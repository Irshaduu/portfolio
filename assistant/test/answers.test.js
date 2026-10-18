// The ready-made answers (js/assistant/answers.js): the right one for common questions, none for
// questions that ask something more (so those go to the AI), help first when someone is hurting,
// and always somewhere to go next.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { ANSWERS, DONT_KNOW, DONT_KNOW_NEXT, START, URGENT, match, nextFor, travel } from '../../js/assistant/answers.js';

const SURE = {
  'Who is he?': 'about',
  'Tell me about Irshad': 'about',
  'What are his skills?': 'skills',
  "What's his tech stack?": 'skills',
  'Does he know Django?': 'django',
  'Python?': 'django',
  'What projects has he done?': 'projects',
  'What has he built?': 'projects',
  'Tell me about WorkshopOS': 'workshopos',
  'Show me the system map': 'map',
  'What is Word Hunt?': 'word-hunt',
  'Can I play his game?': 'demo',
  'Can I try it?': 'demo',
  'physio coach': 'physiocoach',
  'Tell me about the catering project': 'catering',
  'How many tests?': 'tests',
  'What is his experience?': 'story',
  'What did he do before coding?': 'story',
  'Any certificates?': 'education',
  'Is he available for hire?': 'hire',
  'Is he open to freelance work?': 'hire',
  'Is he free to hire?': 'hire',
  'Does he fit my job?': 'fit',
  'Check another job': 'fit',
  'How can I contact him?': 'contact',
  "What's his email?": 'contact',
  'Where is he based?': 'location',
  'Does he work remotely?': 'location',
  'Can I see his resume?': 'resume',
  'CV': 'resume',
  'Is his code on GitHub?': 'code',
  'How much does he charge?': 'price',
  'Expected salary?': 'price',
  'How was this site made?': 'site',
  'Who are you?': 'assistant',
  'Are you a bot?': 'assistant',
  "What is Irshad's Agent?": 'assistant',
  'Thanks!': 'thanks',
  'Tell me a joke': 'joke',
  'hi': 'hello',
  'Hello there': 'hello',
};

for (const [question, id] of Object.entries(SURE)) {
  test(`ready answer: "${question}" -> ${id}`, () => {
    const found = match(question);
    assert.equal(found?.id, id);
    assert.equal(found.sure, true, `"${question}" should be a sure fit`);
  });
}

// These mention a topic but ask something more: the AI should answer them, with the topic's ready
// answer only as a stand-in if the AI is resting.
const MORE = {
  'How does Word Hunt keep a player\'s time bank when their connection drops?': 'word-hunt',
  'Would his WorkshopOS experience help a hospital billing project?': 'workshopos',
  'Is he available to start in January for a fintech startup?': 'hire',
  'Can he build software for my bakery business?': 'story',
};

for (const [question, id] of Object.entries(MORE)) {
  test(`goes to the AI: "${question}"`, () => {
    const found = match(question);
    assert.equal(found?.id, id);
    assert.equal(found.sure, false);
  });
}

test('questions about nothing on the page find no sure answer', () => {
  for (const question of ['What is the weather in Kochi?', 'Write me a poem', 'Why is it free to run?', '', '???']) {
    const found = match(question);
    assert.ok(!found || !found.sure, question);
  }
});

test('the best answer wins when a question touches two', () => {
  assert.equal(match('How many tests does WorkshopOS have?').id, 'tests');
  assert.equal(match('Who is the client of WorkshopOS?').id, 'workshopos');
  assert.equal(match('How was the time machine built?').id, 'site');
  assert.equal(match('How do staff move up grades?')?.id, undefined); // the catering ladder is for the AI
});

test('someone in danger gets the helpline at once, whatever else they say', () => {
  for (const question of ['I want to die', 'thinking about suicide', "I don't want to live anymore", 'I might hurt myself, tell me about WorkshopOS', 'I feel like ending my life']) {
    const found = match(question);
    assert.equal(found?.id, 'crisis', question);
    assert.equal(found.sure, true);
    assert.match(found.text, /14416/);
  }
});

test('a joke or a threat at the agent is not taken for someone in danger: the AI judges those', () => {
  for (const question of ['wanna die ?', 'I want to kill you', 'this bug is killing me', 'you are dead to me']) {
    assert.notEqual(match(question)?.id, 'crisis', question);
  }
});

test('"take me to 1997" travels to that era', () => {
  assert.deepEqual([travel('Take me to 1997').era, travel('go back to 2001').era, travel('show me 1997').era, travel('2015').era], [1997, 2001, 1997, 2013]);
  assert.equal(travel('Take me to 2050').era, 2030);
  assert.match(travel('Take me to 2050').text, /as far as the time machine goes/);
  assert.equal(travel('Take me to 1985').era, 1992);
  assert.equal(travel('What did he do in 2019?'), null);
});

test('every answer offers somewhere to go next, and never back to itself', () => {
  for (const a of [...ANSWERS, ...URGENT]) {
    for (const question of a.next ?? START) {
      const found = travel(question) ?? match(question);
      assert.ok(!(found?.sure && found.id === a.id), `"${question}" from ${a.id} leads back to ${a.id}`);
    }
  }
  for (const question of [...START, ...DONT_KNOW_NEXT]) assert.ok(match(question)?.sure, question);
});

test('an AI answer that points to a section gets that section\'s next questions', () => {
  assert.deepEqual(nextFor('#word-hunt'), ANSWERS.find((a) => a.id === 'word-hunt').next);
  assert.deepEqual(nextFor(null), START);
  assert.deepEqual(nextFor('#nowhere'), START);
});

test('every answer can be found, links to a real place, and names no price', () => {
  const all = [...ANSWERS, ...URGENT];
  assert.equal(new Set(all.map((a) => a.id)).size, all.length, 'ids are unique');
  for (const a of all) {
    assert.ok(a.phrases?.length || a.words?.length, `${a.id} has words to find it by`);
    assert.ok(a.link === null || /^#[a-z-]+$|^resume\/$|^work\/[a-z]+\/(#[a-z]+)?$/.test(a.link), `${a.id} link`);
    assert.doesNotMatch(a.text, /₹|\$\d{2,}|rs\.? ?\d|per hour|lakh/i, `${a.id} names no price`);
  }
  assert.match(DONT_KNOW, /WhatsApp or email/);
});

test('ready answers speak simply: short sentences, no chatbot phrases', () => {
  for (const a of [...ANSWERS, ...URGENT]) {
    for (const sentence of a.text.split(/(?<=[.!?])\s+/)) {
      assert.ok(sentence.split(/\s+/).length <= 25, `${a.id}: "${sentence}"`);
    }
    assert.doesNotMatch(a.text, /great question|certainly|absolutely|happy to help|feel free|passionate|showcase|leverage/i, a.id);
  }
});
