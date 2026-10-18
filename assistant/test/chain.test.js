import assert from 'node:assert/strict';
import { test } from 'node:test';

import { coolDown, firstAnswer, routes } from '../worker/chain.js';
import { ENV, GEMINI, GEMINI_LITE, GROQ, answer, collect, failure, fakeFetch, streamed } from './helpers.js';

const REQUEST = { messages: [{ role: 'user', content: 'Hi' }] };
const clock = (start = 1_000_000) => {
  let t = start;
  const now = () => t;
  now.add = (ms) => (t += ms);
  return now;
};

test('the order: Gemini, then Gemini Lite, then Groq', () => {
  assert.deepEqual(routes(ENV).map((r) => r.name), ['Gemini', 'Gemini Lite', 'Groq']);
});

test('Gemini answers first when it can', async () => {
  const { fetch, calls } = fakeFetch({ [GEMINI]: answer('Hel', 'lo') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route.name, 'Gemini');
  assert.equal(result.first, 'Hel');
  assert.deepEqual(await collect(result.rest), ['lo']);
  assert.deepEqual(result.tried, [{ name: 'Gemini', why: 'answered' }]);
  assert.equal(calls.length, 1);
});

test('each service gets its key, its model, its own settings, streaming on, and the question', async () => {
  const { fetch, calls } = fakeFetch({ [GEMINI]: failure(500), [GEMINI_LITE]: failure(500), [GROQ]: answer('ok') });
  await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  const [gemini, lite, groq] = calls;
  assert.equal(gemini.init.headers.authorization, 'Bearer test-gemini');
  assert.deepEqual(gemini.body, { ...REQUEST, model: 'gemini-test', stream: true, reasoning_effort: 'low' });
  assert.equal(lite.init.headers.authorization, 'Bearer test-gemini');
  assert.deepEqual(lite.body, { ...REQUEST, model: 'gemini-lite-test', stream: true, reasoning_effort: 'low' });
  assert.equal(groq.init.headers.authorization, 'Bearer test-groq');
  assert.deepEqual(groq.body, { ...REQUEST, model: 'groq-test', stream: true, reasoning_effort: 'low', include_reasoning: false });
});

test('how much the first Gemini thinks is a setting', () => {
  assert.equal(routes({ ...ENV, GEMINI_THINKING: 'minimal' })[0].extra.reasoning_effort, 'minimal');
  assert.equal(routes(ENV)[0].extra.reasoning_effort, 'low');
});

test('Gemini at its limit: Gemini Lite answers, and Gemini rests as long as it asked', async () => {
  const now = clock();
  const cooling = new Map();
  const { fetch } = fakeFetch({ [GEMINI]: failure(429, { 'retry-after': '30' }), [GEMINI_LITE]: answer('From Lite') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling, now });
  assert.equal(result.route.name, 'Gemini Lite');
  assert.deepEqual(result.tried, [{ name: 'Gemini', why: 'HTTP 429' }, { name: 'Gemini Lite', why: 'answered' }]);
  assert.equal(cooling.get('Gemini'), now() + 30_000);
});

test('both Gemini models out for the day: Groq answers', async () => {
  const { fetch } = fakeFetch({ [GEMINI]: failure(429), [GEMINI_LITE]: failure(429), [GROQ]: answer('From Groq') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route.name, 'Groq');
  assert.deepEqual(result.tried.map((t) => t.why), ['HTTP 429', 'HTTP 429', 'answered']);
});

test('a resting service is skipped without asking it, then tried again once rested', async () => {
  const now = clock();
  const cooling = new Map([['Gemini', now() + 60_000]]);
  const { fetch, calls } = fakeFetch({ [GEMINI]: () => answer('Gemini again'), [GEMINI_LITE]: () => answer('Lite') });

  const resting = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling, now });
  assert.equal(resting.route.name, 'Gemini Lite');
  assert.deepEqual(resting.tried[0], { name: 'Gemini', why: 'resting' });
  assert.deepEqual(calls.map((c) => c.model), [GEMINI_LITE]);

  now.add(60_001);
  const rested = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling, now });
  assert.equal(rested.route.name, 'Gemini');
});

test('a service without a key or model is skipped, so the chain works with whatever is set up', async () => {
  const { fetch, calls } = fakeFetch({ [GROQ]: answer('Groq only') });
  const result = await firstAnswer(routes({ ...ENV, GEMINI_API_KEY: '' }), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route.name, 'Groq');
  assert.deepEqual(result.tried.slice(0, 2), [{ name: 'Gemini', why: 'not set up' }, { name: 'Gemini Lite', why: 'not set up' }]);
  assert.equal(calls.length, 1);
});

test('a 200 with nothing in it counts as a failure, and the next service answers', async () => {
  const { fetch } = fakeFetch({ [GEMINI]: streamed(['data: [DONE]\n\n']), [GEMINI_LITE]: answer('Something') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route.name, 'Gemini Lite');
  assert.deepEqual(result.tried[0], { name: 'Gemini', why: 'empty answer' });
});

test('a service that is too slow to start is given up on', async () => {
  const hang = (init) => new Promise((resolve, reject) => {
    init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
  });
  const { fetch } = fakeFetch({ [GEMINI]: hang, [GEMINI_LITE]: answer('Quick') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map(), waitMs: 20 });
  assert.equal(result.route.name, 'Gemini Lite');
  assert.deepEqual(result.tried[0], { name: 'Gemini', why: 'too slow' });
});

test('a network error moves on to the next service', async () => {
  const { fetch } = fakeFetch({ [GEMINI]: () => { throw new TypeError('fetch failed'); }, [GEMINI_LITE]: answer('Fine') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route.name, 'Gemini Lite');
  assert.deepEqual(result.tried[0], { name: 'Gemini', why: 'failed' });
});

test('when every service fails there is no answer, and each says why', async () => {
  const { fetch } = fakeFetch({ [GEMINI]: failure(429), [GEMINI_LITE]: failure(400), [GROQ]: failure(503) });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route, null);
  assert.deepEqual(result.tried, [{ name: 'Gemini', why: 'HTTP 429' }, { name: 'Gemini Lite', why: 'HTTP 400' }, { name: 'Groq', why: 'HTTP 503' }]);
});

test('rest times: the service\'s own wait for limits, long for set-up mistakes, short for outages', () => {
  assert.equal(coolDown(429, '120'), 120_000);
  assert.equal(coolDown(429, null), 60_000);
  assert.equal(coolDown(429, '1'), 5_000); // never hammer it
  assert.equal(coolDown(429, '999999'), 3_600_000); // never rest it more than an hour
  assert.equal(coolDown(401), 600_000);
  assert.equal(coolDown(404), 600_000);
  assert.equal(coolDown(503), 30_000);
});
