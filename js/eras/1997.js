// 1997: a sparkle trail behind the cursor, a visitor counter, and MIDI-style music made
// live with the Web Audio API (the same trick Word Hunt uses for its sounds). The music
// plays through the site's one sound switch (js/sound.js): Play turns sound on, and
// turning sound off stops the music.

import { channel } from '../sound.js';

let cleanups = [];
const onLeave = (fn) => cleanups.push(fn);

// ---- visitor counter: honest, it counts this browser's visits ---------------------

function countVisit() {
  const out = document.querySelector('.hits__n');
  let n = 1;
  try {
    n = Number(localStorage.getItem('tt-visits') || 0);
    if (!sessionStorage.getItem('tt-counted')) {
      n += 1;
      localStorage.setItem('tt-visits', n);
      sessionStorage.setItem('tt-counted', '1');
    }
  } catch {
    // Storage blocked: the counter just shows 1.
  }
  out.textContent = String(Math.max(n, 1)).padStart(6, '0');
}

// ---- sparkles ------------------------------------------------------------------------

const COLORS = ['#ff0', '#0ff', '#f0f', '#0f0', '#fff', '#ff8000'];

function startSparkles() {
  const layer = Object.assign(document.createElement('div'), { className: 'sparkles' });
  layer.setAttribute('aria-hidden', 'true');
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:95;overflow:hidden';
  document.body.append(layer);
  const pool = Array.from({ length: 18 }, () => {
    const s = document.createElement('span');
    s.textContent = '*';
    s.style.cssText = 'position:absolute;left:0;top:0;font:bold 18px "Comic Sans MS",cursive;opacity:0';
    layer.append(s);
    return s;
  });
  let i = 0;
  let last = 0;

  const onMove = (event) => {
    if (event.timeStamp - last < 28) return;
    last = event.timeStamp;
    const s = pool[i++ % pool.length];
    s.style.color = COLORS[i % COLORS.length];
    s.style.left = `${event.clientX}px`;
    s.style.top = `${event.clientY}px`;
    const dx = (Math.random() - 0.5) * 40;
    s.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + 34px)) scale(.3) rotate(90deg)`, opacity: 0 },
      ],
      { duration: 750, easing: 'ease-out' },
    );
  };
  addEventListener('pointermove', onMove, { passive: true });
  onLeave(() => {
    removeEventListener('pointermove', onMove);
    layer.remove();
  });
}

// ---- MIDI music ----------------------------------------------------------------------

// An original little loop: bar by bar, a lead melody over a bass note (semitones from A3).
const LEAD = [12, 16, 19, 16, 21, 19, 16, 14, 12, 16, 19, 24, 23, 19, 21, null,
              14, 17, 21, 17, 23, 21, 17, 16, 14, 17, 21, 26, 24, null, 24, null];
const BASS = [0, 0, 5, 5, 7, 7, 3, 3];
const STEP = 0.16; // seconds per lead note

let audio = null;

function hz(semitones) {
  return 220 * 2 ** (semitones / 12);
}

function note(ctx, out, type, freq, at, length, gain) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, at);
  env.gain.linearRampToValueAtTime(gain, at + 0.01);
  env.gain.exponentialRampToValueAtTime(0.0001, at + length);
  osc.connect(env).connect(out);
  osc.start(at);
  osc.stop(at + length + 0.02);
}

function startMusic(button) {
  const { ctx, out } = channel();
  out.gain.value = 0.5;
  let step = 0;
  let next = ctx.currentTime + 0.05;

  // Schedule a little ahead of time so the loop never stutters.
  const timer = setInterval(() => {
    while (next < ctx.currentTime + 0.25) {
      const lead = LEAD[step % LEAD.length];
      if (lead !== null) note(ctx, out, 'square', hz(lead), next, STEP * 0.9, 0.05);
      if (step % 4 === 0) note(ctx, out, 'triangle', hz(BASS[(step / 4) % BASS.length] - 12), next, STEP * 3.6, 0.14);
      next += STEP;
      step += 1;
    }
  }, 50);

  audio = { out, timer, button };
  button.setAttribute('aria-pressed', 'true');
  button.textContent = '♫ Stop the MIDI ♫';
}

function stopMusic() {
  if (!audio) return;
  clearInterval(audio.timer);
  audio.out.disconnect(); // notes already scheduled go nowhere
  audio.button.setAttribute('aria-pressed', 'false');
  audio.button.textContent = '♫ Play MIDI music ♫';
  audio = null;
}

// ---- lifecycle -----------------------------------------------------------------------

export function enter({ reducedMotion }) {
  countVisit();

  const button = document.querySelector('.midi');
  const onClick = () => (audio ? stopMusic() : startMusic(button));
  const onSound = (event) => event.detail || stopMusic();
  button.addEventListener('click', onClick);
  document.addEventListener('sound:change', onSound);
  onLeave(() => {
    button.removeEventListener('click', onClick);
    document.removeEventListener('sound:change', onSound);
    stopMusic();
  });

  if (!reducedMotion && matchMedia('(pointer: fine)').matches) startSparkles();
}

export function leave() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}
