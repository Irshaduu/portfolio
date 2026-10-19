// The assistant's server: one small Cloudflare Worker between the portfolio and the AI services.
//
// It holds the API keys (the page never sees them), checks every question, keeps each visitor to a
// fair share, asks Gemini and then Groq (chain.js), and streams the answer back word by word.
// When no service will answer it says so, and the page shows a ready-made answer instead.
//
//   GET  /      a health check: open it in a browser to see which services have their keys
//   POST /chat  { messages: [{ role: 'user' | 'assistant', content }], context?: { era, section, intent } }
//               -> server-sent events: meta { by, tried, left? }, then text { t } pieces, then done {}
//               (or error { partial }). left: questions left today, only when 5 or fewer.
//   POST /fit   { post }: a job post, checked against his work (prompt.js), as the same events
//
// Refusals say how long to wait: 429 { limit: 'minute' | 'day', wait } when the visitor used their
// share, 503 { wait } when every AI is resting (wait: seconds until the first is free again).

import { firstAnswer, routes } from './chain.js';
import { makeLimiter } from './limits.js';
import { buildFitMessages, buildMessages, ERAS, INTENTS, SECTIONS } from './prompt.js';

const MAX_BODY = 16 * 1024; // bytes in one request
const MAX_TURNS = 8; // messages of the conversation sent on to the AI
const MAX_QUESTION = 600; // characters in one question
const MAX_ANSWER = 4000; // characters kept of one earlier turn sent back as context
const MAX_POST = 6000; // characters in one job post

// Shared by every request this Worker handles (see chain.js and limits.js for why memory is enough).
const cooling = new Map();
const allow = makeLimiter();

export default {
  fetch: (request, env) => handle(request, env, { fetch: relayed(env), cooling, allow }),
};

// The AI services are called from the Relay below, which Cloudflare keeps in western North America.
// A Worker's own calls leave from wherever the visitor reached Cloudflare, and on the free plan a
// visitor in India may reach it in Hong Kong, where Gemini turns every request away ("User location
// is not supported for the API use."). The Relay's calls always leave from the US. If the Relay
// can't be reached, the call goes direct, as it used to.
const RELAY_HOSTS = ['generativelanguage.googleapis.com', 'api.groq.com'];
function relayed(env) {
  if (!env.RELAY) return (...args) => fetch(...args);
  const relay = env.RELAY.get(env.RELAY.idFromName('ai'), { locationHint: 'wnam' });
  return async (url, init = {}) => {
    try {
      return await relay.fetch('https://relay/', { method: 'POST', headers: { ...init.headers, 'x-relay-to': url }, body: init.body, signal: init.signal });
    } catch (error) {
      if (init.signal?.aborted) throw error;
      return fetch(url, init);
    }
  };
}

export class Relay {
  async fetch(request) {
    const to = request.headers.get('x-relay-to') ?? '';
    if (!RELAY_HOSTS.includes(URL.canParse(to) ? new URL(to).hostname : '')) return new Response('Not found.', { status: 404 });
    const headers = new Headers(request.headers);
    headers.delete('x-relay-to');
    return fetch(to, { method: 'POST', headers, body: request.body, signal: request.signal });
  }
}

export async function handle(request, env, deps) {
  const url = new URL(request.url);
  const origin = request.headers.get('origin') ?? '';
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').map((o) => o.trim()).filter(Boolean);
  const cors = allowed.includes(origin) ? { 'access-control-allow-origin': origin, vary: 'origin' } : null;

  if (request.method === 'GET' && url.pathname === '/') {
    const services = routes(env).map(({ name, key, model }) => ({ name, model: model ?? null, ready: Boolean(key && model) }));
    return json({ ok: true, services }, 200, cors ?? {});
  }
  if (url.pathname !== '/chat' && url.pathname !== '/fit') return json({ error: 'Not found.' }, 404);

  // Only the portfolio's own pages may ask. (A script can fake this header; limits.js covers that.)
  if (!cors) return json({ error: "This assistant only answers on Irshad's portfolio." }, 403);
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: { ...cors, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'content-type, x-exam-key', 'access-control-max-age': '86400' },
    });
  }
  if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405, cors);

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: 'Too long.' }, 413, cors);
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Not JSON.' }, 400, cors);
  }
  const fit = url.pathname === '/fit';
  const asked = fit ? readPost(body) : readHistory(body);
  if (!asked) {
    const error = fit ? `Paste a job post of up to ${MAX_POST} characters.` : `Ask a question of up to ${MAX_QUESTION} characters.`;
    return json({ error }, 400, cors);
  }

  // Cloudflare puts the visitor's real address in this header. (WorkshopOS learned the hard way that
  // behind a proxy the "visitor" can otherwise be the proxy itself, so everyone shares one count.)
  const visitor = request.headers.get('cf-connecting-ip') ?? 'unknown';
  // The exam (exam.mjs) asks many questions in a row, so it carries a key that skips the share.
  const examining = Boolean(env.EXAM_KEY) && request.headers.get('x-exam-key') === env.EXAM_KEY;
  const share = examining || deps.allow(visitor);
  if (share !== true) {
    // Which limit, so the page can say "give me a minute" or "see you tomorrow" in the agent's voice.
    const { limit = 'minute', wait = 60 } = share || {};
    return json({ error: 'Too many questions for now.', limit, wait, fallback: true }, 429, { ...cors, 'retry-after': String(wait) });
  }

  const started = Date.now();
  // A job-fit check wants care more than charm, so it runs cooler than the chat. max_tokens is a
  // ceiling, not a target, and Gemini counts its hidden thinking in it: at 1024, a job post that
  // made it think hard came back cut off mid-line.
  const call = fit
    ? { messages: buildFitMessages(asked), temperature: 0.2, max_tokens: 4096 }
    : { messages: buildMessages(asked, readContext(body.context)), temperature: 0.5, max_tokens: 2048 };
  // A refusal is logged with the service's own reason and the data centre the question came in at.
  const log = (refused) => console.log(JSON.stringify({ ...refused, colo: request.cf?.colo ?? null }));
  // The exam can ask one service alone (x-exam-only: GLM), to judge a backup without spending the
  // Geminis' day. Only with the exam key: visitors always get the whole chain.
  const only = examining ? request.headers.get('x-exam-only') : null;
  const result = await firstAnswer(routes(env).filter((r) => !only || r.name === only), call, { log, ...deps });
  const tried = result.tried.map(({ name, why }) => `${name}: ${why}`);
  // What the logs keep: what was asked for, which service answered and how long it took. Never
  // the question or the job post.
  console.log(JSON.stringify({ path: url.pathname, by: result.route?.name ?? null, tried, ms: Date.now() - started }));

  if (!result.route) {
    // When the first one is free again, for the page's "back in 0:52". Each rests as chain.js decided.
    const free = routes(env).filter((r) => r.key && r.model).map((r) => deps.cooling.get(r.name) ?? 0);
    const wait = Math.min(3600, Math.max(5, Math.ceil((Math.min(...free) - Date.now()) / 1000)));
    return json({ error: 'No AI service is free right now.', fallback: true, tried, wait }, 503, { ...cors, 'retry-after': String(wait) });
  }
  // Near the end of their day's share, the page says "5 left today", so a long chat never ends by surprise.
  const left = examining || typeof deps.allow.left !== 'function' ? null : deps.allow.left(visitor);
  return new Response(relay(result, tried, left !== null && left <= 5 ? left : null), {
    headers: { ...cors, 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// The visitor's conversation, checked and trimmed, or null if it isn't one. Only the new question
// has to fit the limit; an earlier turn that ran long is shortened, never a reason to refuse (one
// long answer used to make every later question in that chat fail).
// Two turns from the same side in a row are joined: some services refuse them.
export function readHistory(body) {
  const messages = body?.messages;
  if (!Array.isArray(messages) || !messages.length) return null;
  const newest = messages.at(-1);
  if (newest?.role !== 'user' || typeof newest.content !== 'string' || newest.content.trim().length > MAX_QUESTION) return null;
  const turns = [];
  for (const m of messages.slice(-MAX_TURNS)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null;
    const content = (m === newest ? m.content : m.content.slice(0, MAX_ANSWER)).trim();
    if (!content) continue;
    const last = turns.at(-1);
    if (last?.role === m.role) last.content += `\n\n${content}`;
    else turns.push({ role: m.role, content });
  }
  while (turns[0]?.role === 'assistant') turns.shift();
  return turns.at(-1)?.role === 'user' ? turns : null;
}

// The job post a visitor pasted, trimmed, or null if it isn't text of a sensible length.
export function readPost(body) {
  const post = typeof body?.post === 'string' ? body.post.trim() : '';
  return post.length >= 10 && post.length <= MAX_POST ? post : null;
}

// Where the visitor is on the site. Only known values pass, so nothing a visitor sends here can
// become an instruction to the AI.
export function readContext(context) {
  const out = {};
  if (ERAS.includes(String(context?.era))) out.era = String(context.era);
  if (SECTIONS.includes(context?.section)) out.section = context.section;
  if (Object.hasOwn(INTENTS, context?.intent ?? '')) out.intent = context.intent;
  return out;
}

// The answer, as server-sent events the page reads as they arrive.
function relay({ route, first, rest, abort }, tried, left) {
  const encoder = new TextEncoder();
  const event = (name, data) => encoder.encode(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`);
  let opened = false;
  return new ReadableStream({
    async pull(controller) {
      if (!opened) {
        opened = true;
        controller.enqueue(event('meta', { by: route.name, tried, ...(left !== null && { left }) }));
        controller.enqueue(event('text', { t: first }));
        return;
      }
      try {
        const next = await rest.next();
        if (next.done) {
          controller.enqueue(event('done', {}));
          controller.close();
        } else {
          controller.enqueue(event('text', { t: next.value }));
        }
      } catch {
        // The service broke off mid-answer. The page keeps what arrived and says it was cut short.
        controller.enqueue(event('error', { partial: true }));
        controller.close();
      }
    },
    cancel() {
      // The visitor closed the chat or the page: stop the AI too.
      abort.abort();
    },
  });
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...headers, 'content-type': 'application/json; charset=utf-8' } });
}
