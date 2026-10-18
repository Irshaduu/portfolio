// The page's side (js/assistant/client.js): ready answer, AI, or stand-in, in that order.

import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { DONT_KNOW, DONT_KNOW_NEXT, LIMIT, START, match } from '../../js/assistant/answers.js';
import { ask, checkFit, plain } from '../../js/assistant/client.js';
import { FIT_NEXT, wordCheck } from '../../js/assistant/fit.js';
import { DJANGO_POST } from './helpers.js';

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

test('a tapped suggestion gets its ready answer at once, without asking the AI, with what to ask next', async () => {
  globalThis.fetch = () => assert.fail('the AI should not be asked');
  const { seen, on } = recorder();
  const result = await ask('What are his skills?', [], { on, server: SERVER, tapped: true });
  const skills = match('What are his skills?');
  assert.deepEqual(result, { text: skills.text, by: 'ready', link: '#stack', next: skills.next, travel: null, id: 'skills' });
  assert.deepEqual(seen.map((e) => e.type), ['step', 'source', 'text', 'done']);
});

test('a typed question goes to the AI, even when its words look like a ready answer', async () => {
  const asked = [];
  globalThis.fetch = async (url, init) => {
    asked.push(JSON.parse(init.body).messages.at(-1).content);
    return sse(['meta', { by: 'Gemini', tried: [] }], ['text', { t: 'Sure.' }], ['done', {}]);
  };
  for (const typed of ['switch to gemini', 'What are his skills?', 'Olakka']) {
    assert.equal((await ask(typed, [], { server: SERVER })).by, 'Gemini', typed);
  }
  assert.deepEqual(asked, ['switch to gemini', 'What are his skills?', 'Olakka']);
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
  const result = await ask('What are his skills?', [], { server: SERVER, deep: true, tapped: true });
  assert.equal(asked, true);
  assert.equal(result.by, 'Groq');
});

test('help for someone in danger never waits for the AI, typed or tapped', async () => {
  globalThis.fetch = () => assert.fail('never left to the AI');
  assert.match((await ask('I want to die', [], { server: SERVER })).text, /14416/);
  assert.match((await ask('I want to die', [], { server: SERVER, deep: true })).text, /14416/);
});

test('when both AIs rest, the closest ready answer stands in', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ fallback: true }), { status: 503 });
  const { seen, on } = recorder();
  const result = await ask(DEEP_QUESTION, [], { on, server: SERVER });
  assert.equal(result.by, 'ready');
  assert.equal(result.link, '#word-hunt');
  assert.ok(seen.some((e) => e.type === 'step' && e.text === 'Both AIs are resting'));
});

test('a visitor who used up their share is told so in the agent\'s voice, not given a stand-in', async () => {
  for (const [limit, expected] of [['minute', LIMIT.minute], ['day', LIMIT.day], [undefined, LIMIT.minute]]) {
    globalThis.fetch = async () => new Response(JSON.stringify({ fallback: true, limit }), { status: 429 });
    const result = await ask(DEEP_QUESTION, [], { server: SERVER });
    assert.deepEqual(result, { text: expected.text, by: 'limit', link: null, next: expected.next, travel: null, id: 'limit' });
  }
  globalThis.fetch = async () => new Response(JSON.stringify({ fallback: true, limit: 'day' }), { status: 429 });
  const check = await checkFit(DJANGO_POST, { server: SERVER });
  assert.match(check.fit.summary, /talked a lot today/);
  assert.ok(check.fit.matches.length); // the word check, meanwhile
});

test('when nothing fits and the AI is out of reach, it says so and offers where to go', async () => {
  globalThis.fetch = async () => { throw new TypeError('offline'); };
  const result = await ask('What is the weather in Kochi?', [], { server: SERVER });
  assert.deepEqual(result, { text: DONT_KNOW, by: 'none', link: '#contact', next: DONT_KNOW_NEXT, travel: null, id: null });
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
  assert.equal(plain('Code like a river flows—steady and clear.'), 'Code like a river flows, steady and clear.');
  assert.equal(plain('Try his game – it’s free. 1–3 years. (#word‑hunt)'), 'Try his game, it’s free. 1–3 years. (#word-hunt)');
});

test('machine sentences become what a person would say', () => {
  assert.equal(plain('I’m sorry, but I can’t help with that. (#top)'), "That's not something I'll do. (#top)");
  assert.equal(plain("I'm sorry, but I can't do that. If you'd like to know more about his work, feel free to ask."),
    "That's not something I'll do. If you'd like to know more about his work, just ask.");
  assert.equal(plain('I can’t help with that. If you like websites, see his projects.'), "That's not something I'll help with. If you like websites, see his projects.");
  assert.equal(plain('I don’t have that information. You can ask Irshad directly.'), "He hasn't told me that one. You can ask Irshad directly.");
  assert.equal(plain("I'm sorry it hurts."), "I'm sorry it hurts."); // real sympathy stays
});

test('a closed door becomes what a friend would say: "he hasn\'t told me"', () => {
  assert.equal(plain('The site doesn’t mention why he stepped away. You can ping him on WhatsApp.'), "He hasn't told me why he stepped away. You can ping him on WhatsApp.");
  assert.equal(plain("The site doesn't mention his age."), "He hasn't told me about his age.");
  assert.equal(plain("Sorry, that isn't on the site. Ask him."), "Sorry, he hasn't told me that one. Ask him.");
  assert.equal(plain("It's not mentioned on the website, but he uses JavaScript."), "He hasn't told me that one, but he uses JavaScript.");
  assert.equal(plain("He didn't really quit. Then he moved on to coding."), "He didn't really quit. Then he moved on to coding.");
});

test('"Does he fit my job?", tapped or typed, asks for the post without asking the AI', async () => {
  globalThis.fetch = () => assert.fail('no AI needed to say "paste it"');
  for (const tapped of [true, false]) {
    const result = await ask('Does he fit my job?', [], { server: SERVER, tapped });
    assert.equal(result.id, 'fit');
    assert.match(result.text, /Paste the job post/);
    assert.deepEqual(result.next, []);
  }
});

test('a job post goes to /fit, and its lines become the check as they arrive', async () => {
  let sent;
  globalThis.fetch = async (url, init) => {
    sent = { url, body: JSON.parse(init.body) };
    return sse(['meta', { by: 'Gemini', tried: ['Gemini: answered'] }],
      ['text', { t: 'SUMMARY: Close on the Django side.\nMATCH: Django | Built WorkshopOS in Django | #workshopos\n' }],
      ['text', { t: 'GAP: Docker\nASK: Has he used Docker?' }], ['done', {}]);
  };
  const { seen, on } = recorder();
  const result = await checkFit(DJANGO_POST, { on, server: SERVER });
  assert.equal(sent.url, 'https://assistant.test/fit');
  assert.deepEqual(sent.body, { post: DJANGO_POST });
  assert.equal(result.by, 'Gemini');
  assert.equal(result.id, 'fit-check');
  assert.deepEqual(result.fit, {
    summary: 'Close on the Django side.',
    matches: [{ need: 'Django', proof: 'Built WorkshopOS in Django', link: '#workshopos' }],
    gaps: ['Docker'],
    ask: 'Has he used Docker?',
  });
  assert.equal(result.text, 'Close on the Django side.\nMatches: Django (Built WorkshopOS in Django).\nNot shown on this site: Docker.\nWorth asking him: Has he used Docker?');
  assert.deepEqual(result.next, FIT_NEXT);
  assert.equal(seen.filter((e) => e.type === 'text').length, 2);
  assert.deepEqual(seen.at(-1), { type: 'done', fit: result.fit, next: FIT_NEXT });
});

test('when the AIs rest, the word check stands in for the job-fit check', async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ fallback: true }), { status: 503 });
  const { seen, on } = recorder();
  const result = await checkFit(DJANGO_POST, { on, server: SERVER });
  assert.equal(result.by, 'ready');
  assert.deepEqual(result.fit, wordCheck(DJANGO_POST));
  assert.ok(seen.some((e) => e.type === 'step' && e.text === 'Both AIs are resting'));
});

test('a job-fit check that breaks off keeps what arrived and says so', async () => {
  globalThis.fetch = async () => sse(['meta', { by: 'Groq', tried: [] }], ['text', { t: 'SUMMARY: Close.\nMATCH: Django | WorkshopOS | #workshopos\n' }], ['error', { partial: true }]);
  const result = await checkFit(DJANGO_POST, { server: SERVER });
  assert.equal(result.fit.summary, 'Close. (The answer was cut short.)');
  assert.equal(result.fit.matches.length, 1);
});

test('a section written with a non-breaking hyphen still becomes its link', async () => {
  globalThis.fetch = async () => sse(['meta', { by: 'Groq', tried: [] }], ['text', { t: 'Play his game. (#word‑hunt)' }], ['done', {}]);
  assert.equal((await ask(DEEP_QUESTION, [], { server: SERVER })).link, '#word-hunt');
});

test('an answer pointing to two sections shows the first', async () => {
  globalThis.fetch = async () => sse(['meta', { by: 'Groq', tried: [] }], ['text', { t: 'He tests a lot. (#stack #workshopos)' }], ['done', {}]);
  const result = await ask(DEEP_QUESTION, [], { server: SERVER });
  assert.equal(result.link, '#stack');
});
