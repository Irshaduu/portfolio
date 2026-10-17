// 2030's sky follows the visitor's own clock: a sunrise low on the left in the morning,
// daylight blue at noon (fewer stars), a sunset on the right in the evening, and deep space
// at night. "Play a day" runs the whole 24 hours in nine seconds, then comes back to now.
//
// It only writes custom properties (2030.css paints them) and the scene's starlight.

import { load } from '../../load.js';

// The score is optional: every sound is silent until it arrives, and stays silent if it never
// does, so a dropped sound file can never stop this part from drawing.
let audio = new Proxy({}, { get: () => () => {} });
load(new URL('./audio.js', import.meta.url)).then((m) => { audio = m; }, () => {});

// How bright the stars should be, handed to the scene by 2030.js, so the sky never needs the
// scene to load first (or at all).
let setStarlight = () => {};

const root = document.documentElement;
const DAY_MS = 9000;
const clamp01 = (v) => Math.min(1, Math.max(0, v));

const button = document.querySelector('.sky-clock');
const timeEl = button.querySelector('.sky-clock__time');
const phaseEl = button.querySelector('.sky-clock__phase');

function phaseName(h) {
  if (h < 4) return 'Deep night';
  if (h < 5.5) return 'Before dawn';
  if (h < 7) return 'Sunrise';
  if (h < 11) return 'Morning';
  if (h < 14) return 'Midday';
  if (h < 17) return 'Afternoon';
  if (h < 18.75) return 'Sunset';
  if (h < 20) return 'Dusk';
  return 'Night';
}

const nowHours = () => {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
};

// The visitor's own format: 06:30 or 6:30 AM.
const formatter = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });
const formatHours = (h) => {
  const d = new Date();
  d.setHours(Math.floor(h), Math.floor((h % 1) * 60), 0, 0);
  return formatter.format(d);
};

function paint(h) {
  // -1 at midnight, 0 at 6:00 and 18:00, 1 at noon.
  const sun = Math.sin(((h - 6) / 12) * Math.PI);
  const day = clamp01(sun * 1.4);
  root.style.setProperty('--sky-dawn', clamp01(1 - Math.abs(sun) * 3.2).toFixed(3));
  root.style.setProperty('--sky-day', day.toFixed(3));
  root.style.setProperty('--sky-x', h < 12 ? '20%' : '80%');
  setStarlight(1 - day * 0.7);
  timeEl.textContent = formatHours(h);
  phaseEl.textContent = phaseName(h);
}

let timer = 0;
let frame = 0;
let playing = false;

function play() {
  if (playing) return;
  playing = true;
  button.dataset.playing = '';
  const from = nowHours();
  const start = performance.now();
  audio.day(from, DAY_MS / 1000);
  const step = (now) => {
    const t = (now - start) / DAY_MS;
    if (t >= 1) {
      playing = false;
      delete button.dataset.playing;
      paint(nowHours());
      return;
    }
    paint((from + t * 24) % 24);
    frame = requestAnimationFrame(step);
  };
  frame = requestAnimationFrame(step);
}

export function startSky(onStarlight) {
  setStarlight = onStarlight || (() => {});
  paint(nowHours());
  timer = setInterval(() => playing || paint(nowHours()), 30000);
  button.addEventListener('click', play);
}

export function stopSky() {
  clearInterval(timer);
  cancelAnimationFrame(frame);
  playing = false;
  delete button.dataset.playing;
  button.removeEventListener('click', play);
  for (const prop of ['--sky-dawn', '--sky-day', '--sky-x']) root.style.removeProperty(prop);
}
