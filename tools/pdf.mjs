// Prints the document pages to their PDFs: node tools/pdf.mjs
// Each page is the only source of its PDF, so the two can never drift apart. It starts its own
// copy of tools/serve.mjs, prints with headless Edge or Chrome (set BROWSER to use another
// one), and stops the server again.

import { execFile, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const port = 4179;

const DOCS = [
  { page: 'resume/', pdf: 'assets/Mohammed_Irshad_C_Resume.pdf' },
  { page: 'work/workshopos/', pdf: 'assets/docs/WorkshopOS_Technical_Overview.pdf' },
  { page: 'work/catering/', pdf: 'assets/docs/Catering_Staff_System_Overview.pdf' },
];

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

const print = (url, out) =>
  new Promise((done, fail) => {
    execFile(browser, [
      '--headless=new',
      '--no-pdf-header-footer',
      '--print-to-pdf-no-header',
      '--virtual-time-budget=10000',
      `--user-data-dir=${join(tmpdir(), 'portfolio-pdf')}`, // never the profile of a browser that's open
      `--print-to-pdf=${out}`,
      url,
    ], (error) => (error ? fail(error) : done()));
  });

try {
  for (const { page, pdf } of DOCS) {
    await print(`http://localhost:${port}/${page}`, join(root, pdf));
    console.log(`${pdf}  <-  ${page}`);
  }
} finally {
  server.kill();
}
