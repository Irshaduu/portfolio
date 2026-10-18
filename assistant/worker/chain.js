// The chain: ask the first AI service; if it's busy, out of quota or broken, ask the next.
//
// A service that fails is rested for a while (a "cool-down"), so the next visitors go straight to
// the one that works instead of waiting on the broken one first. The cool-downs live in the
// Worker's memory: a fresh Worker starts with none, which only costs one extra try.

import { textDeltas } from './sse.js';

// The services, in the order they are asked. Both speak the OpenAI chat format.
// A service with no key is skipped, so the chain works with one key while you set up the other.
//
// Groq first: it writes very fast, so the answer appears almost at once, and it doesn't keep or
// learn from what visitors type. Gemini is the backup: more room per minute, but on its free tier
// Google may read and learn from the messages. A question in Malayalam goes to Gemini first,
// because it writes better Malayalam.
export function routes(env, { question = '' } = {}) {
  const groq = {
    name: 'Groq',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    key: env.GROQ_API_KEY,
    model: env.GROQ_MODEL,
    // gpt-oss thinks before it answers. Keep the thinking short (it counts against the free
    // per-minute token limit) and out of the reply.
    extra: { reasoning_effort: 'low', include_reasoning: false },
  };
  const gemini = {
    name: 'Gemini',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    key: env.GEMINI_API_KEY,
    model: env.GEMINI_MODEL,
  };
  return MALAYALAM.test(question) ? [gemini, groq] : [groq, gemini];
}

const MALAYALAM = /[ഀ-ൿ]/;

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
export async function firstAnswer(list, request, { fetch, cooling, now = Date.now, waitMs = 12 * SECOND }) {
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
