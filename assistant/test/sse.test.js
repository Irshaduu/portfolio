import assert from 'node:assert/strict';
import { test } from 'node:test';

import { textDeltas } from '../worker/sse.js';
import { collect, streamed } from './helpers.js';

const piece = (content) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`;

test('reads each piece of the answer, and stops at [DONE]', async () => {
  const body = streamed([piece('Hello'), piece(', world'), 'data: [DONE]\n\n', piece('never read')]).body;
  assert.deepEqual(await collect(textDeltas(body)), ['Hello', ', world']);
});

test('a line split across two network chunks is read whole', async () => {
  const line = piece('split in two');
  const body = streamed([line.slice(0, 17), line.slice(17), 'data: [DONE]\n\n']).body;
  assert.deepEqual(await collect(textDeltas(body)), ['split in two']);
});

test('the model\'s private reasoning, empty pieces and comments are not part of the answer', async () => {
  const body = streamed([
    ': keep-alive\n\n',
    `data: ${JSON.stringify({ choices: [{ delta: { reasoning: 'thinking...' } }] })}\n\n`,
    piece(''),
    `data: ${JSON.stringify({ choices: [{ delta: { role: 'assistant' } }] })}\n\n`,
    piece('Answer'),
    'data: [DONE]\n\n',
  ]).body;
  assert.deepEqual(await collect(textDeltas(body)), ['Answer']);
});

test('a stream that ends without [DONE] still gives what arrived', async () => {
  const body = streamed([piece('Part'), 'data: {"choices":[{"delta":{"content":"ial"}}]}']).body;
  assert.deepEqual(await collect(textDeltas(body)), ['Part', 'ial']);
});

test('an error inside the stream is raised, not shown as text', async () => {
  const body = streamed([piece('Half'), 'data: {"error":{"message":"quota"}}\n\n']).body;
  const pieces = textDeltas(body);
  assert.deepEqual(await pieces.next(), { value: 'Half', done: false });
  await assert.rejects(pieces.next(), /quota/);
});
