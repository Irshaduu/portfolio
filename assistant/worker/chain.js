// The chain: ask the first AI service; if it's busy, out of quota or broken, ask the next.
//
// A service that fails is rested for a while (a "cool-down"), so the next visitors go straight to
// the one that works instead of waiting on the broken one first. The cool-downs live in the
// Worker's memory: a fresh Worker starts with none, which only costs one extra try.

import { textDeltas } from './sse.js';

// The services, in the order they are asked. All speak the OpenAI chat format.
// A service with no key or model is skipped, so the chain works with whatever is set up.
//
// Gemini first: it understands people, Kerala's Manglish and slang included, and talks most
// naturally. Its full Flash model leads, thinking as little as it can, which measured one to five
// seconds to the first word. When it is busy or out of its free share for the day, the newest Flash
// answers as a reserve: just as good, but about five seconds to the first word and sometimes
// overloaded, which is why it isn't first. Each model has its own free share, so the reserve
// doubles the full-power answers. Only when both are out does Gemini Flash-Lite answer (smaller,
// two or three seconds, a bigger daily share), and only then the two backups. Judged side by side on
// the same 29 exam messages (19 Oct 2026): Groq is stiffer and misreads slang, but invented nothing;
// GLM follows the job-fit format better and has five times the daily room, but invented two facts
// and was too slow twice. Trust decides: Groq first, GLM when Groq is out of its small share.
// On Gemini's free tier Google may read and learn from the messages, which is why the chat
// asks visitors not to share personal or sensitive data. The trace (?trace on the page) and
// Cloudflare's logs say which one answered.
const GEMINI = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';

export function routes(env) {
  return [
    // Gemini 3 always thinks a little before it answers: as little as each model allows.
    { name: 'Gemini', url: GEMINI, key: env.GEMINI_API_KEY, model: env.GEMINI_MODEL, extra: { reasoning_effort: env.GEMINI_THINKING || 'low' } },
    { name: 'Gemini Reserve', url: GEMINI, key: env.GEMINI_API_KEY, model: env.GEMINI_RESERVE_MODEL, extra: { reasoning_effort: 'low' } },
    { name: 'Gemini Lite', url: GEMINI, key: env.GEMINI_API_KEY, model: env.GEMINI_LITE_MODEL, extra: { reasoning_effort: 'low' } },
    {
      name: 'Groq',
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: env.GROQ_API_KEY,
      model: env.GROQ_MODEL,
      // gpt-oss thinks before it answers. Keep the thinking short (it counts against the free
      // per-minute token limit) and out of the reply.
      extra: { reasoning_effort: 'low', include_reasoning: false },
    },
    // GLM on Workers AI: inside Cloudflare, so no key and no relay (Google's location rules don't
    // apply), 10,000 free neurons a day, then it rests until the day turns at 00:00 UTC. It thinks
    // before it answers unless its chat template is told not to.
    { name: 'GLM', key: env.AI ? 'binding' : undefined, model: env.GLM_MODEL, extra: { chat_template_kwargs: { enable_thinking: false } }, call: env.AI && workersAI(env.AI) },
  ];
}

// Workers AI answers through the Worker's own AI binding, not a web address. It streams the same
// server-sent events, so its stream is wrapped as a response like any other service's, and it stops
// when the chain gives up on it (too slow). Out of its day's neurons it says so in an error, which
// becomes a 429 that rests it until midnight UTC.
const workersAI = (ai) => async ({ model, ...input }, signal) => {
  let stream;
  try {
    stream = await ai.run(model, input);
  } catch (error) {
    const message = String(error?.message ?? error);
    const spent = /neuron|allocation|daily/i.test(message);
    const untilMidnight = Math.ceil((Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 1) - Date.now()) / 1000);
    return new Response(JSON.stringify({ error: { message } }), { status: spent ? 429 : 502, headers: spent ? { 'retry-after': String(untilMidnight) } : {} });
  }
  const reader = stream.getReader();
  const body = new ReadableStream({
    start(controller) {
      signal?.addEventListener('abort', () => {
        reader.cancel().catch(() => {});
        try { controller.error(new DOMException('The service was too slow.', 'AbortError')); } catch {}
      }, { once: true });
    },
    async pull(controller) {
      try {
        const { value, done } = await reader.read();
        if (done) controller.close();
        else controller.enqueue(value);
      } catch (error) {
        try { controller.error(error); } catch {}
      }
    },
    cancel: () => reader.cancel().catch(() => {}),
  });
  return new Response(body, { headers: { 'content-type': 'text/event-stream' } });
};

const SECOND = 1000;
const MINUTE = 60 * SECOND;

// How long to rest a service after a failure. `said` is the service's own reason.
export function coolDown(status, retryAfter, said = '') {
  // Turned away for where this one request came from, not for good: the next may be fine.
  if (status === 400 && /location is not supported/i.test(said)) return 0;
  if (status === 429) {
    // Rate limited. Respect the service's own "try again after", within reason.
    const seconds = Number(retryAfter);
    return Number.isFinite(seconds) && seconds > 0 ? Math.min(Math.max(seconds, 5), 3600) * SECOND : MINUTE;
  }
  if (status === 400 || status === 401 || status === 403 || status === 404) return 10 * MINUTE; // wrong key or model: a person must fix it
  if (status >= 500) return 30 * SECOND; // the service is having a bad moment
  return MINUTE;
}

// Asks each service in turn until one starts answering. Returns the service and its answer as a
// stream of text pieces, the first piece already in hand, or { route: null } if none would answer.
// `tried` says what happened at each service, for the logs and the visitor's trace. A service that
// refuses also says why, in its own words, to `log` (the Worker's logs only, never the page).
export async function firstAnswer(list, request, { fetch, cooling, now = Date.now, waitMs = 8 * SECOND, log = () => {} }) {
  const tried = [];
  for (const route of list) {
    if (!route.key || !route.model) {
      tried.push({ name: route.name, why: 'not set up' });
      continue;
    }
    if ((cooling.get(route.name) ?? 0) > now()) {
      tried.push({ name: route.name, why: 'resting' });
      continue;
    }

    // Give up on a service that hasn't started its answer in time. Once the first words arrive,
    // the rest may take as long as it needs.
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), waitMs);
    try {
      const body = { ...request, ...route.extra, model: route.model, stream: true };
      const res = route.call
        ? await Promise.race([route.call(body, abort.signal), new Promise((_, stop) => abort.signal.addEventListener('abort', () => stop(abort.signal.reason), { once: true }))])
        : await fetch(route.url, {
          method: 'POST',
          headers: { authorization: `Bearer ${route.key}`, 'content-type': 'application/json' },
          body: JSON.stringify(body),
          signal: abort.signal,
        });
      if (!res.ok || !res.body) {
        const refusal = await res.text().catch(() => '');
        const said = refusal.match(/"message"\s*:\s*"([^"]{1,300})/)?.[1] ?? refusal.slice(0, 300);
        cooling.set(route.name, now() + coolDown(res.status, res.headers.get('retry-after'), said));
        tried.push({ name: route.name, why: `HTTP ${res.status}` });
        log({ service: route.name, status: res.status, said });
        continue;
      }
      // A 200 can still be empty (a blocked answer, or one spent entirely on thinking).
      // Only a service that says something counts as answering.
      const pieces = textDeltas(res.body);
      const first = await pieces.next();
      if (first.done) {
        cooling.set(route.name, now() + MINUTE);
        tried.push({ name: route.name, why: 'empty answer' });
        continue;
      }
      clearTimeout(timer);
      tried.push({ name: route.name, why: 'answered' });
      return { route, first: first.value, rest: pieces, tried, abort };
    } catch {
      cooling.set(route.name, now() + 30 * SECOND);
      tried.push({ name: route.name, why: abort.signal.aborted ? 'too slow' : 'failed' });
    } finally {
      clearTimeout(timer);
    }
  }
  return { route: null, tried };
}
