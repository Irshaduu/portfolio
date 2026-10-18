// Asks the assistant a question. A tapped suggestion gets its ready-made answer at once; a typed
// question goes to the AI (through the Worker in assistant/), which reads the whole conversation;
// and when the AI is resting, the closest ready answer or "I don't know" stands in. Two things never
// wait for the AI: someone in danger gets the helpline, and "take me to 1997" travels.
// A pasted job post goes to checkFit() instead, which checks it against his work (fit.js).
// Every era's assistant will use this; only how they look will differ.
//
// It reports as it goes, so a page can show the answer arriving and the steps behind it:
//   { type: 'step', text }                 what it's doing ("Asking the AI")
//   { type: 'source', by, tried }          who answers: 'ready', 'Gemini', 'Gemini Lite', 'Groq', 'none', or 'limit'
//   { type: 'text', t }                    the next piece of the answer (pass the whole so far through plain())
//   { type: 'done', link, next, travel }   finished: the part of the page to show, what to ask next,
//                                          and the era to travel to, if the visitor asked to
//                                          (checkFit's says { fit, next }: the check, read)
// and resolves to { text, by, link, next, travel, id }, to keep in the conversation's history (id:
// which ready answer, if one was given). Two more, for the page's header, when they apply:
//   wait { reason: 'minute' | 'day' | 'rest', seconds }   the visitor used their share, or every AI
//                                                         is resting: how long until they can ask
//   left                                                  questions left today, when 5 or fewer
//
// Options: context { era, section, intent } tells the AI where the visitor is; tapped: true for a
// suggestion button's question; deep: true for "tell me more", which always asks the AI.

import { DONT_KNOW, DONT_KNOW_NEXT, LIMIT, START, match, nextFor, travel } from './answers.js';
import { FIT_NEXT, fitText, parseFit, wordCheck } from './fit.js';

// The Worker's address, printed by `npm run deploy` in assistant/. Empty, every question gets a
// ready-made answer or "I don't know".
export const SERVER = 'https://portfolio-assistant.irshaduu.workers.dev';

export async function ask(question, history = [], { on = () => {}, server = SERVER, signal, context, tapped = false, deep = false } = {}) {
  on({ type: 'step', text: 'Looking for a ready answer' });
  const trip = travel(question);
  if (trip) return reply(on, trip, 'ready');
  const ready = match(question);
  if (ready?.id === 'crisis') return reply(on, ready, 'ready');
  // "Does he fit my job?" typed asks to start the check, like the button: no AI needed to say "paste it".
  if ((tapped && !deep && ready?.sure) || (ready?.id === 'fit' && ready.sure)) return reply(on, ready, 'ready');

  // No sure fit: the AI. If it can't answer, the closest ready answer stands in.
  const standIn = (why) => {
    on({ type: 'step', text: why });
    const guess = ready && ready.score >= 2 ? ready : null;
    return reply(on, guess ?? { text: DONT_KNOW, link: '#contact', next: DONT_KNOW_NEXT }, guess ? 'ready' : 'none');
  };
  const got = await stream(server, '/chat', { messages: [...history, { role: 'user', content: question }], context }, on, signal);
  // The visitor's own share is used up: the agent says so, rather than a stand-in that may not fit.
  if (got.limit) {
    on({ type: 'step', text: got.why });
    return { ...reply(on, { id: 'limit', ...LIMIT[got.limit] }, 'limit'), wait: pause(got) };
  }
  if (got.why) return { ...standIn(got.why), ...(got.wait && { wait: pause(got) }) };
  let { text } = got;
  if (!got.finished) {
    const note = ' (The answer was cut short.)';
    text += note;
    on({ type: 'text', t: note });
  }
  text = plain(text);
  // "(#word-hunt)", or "(#stack #workshopos)" when it points to two: the first is shown.
  const link = text.match(/\((#[a-z-]+)(?:[\s,]+#[a-z-]+)*\)/)?.[1] ?? null;
  const next = nextFor(link);
  on({ type: 'done', link, next, travel: null });
  return { text, by: got.by, link, next, travel: null, id: null, ...(got.left != null && { left: got.left }) };
}

// How long until the visitor can ask the AI again, from a refusal: { reason, seconds }.
const pause = (got) => ({ reason: got.limit ?? 'rest', seconds: got.wait ?? 60 });

// Checks a job post against his work. The AI's lines arrive as text events (parseFit reads them as
// they come), and the result is { text, by, fit, next, ... }: `fit` the check, read, and `text` the
// same in sentences, for the conversation's history. When the AI is resting, a check of the post's
// own words stands in (by: 'ready').
export async function checkFit(post, { on = () => {}, server = SERVER, signal } = {}) {
  on({ type: 'step', text: 'Reading the job post' });
  const done = (fit, by) => {
    on({ type: 'done', fit, next: FIT_NEXT });
    return { text: fitText(fit), by, fit, link: null, next: FIT_NEXT, travel: null, id: 'fit-check' };
  };
  const got = await stream(server, '/fit', { post }, on, signal);
  if (got.why) {
    on({ type: 'step', text: got.why });
    on({ type: 'source', by: 'ready', tried: [] });
    const quick = wordCheck(post);
    // The visitor's share is used up: say so, and give the word check meanwhile.
    if (got.limit === 'minute') quick.summary = "You're quick! Give me a minute for the full check. Here's a quick word check meanwhile.";
    if (got.limit === 'day') quick.summary = "We've talked a lot today, so the full check rests till tomorrow. Here's a quick word check meanwhile.";
    return { ...done(quick, 'ready'), ...((got.limit || got.wait) && { wait: pause(got) }) };
  }
  const fit = parseFit(got.text);
  if (!got.finished) fit.summary = `${fit.summary} (The answer was cut short.)`.trim();
  return { ...done(fit, got.by), ...(got.left != null && { left: got.left }) };
}

// Asks the Worker at `path` and passes the answer on as it arrives. Resolves to { text, by, finished,
// left }, or to { why, limit?, wait? } when no AI answered, for the caller's stand-in.
async function stream(server, path, body, on, signal) {
  if (!server) return { why: 'The AI is not switched on yet' };
  on({ type: 'step', text: 'Asking the AI' });
  let res;
  try {
    res = await fetch(`${server.replace(/\/+$/, '')}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    return { why: 'Could not reach the AI' };
  }
  if (!res.ok || !res.body) {
    const info = await res.json().catch(() => ({}));
    const why = REASONS[res.status] ?? info.error ?? 'The AI could not answer';
    // How long to wait, when the server says: a visitor's share (429, with which limit), or every
    // AI resting (503).
    const wait = Number(info.wait) > 0 ? Math.round(Number(info.wait)) : null;
    if (res.status === 429) return { why, limit: info.limit === 'day' ? 'day' : 'minute', wait };
    return { why, wait };
  }

  let text = '';
  let by = null;
  let left = null;
  let finished = false;
  try {
    for await (const { name, data } of events(res.body)) {
      if (name === 'meta') {
        by = data.by;
        if (Number.isInteger(data.left)) left = data.left;
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
  if (!text.trim()) return { why: 'The AI went quiet' };
  return { text, by, finished, left };
}

const REASONS = {
  403: 'This page may not ask the AI',
  429: 'This visitor reached their share of AI questions',
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
// for what a person would say. That includes the closed door ("The site doesn't mention why…"): his
// agent says what a friend would, "He hasn't told me why…".
const SITE = String.raw`(?:the|this) (?:site|website|portfolio|page)`;
const HUMAN = [
  [/I[’']m sorry, but I can[’']t (?:help with|do) that\.?/gi, "That's not something I'll do."],
  [/I can[’']t help with that\.?/gi, "That's not something I'll help with."],
  [/I don[’']t have (?:that|any) (?:information|detail|details)(?: (?:about|on) (?:that|this))?/gi, "He hasn't told me that one"],
  [new RegExp(String.raw`${SITE} (?:doesn[’']t|does not) (?:mention|say|tell me) (why|how|what|when|where|whether|if|who)\b`, 'gi'), "he hasn't told me $1"],
  [new RegExp(String.raw`${SITE} (?:doesn[’']t|does not) (?:mention|say anything about|talk about)`, 'gi'), "he hasn't told me about"],
  [new RegExp(String.raw`(?:that|this|it)(?: information)? (?:isn[’']t|is not) (?:mentioned |listed |shown )?(?:on|in) ${SITE}`, 'gi'), "he hasn't told me that one"],
  [new RegExp(String.raw`(?:it|that)[’']s not (?:mentioned |listed |shown )?(?:on|in) ${SITE}`, 'gi'), "he hasn't told me that one"],
  [/,? feel free to ask\.?/gi, ', just ask.'],
];

export function plain(text) {
  let out = text
    .replace(/\*\*|__|`/g, '')
    .replace(/^[ \t]{0,3}#{1,6}[ \t]+/gm, '')
    .replace(/^[ \t]*[-*•][ \t]+/gm, '')
    .replace(/‑/g, '-') // Groq writes "word‑hunt" with a non-breaking hyphen, which no link matches
    .replace(/\s*—\s*|\s+–\s+/g, ', ') // a dash joining sentences reads easier as a comma ("1–3" stays)
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n');
  for (const [robot, person] of HUMAN) out = out.replace(robot, person);
  // A swap at the start of a sentence starts with a capital, as the sentence did.
  out = out.replace(/(^|[.!?]\s+)he hasn't/g, "$1He hasn't");
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
