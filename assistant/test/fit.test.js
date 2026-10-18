// The job-fit check on the page's side (js/assistant/fit.js): telling a job post from a question,
// reading the AI's lines however it formats them, and the word check for when the AI rests.

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { match } from '../../js/assistant/answers.js';
import { FIT_NEXT, MAX_POST, SECTIONS, fitText, isJobPost, parseFit, wordCheck } from '../../js/assistant/fit.js';
import { SECTIONS as WORKER_SECTIONS } from '../worker/prompt.js';
import { DJANGO_POST } from './helpers.js';

test('a question is a question, and a job post is a job post', () => {
  assert.equal(isJobPost('Is he a good fit for a Django backend role?'), false);
  assert.equal(isJobPost('What are his skills? Does he have experience with Django and REST APIs and how many years has he been coding?'), false);
  assert.equal(isJobPost(DJANGO_POST), true);
  assert.equal(isJobPost('x '.repeat(320)), true); // too long to be a question: the AI says if it isn't a post
});

test('after "Does he fit my job?", anything more than a few words is the post', () => {
  assert.equal(isJobPost('Django developer, 2 years, Kochi, hybrid', { waiting: true }), true);
  assert.equal(isJobPost('ok wait', { waiting: true }), false);
});

test('the AI\'s lines become the card', () => {
  const fit = parseFit([
    'SUMMARY: Close on the Django side. Docker isn\'t shown here.',
    'MATCH: Django | Built a full workshop system in Django | #workshopos',
    'MATCH: Automated tests | 3,185 Django tests in WorkshopOS | #workshopos',
    'GAP: Docker',
    'GAP: React',
    'ASK: Has he used Docker?',
  ].join('\n'));
  assert.deepEqual(fit, {
    summary: "Close on the Django side. Docker isn't shown here.",
    matches: [
      { need: 'Django', proof: 'Built a full workshop system in Django', link: '#workshopos' },
      { need: 'Automated tests', proof: '3,185 Django tests in WorkshopOS', link: '#workshopos' },
    ],
    gaps: ['Docker', 'React'],
    ask: 'Has he used Docker?',
  });
});

test('formatting the AI slips in, and section ids it makes up, are taken out', () => {
  const fit = parseFit([
    '**SUMMARY:** Mostly there.',
    '- **MATCH:** REST APIs | REST and JSON in his stack (#stack) | #stack',
    '* MATCH: PostgreSQL | The database behind WorkshopOS | #database',
    '• gap: Kubernetes',
  ].join('\n'));
  assert.equal(fit.summary, 'Mostly there.');
  assert.deepEqual(fit.matches, [
    { need: 'REST APIs', proof: 'REST and JSON in his stack', link: '#stack' },
    { need: 'PostgreSQL', proof: 'The database behind WorkshopOS', link: null },
  ]);
  assert.deepEqual(fit.gaps, ['Kubernetes']);
  assert.equal(parseFit("SUMMARY: That isn't software work—he's a Python developer.").summary, "That isn't software work, he's a Python developer.");
});

test('pay, notice and moving are never gaps: they stay the question for Irshad', () => {
  const fit = parseFit('SUMMARY: Close.\nGAP: Expected CTC\nGAP: Notice period\nGAP: Docker\nGAP: Willing to relocate\nASK: What are his expected CTC and notice period?');
  assert.deepEqual(fit.gaps, ['Docker']);
  assert.match(fit.ask, /CTC/);
});

test('while the answer arrives, a half-written line waits', () => {
  const fit = parseFit('SUMMARY: Close.\nMATCH: Django | Built WorkshopOS in Dja', { done: false });
  assert.equal(fit.summary, 'Close.');
  assert.deepEqual(fit.matches, []);
});

test('an answer that ignored the format is kept whole', () => {
  assert.equal(parseFit('He knows Django well.\nDocker is not shown.').summary, 'He knows Django well. Docker is not shown.');
});

test('at most five matches and four gaps', () => {
  const fit = parseFit([...Array(8)].map((_, i) => `MATCH: m${i} | p | #stack\nGAP: g${i}`).join('\n'));
  assert.equal(fit.matches.length, 5);
  assert.equal(fit.gaps.length, 4);
});

test('the check in sentences, for the conversation and screen readers', () => {
  assert.equal(fitText({ summary: 'Close.', matches: [{ need: 'Django', proof: 'WorkshopOS', link: '#workshopos' }, { need: 'Git', proof: '', link: null }], gaps: ['Docker'], ask: 'Docker?' }),
    'Close.\nMatches: Django (WorkshopOS); Git.\nNot shown on this site: Docker.\nWorth asking him: Docker?');
  assert.equal(fitText({ summary: "That doesn't look like a job post.", matches: [], gaps: [], ask: '' }), "That doesn't look like a job post.");
});

test('when the AI rests, the post\'s own words are checked, with proof for each match', () => {
  const fit = wordCheck(DJANGO_POST);
  assert.deepEqual(fit.matches.map((m) => m.need), ['Python', 'Django', 'PostgreSQL', 'REST APIs', 'Testing']);
  assert.ok(fit.matches.every((m) => m.proof && SECTIONS.includes(m.link)));
  assert.deepEqual(fit.gaps, ['React', 'Docker']);
  assert.equal(fit.ask, 'Has he worked with React?');
  assert.match(fit.summary, /AI is resting/);
});

test('the word check doesn\'t mistake one word for another', () => {
  const js = wordCheck('We use JavaScript; the rest of the team is remote.');
  assert.deepEqual([js.matches.map((m) => m.need), js.gaps], [['JavaScript'], []]); // not Java, not REST
  assert.deepEqual(wordCheck('Senior Java engineer, Spring Boot, Kubernetes').gaps, ['Java', 'Spring', 'Kubernetes']);
  const nothing = wordCheck('Staff nurse for a hospital in Dubai');
  assert.deepEqual([nothing.matches, nothing.gaps, nothing.ask], [[], [], '']);
  assert.match(nothing.summary, /found nothing to compare/);
});

test('the page and the AI know the same sections, and the same longest post', () => {
  assert.deepEqual(SECTIONS, WORKER_SECTIONS);
  assert.equal(MAX_POST, 6000);
});

test('after a check, each next step has its own ready answer', () => {
  assert.deepEqual(FIT_NEXT.map((q) => [match(q)?.id, match(q)?.sure]), [['resume', true], ['hire', true], ['fit', true]]);
});
