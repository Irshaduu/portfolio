// Makes the exam's key, so you don't have to invent one: npm run exam-key
//
// The key is a long random password the exam (exam.mjs) shows the server, so the server lets it ask
// many questions in a row. It has to be in two places: on the server, as the EXAM_KEY secret, and on
// this computer, in .dev.vars, where the exam reads it. This puts it in both. Run it again any time
// to change it. Nobody sees the key: it goes straight from here to Cloudflare and into .dev.vars.

import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const here = import.meta.dirname;
const vars = join(here, '.dev.vars');
const key = randomBytes(24).toString('base64url');

console.log('Saving a new exam key on the server...');
const put = spawnSync('npx wrangler secret put EXAM_KEY', { cwd: here, shell: true, input: key, stdio: ['pipe', 'inherit', 'inherit'] });
if (put.status !== 0) {
  console.error('\nThe server did not take the key, so nothing was changed here. Check the message above.');
  process.exit(1);
}

if (!existsSync(vars)) copyFileSync(join(here, '.dev.vars.example'), vars);
const text = readFileSync(vars, 'utf8');
writeFileSync(vars, /^EXAM_KEY=.*$/m.test(text) ? text.replace(/^EXAM_KEY=.*$/m, `EXAM_KEY=${key}`) : `EXAM_KEY=${key}\n${text}`);
console.log('Saved in .dev.vars too. The exam is ready: npm run exam -- <the server address>');
