// Stamps every stylesheet and script with a fingerprint of its contents: node tools/stamp.mjs
//
// GitHub Pages lets browsers keep each file for 10 minutes. Without stamps, a visitor right after
// a deploy can get the new page with an old stylesheet or script and see it half-styled or broken.
// With them, a changed file has a new URL and is fetched fresh, and an unchanged one stays cached.
//
// - Every <link href> and <script src> to css/ or js/ in the pages gets ?v=<fingerprint>.
// - index.html gets an import map with the same for every module, so the scripts that load other
//   scripts (main.js, the eras) fetch them fresh too.
//
// Run it after changing any CSS or JS and before committing. `--check` changes nothing and exits 1
// if a stamp is out of date.

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const check = process.argv.includes('--check');
const PAGES = ['index.html', 'resume/index.html', 'work/workshopos/index.html', 'work/catering/index.html'];

const walk = (dir) => readdirSync(join(root, dir), { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(posix.join(dir, e.name)) : [posix.join(dir, e.name)]);
const files = [...walk('css'), ...walk('js')].filter((f) => /\.(css|js)$/.test(f));
const stamp = Object.fromEntries(files.map((f) =>
  [f, createHash('sha256').update(readFileSync(join(root, f))).digest('hex').slice(0, 10)]));

let stale = 0;
for (const page of PAGES) {
  const path = join(root, page);
  const before = readFileSync(path, 'utf8');
  const base = dirname(page);

  // Links and script tags: (../)css/x.css or (../)js/x.js, with or without an old stamp.
  let after = before.replace(/(href|src)="((?:\.\.\/)*(?:css|js)\/[^"?#]+\.(?:css|js))(?:\?v=[0-9a-f]+)?"/g, (all, attr, url) => {
    const file = posix.normalize(posix.join(base === '.' ? '' : base, url));
    if (!stamp[file]) throw new Error(`${page}: ${url} is not a file`);
    return `${attr}="${url}?v=${stamp[file]}"`;
  });

  // The import map: one entry per module, in index.html only, just before its first module script.
  if (page === 'index.html') {
    const entries = files.filter((f) => f.startsWith('js/'))
      .map((f) => `      "./${f}": "./${f}?v=${stamp[f]}"`).join(',\n');
    const map = `<script type="importmap">\n    {\n    "imports": {\n${entries}\n    }\n    }\n  </script>`;
    if (/<script type="importmap">[\s\S]*?<\/script>/.test(after)) {
      after = after.replace(/<script type="importmap">[\s\S]*?<\/script>/, map);
    } else {
      after = after.replace(/(\n\s*)<script type="module"/, `$1${map}$1<script type="module"`);
    }
  }

  if (after !== before) {
    stale++;
    if (check) console.log(`out of date: ${page}`);
    else writeFileSync(path, after);
  }
}

if (check && stale) {
  console.log('Run: node tools/stamp.mjs');
  process.exit(1);
}
console.log(check ? 'Stamps are up to date.' : stale ? `Stamped ${stale} page(s), ${files.length} files.` : 'Stamps were already up to date.');
