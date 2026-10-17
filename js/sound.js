// Sound for the whole site. Off until the visitor turns it on (the speaker on the time
// machine, or 2001's Sound button), and remembered after that. Once it's on, travelling
// makes its own sounds: no more buttons to press.
//
// Browsers let a page make sound only after a tap, click or key press. So if sound was on
// last visit, it wakes on the visitor's first one. Every sound is made here with the Web
// Audio API (as in Word Hunt): no audio files.

const KEY = 'tt-sound';

let on = false;
let ctx = null;
let master = null;
let noiseBuffer = null;

const read = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};
const write = (value) => {
  try {
    localStorage.setItem(KEY, value ? '1' : '0');
  } catch {
    // Storage blocked: sound is just off again next visit.
  }
};

// Only ever called from a tap, click or key press, or once one has happened.
function wake() {
  if (!ctx) {
    ctx = new AudioContext();
    const squash = ctx.createDynamicsCompressor();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(squash).connect(ctx.destination);
    ctx.addEventListener('statechange', syncHum);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
}

const ready = () => on && ctx?.state === 'running';

// ---- building blocks ----------------------------------------------------------------------

function tone({ type = 'sine', freq, to, at = 0, length, gain, attack = 0.005 }) {
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + length);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + length);
  osc.connect(env).connect(master);
  osc.start(t);
  osc.stop(t + length + 0.05);
}

// Filtered white noise, its filter swept from one frequency to another: whooshes and hiss.
function noise({ from, to, at = 0, length, gain, q = 1, attack = 0.05 }) {
  if (!noiseBuffer) {
    noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const t = ctx.currentTime + at;
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const env = ctx.createGain();
  src.buffer = noiseBuffer;
  src.loop = true;
  filter.type = 'bandpass';
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + length);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + length);
  src.connect(filter).connect(env).connect(master);
  src.start(t);
  src.stop(t + length + 0.05);
}

const bell = (freq, at, gain) => {
  tone({ freq, at, length: 0.8, gain });
  tone({ freq: freq * 2.76, at, length: 0.25, gain: gain * 0.3 }); // the metallic overtone
};

// ---- the sounds of travel ---------------------------------------------------------------

// Leaving for another era, back or forward: the air rushes past.
export function travel() {
  if (!ready()) return;
  noise({ from: 300, to: 4500, length: 0.5, gain: 0.16, q: 1.2, attack: 0.25 });
  tone({ freq: 220, to: 880, length: 0.5, gain: 0.04, attack: 0.2 });
}

// Landing. Each era sounds like its own web.
const LANDINGS = {
  // A terminal's bell.
  1992: () => tone({ type: 'square', freq: 880, length: 0.14, gain: 0.05 }),
  // A dial-up modem, cut down to a second: dial tone, three digits, answer, screech.
  1997: () => {
    tone({ freq: 350, length: 0.24, gain: 0.05 });
    tone({ freq: 440, length: 0.24, gain: 0.05 });
    [1209, 1336, 1477].forEach((f, i) => {
      tone({ freq: f, at: 0.3 + i * 0.09, length: 0.07, gain: 0.035 });
      tone({ freq: 770, at: 0.3 + i * 0.09, length: 0.07, gain: 0.035 });
    });
    tone({ freq: 2100, at: 0.6, length: 0.22, gain: 0.03 });
    for (let k = 0; k < 6; k++) tone({ type: 'square', freq: k % 2 ? 1200 : 2400, at: 0.84 + k * 0.05, length: 0.05, gain: 0.015 });
    noise({ from: 1800, to: 2600, at: 0.84, length: 0.32, gain: 0.05, q: 6 });
  },
  // A Flash intro: a swoosh, then the button click.
  2001: () => {
    noise({ from: 600, to: 3200, length: 0.22, gain: 0.1, q: 3, attack: 0.1 });
    tone({ freq: 1800, at: 0.22, length: 0.04, gain: 0.06 });
    tone({ freq: 2600, at: 0.26, length: 0.05, gain: 0.04 });
  },
  // A glossy bubble popping.
  2007: () => tone({ freq: 420, to: 1300, length: 0.12, gain: 0.12, attack: 0.003 }),
  // A clean, flat tick.
  2013: () => tone({ type: 'triangle', freq: 1500, length: 0.05, gain: 0.08 }),
  // A notification ding.
  2023: () => {
    bell(1318.5, 0, 0.09);
    bell(1975.5, 0.12, 0.07);
  },
  // An airy chord.
  2026: () => [220, 277.2, 329.6, 493.9].forEach((f, i) => tone({ freq: f, at: i * 0.03, length: 1.3, gain: 0.05, attack: 0.18 })),
  // An airlock opening onto deep space. Everything after it is 2030's own (eras/2030/audio.js).
  2030: () => {
    noise({ from: 140, to: 1100, length: 1.5, gain: 0.08, q: 0.8, attack: 0.55 });
    tone({ freq: 55, to: 41.2, length: 1.5, gain: 0.09, attack: 0.1 });
  },
};

export function land(eraId) {
  if (ready()) LANDINGS[eraId]?.();
}

// Dragging the slider through eras: a soft detent click for each one passed.
let lastTick = 0;
export function tick() {
  if (!ready() || ctx.currentTime - lastTick < 0.05) return;
  lastTick = ctx.currentTime;
  tone({ type: 'square', freq: 2400, length: 0.02, gain: 0.02 });
}

// A short beep for rollovers (2001).
export function blip(freq, length) {
  if (ready()) tone({ freq, to: freq * 1.6, length, gain: 0.06 });
}

// ---- 2030's background hum ---------------------------------------------------------------

let humWanted = false;
let hum = null;

function syncHum() {
  const should = humWanted && ready();
  if (should && !hum) {
    const t = ctx.currentTime;
    const out = ctx.createGain();
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 380;
    out.gain.setValueAtTime(0.0001, t);
    out.gain.exponentialRampToValueAtTime(0.05, t + 2.5);
    lowpass.connect(out).connect(master);
    // Two low notes a hair apart beat slowly against each other; a fifth sits above.
    const voices = [55, 55.35, 82.4].map((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = f;
      g.gain.value = i === 2 ? 0.5 : 1;
      osc.connect(g).connect(lowpass);
      osc.start(t);
      return osc;
    });
    // The filter breathes, very slowly.
    const lfo = ctx.createOscillator();
    const depth = ctx.createGain();
    lfo.frequency.value = 0.07;
    depth.gain.value = 160;
    lfo.connect(depth).connect(lowpass.frequency);
    lfo.start(t);
    hum = { out, nodes: [...voices, lfo] };
  } else if (!should && hum) {
    const { out, nodes } = hum;
    hum = null;
    if (ctx.state !== 'running') return nodes.forEach((n) => n.stop());
    const t = ctx.currentTime;
    out.gain.cancelScheduledValues(t);
    out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t);
    out.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    nodes.forEach((n) => n.stop(t + 0.7));
  }
}

export function setHum(want) {
  humWanted = want;
  syncHum();
}

// ---- for eras with their own music (1997's MIDI) ---------------------------------------------

// A channel into the mix, for code that schedules its own notes. Turns sound on if it was off:
// pressing Play is asking for sound. Call it from a click.
export function channel() {
  if (!on) setOn(true);
  wake();
  const out = ctx.createGain();
  out.connect(master);
  return { ctx, out };
}

// ---- for eras with their own sound design (2030) ---------------------------------------------

// The shared context and the way into the mix, only while sound is on and awake; otherwise
// null. Unlike channel(), it never turns sound on.
export const voice = () => (ready() ? { ctx, out: master } : null);

// ---- the switch -------------------------------------------------------------------------------

export const isOn = () => on;

function paintSwitches() {
  for (const el of document.querySelectorAll('[data-sound-toggle]')) {
    el.setAttribute('aria-pressed', String(on));
    const text = on ? el.dataset.onText : el.dataset.offText;
    if (text) el.textContent = text;
  }
}

export function setOn(value) {
  on = value;
  write(on);
  if (on) wake();
  else ctx?.suspend();
  paintSwitches();
  syncHum();
  document.dispatchEvent(new CustomEvent('sound:change', { detail: on }));
}

on = read();
paintSwitches();

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-sound-toggle]')) setOn(!on);
});

// On from a past visit: wake on the first tap, click or key that lets a page make sound.
if (on) {
  const gestures = ['click', 'keydown', 'touchend'];
  const first = () => {
    wake();
    if (ctx.state === 'running') return done();
    ctx.resume().then(done, () => {});
  };
  const done = () => {
    gestures.forEach((type) => removeEventListener(type, first, true));
    syncHum();
  };
  gestures.forEach((type) => addEventListener(type, first, true));
}

// A hidden tab stays silent.
document.addEventListener('visibilitychange', () => {
  if (!ctx || !on) return;
  if (document.hidden) ctx.suspend();
  else ctx.resume().catch(() => {});
});
