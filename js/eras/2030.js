// 2030: the page becomes a place. This file starts and stops its parts:
//   2030/scene.js          the WebGL scene behind the page
//   2030/constellation.js  the Stack as a night sky
//   2030/sky.js            a sky that follows the visitor's clock
// and runs the time machine's plan itself. In 2030 even time travel has a token limit.
//
// The plan counts seconds you actually spend in 2030 (not in a hidden tab). Each limit shows
// once per visit. Limit notices have only got shorter: from a paragraph to one line and a
// reset time. By 2030 it's a quiet line that rises out of the time machine, never a popup
// over the page, and it never takes focus. ×, Escape or either button puts it away.

import { startScene, stopScene, boost } from './2030/scene.js';
import { startConstellation, stopConstellation } from './2030/constellation.js';
import { startSky, stopSky } from './2030/sky.js';
import { setHum } from '../sound.js';
import { limit } from './2030/audio.js';

const KEY = 'tt-plan-2030';

const PLANS = {
  pro: { label: 'Pro', seconds: 30 },
  max: { label: 'Max', seconds: 300 },
  max20: { label: 'Max 20x', seconds: 6000 },
};

// The future resets when the future does.
const RESETS = `Resets ${new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(2031, 0, 1))}`;

const LIMITS = {
  pro: { title: 'Pro limit reached', reset: RESETS, upgrade: 'Get Max · ₹0', next: 'max' },
  max: { title: 'Max limit reached', reset: RESETS, upgrade: 'Get Max 20x · ₹0', next: 'max20' },
  max20: { title: 'That was all of 2030', reset: 'See you in 2031', upgrade: 'OK', next: null },
};

// ---- state, kept for the visit ---------------------------------------------------------------

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY));
    if (saved && (PLANS[saved.plan] || saved.plan === 'done')) return saved;
  } catch {
    // Nothing saved, or storage blocked: start on Pro.
  }
  return { plan: 'pro', left: PLANS.pro.seconds, shown: [] };
}

function save() {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage blocked: the plan resets on reload. Harmless.
  }
}

let state = load();

// ---- the readout in the time machine ---------------------------------------------------------

const badge = document.querySelector('.tm__plan');
const badgeTier = badge.querySelector('.tm__plan-tier');
const badgeLeft = badge.querySelector('.tm__plan-left');

const clock = (s) => {
  s = Math.ceil(s);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};

function paintBadge() {
  if (state.plan === 'done') {
    badgeTier.textContent = '2030';
    badgeLeft.textContent = 'used up';
  } else {
    badgeTier.textContent = PLANS[state.plan].label;
    badgeLeft.textContent = state.left > 0 ? `${clock(state.left)} left` : 'on fumes';
  }
  badge.toggleAttribute('data-low', state.plan !== 'done' && state.left > 0 && state.left <= 10);
}

function flashBadge() {
  badge.removeAttribute('data-flash');
  void badge.offsetWidth; // restart the animation
  badge.setAttribute('data-flash', '');
}

// ---- the notice -------------------------------------------------------------------------------

const notice = document.getElementById('limit');
const ui = {
  title: notice.querySelector('.limit__title'),
  reset: notice.querySelector('.limit__reset'),
  upgrade: notice.querySelector('[data-limit="upgrade"]'),
  back: notice.querySelector('[data-limit="back"]'),
};
const announce = document.querySelector('.tm__live');
const isOpen = () => !notice.hidden;

function openLimit() {
  const limit = LIMITS[state.plan];
  state.shown.push(state.plan);
  save();
  ui.title.textContent = limit.title;
  ui.reset.textContent = limit.reset;
  ui.upgrade.textContent = limit.upgrade;
  ui.back.hidden = !limit.next;
  notice.hidden = false;
  limit();
  announce.textContent = `${limit.title}. ${limit.reset}.`; // said once, politely; focus stays put
}

function closeLimit() {
  notice.hidden = true;
}

const onKey = (event) => {
  if (event.key === 'Escape' && isOpen()) closeLimit();
};

let ctxRef = null;

notice.addEventListener('click', (event) => {
  const action = event.target.closest('[data-limit]')?.dataset.limit;
  if (action === 'close') return closeLimit();
  if (action === 'upgrade') {
    const next = LIMITS[state.plan].next;
    state.plan = next ?? 'done';
    state.left = next ? PLANS[next].seconds : 0;
    save();
    closeLimit();
    paintBadge();
    if (next) {
      flashBadge();
      boost();
    }
  } else if (action === 'back') {
    closeLimit();
    ctxRef?.goTo(2026);
  }
});

// ---- the meter --------------------------------------------------------------------------------

let timer = 0;
let lastTick = 0;

function tick() {
  const now = performance.now();
  const dt = (now - lastTick) / 1000;
  lastTick = now;
  if (state.plan === 'done' || document.hidden || isOpen()) return;
  if (state.left > 0) {
    const before = Math.ceil(state.left);
    state.left = Math.max(0, state.left - dt);
    if (Math.ceil(state.left) !== before) {
      paintBadge();
      save();
    }
  }
  // Out of time: say so once per plan, and never in the middle of a drag.
  if (state.left === 0 && !state.shown.includes(state.plan) && !ctxRef.scrubbing) openLimit();
}

// ---- lifecycle --------------------------------------------------------------------------------

export function enter(ctx) {
  ctxRef = ctx;
  state = load();
  paintBadge();
  lastTick = performance.now();
  timer = setInterval(tick, 250);
  addEventListener('keydown', onKey);
  startScene(ctx);
  startSky();
  startConstellation();
  setHum(true); // only heard with sound on
}

export function leave() {
  clearInterval(timer);
  removeEventListener('keydown', onKey);
  closeLimit();
  stopConstellation();
  setHum(false);
  stopSky();
  stopScene();
  ctxRef = null;
}
