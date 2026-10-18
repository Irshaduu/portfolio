// Fake AI services for the tests: answers streamed the way Gemini and Groq stream them.

const encoder = new TextEncoder();

// A response whose body arrives in exactly these chunks.
export function streamed(chunks, { status = 200, headers = {} } = {}) {
  const body = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
  return new Response(body, { status, headers: { 'content-type': 'text/event-stream', ...headers } });
}

// An OpenAI-format stream that says these pieces, then [DONE].
export function answer(...pieces) {
  return streamed([...pieces.map((content) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`), 'data: [DONE]\n\n']);
}

export function failure(status, headers = {}) {
  return new Response(JSON.stringify({ error: { message: 'nope' } }), { status, headers });
}

// A fetch that answers each service by its address, and remembers what it was asked.
export function fakeFetch(byHost) {
  const calls = [];
  const fetch = async (url, init) => {
    const host = new URL(url).host;
    calls.push({ host, url, init, body: JSON.parse(init.body) });
    const reply = byHost[host];
    if (!reply) throw new TypeError(`no fake for ${host}`);
    return typeof reply === 'function' ? reply(init) : reply;
  };
  return { fetch, calls };
}

export const GEMINI = 'generativelanguage.googleapis.com';
export const GROQ = 'api.groq.com';

export const ENV = {
  ALLOWED_ORIGINS: 'https://irshaduu.github.io,http://localhost:4173',
  GEMINI_API_KEY: 'test-gemini',
  GEMINI_MODEL: 'gemini-test',
  GROQ_API_KEY: 'test-groq',
  GROQ_MODEL: 'groq-test',
};

export async function collect(iterator) {
  const out = [];
  for await (const value of iterator) out.push(value);
  return out;
}
