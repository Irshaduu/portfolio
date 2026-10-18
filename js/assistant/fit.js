// The job-fit check on the page's side: telling a job post from a question, reading the AI's answer
// to one, and a word check that stands in when the AI is resting.
//
// The AI answers a job post in fixed lines (assistant/worker/prompt.js):
//   SUMMARY: how he fits, in a sentence or two
//   MATCH: what the job asks | the proof | #section
//   GAP: something the job asks that the site doesn't show
//   ASK: a question for Irshad
// and js/agent.js shows them as a card, line by line as they arrive.

// The parts of the page a match may point to (the same as SECTIONS in assistant/worker/prompt.js).
export const SECTIONS = ['#top', '#work', '#workshopos', '#word-hunt', '#physiocoach', '#catering', '#stack', '#story', '#contact'];

export const MAX_POST = 6000; // characters in one job post (the same in assistant/worker/index.js)

// What to offer after a check.
export const FIT_NEXT = ['Can I see his resume?', 'Is he free to hire?', 'Check another job'];

// Words a job post uses and a question rarely does.
const MARKERS = ['requirement', 'responsibilit', 'qualification', 'experience', 'years', 'skills', 'must have',
  'nice to have', 'job description', 'looking for', 'we are hiring', 'you will', 'candidate', 'proficien',
  'knowledge of', 'familiar with', 'salary', 'apply', 'benefits', 'full-time', 'full time'];

// Is this message a job post? Yes when the visitor was asked to paste one (`waiting`) and sent more
// than a few words, when it's too long to be a question, or when it reads like one.
export function isJobPost(text, { waiting = false } = {}) {
  const t = text.trim();
  if (waiting) return t.length >= 30;
  if (t.length > 600) return true;
  const lower = t.toLowerCase();
  return t.length >= 200 && MARKERS.filter((m) => lower.includes(m)).length >= 2;
}

// What a line says, without the formatting an AI likes to add, the "(#section)" it points with, and
// the long dashes it joins sentences with (a comma reads easier).
const clean = (s) => s.replace(/\*\*|__|`/g, '').replace(/\(?#[a-z-]+\)?/g, '').replace(/\s*—\s*/g, ', ')
  .replace(/\s{2,}/g, ' ').replace(/^[\s|:,–-]+|[\s|]+$/g, '').trim();

const PERSONAL = /\b(?:ctc|salary|salaries|pay|compensation|notice|visa|relocat\w*)\b/i;

// The AI's lines as { summary, matches: [{ need, proof, link }], gaps, ask }. While the answer is
// still arriving (`done: false`), the last line may be half-written, so it waits. An answer that
// ignored the format is kept whole, as the summary.
export function parseFit(text, { done = true } = {}) {
  const lines = text.split('\n');
  if (!done) lines.pop();
  const fit = { summary: '', matches: [], gaps: [], ask: '' };
  let found = false;
  for (const line of lines) {
    const m = line.replace(/\*\*|__/g, '').match(/^[\s>*•-]*(SUMMARY|MATCH|GAP|ASK)\s*:\s*(.*)$/i);
    if (!m) continue;
    found = true;
    const [, kind, rest] = m;
    switch (kind.toUpperCase()) {
      case 'SUMMARY':
        fit.summary = [fit.summary, clean(rest)].filter(Boolean).join(' ');
        break;
      case 'MATCH': {
        const [need, proof = ''] = rest.split('|');
        const link = rest.match(/#[a-z-]+/g)?.find((id) => SECTIONS.includes(id)) ?? null;
        if (clean(need) && fit.matches.length < 5) fit.matches.push({ need: clean(need), proof: clean(proof), link });
        break;
      }
      case 'GAP':
        // Pay, notice and moving are Irshad's to answer, not something the site lacks: the AI is
        // told to ask about them instead, and when it lists them anyway, they're left out here.
        if (clean(rest) && !PERSONAL.test(rest) && fit.gaps.length < 4) fit.gaps.push(clean(rest));
        break;
      case 'ASK':
        fit.ask = clean(rest);
        break;
    }
  }
  if (!found && done) fit.summary = clean(text.replace(/\s*\n\s*/g, ' '));
  return fit;
}

// The check as plain sentences: for the conversation's history (so the AI can talk about it after)
// and for screen readers.
export function fitText({ summary, matches, gaps, ask }) {
  return [
    summary,
    matches.length && `Matches: ${matches.map((m) => (m.proof ? `${m.need} (${m.proof})` : m.need)).join('; ')}.`,
    gaps.length && `Not shown on this site: ${gaps.join('; ')}.`,
    ask && `Worth asking him: ${ask}`,
  ].filter(Boolean).join('\n');
}

// ---- the word check -------------------------------------------------------------------------

// When the AI is resting, the page looks for the words themselves. What the site shows, the words a
// job post uses for it, the proof, and where the page shows it. Only what assistant/worker/facts.js
// says.
const SHOWN = [
  ['Python', /\bpython\b/, 'His main language, in every project', '#stack'],
  ['Django', /\bdjango\b/, 'Built a full business system for a car workshop in Django', '#workshopos'],
  ['PostgreSQL', /\bpostgres(?:ql)?\b/, 'The database behind WorkshopOS', '#workshopos'],
  ['SQL', /\bsql\b/, 'In his stack, with query tuning and indexes', '#stack'],
  ['REST APIs', /\brest(?:ful)?\s*apis?\b|\brestful\b|\bapis?\b/, 'REST and JSON are in his stack', '#stack'],
  ['Real-time and WebSockets', /\bwebsockets?\b|\breal[- ]?time\b|\bdjango channels\b/, 'Word Hunt runs live games on Django Channels', '#word-hunt'],
  ['JavaScript', /\bjavascript\b|\bes6\b/, 'Plain JavaScript in the browser, in all his apps', '#stack'],
  ['HTML and CSS', /\bhtml5?\b|\bcss3?\b/, 'In his stack; this whole site is plain HTML and CSS', '#stack'],
  ['Testing', /\btest(?:s|ing)?\b|\btdd\b/, 'WorkshopOS has more test code than app code', '#workshopos'],
  ['Git', /\bgit(?:hub)?\b/, 'Git and GitHub; his own apps are public on GitHub', '#stack'],
  ['PWA', /\bpwa\b|progressive web app|service workers?/, 'PhysioCoach works offline as a PWA', '#physiocoach'],
  ['Deploying apps', /\bdeploy(?:ing|ment|ments)?\b/, 'Two apps of his are live, built and shipped alone', '#work'],
  ['Business software', /\berp\b|\binventory\b|\bbilling\b|\bpayroll\b|\baccounting\b/, 'WorkshopOS runs stock, payroll, estimates and supplier ledgers', '#workshopos'],
];

// Common asks the site doesn't show, named only when the post names them.
const NOT_SHOWN = [
  ['React', /\breact(?:\.?js)?\b/], ['Angular', /\bangular\b/], ['Vue', /\bvue(?:\.?js)?\b/],
  ['Node.js', /\bnode(?:\.?js)?\b/], ['TypeScript', /\btypescript\b/], ['Java', /\bjava\b/],
  ['Spring', /\bspring (?:boot|framework|mvc)\b/], ['PHP', /\bphp\b/], ['Laravel', /\blaravel\b/], ['.NET', /\.net\b|\bc#/],
  ['Go', /\bgolang\b/], ['Ruby', /\bruby\b/], ['FastAPI', /\bfastapi\b/], ['Flask', /\bflask\b/],
  ['Docker', /\bdocker\b/], ['Kubernetes', /\bkubernetes\b|\bk8s\b/], ['Celery', /\bcelery\b/],
  ['Redis', /\bredis\b/], ['MongoDB', /\bmongo(?:db)?\b/], ['MySQL', /\bmysql\b/], ['GraphQL', /\bgraphql\b/],
  ['Kafka', /\bkafka\b/], ['Terraform', /\bterraform\b/], ['Azure', /\bazure\b/], ['Google Cloud', /\bgcp\b|\bgoogle cloud\b/],
  ['Machine learning', /\bmachine learning\b|\bdeep learning\b/], ['Flutter', /\bflutter\b/], ['React Native', /\breact native\b/],
];

export function wordCheck(post) {
  const text = post.toLowerCase();
  const matches = SHOWN.filter(([, words]) => words.test(text)).slice(0, 5).map(([need, , proof, link]) => ({ need, proof, link }));
  const gaps = NOT_SHOWN.filter(([, words]) => words.test(text)).slice(0, 4).map(([need]) => need);
  const summary = matches.length || gaps.length
    ? 'The AI is resting, so this is a quick check of the words in the post. Try again in a minute for a full one.'
    : "The AI is resting, and a quick word check found nothing to compare. Try again in a minute, or send the post to Irshad.";
  return { summary, matches, gaps, ask: gaps.length ? `Has he worked with ${gaps[0]}?` : '' };
}
