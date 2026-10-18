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

// A fetch that answers each service by its model (both Gemini models share one address), or by its
// address, and remembers what it was asked.
export function fakeFetch(byService) {
  const calls = [];
  const fetch = async (url, init) => {
    const host = new URL(url).host;
    const body = JSON.parse(init.body);
    calls.push({ host, model: body.model, url, init, body });
    const reply = byService[body.model] ?? byService[host];
    if (!reply) throw new TypeError(`no fake for ${body.model} at ${host}`);
    return typeof reply === 'function' ? reply(init) : reply;
  };
  return { fetch, calls };
}

export const GEMINI = 'gemini-test'; // the models, which fakeFetch answers by
export const GROQ = 'groq-test';

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
