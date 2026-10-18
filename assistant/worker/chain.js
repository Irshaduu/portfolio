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
// two or three seconds, a bigger daily share), and only then Groq: very fast, but stiffer, and it
// misreads slang. On Gemini's free tier Google may read and learn from the messages, which is why the chat
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
  ];
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;

// How long to rest a service after a failure.
export function coolDown(status, retryAfter) {
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
// `tried` says what happened at each service, for the logs and the visitor's trace.
export async function firstAnswer(list, request, { fetch, cooling, now = Date.now, waitMs = 8 * SECOND }) {
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
      const res = await fetch(route.url, {
        method: 'POST',
        headers: { authorization: `Bearer ${route.key}`, 'content-type': 'application/json' },
        body: JSON.stringify({ ...request, ...route.extra, model: route.model, stream: true }),
        signal: abort.signal,
      });
      if (!res.ok || !res.body) {
        cooling.set(route.name, now() + coolDown(res.status, res.headers.get('retry-after')));
        tried.push({ name: route.name, why: `HTTP ${res.status}` });
        res.body?.cancel().catch(() => {});
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
