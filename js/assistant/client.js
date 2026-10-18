// Asks the assistant a question. A tapped suggestion gets its ready-made answer at once; a typed
// question goes to the AI (through the Worker in assistant/), which reads the whole conversation;
// and when the AI is resting, the closest ready answer or "I don't know" stands in. Two things never
// wait for the AI: someone in danger gets the helpline, and "take me to 1997" travels.
// Every era's assistant will use this; only how they look will differ.
//
// It reports as it goes, so a page can show the answer arriving and the steps behind it:
//   { type: 'step', text }                 what it's doing ("Asking the AI")
//   { type: 'source', by, tried }          who answers: 'ready', 'Groq', 'Gemini', or 'none'
//   { type: 'text', t }                    the next piece of the answer (pass the whole so far through plain())
//   { type: 'done', link, next, travel }   finished: the part of the page to show, what to ask next,
//                                          and the era to travel to, if the visitor asked to
// and resolves to { text, by, link, next, travel, id }, to keep in the conversation's history (id:
// which ready answer, if one was given).
//
// Options: context { era, section, intent } tells the AI where the visitor is; tapped: true for a
// suggestion button's question; deep: true for "tell me more", which always asks the AI.

import { DONT_KNOW, DONT_KNOW_NEXT, START, match, nextFor, travel } from './answers.js';

// The Worker's address, printed by `npm run deploy` in assistant/. Empty, every question gets a
// ready-made answer or "I don't know".
export const SERVER = 'https://portfolio-assistant.irshaduu.workers.dev';

export async function ask(question, history = [], { on = () => {}, server = SERVER, signal, context, tapped = false, deep = false } = {}) {
  on({ type: 'step', text: 'Looking for a ready answer' });
  const trip = travel(question);
  if (trip) return reply(on, trip, 'ready');
  const ready = match(question);
  if (ready?.id === 'crisis') return reply(on, ready, 'ready');
  if (tapped && !deep && ready?.sure) return reply(on, ready, 'ready');

  // No sure fit: the AI. If it can't answer, the closest ready answer stands in.
  const standIn = (why) => {
    on({ type: 'step', text: why });
    const guess = ready && ready.score >= 2 ? ready : null;
    return reply(on, guess ?? { text: DONT_KNOW, link: '#contact', next: DONT_KNOW_NEXT }, guess ? 'ready' : 'none');
  };
  if (!server) return standIn('The AI is not switched on yet');

  on({ type: 'step', text: 'Asking the AI' });
  let res;
  try {
    res = await fetch(`${server.replace(/\/+$/, '')}/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages: [...history, { role: 'user', content: question }], context }),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    return standIn('Could not reach the AI');
  }
  if (!res.ok || !res.body) {
    const info = await res.json().catch(() => ({}));
    return standIn(REASONS[res.status] ?? info.error ?? 'The AI could not answer');
  }

  let text = '';
  let by = null;
  let finished = false;
  try {
    for await (const { name, data } of events(res.body)) {
      if (name === 'meta') {
        by = data.by;
        on({ type: 'source', by, tried: data.tried ?? [] });
      } else if (name === 'text') {
        text += data.t;
        on({ type: 'text', t: data.t });
      } else if (name === 'done') {
        finished = true;
        break;
      } else if (name === 'error') {
        break;
      }
    }
  } catch (error) {
    if (signal?.aborted) throw error;
  }
  if (!text.trim()) return standIn('The AI went quiet');
  if (!finished) {
    const note = ' (The answer was cut short.)';
    text += note;
    on({ type: 'text', t: note });
  }
  text = plain(text);
  // "(#word-hunt)", or "(#stack #workshopos)" when it points to two: the first is shown.
  const link = text.match(/\((#[a-z-]+)(?:[\s,]+#[a-z-]+)*\)/)?.[1] ?? null;
  const next = nextFor(link);
  on({ type: 'done', link, next, travel: null });
  return { text, by, link, next, travel: null, id: null };
}

const REASONS = {
  403: 'This page may not ask the AI',
  429: "You've asked a lot for now, so ready answers only",
  503: 'Both AIs are resting',
};

function reply(on, { id = null, text, link = null, next = null, era = null }, by) {
  const after = next ?? START;
  on({ type: 'source', by, tried: [] });
  on({ type: 'text', t: text });
  on({ type: 'done', link, next: after, travel: era });
  return { text, by, link, next: after, travel: era, id };
}

// AI services like to format: **bold**, # headings, - lists. The assistant speaks in plain sentences,
// so whatever slips through is taken out before it's shown. And some models have sentences trained
// so deep that no rule removes them ("I'm sorry, but I can't help with that."): those are swapped
// for what a person would say.
const HUMAN = [
  [/I[’']m sorry, but I can[’']t (?:help with|do) that\.?/gi, "That's not something I'll do."],
  [/I can[’']t help with that\.?/gi, "That's not something I'll help with."],
  [/I don[’']t have that (?:information|detail)\.?/gi, "That isn't on this site, so I don't know."],
  [/,? feel free to ask\.?/gi, ', just ask.'],
];

export function plain(text) {
  let out = text
    .replace(/\*\*|__|`/g, '')
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, '')
    .replace(/^[ \t]*[-*•][ \t]+/gm, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n');
  for (const [robot, person] of HUMAN) out = out.replace(robot, person);
  return out.trim();
}

// The Worker's server-sent events, one { name, data } at a time.
async function* events(body) {
  const reader = body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    buffer += value;
    let end;
    while ((end = buffer.indexOf('\n\n')) >= 0) {
      const block = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      let name = 'message';
      let data = '';
      for (const line of block.split('\n')) {
        if (line.startsWith('event:')) name = line.slice(6).trim();
        else if (line.startsWith('data:')) data += line.slice(5).trim();
      }
      yield { name, data: data ? JSON.parse(data) : {} };
    }
  }
}
