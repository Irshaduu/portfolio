// Irshad's Agent on a phone, in each era, for its card in Work: node tools/agent-video.mjs capture|record
//
//   capture  asks the live agent the video's messages once and keeps every answer exactly as it
//            streamed, with its timing, in tools/agent-video.json. Run it when the full Flash model
//            answers: the file says which model did, and the bars by the brain in the video's header will too.
//   record   plays that conversation on the real page in each era, on a phone screen, and films it.
//            The page asks the agent as usual, but the answers come from the file instead of the
//            network: the same words, in the same pieces, at the same pace; only the wait before the
//            first word is cut short, as the card's caption says. 2013, 2023, 2026 and 2030 get a
//            video (assets/shots/eras/<era>-agent.mp4) and its first frame as a still; 1997, 2001
//            and 2007, before web video, get a still of the finished check. 1992 shows "[IMAGE]".
//
// It starts its own copy of tools/serve.mjs and a headless Edge or Chrome (set BROWSER to use
// another one), and films with the browser's own video recorder, so nothing needs installing.

import { spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { SERVER } from '../js/assistant/client.js';

const root = resolve(import.meta.dirname, '..');
const DATA = join(root, 'tools/agent-video.json');
const port = 4172;
const debug = 9334;

// The conversation: a joke, a cheeky one, an honest "not shown", then a real-looking job post. Its
// gaps (PHP, Java, SAP, Oracle) are tools he isn't heading for, so the video stays true for years.
const CHAT = ['Is Irshad better than ChatGPT?', 'Will he work for free?', 'Does he know PHP?'];
const FIT_ASK = 'Does he fit my job?'; // answered by the page itself, like the button: no AI
const POST = `Python Developer (Django) – Kochi, Kerala
Full-time · On-site (Infopark) · 1–3 years

About us
We're a growing product company building billing and inventory software for retail and service businesses across Kerala. We're moving our older system to Django.

What you'll do
• Build and maintain backend features and REST APIs in Django
• Design PostgreSQL schemas and write efficient queries
• Write unit and integration tests for new and existing code
• Work with our front-end and mobile teams
• Fix production issues and keep the codebase clean

What we're looking for
• 1–3 years of experience with Python and Django
• Good knowledge of REST APIs and PostgreSQL
• Comfortable with Git and code reviews
• Habit of writing automated tests

Nice to have
• Exposure to PHP or Java, to help move the older system across
• Experience integrating with SAP or Oracle ERP
• Experience with billing, inventory or accounting systems`;

// On the film the agent fills the phone, its own window maximised in each era's clothes, with
// the page and the time machine out of sight. (On the site it floats over the page as a card.)
const FULL_SCREEN = `
  #agent.agent {
    position: fixed !important; inset: 0 !important; width: auto !important; height: 100% !important;
    max-height: none !important; margin: 0 !important; border-radius: 0 !important;
    translate: none !important; transform: none !important; z-index: 2147483647 !important;
  }
  #agent .agent__log { flex: 1 1 auto !important; }
  .timemachine, .agent-launch { visibility: hidden !important; }
`;
const VIDEO_ERAS = ['2013', '2023', '2026', '2030'];
const STILL_ERAS = ['1997', '2001', '2007'];
const PHONE = { width: 390, height: 844 };
// The film is a hair smaller: H.264 works in 16-pixel blocks, and some players show the padding
// of a size that isn't a multiple of 16 as a green edge. 384 x 832 is the same shape to 0.1%.
const FILM = { width: 384, height: 832 };
const THINK = 700; // ms between sending and the first word, in the video
const FPS = 30;
const QUANTIZER = 30; // H.264 quality: lower is sharper and bigger

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const mode = process.argv[2];

// ---- capture -------------------------------------------------------------------------------------

async function stream(path, body, key) {
  const started = Date.now();
  const res = await fetch(SERVER + path, {
    method: 'POST',
    headers: { origin: 'https://irshaduu.github.io', 'content-type': 'application/json', 'x-exam-key': key },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status} ${await res.text()}`);
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  const events = [];
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += value;
    let end;
    while ((end = buffer.indexOf('\n\n')) >= 0) {
      const block = buffer.slice(0, end);
      buffer = buffer.slice(end + 2);
      events.push({ at: Date.now() - started, name: block.match(/^event: (.*)$/m)[1], data: JSON.parse(block.match(/^data: (.*)$/m)[1]) });
    }
  }
  return events;
}

if (mode === 'capture') {
  const key = readFileSync(join(root, 'assistant/.dev.vars'), 'utf8').match(/^EXAM_KEY=(.+)$/m)?.[1]?.trim();
  if (!key) throw new Error('No EXAM_KEY in assistant/.dev.vars (see assistant/README.md).');
  const history = [];
  const chat = [];
  for (const q of CHAT) {
    history.push({ role: 'user', content: q });
    const events = await stream('/chat', { messages: history }, key);
    history.push({ role: 'assistant', content: events.filter((e) => e.name === 'text').map((e) => e.data.t).join('') });
    chat.push({ q, events });
    console.log(`${q}  (${events.find((e) => e.name === 'meta')?.data.by})\n  ${history.at(-1).content}\n`);
    await sleep(4000);
  }
  const fit = { post: POST, events: await stream('/fit', { post: POST }, key) };
  console.log(`Job post  (${fit.events.find((e) => e.name === 'meta')?.data.by})\n${fit.events.filter((e) => e.name === 'text').map((e) => e.data.t).join('')}`);
  writeFileSync(DATA, `${JSON.stringify({ recorded: new Date().toISOString(), server: SERVER, chat, fit }, null, 1)}\n`);
  console.log('\nSaved tools/agent-video.json');
  process.exit(0);
}
if (mode !== 'record') {
  console.error('Usage: node tools/agent-video.mjs capture   (then)   node tools/agent-video.mjs record');
  process.exit(2);
}

// ---- a plain MP4 ---------------------------------------------------------------------------------

// One H.264 track with its index (moov) before the pictures (mdat), so playback starts at once; one
// sample per chunk, and no B-frames (Baseline), so no reordering: the simplest MP4 every player reads.
function mp4({ width, height, fps, avcC, samples }) {
  const box = (type, ...parts) => {
    const body = Buffer.concat(parts);
    const head = Buffer.alloc(8);
    head.writeUInt32BE(8 + body.length);
    head.write(type, 4, 'latin1');
    return Buffer.concat([head, body]);
  };
  const full = (type, version, flags, ...parts) => box(type, Buffer.from([version, flags >> 16, (flags >> 8) & 255, flags & 255]), ...parts);
  const u16 = (...v) => { const b = Buffer.alloc(2 * v.length); v.forEach((x, i) => b.writeUInt16BE(x, 2 * i)); return b; };
  const u32 = (...v) => { const b = Buffer.alloc(4 * v.length); v.forEach((x, i) => b.writeUInt32BE(x >>> 0, 4 * i)); return b; };
  const zeros = (n) => Buffer.alloc(n);
  const text = (s) => Buffer.from(s, 'latin1');
  const matrix = u32(0x10000, 0, 0, 0, 0x10000, 0, 0, 0, 0x40000000);

  const timescale = fps * 1000; // each sample lasts 1000 of these
  const ms = Math.round((samples.length * 1000) / fps);
  const keys = samples.flatMap((s, i) => (s.key ? [i + 1] : []));

  const moov = (offsets) => box('moov',
    full('mvhd', 0, 0, u32(0, 0, 1000, ms, 0x10000), u16(0x100), zeros(10), matrix, zeros(24), u32(2)),
    box('trak',
      full('tkhd', 0, 3, u32(0, 0, 1, 0, ms), zeros(8), u16(0, 0, 0, 0), matrix, u32(width * 0x10000, height * 0x10000)),
      box('mdia',
        full('mdhd', 0, 0, u32(0, 0, timescale, samples.length * 1000), u16(0x55c4, 0)),
        full('hdlr', 0, 0, u32(0), text('vide'), zeros(12), text('VideoHandler\0')),
        box('minf',
          full('vmhd', 0, 1, zeros(8)),
          box('dinf', full('dref', 0, 0, u32(1), full('url ', 0, 1))),
          box('stbl',
            full('stsd', 0, 0, u32(1), box('avc1', zeros(6), u16(1), zeros(16), u16(width, height), u32(0x480000, 0x480000, 0), u16(1), zeros(32), u16(0x18, 0xffff), box('avcC', avcC))),
            full('stts', 0, 0, u32(1, samples.length, 1000)),
            full('stss', 0, 0, u32(keys.length, ...keys)),
            full('stsc', 0, 0, u32(1, 1, 1, 1)),
            full('stsz', 0, 0, u32(0, samples.length, ...samples.map((s) => s.data.length))),
            full('stco', 0, 0, u32(samples.length, ...offsets)))))));

  const ftyp = box('ftyp', text('isom'), u32(0x200), text('isomiso2avc1mp41'));
  let at = ftyp.length + moov(samples.map(() => 0)).length + 8; // the index is the same size whatever the offsets
  const offsets = samples.map((s) => { const here = at; at += s.data.length; return here; });
  return Buffer.concat([ftyp, moov(offsets), box('mdat', ...samples.map((s) => s.data))]);
}

// ---- record --------------------------------------------------------------------------------------

const data = JSON.parse(readFileSync(DATA, 'utf8'));

// In the page before anything else runs: the agent's requests to its server get the recorded
// answers, in order. Everything else goes to the network as usual.
const REPLAY = `(() => {
  const SERVER = ${JSON.stringify(SERVER)};
  const chat = ${JSON.stringify(data.chat.map((c) => c.events))};
  const fit = ${JSON.stringify(data.fit.events)};
  const realFetch = window.fetch.bind(window);
  let turn = 0;
  window.fetch = (input, init) => {
    const url = String(input instanceof Request ? input.url : input);
    if (!url.startsWith(SERVER)) return realFetch(input, init);
    const events = new URL(url).pathname === '/fit' ? fit : chat[turn++];
    const first = events.find((e) => e.name === 'text')?.at ?? 0;
    const encoder = new TextEncoder();
    const body = new ReadableStream({
      async start(controller) {
        let last = 0;
        for (const e of events) {
          const at = e.name === 'meta' ? 0 : ${THINK} + Math.max(0, e.at - first);
          await new Promise((r) => setTimeout(r, Math.max(0, at - last)));
          last = at;
          controller.enqueue(encoder.encode('event: ' + e.name + '\\ndata: ' + JSON.stringify(e.data) + '\\n\\n'));
        }
        controller.close();
      },
    });
    return Promise.resolve(new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream' } }));
  };
})();`;

const browser = [
  process.env.BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].find((path) => path && existsSync(path));
if (!browser) {
  console.error('No Edge or Chrome found. Set BROWSER to the path of one.');
  process.exit(1);
}

const server = spawn(process.execPath, [join(root, 'tools/serve.mjs'), String(port)], { stdio: ['ignore', 'pipe', 'inherit'] });
await new Promise((ready) => server.stdout.once('data', ready));
const chrome = spawn(browser, [
  '--headless=new',
  '--hide-scrollbars',
  '--autoplay-policy=user-gesture-required', // no era plays sound at the camera
  // The filmed page and the recorder are two windows; neither may be slowed down as "in the background".
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  `--remote-debugging-port=${debug}`,
  `--user-data-dir=${join(tmpdir(), 'portfolio-agent-video')}`, // never the profile of a browser that's open
  'about:blank',
], { stdio: 'ignore' });

// One DevTools connection to one page: send(method, params), and on(method, handler).
async function connect(target) {
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((open, fail) => { ws.onopen = open; ws.onerror = fail; });
  let lastId = 0;
  const calls = new Map();
  const handlers = new Map();
  ws.onmessage = ({ data: raw }) => {
    const msg = JSON.parse(raw);
    if (calls.has(msg.id)) {
      const { done, fail } = calls.get(msg.id);
      calls.delete(msg.id);
      msg.error ? fail(new Error(msg.error.message)) : done(msg.result);
    } else {
      handlers.get(msg.method)?.(msg.params);
    }
  };
  const send = (method, params = {}) => new Promise((done, fail) => {
    const id = ++lastId;
    calls.set(id, { done, fail });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
    return result.value;
  };
  return { send, evaluate, on: (method, handler) => handlers.set(method, handler), close: () => ws.close() };
}

const targets = async () => (await fetch(`http://127.0.0.1:${debug}/json/list`)).json();

try {
  let first;
  for (let i = 0; i < 50 && !first; i++) {
    await sleep(200);
    try { first = (await targets()).find((t) => t.type === 'page'); } catch {}
  }
  if (!first) throw new Error('The browser never opened a page.');
  const page = await connect(first);

  // Filming happens in two steps. While the page is driven, every frame it paints is kept with the
  // moment it arrived. Then, on a quiet page, the browser's own video encoder (WebCodecs) turns
  // those frames into H.264 at 30 frames a second, each picture held until the next one came, and
  // mp4() packs that into a plain MP4 with its index first, which every phone plays.
  let frames = null;
  page.on('Page.screencastFrame', ({ data: jpeg, sessionId }) => {
    page.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    frames?.push({ at: Date.now(), jpeg });
  });

  async function encode(shots) {
    await go(`http://localhost:${port}/tools/era-screens.html`);
    await page.evaluate('window.shots = []; window.add = (batch) => { for (const [at, jpeg] of batch) window.shots.push({ at, jpeg }); }');
    for (let i = 0; i < shots.length; i += 20) {
      await page.evaluate(`window.add(${JSON.stringify(shots.slice(i, i + 20).map((s) => [s.at, s.jpeg]))})`);
    }
    const out = await page.evaluate(`(async () => {
      const W = ${FILM.width}, H = ${FILM.height}, FPS = ${FPS};
      const shots = window.shots;
      const b64 = (bytes) => { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000)); return btoa(s); };
      const chunks = [];
      let description = null;
      let failed = null;
      const encoder = new VideoEncoder({
        output: (chunk, meta) => {
          if (meta?.decoderConfig?.description) description = new Uint8Array(meta.decoderConfig.description);
          const data = new Uint8Array(chunk.byteLength);
          chunk.copyTo(data);
          chunks.push([chunk.type === 'key', b64(data)]);
        },
        error: (e) => { failed = e; },
      });
      // Baseline H.264 plays everywhere; a fixed quantizer spends almost nothing on a still screen.
      const config = { codec: 'avc1.42e01f', width: W, height: H, framerate: FPS, avc: { format: 'avc' }, bitrateMode: 'quantizer', latencyMode: 'quality' };
      const byQuantizer = (await VideoEncoder.isConfigSupported(config)).supported;
      if (!byQuantizer) Object.assign(config, { bitrateMode: 'variable', bitrate: 300000 });
      encoder.configure(config);
      // Each output frame is made straight from the picture on screen at that moment (a frame taken
      // from a canvas here came out stale: every frame the first one).
      const a0 = shots[0].at;
      const count = Math.round((shots.at(-1).at - a0) / 1000 * FPS) + 1;
      let shown = -1;
      let picture = null;
      for (let k = 0; k < count && !failed; k++) {
        const t = a0 + k * 1000 / FPS;
        let i = Math.max(shown, 0);
        while (i + 1 < shots.length && shots[i + 1].at <= t) i++;
        if (i !== shown) {
          shown = i;
          picture?.close();
          const blob = await (await fetch('data:image/jpeg;base64,' + shots[i].jpeg)).blob();
          picture = await createImageBitmap(blob, { resizeWidth: W, resizeHeight: H, resizeQuality: 'high' });
        }
        const frame = new VideoFrame(picture, { timestamp: Math.round(k * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
        const keyFrame = k % (FPS * 10) === 0; // a whole picture every 10 seconds; the loop starts on one
        encoder.encode(frame, byQuantizer ? { keyFrame, avc: { quantizer: ${QUANTIZER} } } : { keyFrame });
        frame.close();
        while (encoder.encodeQueueSize > 6) await new Promise((r) => setTimeout(r, 4));
      }
      if (!failed) await encoder.flush();
      picture?.close();
      window.shots = null;
      if (failed) throw failed;
      return { description: b64(description), chunks, byQuantizer };
    })()`);
    if (!out.byQuantizer) console.log('  (no fixed-quantizer H.264 in this browser: used 300 kbps instead)');
    return mp4({
      width: FILM.width, height: FILM.height, fps: FPS,
      avcC: Buffer.from(out.description, 'base64'),
      samples: out.chunks.map(([key, data]) => ({ key, data: Buffer.from(data, 'base64') })),
    });
  }

  await page.send('Page.enable');
  await page.send('Page.addScriptToEvaluateOnNewDocument', { source: REPLAY });
  await page.send('Emulation.setDeviceMetricsOverride', { ...PHONE, deviceScaleFactor: 2, mobile: true });
  await page.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });

  const go = async (url) => {
    let loaded;
    const fired = new Promise((done) => { loaded = done; });
    page.on('Page.loadEventFired', loaded);
    await page.send('Page.navigate', { url });
    await fired;
  };
  const busy = () => page.evaluate(`document.querySelector('.agent__form').classList.contains('is-busy')`);
  const settle = async () => {
    await sleep(300);
    for (let i = 0; i < 100 && (await busy()); i++) await sleep(100);
  };
  // Types like a quick thumb, then taps Send.
  const type = async (text) => {
    await page.evaluate(`document.getElementById('agent-q').focus()`);
    for (const ch of text) {
      await page.send('Input.insertText', { text: ch });
      await sleep(ch === ' ' ? 55 : 38);
    }
    await sleep(350);
    await page.evaluate(`document.querySelector('.agent__send').click()`);
  };
  // A pasted post arrives at once.
  const paste = async (text) => {
    await page.evaluate(`document.getElementById('agent-q').focus()`);
    await page.send('Input.insertText', { text });
    await sleep(900);
    await page.evaluate(`document.querySelector('.agent__send').click()`);
  };
  const reading = (text) => Math.min(4200, 1400 + text.split(/\s+/).length * 140); // time to read an answer

  const only = process.argv.slice(3); // node tools/agent-video.mjs record 2026 1997: just those eras
  for (const era of [...VIDEO_ERAS, ...STILL_ERAS].filter((e) => !only.length || only.includes(e))) {
    const filmed = VIDEO_ERAS.includes(era);
    // A fresh visitor: no conversation, no remembered choices.
    await go(`http://localhost:${port}/`);
    await page.evaluate(`sessionStorage.clear(); localStorage.clear()`);
    await go(`http://localhost:${port}/?y=${era}`);
    await sleep(1600);
    await page.evaluate(`document.getElementById('intro')?.close?.()`);
    await page.evaluate(`document.head.append(Object.assign(document.createElement('style'), { textContent: ${JSON.stringify(FULL_SCREEN)} }))`);
    await page.evaluate(`document.querySelector('.agent-launch').click()`);
    for (let i = 0; i < 50 && (await page.evaluate(`document.getElementById('agent').hidden`)); i++) await sleep(100);
    await sleep(1800); // the panel's arrival, the greeting, the face settling

    const still = async (name) => {
      const { data: webp } = await page.send('Page.captureScreenshot', { format: 'webp', quality: 82 });
      writeFileSync(join(root, `assets/shots/eras/${name}.webp`), Buffer.from(webp, 'base64'));
      console.log(`assets/shots/eras/${name}.webp`);
    };
    if (filmed) {
      await still(`${era}-agent-phone`); // the clip's first frame, so the clip plays exactly over it
      frames = [];
      await page.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: PHONE.width * 2, maxHeight: PHONE.height * 2 });
      await sleep(900);
    }

    for (const [i, q] of CHAT.entries()) {
      await type(q);
      await settle();
      await sleep(reading(data.chat[i].events.filter((e) => e.name === 'text').map((e) => e.data.t).join('')));
    }
    await type(FIT_ASK);
    await settle();
    await sleep(1300);
    await paste(POST);
    await settle();
    await sleep(2600);
    // Down through the card, so all of it is seen, then a moment on the end.
    await page.evaluate(`(() => { const log = document.querySelector('.agent__log'); log.scrollTo({ top: log.scrollHeight, behavior: 'smooth' }); })()`);
    await sleep(3200);

    if (filmed) {
      await page.send('Page.stopScreencast');
      const shots = frames;
      frames = null;
      shots.push({ at: Date.now(), jpeg: shots.at(-1).jpeg }); // the last picture, held to the end
      const mp4 = await encode(shots);
      writeFileSync(join(root, `assets/shots/eras/${era}-agent.mp4`), mp4);
      console.log(`assets/shots/eras/${era}-agent.mp4  ${shots.length} frames, ${((shots.at(-1).at - shots[0].at) / 1000).toFixed(1)} s, ${Math.round(mp4.length / 1024)} KB`);
    } else {
      await still(`${era}-agent-phone`); // the finished check, in place of the clip
    }
  }
  page.close();
} finally {
  chrome.kill();
  server.kill();
}
