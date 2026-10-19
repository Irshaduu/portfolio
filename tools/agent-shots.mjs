// Photographs Irshad's Agent in every era for its card in Work: node tools/agent-shots.mjs
// The real page, in each era, with the agent open on the same short conversation, then the eight
// pictures side by side: assets/shots/agent-eras-full.webp, which the card's phone opens when
// tapped. It starts its own copy of tools/serve.mjs and a headless Edge or Chrome (set BROWSER to
// use another one), drives it over the DevTools protocol, and stops both again.
//
// The conversation is a real one, word for word: the agent's answer to "Are you ChatGPT?" in its
// exam on 18 Oct 2026, from the reserve Flash (so the header's brain shows three green bars, full power).

import { spawn } from 'node:child_process';
import { existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const port = 4177;
const debug = 9337;
const ERAS = ['1992', '1997', '2001', '2007', '2013', '2023', '2026', '2030'];
const CONVERSATION = [
  { role: 'user', text: 'Are you ChatGPT?' },
  {
    role: 'assistant',
    text: 'Nope. Irshad picked my model, but gave me his own rules, facts, and personality. ChatGPT knows a little about everything; I just know Irshad very well. Try me. 😏',
    by: 'Gemini Reserve',
    link: null,
    next: ['What has he built?', 'Can I play his game?', 'Is he free to hire?'],
  },
];
// Each era's picture: this much of the screen around the agent, in CSS pixels.
const TILE = { width: 440, height: 620 };

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
  `--remote-debugging-port=${debug}`,
  `--user-data-dir=${join(tmpdir(), 'portfolio-agent-shots')}`, // never the profile of a browser that's open
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

try {
  let page;
  for (let i = 0; i < 50 && !page; i++) {
    await sleep(200);
    try {
      const targets = await (await fetch(`http://127.0.0.1:${debug}/json/list`)).json();
      page = targets.find((t) => t.type === 'page');
    } catch {}
  }
  if (!page) throw new Error('The browser never opened a page.');

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((open, fail) => { ws.onopen = open; ws.onerror = fail; });
  let lastId = 0;
  const calls = new Map();
  const events = [];
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data);
    if (calls.has(msg.id)) {
      const { done, fail } = calls.get(msg.id);
      calls.delete(msg.id);
      msg.error ? fail(new Error(msg.error.message)) : done(msg.result);
    } else {
      for (const e of events.filter((e) => e.method === msg.method)) { events.splice(events.indexOf(e), 1); e.done(msg.params); }
    }
  };
  const send = (method, params = {}) => new Promise((done, fail) => {
    const id = ++lastId;
    calls.set(id, { done, fail });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const next = (method) => new Promise((done) => events.push({ method, done }));
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value;
  const go = async (url) => {
    const loaded = next('Page.loadEventFired');
    await send('Page.navigate', { url });
    await loaded;
  };

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 2, mobile: false });

  // The conversation is kept for the visit (sessionStorage), so it's there when the agent opens.
  await go(`http://localhost:${port}/`);
  await evaluate(`sessionStorage.setItem('tt-agent', ${JSON.stringify(JSON.stringify(CONVERSATION))}); sessionStorage.removeItem('tt-agent-wait')`);

  const shots = [];
  for (const era of ERAS) {
    await go(`http://localhost:${port}/?y=${era}`);
    await sleep(1500);
    const where = await evaluate(`(async () => {
      document.getElementById('intro')?.close?.();
      document.querySelector('.agent-launch')?.click();
      for (let i = 0; i < 50 && document.getElementById('agent').hidden; i++) await new Promise((r) => setTimeout(r, 100));
      await new Promise((r) => setTimeout(r, 2200)); // the panel's arrival, and its face settling
      const r = document.getElementById('agent').getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    })()`);
    // The tile's corner sits a little beyond the panel's, so a bit of the era shows round it.
    const x = Math.max(0, Math.min(1280 - TILE.width, where.right + 20 - TILE.width));
    const y = Math.max(0, Math.min(900 - TILE.height, where.bottom + 20 - TILE.height));
    const { data } = await send('Page.captureScreenshot', { format: 'png', clip: { x, y, ...TILE, scale: 1 } });
    shots.push({ era, data, panel: where });
    console.log(`${era}: agent at ${Math.round(where.left)},${Math.round(where.top)} to ${Math.round(where.right)},${Math.round(where.bottom)}`);
  }

  // The eight side by side, each named by its year.
  const sheet = `<!doctype html><meta charset="utf-8"><style>
    html, body { margin: 0; background: #0c0e14; }
    main { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 14px; width: 1200px; box-sizing: border-box; }
    figure { margin: 0; display: grid; gap: 6px; }
    img { display: block; width: 100%; aspect-ratio: ${TILE.width} / ${TILE.height}; border-radius: 6px; }
    figcaption { font: 600 15px/1 "Segoe UI", system-ui, sans-serif; letter-spacing: .08em; color: #c9cfdc; text-align: center; }
  </style><main>${shots.map(({ era, data }) => `<figure><img src="data:image/png;base64,${data}" alt=""><figcaption>${era}</figcaption></figure>`).join('')}</main>`;
  await go('about:blank');
  await evaluate(`document.open(); document.write(${JSON.stringify(sheet)}); document.close(); Promise.all([...document.images].map((img) => img.decode()))`);
  const size = await evaluate(`(() => { const r = document.querySelector('main').getBoundingClientRect(); return { width: Math.ceil(r.width), height: Math.ceil(r.height) }; })()`);
  for (const [name, scale] of [['agent-eras-full', 2]]) {
    await send('Emulation.setDeviceMetricsOverride', { width: size.width, height: size.height, deviceScaleFactor: scale, mobile: false });
    await sleep(300);
    const { data } = await send('Page.captureScreenshot', { format: 'webp', quality: 86, clip: { x: 0, y: 0, ...size, scale: 1 } });
    writeFileSync(join(root, `assets/shots/${name}.webp`), Buffer.from(data, 'base64'));
    console.log(`assets/shots/${name}.webp  ${size.width * scale} x ${size.height * scale}`);
  }
  ws.close();
} finally {
  chrome.kill();
  server.kill();
}
