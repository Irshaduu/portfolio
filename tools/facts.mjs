// Checks that the pages still agree on the facts they share: node tools/facts.mjs
// The portfolio, the resume and the write-ups each state the same numbers in their own words. Every
// fact below is found by its wording on each page; if two pages give different values, or a page no
// longer words a fact the way it's looked for, this says where and exits with an error. Run it after
// changing any number, before printing the PDFs.

import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const PAGES = {
  portfolio: 'index.html',
  resume: 'resume/index.html',
  workshopos: 'work/workshopos/index.html',
  catering: 'work/catering/index.html',
};
const html = Object.fromEntries(Object.entries(PAGES).map(([page, file]) => [page, readFileSync(join(root, file), 'utf8')]));

// A value as a plain number: "3,185" -> 3185, "six" -> 6.
const WORDS = { two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
const number = (value) => WORDS[value.toLowerCase()] ?? Number(value.replace(/,/g, ''));

// Each fact: where to find it on each page, and how to compare (default: the same number).
const FACTS = [
  { fact: 'WorkshopOS Django tests', find: {
    portfolio: [/Django tests<\/dt><dd>([\d,]+)/],
    resume: [/lines, ([\d,]+) automated tests/, /([\d,]+) automated Django tests/],
    workshopos: [/automated Django tests[^<]*<\/dt><dd>([\d,]+)/, /([\d,]+) Django tests<\/strong>/, /passed all ([\d,]+) tests/],
  } },
  { fact: 'WorkshopOS JavaScript tests', find: {
    resume: [/and (\d+) JavaScript tests/],
    workshopos: [/plus (\d+) in JavaScript/, /(\d+) JavaScript tests/],
  } },
  { fact: 'WorkshopOS models', find: {
    portfolio: [/<dt>Models<\/dt><dd>(\d+)/],
    resume: [/(\d+)-model/, /(\d+) models/],
    workshopos: [/<dt>data models<\/dt><dd>(\d+)/],
  } },
  { fact: 'WorkshopOS routes', find: {
    portfolio: [/<dt>Routes<\/dt><dd>(\d+)/],
    resume: [/(\d+) routes/],
    workshopos: [/<dt>URL routes<\/dt><dd>(\d+)/],
  } },
  { fact: 'WorkshopOS screens', find: {
    portfolio: [/<dt>Screens<\/dt><dd>(\d+)/, /fact__n">(\d+)<\/span> <span class="fact__l">screens/],
    resume: [/(\d+) screens/],
    workshopos: [/<dt>screens<\/dt><dd>(\d+)/],
  } },
  { fact: 'WorkshopOS commits', find: {
    portfolio: [/<dt>Commits<\/dt><dd>(\d+)/],
    resume: [/in (\d+) commits/],
    workshopos: [/<dt>commits[^<]*<\/dt><dd>(\d+)/],
  } },
  { fact: 'WorkshopOS lines of test per line of code', find: {
    portfolio: [/Test to code<\/dt><dd>([\d.]+)/],
    resume: [/([\d.]+) lines of test/],
    workshopos: [/([\d.]+) lines of test/],
  } },
  { fact: 'WorkshopOS rule modules', find: {
    portfolio: [/(\d+) rule modules/],
    resume: [/(\d+) view-free rule modules/],
    workshopos: [/<dt>rule modules<\/dt><dd>(\d+)/],
  } },
  { fact: 'WorkshopOS all-or-nothing transaction blocks', find: {
    portfolio: [/one of (\d+) all-or-nothing/],
    resume: [/(\d+) all-or-nothing transaction blocks/],
    workshopos: [/all-or-nothing transaction blocks<\/dt><dd>(\d+)/],
  } },
  { fact: 'WorkshopOS lines of code (in thousands)', same: (v) => Math.floor(v / 1000), find: {
    resume: [/\(([\d,]+) lines, /],
    workshopos: [/<dt>lines of code[^<]*<\/dt><dd>([\d,]+)/],
  } },
  { fact: 'Word Hunt tests', find: {
    portfolio: [/id="word-hunt"[\s\S]*?<dt>Tests<\/dt><dd>(\d+)/],
    resume: [/Word Hunt:[\s\S]*?(\d+) tests\./],
  } },
  { fact: 'PhysioCoach tests', find: {
    portfolio: [/id="physiocoach"[\s\S]*?<dt>Tests<\/dt><dd>(\d+)/],
    resume: [/PhysioCoach:[\s\S]*?(\d+) tests\./],
  } },
  { fact: 'PhysioCoach voice clips', find: {
    portfolio: [/<dt>Voice clips<\/dt><dd>(\d+)/, /then (\d+) pre-generated/],
    resume: [/then (\d+) pre-generated/],
  } },
  { fact: 'Catering roles', find: {
    portfolio: [/<dt>Roles<\/dt><dd>(\d+)/, /(\d+)-role/],
    resume: [/(\d+)-role/],
    catering: [/<dt>roles[^<]*<\/dt><dd>(\d+)/, /A (\d+)-role/],
  } },
  { fact: 'Catering modules', find: {
    portfolio: [/<dt>Modules<\/dt><dd>(\d+)/, /(\d+) modules, ranked/],
    resume: [/(\d+) modules<\/strong>/],
    catering: [/<dt>modules[^<]*<\/dt><dd>(\d+)/, /into (\d+) modules/],
  } },
  { fact: 'Catering Django apps', find: {
    portfolio: [/<dt>Django apps<\/dt><dd>(\d+)/, /across (\w+) Django apps/],
    resume: [/across (\w+) Django apps/],
    catering: [/<dt>Django apps[^<]*<\/dt><dd>(\d+)/, /(\w+) Django apps:<\/strong>/],
  } },
  { fact: 'Catering registration day (people)', same: (v) => v, raw: true, find: {
    portfolio: [/([\d,]+ to [\d,]+) sign-ups/],
    catering: [/([\d,]+ to [\d,]+) people register/],
  } },
  { fact: 'Full-stack course grade', find: {
    portfolio: [/Grade A\+ \((\d+)%\)/],
    resume: [/Grade A\+ \((\d+)%\)/],
  } },
];

const problems = [];
const found = {};

for (const { fact, find, same = (v) => v, raw = false } of FACTS) {
  const values = [];
  for (const [page, patterns] of Object.entries(find)) {
    for (const pattern of patterns) {
      const match = html[page].match(pattern);
      if (!match) {
        problems.push(`${fact}: not found on ${PAGES[page]} (looked for ${pattern})`);
        continue;
      }
      values.push({ page, value: raw ? match[1] : number(match[1]), as: match[1] });
    }
  }
  const distinct = new Set(values.map(({ value }) => same(value)));
  if (distinct.size > 1) {
    problems.push(`${fact} differs: ${values.map(({ page, as }) => `${PAGES[page]} says ${as}`).join(', ')}`);
  }
  found[fact] = values[0]?.value;
}

// "3,400+ automated tests" must still be true of the projects' own counts.
const total = ['WorkshopOS Django tests', 'WorkshopOS JavaScript tests', 'Word Hunt tests', 'PhysioCoach tests'].reduce((sum, fact) => sum + (found[fact] ?? 0), 0);
for (const page of ['portfolio', 'resume']) {
  const claim = html[page].match(/([\d,]+)\+(?:<\/span> <span class="fact__l">| )automated tests/);
  if (!claim) problems.push(`Total tests: no "N+ automated tests" on ${PAGES[page]}`);
  else if (number(claim[1]) > total) problems.push(`Total tests: ${PAGES[page]} claims ${claim[1]}+, but the projects add up to ${total.toLocaleString('en-US')}`);
}

// One phone number: the resume's tap-to-call link (the number it dials and the one it shows) is the
// one every WhatsApp link uses.
const phone = html.resume.match(/href="tel:\+(\d+)">\+([\d ]+)</);
const whatsapps = [html.portfolio, readFileSync(join(root, 'js/eras/2026.js'), 'utf8')].flatMap((text) => [...text.matchAll(/wa\.me\/(\d+)/g)].map((m) => m[1]));
if (!phone) problems.push(`Phone: no tap-to-call link on ${PAGES.resume}`);
else if (!whatsapps.length) problems.push('Phone: no WhatsApp link found');
else if (phone[2].replace(/ /g, '') !== phone[1] || whatsapps.some((number) => number !== phone[1])) {
  problems.push(`Phone differs: the resume dials +${phone[1]} and shows +${phone[2]}; WhatsApp links use ${[...new Set(whatsapps)].join(', ')}`);
}

// No page may link to Google Drive again.
for (const [page, text] of Object.entries(html)) {
  if (/drive\.google\.com|docs\.google\.com/.test(text)) problems.push(`${PAGES[page]} links to Google Drive`);
}

if (problems.length) {
  console.error(`${problems.length} problem${problems.length > 1 ? 's' : ''}:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  process.exit(1);
}
console.log(`All ${FACTS.length} shared facts agree across ${Object.keys(PAGES).length} pages; the tests add up to ${total.toLocaleString('en-US')}; one phone number; no Google Drive links.`);
