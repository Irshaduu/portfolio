import { ERAS, MIN_YEAR, MAX_YEAR, DEFAULT_YEAR, eraForYear, eraIndex } from './eras.js';
import { applyYear } from './time.js';
import { travel, warp } from './transition.js';
import { mountTimeMachine } from './timemachine.js';
import { travel as travelSound, land, tick } from './sound.js';
import './clips.js';

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
// Only the eras' own years exist here: a link to ?y=2015 lands on 2013, the era it belongs to.
const snap = (y) => eraForYear(Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.round(y)))).from;

const state = { year: snap(Number(root.dataset.year) || DEFAULT_YEAR), era: null };

// ---- fonts: each era's stylesheet is fetched the first time it is needed --------------

const loadedFonts = new Set([...document.querySelectorAll('link[data-font]')].map((l) => l.getAttribute('href')));

function loadFonts(era) {
  for (const href of era.fonts) {
    if (loadedFonts.has(href)) continue;
    loadedFonts.add(href);
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href });
    document.head.append(link);
  }
}

// ---- era behaviour modules: only the current era's code runs --------------------------

let active = null;
let moduleTicket = 0;

const ctx = {
  root,
  get reducedMotion() {
    return reducedMotion.matches;
  },
  // True while the visitor is still dragging the slider through eras.
  get scrubbing() {
    return tm.isScrubbing();
  },
  goTo: (year) => setYear(year),
  step: (dir) => stepEra(dir),
};

async function syncModule() {
  const era = state.era;
  if (active?.id === era.id) return;
  const ticket = ++moduleTicket;
  active?.mod.leave?.(ctx);
  active = null;
  if (!era.module) return;
  try {
    const mod = await import(`./eras/${era.id}.js`);
    if (ticket !== moduleTicket) return;
    active = { id: era.id, mod };
    mod.enter?.(ctx);
  } catch (err) {
    console.error(`Era ${era.id} behaviour failed to load`, err);
  }
}

// ---- rendering ----------------------------------------------------------------------

const favicon = document.getElementById('favicon');
let tm;

// Reads state, never arguments, so any number of overlapping calls end in the same place.
function render() {
  const { year, era } = state;
  root.dataset.year = year;
  if (root.dataset.era !== era.id) root.dataset.era = era.id;
  document.title = era.title;
  favicon.href = era.favicon;
  applyYear(year);
  tm.render(year, era);
}

let urlTimer;
function writeUrl(year) {
  clearTimeout(urlTimer);
  urlTimer = setTimeout(() => {
    const url = new URL(location.href);
    if (year === DEFAULT_YEAR) url.searchParams.delete('y');
    else url.searchParams.set('y', year);
    history.replaceState(null, '', url);
  }, 200);
}

function setYear(year, { scrub = false } = {}) {
  year = snap(year);
  const prevYear = state.year;
  const prevEra = state.era;
  const era = eraForYear(year);
  state.year = year;
  state.era = era;
  writeUrl(year);

  if (prevEra === era) return render();

  const direction = year < prevYear ? 'back' : 'forward';
  loadFonts(era);
  if (scrub) {
    warp();
    tick(); // a detent click per era dragged through; the landing waits for the release
    scrubbedFrom ??= prevEra;
  } else {
    travelSound(direction);
    landSoon(era);
  }
  travel(render, {
    animate: !scrub && !reducedMotion.matches,
    direction,
    fontProbe: era.fontProbe,
  }).then(syncModule);
}

// The new era's sound plays as it arrives, after the sound of leaving.
let landTimer;
function landSoon(era) {
  clearTimeout(landTimer);
  landTimer = setTimeout(() => land(era.id), 380);
}

// Let go of the slider in a new era: now it lands.
let scrubbedFrom = null;
document.addEventListener('timemachine:release', () => {
  if (scrubbedFrom && scrubbedFrom !== state.era) {
    travelSound(eraIndex(state.era) < eraIndex(scrubbedFrom) ? 'back' : 'forward');
    landSoon(state.era);
  }
  scrubbedFrom = null;
});

function stepEra(dir) {
  const i = eraIndex(state.era) + dir;
  if (i >= 0 && i < ERAS.length) setYear(ERAS[i].from);
}

// ---- boot ---------------------------------------------------------------------------

tm = mountTimeMachine(document.getElementById('timemachine'), {
  eras: ERAS,
  onYear: (year, opts) => setYear(year, opts),
  onStep: stepEra,
});

state.era = eraForYear(state.year);
loadFonts(state.era);
render();
syncModule();

// Webring links and anything else that says "go one era that way".
document.addEventListener('click', (event) => {
  const jump = event.target.closest('[data-jump]');
  if (!jump) return;
  event.preventDefault();
  stepEra(Number(jump.dataset.jump));
});

// [ and ] step through the eras from anywhere on the page.
addEventListener('keydown', (event) => {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target.closest?.('input:not([type="range"]), textarea, [contenteditable]')) return;
  if (event.key === '[') stepEra(-1);
  if (event.key === ']') stepEra(1);
});

// Back/forward through shared links.
addEventListener('popstate', () => {
  const y = Number(new URL(location.href).searchParams.get('y'));
  setYear(y || DEFAULT_YEAR);
});

// Warm the other eras' font stylesheets once the page is idle. The font files themselves
// still download only when an era actually uses them.
(window.requestIdleCallback || ((fn) => setTimeout(fn, 1500)))(() => ERAS.forEach(loadFonts));
