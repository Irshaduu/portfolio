// Everything on the page that depends on the year, not the era: which tools exist yet,
// how far away each piece of work is, and the copyright line. Cheap enough to run on
// every year the slider passes through.

const sinceEls = [...document.querySelectorAll('[data-since]')];
const whenEls = [...document.querySelectorAll('.when[data-when]')];
const yearEls = [...document.querySelectorAll('[data-year-text]')];
const clockEl = document.querySelector('[data-stack-clock]');

// One entry per tool in the Stack section, oldest first.
const tools = [...document.querySelectorAll('#stack .chip[data-since]')]
  .map((el) => ({ name: el.textContent.trim(), since: Number(el.dataset.since) }))
  .sort((a, b) => a.since - b.since);

const years = (n) => `${n} year${n === 1 ? '' : 's'}`;

function describeWhen(el, year) {
  const built = Number(el.dataset.when);
  const label = el.dataset.label || String(built);
  const gap = built - year;
  if (gap === 0) return `${label} · this year`;
  return gap > 0 ? `${label} · ${years(gap)} from now` : `${label} · ${years(-gap)} ago`;
}

function describeStack(year) {
  const here = tools.filter((t) => t.since <= year).length;
  const next = tools.find((t) => t.since > year);
  if (!next) return `In ${year}, all ${tools.length} tools I use exist.`;
  const also = tools.filter((t) => t.since === next.since).map((t) => t.name);
  const names = also.length > 1 ? `${also.slice(0, -1).join(', ')} and ${also.at(-1)}` : also[0];
  return `In ${year}, ${here} of the ${tools.length} tools I use exist. Next: ${names}, in ${next.since}.`;
}

export function applyYear(year) {
  for (const el of sinceEls) el.toggleAttribute('data-future', year < Number(el.dataset.since));
  for (const el of whenEls) el.textContent = describeWhen(el, year);
  for (const el of yearEls) el.textContent = year;
  if (clockEl) clockEl.textContent = describeStack(year);
}
