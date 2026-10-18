// Reads a streamed answer from an AI service, piece by piece.
//
// Gemini and Groq both speak the OpenAI chat format, so one reader serves both. The stream is
// server-sent events: lines of `data: {json}`, ending with `data: [DONE]`. A network chunk can end
// in the middle of a line, so the reader keeps the unfinished part until the rest arrives.

export async function* textDeltas(body) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      const lines = buffer.split('\n');
      buffer = done ? '' : lines.pop();
      for (const line of lines) {
        const text = parseLine(line.trim());
        if (text === DONE) return;
        if (text) yield text;
      }
      if (done) return;
    }
  } finally {
    reader.releaseLock();
  }
}

const DONE = Symbol('done');

// One line of the stream: the answer's next piece, DONE at the end, or nothing (comments, empty
// lines, and the model's private reasoning, which arrives in its own field and is never shown).
function parseLine(line) {
  if (!line.startsWith('data:')) return null;
  const data = line.slice(5).trim();
  if (data === '[DONE]') return DONE;
  let json;
  try {
    json = JSON.parse(data);
  } catch {
    return null;
  }
  if (json.error) throw new Error(`stream error: ${json.error.message || json.error.status || 'unknown'}`);
  const text = json.choices?.[0]?.delta?.content;
  return typeof text === 'string' && text ? text : null;
}
