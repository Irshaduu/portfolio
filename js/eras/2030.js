// 2030: the page becomes a place. This file starts and stops its parts:
//   2030/scene.js          the WebGL scene behind the page
//   2030/constellation.js  the Stack as a night sky
//   2030/sky.js            a sky that follows the visitor's clock
// and runs the time machine's plan itself. In 2030 even time travel has a token limit.
//
// The plan counts seconds you actually spend in 2030 (not in a hidden tab). Each limit
// pops up once per visit; Escape, the backdrop, or either button closes it.

import { startScene, stopScene, boost } from './2030/scene.js';
import { startConstellation, stopConstellation } from './2030/constellation.js';
import { startSky, stopSky } from './2030/sky.js';

const KEY = 'tt-plan-2030';

const PLANS = {
  pro: { label: 'Pro', seconds: 30 },
  max: { label: 'Max', seconds: 300 },
  max20: { label: 'Max 20x', seconds: 6000 },
};

const LIMITS = {
  pro: {
    title: 'Token limit reached',
    body: 'Your Pro plan ran out of future in 30 seconds. Upgrade to Max to explore 2030 for 5 whole minutes.',
    upgrade: 'Upgrade to Max · ₹0',
    fine: 'Billed in 2030 rupees. Cancel anytime, or in 2031.',
    next: 'max',
  },
  max: {
    title: 'Max limit reached',
    body: 'That was 5 whole minutes of the future. Upgrade to Max 20x for 100 minutes of 2030.',
    upgrade: 'Upgrade to Max 20x · ₹0',
    fine: 'Still ₹0. The future is generous.',
    next: 'max20',
  },
  max20: {
    title: 'You have used up 2030',
    body: 'All 100 minutes of it. Please come back in 2030.',
    upgrade: 'Fair enough',
    fine: 'Or hire me, and I will build you a 2031.',
    next: null,
  },
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

// ---- the popup --------------------------------------------------------------------------------

const dialog = document.getElementById('limit');
const ui = {
  plan: dialog.querySelector('.limit__plan'),
  title: dialog.querySelector('.limit__title'),
  body: dialog.querySelector('.limit__body'),
  upgrade: dialog.querySelector('[data-limit="upgrade"]'),
  fine: dialog.querySelector('.limit__fine'),
};

function openLimit() {
  const limit = LIMITS[state.plan];
  state.shown.push(state.plan);
  save();
  ui.plan.textContent = `${PLANS[state.plan].label} plan`;
  ui.title.textContent = limit.title;
  ui.body.textContent = limit.body;
  ui.upgrade.textContent = limit.upgrade;
  ui.fine.textContent = limit.fine;
  dialog.showModal();
}

function closeLimit() {
  if (dialog.open) dialog.close();
}

let ctxRef = null;

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) return closeLimit(); // the backdrop
  const action = event.target.closest('[data-limit]')?.dataset.limit;
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
  if (state.plan === 'done' || document.hidden || dialog.open) return;
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
  startScene(ctx);
  startSky();
  startConstellation();
}

export function leave() {
  clearInterval(timer);
  closeLimit();
  stopConstellation();
  stopSky();
  stopScene();
  ctxRef = null;
}
