// The assistant's server: one small Cloudflare Worker between the portfolio and the AI services.
//
// It holds the API keys (the page never sees them), checks every question, keeps each visitor to a
// fair share, asks Gemini and then Groq (chain.js), and streams the answer back word by word.
// When no service will answer it says so, and the page shows a ready-made answer instead.
//
//   GET  /      a health check: open it in a browser to see which services have their keys
//   POST /chat  { messages: [{ role: 'user' | 'assistant', content }], context?: { era, section, intent } }
//               -> server-sent events: meta { by, tried }, then text { t } pieces, then done {}
//               (or error { partial })
//   POST /fit   { post }: a job post, checked against his work (prompt.js), as the same events

import { firstAnswer, routes } from './chain.js';
import { makeLimiter } from './limits.js';
import { buildFitMessages, buildMessages, ERAS, INTENTS, SECTIONS } from './prompt.js';

const MAX_BODY = 16 * 1024; // bytes in one request
const MAX_TURNS = 8; // messages of the conversation sent on to the AI
const MAX_QUESTION = 600; // characters in one question
const MAX_ANSWER = 4000; // characters in one earlier answer sent back as context
const MAX_POST = 6000; // characters in one job post

// Shared by every request this Worker handles (see chain.js and limits.js for why memory is enough).
const cooling = new Map();
const allow = makeLimiter();

export default {
  fetch: (request, env) => handle(request, env, { fetch: (...args) => fetch(...args), cooling, allow }),
};

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
  if (!examining && !deps.allow(visitor)) return json({ error: 'Too many questions for now.', fallback: true }, 429, cors);

  const started = Date.now();
  // A job-fit check wants care more than charm, so it runs cooler than the chat. max_tokens is a
  // ceiling, not a target, and Gemini counts its hidden thinking in it: at 1024, a job post that
  // made it think hard came back cut off mid-line.
  const call = fit
    ? { messages: buildFitMessages(asked), temperature: 0.2, max_tokens: 4096 }
    : { messages: buildMessages(asked, readContext(body.context)), temperature: 0.5, max_tokens: 2048 };
  const result = await firstAnswer(routes(env), call, deps);
  const tried = result.tried.map(({ name, why }) => `${name}: ${why}`);
  // What the logs keep: what was asked for, which service answered and how long it took. Never
  // the question or the job post.
  console.log(JSON.stringify({ path: url.pathname, by: result.route?.name ?? null, tried, ms: Date.now() - started }));

  if (!result.route) return json({ error: 'No AI service is free right now.', fallback: true, tried }, 503, cors);
  return new Response(relay(result, tried), {
    headers: { ...cors, 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// The visitor's conversation, checked and trimmed, or null if it isn't one.
// Two turns from the same side in a row are joined: some services refuse them.
export function readHistory(body) {
  const messages = body?.messages;
  if (!Array.isArray(messages) || !messages.length) return null;
  const turns = [];
  for (const m of messages.slice(-MAX_TURNS)) {
    if (!m || (m.role !== 'user' && m.role !== 'assistant') || typeof m.content !== 'string') return null;
    const content = m.content.trim();
    if (!content) continue;
    const last = turns.at(-1);
    if (last?.role === m.role) last.content += `\n\n${content}`;
    else turns.push({ role: m.role, content });
  }
  while (turns[0]?.role === 'assistant') turns.shift();
  const question = turns.at(-1);
  if (!question || question.role !== 'user' || question.content.length > MAX_QUESTION) return null;
  if (turns.some(({ role, content }) => role === 'assistant' && content.length > MAX_ANSWER)) return null;
  return turns;
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
function relay({ route, first, rest, abort }, tried) {
  const encoder = new TextEncoder();
  const event = (name, data) => encoder.encode(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`);
  let opened = false;
  return new ReadableStream({
    async pull(controller) {
      if (!opened) {
        opened = true;
        controller.enqueue(event('meta', { by: route.name, tried }));
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
