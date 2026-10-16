// 2001: the Skip Intro screen and rollover blips. The title bar's Sound button is the same
// switch as the time machine's speaker (js/sound.js).

import { blip } from '../sound.js';
//
// The intro plays once per visit, the first time you arrive in 2001 and stay: by clicking
// a year, stepping, a shared ?y= link, or letting go of the slider here. Dragging straight
// through 2001 doesn't trigger it. "Replay intro" plays it again on demand.

const SEEN = 'tt-intro-2001';
const LOADING_MS = 60; // one progress tick
const MOVIE_MS = 2900; // letters, tagline, flash
const READY_MS = 1600; // "Enter site" waits this long before entering for you

let cleanups = [];
const onLeave = (fn) => cleanups.push(fn);

// ---- the intro ---------------------------------------------------------------------

const dialog = document.getElementById('intro');
const nameEl = dialog.querySelector('.intro__name');
const pctEl = dialog.querySelector('.intro__pct');
const barEl = dialog.querySelector('.intro__bar');

// Split the name into letters once, so each can fly in on its own delay.
// The heading keeps its accessible name through aria-label.
if (!nameEl.dataset.split) {
  const text = nameEl.dataset.text;
  nameEl.setAttribute('aria-label', text);
  nameEl.innerHTML = [...text]
    .map((ch, i) => `<span aria-hidden="true" style="--i:${i}">${ch}</span>`)
    .join('');
  nameEl.dataset.split = '1';
}

let timers = [];
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const clearTimers = () => {
  timers.forEach(clearTimeout);
  timers = [];
};

function setProgress(pct) {
  pctEl.textContent = `${pct}%`;
  barEl.style.setProperty('--pct', `${pct}%`);
}

function playIntro({ reducedMotion }) {
  if (dialog.open) return;
  clearTimers();
  try {
    sessionStorage.setItem(SEEN, '1');
  } catch {
    // Storage blocked: the intro may play again next time. Harmless.
  }

  setProgress(0);
  dialog.dataset.phase = 'loading';
  dialog.showModal();

  if (reducedMotion) {
    setProgress(100);
    dialog.dataset.phase = 'ready';
    return; // no auto-enter: the visitor presses Enter or Skip
  }

  // A loading bar that hesitates like a 56k modem, then the movie, then Enter.
  let pct = 0;
  const tick = () => {
    pct = Math.min(100, pct + Math.ceil(Math.random() * 7) + (pct > 60 && pct < 80 ? 0 : 2));
    setProgress(pct);
    if (pct < 100) return later(tick, LOADING_MS + (pct > 70 && pct < 76 ? 400 : 0));
    later(() => {
      dialog.dataset.phase = 'movie';
      later(() => {
        dialog.dataset.phase = 'ready';
        later(closeIntro, READY_MS);
      }, MOVIE_MS);
    }, 250);
  };
  later(tick, 300);
}

function closeIntro() {
  clearTimers();
  if (dialog.open) dialog.close();
}

// Escape closes a modal dialog natively; make sure the timers stop with it.
dialog.addEventListener('close', clearTimers);
dialog.addEventListener('click', (event) => {
  if (event.target.closest('[data-intro-close]')) closeIntro();
});

function seen() {
  try {
    return sessionStorage.getItem(SEEN) === '1';
  } catch {
    return false;
  }
}

// ---- lifecycle -----------------------------------------------------------------------

let lastBlip = 0;

export function enter(ctx) {
  const replayBtn = document.querySelector('[data-replay-intro]');
  const onReplay = () => playIntro(ctx);
  replayBtn.addEventListener('click', onReplay);

  // Every rollover beeps, the way every Flash site did. Only with sound on.
  const onOver = (event) => {
    const target = event.target.closest?.('a, button');
    if (!target || target.contains(event.relatedTarget)) return;
    if (event.timeStamp - lastBlip < 60) return;
    lastBlip = event.timeStamp;
    blip(1400, 0.05);
  };
  const onDown = (event) => {
    if (event.target.closest?.('a, button')) blip(520, 0.08);
  };
  document.addEventListener('pointerover', onOver);
  document.addEventListener('pointerdown', onDown);

  // Arrived and stayed: play now. Dragging through: wait to see if they let go here.
  const maybePlay = () => {
    if (!seen() && !ctx.reducedMotion) playIntro(ctx);
  };
  if (ctx.scrubbing) document.addEventListener('timemachine:release', maybePlay, { once: true });
  else maybePlay();

  onLeave(() => {
    replayBtn.removeEventListener('click', onReplay);
    document.removeEventListener('pointerover', onOver);
    document.removeEventListener('pointerdown', onDown);
    document.removeEventListener('timemachine:release', maybePlay);
    closeIntro();
  });
}

export function leave() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}
