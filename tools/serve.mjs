// A zero-dependency static server for local work: node tools/serve.mjs [port]
// ES modules don't load from file://, so the page needs to be served over http.
//
// It answers this computer only. The folder also holds private notes (CONTENT.md, PLAN.md) and the
// assistant's exam key (assistant/.dev.vars), and Windows can let other devices on the same Wi-Fi
// reach the port. Hidden files and folders (.git, .dev.vars, .wrangler) are never served at all.

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const port = Number(process.argv[2] || process.env.PORT || 4173);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
};

const LOCAL = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);

createServer(async (req, res) => {
  if (!LOCAL.has(req.socket.remoteAddress)) {
    res.writeHead(403).end();
    return;
  }
  let path;
  try {
    path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  let file = normalize(join(root, path));
  if (file !== root && !file.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  if (path.split('/').some((part) => part.startsWith('.'))) {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
  }
}).listen(port, () => console.log(`Portfolio on http://localhost:${port}`));
