// Photographs the era screens: node tools/screens.mjs
// Every [data-shot] element on tools/era-screens.html becomes assets/shots/eras/<name>.webp at 2x.
// It starts its own copy of tools/serve.mjs and a headless Edge or Chrome (set BROWSER to use
// another one), drives it over the DevTools protocol, and stops both again.

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const port = 4178;
const debug = 9338;
const outDir = join(root, 'assets/shots/eras');

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
  `--remote-debugging-port=${debug}`,
  `--user-data-dir=${join(tmpdir(), 'portfolio-screens')}`, // never the profile of a browser that's open
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

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1248, height: 1200, deviceScaleFactor: 2, mobile: false });
  const loaded = next('Page.loadEventFired');
  await send('Page.navigate', { url: `http://localhost:${port}/tools/era-screens.html` });
  await loaded;

  const { result } = await send('Runtime.evaluate', {
    expression: `window.ready.then(() => [...document.querySelectorAll('[data-shot]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { name: el.dataset.shot, x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height };
    }))`,
    awaitPromise: true,
    returnByValue: true,
  });

  mkdirSync(outDir, { recursive: true });
  for (const { name, ...clip } of result.value) {
    const { data } = await send('Page.captureScreenshot', { format: 'webp', quality: 88, clip: { ...clip, scale: 1 }, captureBeyondViewport: true });
    const file = join(outDir, `${name}.webp`);
    writeFileSync(file, Buffer.from(data, 'base64'));
    console.log(`assets/shots/eras/${name}.webp  ${clip.width * 2} x ${clip.height * 2}`);
  }
  ws.close();
} finally {
  chrome.kill();
  server.kill();
}
