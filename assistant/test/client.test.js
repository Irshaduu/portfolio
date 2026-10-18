// The page's side (js/assistant/client.js): ready answer, AI, or stand-in, in that order.

import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { DONT_KNOW, DONT_KNOW_NEXT, START, match } from '../../js/assistant/answers.js';
import { ask, plain } from '../../js/assistant/client.js';

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; });

const SERVER = 'https://assistant.test/';
const sse = (...events) => new Response(events.map(([name, data]) => `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`).join(''), {
  headers: { 'content-type': 'text/event-stream' },
});
const recorder = () => {
  const seen = [];
  return { seen, on: (e) => seen.push(e) };
};
const DEEP_QUESTION = 'Would Word Hunt work over a bad hotel wifi?';

test('a sure ready answer is given at once, without asking the AI, with what to ask next', async () => {
  globalThis.fetch = () => assert.fail('the AI should not be asked');
  const { seen, on } = recorder();
  const result = await ask('What are his skills?', [], { on, server: SERVER });
  const skills = match('What are his skills?');
  assert.deepEqual(result, { text: skills.text, by: 'ready', link: '#stack', next: skills.next, travel: null });
  assert.deepEqual(seen.map((e) => e.type), ['step', 'source', 'text', 'done']);
});

test('"take me to 1997" answers at once and asks the page to travel', async () => {
  globalThis.fetch = () => assert.fail('no AI needed to travel');
  const result = await ask('Take me to 1997', [], { server: SERVER });
  assert.equal(result.travel, 1997);
  assert.equal(result.by, 'ready');
});

test('anything else goes to the AI, with where the visitor is, and arrives piece by piece', async () => {
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, body: JSON.parse(init.body) };
    return sse(['meta', { by: 'Gemini', tried: ['Groq: HTTP 429', 'Gemini: answered'] }], ['text', { t: 'Yes, ' }], ['text', { t: 'it does. (#word-hunt)' }], ['done', {}]);
  };
  const { seen, on } = recorder();
  const history = [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Hello!' }];
  const context = { era: '2026', section: '#word-hunt' };
  const result = await ask(DEEP_QUESTION, history, { on, server: SERVER, context });

  assert.equal(sent.url, 'https://assistant.test/chat');
  assert.deepEqual(sent.body.messages.at(-1), { role: 'user', content: DEEP_QUESTION });
  assert.equal(sent.body.messages.length, 3);
  assert.deepEqual(sent.body.context, context);
  assert.equal(result.text, 'Yes, it does. (#word-hunt)');
  assert.equal(result.by, 'Gemini');
  assert.equal(result.link, '#word-hunt'); // the page shows that part
  assert.deepEqual(result.next, match('What is Word Hunt?').next); // and offers what to ask next
  assert.deepEqual(seen.find((e) => e.type === 'source'), { type: 'source', by: 'Gemini', tried: ['Groq: HTTP 429', 'Gemini: answered'] });
  assert.deepEqual(seen.filter((e) => e.type === 'text').map((e) => e.t), ['Yes, ', 'it does. (#word-hunt)']);
});

test('"tell me more" skips the ready answer and asks the AI', async () => {
  let asked = false;
  globalThis.fetch = async () => { asked = true; return sse(['meta', { by: 'Groq', tried: [] }], ['text', { t: 'More.' }], ['done', {}]); };
  const result = await ask('What are his skills?', [], { server: SERVER, deep: true });
  assert.equal(asked, true);
  assert.equal(result.by, 'Groq');
});

test('help for someone in danger is never skipped, even for "tell me more"', async () => {
  globalThis.fetch = () => assert.fail('never left to the AI');
  const result = await ask('I want to die', [], { server: SERVER, deep: true });
  assert.match(result.text, /14416/);
});

test('when both AIs rest, the closest ready answer stands in', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ fallback: true }), { status: 503 });
  const { seen, on } = recorder();
  const result = await ask(DEEP_QUESTION, [], { on, server: SERVER });
  assert.equal(result.by, 'ready');
  assert.equal(result.link, '#word-hunt');
  assert.ok(seen.some((e) => e.type === 'step' && e.text === 'Both AIs are resting'));
});

test('when nothing fits and the AI is out of reach, it says so and offers where to go', async () => {
  globalThis.fetch = async () => { throw new TypeError('offline'); };
  const result = await ask('What is the weather in Kochi?', [], { server: SERVER });
  assert.deepEqual(result, { text: DONT_KNOW, by: 'none', link: '#contact', next: DONT_KNOW_NEXT, travel: null });
});

test('before the server is set up, only ready answers are given', async () => {
  globalThis.fetch = () => assert.fail('no server to ask');
  const result = await ask(DEEP_QUESTION, [], { server: '' });
  assert.equal(result.by, 'ready');
});

test('an answer that breaks off keeps what arrived and says so', async () => {
  globalThis.fetch = async () => sse(['meta', { by: 'Groq', tried: [] }], ['text', { t: 'He built' }], ['error', { partial: true }]);
  const result = await ask(DEEP_QUESTION, [], { server: SERVER });
  assert.equal(result.text, 'He built (The answer was cut short.)');
  assert.equal(result.by, 'Groq');
  assert.deepEqual(result.next, START);
});

test('formatting an AI slips in is taken out', () => {
  assert.equal(plain('**WorkshopOS** is big.\n\n- 49 models\n- 324 routes\n\n\n# Done'), 'WorkshopOS is big.\n\n49 models\n324 routes\n\nDone');
  assert.equal(plain('Costs $0, uses `Django`.'), 'Costs $0, uses Django.');
  assert.equal(plain('One line.   Two lines.'), 'One line. Two lines.');
});

test('machine sentences become what a person would say', () => {
  assert.equal(plain('I’m sorry, but I can’t help with that. (#top)'), "That's not something I'll do. (#top)");
  assert.equal(plain("I'm sorry, but I can't do that. If you'd like to know more about his work, feel free to ask."),
    "That's not something I'll do. If you'd like to know more about his work, just ask.");
  assert.equal(plain('I can’t help with that. If you like websites, see his projects.'), "That's not something I'll help with. If you like websites, see his projects.");
  assert.equal(plain('I don’t have that information. You can ask Irshad directly.'), "That isn't on this site, so I don't know. You can ask Irshad directly.");
  assert.equal(plain("I'm sorry it hurts."), "I'm sorry it hurts."); // real sympathy stays
});

test('an answer pointing to two sections shows the first', async () => {
  globalThis.fetch = async () => sse(['meta', { by: 'Groq', tried: [] }], ['text', { t: 'He tests a lot. (#stack #workshopos)' }], ['done', {}]);
  const result = await ask(DEEP_QUESTION, [], { server: SERVER });
  assert.equal(result.link, '#stack');
});
