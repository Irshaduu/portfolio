import assert from 'node:assert/strict';
import { test } from 'node:test';

import { coolDown, firstAnswer, routes } from '../worker/chain.js';
import { ENV, GEMINI, GROQ, answer, collect, failure, fakeFetch, streamed } from './helpers.js';

const REQUEST = { messages: [{ role: 'user', content: 'Hi' }] };
const clock = (start = 1_000_000) => {
  let t = start;
  const now = () => t;
  now.add = (ms) => (t += ms);
  return now;
};

test('Groq answers first when it can', async () => {
  const { fetch, calls } = fakeFetch({ [GROQ]: answer('Hel', 'lo') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route.name, 'Groq');
  assert.equal(result.first, 'Hel');
  assert.deepEqual(await collect(result.rest), ['lo']);
  assert.deepEqual(result.tried, [{ name: 'Groq', why: 'answered' }]);
  assert.equal(calls.length, 1);
});

test('a question in Malayalam goes to Gemini first', () => {
  assert.deepEqual(routes(ENV, { question: 'ഇർഷാദ് ആരാണ്?' }).map((r) => r.name), ['Gemini', 'Groq']);
  assert.deepEqual(routes(ENV, { question: 'ningal aaranu?' }).map((r) => r.name), ['Groq', 'Gemini']);
});

test('each service gets its own key and model, streaming on, and the question', async () => {
  const { fetch, calls } = fakeFetch({ [GROQ]: failure(500), [GEMINI]: answer('ok') });
  await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  const [groq, gemini] = calls;
  assert.equal(groq.init.headers.authorization, 'Bearer test-groq');
  assert.deepEqual(groq.body, { ...REQUEST, model: 'groq-test', stream: true, reasoning_effort: 'low', include_reasoning: false });
  assert.equal(gemini.init.headers.authorization, 'Bearer test-gemini');
  assert.deepEqual(gemini.body, { ...REQUEST, model: 'gemini-test', stream: true });
});

test('Groq at its limit: Gemini answers, and Groq rests as long as it asked', async () => {
  const now = clock();
  const cooling = new Map();
  const { fetch } = fakeFetch({ [GROQ]: failure(429, { 'retry-after': '30' }), [GEMINI]: answer('From Gemini') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling, now });
  assert.equal(result.route.name, 'Gemini');
  assert.deepEqual(result.tried, [{ name: 'Groq', why: 'HTTP 429' }, { name: 'Gemini', why: 'answered' }]);
  assert.equal(cooling.get('Groq'), now() + 30_000);
});

test('a resting service is skipped without asking it, then tried again once rested', async () => {
  const now = clock();
  const cooling = new Map([['Groq', now() + 60_000]]);
  const { fetch, calls } = fakeFetch({ [GROQ]: () => answer('Groq again'), [GEMINI]: () => answer('Gemini') });

  const resting = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling, now });
  assert.equal(resting.route.name, 'Gemini');
  assert.deepEqual(resting.tried[0], { name: 'Groq', why: 'resting' });
  assert.deepEqual(calls.map((c) => c.host), [GEMINI]);

  now.add(60_001);
  const rested = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling, now });
  assert.equal(rested.route.name, 'Groq');
});

test('a service without a key is skipped, so one key is enough to start', async () => {
  const { fetch, calls } = fakeFetch({ [GEMINI]: answer('Gemini only') });
  const result = await firstAnswer(routes({ ...ENV, GROQ_API_KEY: '' }), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route.name, 'Gemini');
  assert.deepEqual(result.tried[0], { name: 'Groq', why: 'not set up' });
  assert.equal(calls.length, 1);
});

test('a 200 with nothing in it counts as a failure, and the next service answers', async () => {
  const { fetch } = fakeFetch({ [GROQ]: streamed(['data: [DONE]\n\n']), [GEMINI]: answer('Something') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route.name, 'Gemini');
  assert.deepEqual(result.tried[0], { name: 'Groq', why: 'empty answer' });
});

test('a service that is too slow to start is given up on', async () => {
  const hang = (init) => new Promise((resolve, reject) => {
    init.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
  });
  const { fetch } = fakeFetch({ [GROQ]: hang, [GEMINI]: answer('Quick') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map(), waitMs: 20 });
  assert.equal(result.route.name, 'Gemini');
  assert.deepEqual(result.tried[0], { name: 'Groq', why: 'too slow' });
});

test('a network error moves on to the next service', async () => {
  const { fetch } = fakeFetch({ [GROQ]: () => { throw new TypeError('fetch failed'); }, [GEMINI]: answer('Fine') });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route.name, 'Gemini');
  assert.deepEqual(result.tried[0], { name: 'Groq', why: 'failed' });
});

test('when every service fails there is no answer, and each says why', async () => {
  const { fetch } = fakeFetch({ [GROQ]: failure(429), [GEMINI]: failure(503) });
  const result = await firstAnswer(routes(ENV), REQUEST, { fetch, cooling: new Map() });
  assert.equal(result.route, null);
  assert.deepEqual(result.tried, [{ name: 'Groq', why: 'HTTP 429' }, { name: 'Gemini', why: 'HTTP 503' }]);
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
