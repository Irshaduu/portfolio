// 2030's sound. It follows the scene: the name gathering out of stardust, the flight, each
// project's object assembling, the night sky, the plan running out. Three things keep it from
// sounding like a set of beeps:
//   - One key. Every note is in A Lydian, the key of the 2030 hum, so whatever plays at once
//     is in tune: one score, not a stack of effects.
//   - One place. Each sound comes from where it happens on the screen, in 3D (HRTF: with
//     headphones, an object on the right is heard on the right, the sky below you from below),
//     and rings out in the same space, a reverb generated here.
//   - Each project's own numbers. Its object plays a motif built the way its shape is built:
//     WorkshopOS locks 21 rings into place, Word Hunt rains 71 letters and circles 10 players,
//     PhysioCoach breathes in, Catering sends 10 orbits round 6 apps.
// It plays only while sound is on and awake (sound.js), so never in a hidden tab, and the
// scene asks for no sound where reduced motion has stopped the motion.

import { voice } from '../../sound.js';

// ---- the key ------------------------------------------------------------------------------------

const LYDIAN = [0, 2, 4, 6, 7, 9, 11];
// Step `step` of A Lydian, counting from the A of `octave` (octave 4 starts at A4, 440 Hz).
// Steps past 6 carry on into the next octave.
const note = (step, octave = 4) => 440 * 2 ** ((LYDIAN[step % 7] + 12 * (octave - 4 + Math.floor(step / 7))) / 12);
// Each project's note. Together they make A major 7, the chord of the whole sky.
const NOTE = { workshopos: 0, 'word-hunt': 2, physiocoach: 4, catering: 6 };
const PENTA = [0, 1, 2, 4, 5]; // the five steps that never clash, for showers of grains

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// ---- the space every sound rings out in ---------------------------------------------------------

let space = null;

function rig() {
  const v = voice();
  if (!v) return null;
  if (space?.ctx !== v.ctx) {
    const { ctx } = v;
    const bus = ctx.createGain(); // all of 2030, so leaving can fade it out at once
    const dry = ctx.createGain();
    const verb = ctx.createConvolver();
    const wet = ctx.createGain();
    dry.gain.value = 0.85;
    wet.gain.value = 0.5;
    // A long, dark tail: stereo noise fading out over 3.4 seconds.
    const length = Math.round(ctx.sampleRate * 3.4);
    const tail = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const data = tail.getChannelData(c);
      for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
    verb.buffer = tail;
    bus.connect(v.out);
    dry.connect(bus);
    verb.connect(wet).connect(bus);
    const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    space = { ctx, bus, dry, verb, noise };
  }
  return space;
}

// Where a sound is heard from: x and y across the screen (0 to 1), z nearer (+) or farther (-),
// with `wet` of it sent into the space.
function at(s, { x = 0.5, y = 0.5, z = 0, wet = 0.4 } = {}) {
  const { ctx } = s;
  const input = ctx.createGain();
  const pan = ctx.createPanner();
  const send = ctx.createGain();
  pan.panningModel = 'HRTF';
  pan.refDistance = 3;
  pan.positionX.value = (Math.min(1.2, Math.max(-0.2, x)) - 0.5) * 4;
  pan.positionY.value = (0.5 - Math.min(1.2, Math.max(-0.2, y))) * 1.6;
  pan.positionZ.value = z - 2;
  send.gain.value = wet;
  input.connect(pan);
  pan.connect(s.dry);
  pan.connect(send).connect(s.verb);
  input.pan = pan;
  return input;
}

// A few places scattered around x, y for a shower of grains to share (3D panning costs, so
// grains don't each get their own). With `gather`, they all drift to x, y by that time.
function cloud(s, n, { x, y, spread, wet, gather }) {
  return Array.from({ length: n }, () => {
    const place = at(s, { x: x + rand(-1, 1) * spread, y: y + rand(-0.8, 0.8) * spread, z: rand(-1, 1) * spread * 2, wet });
    if (gather) {
      const { pan } = place;
      const now = s.ctx.currentTime;
      for (const [param, to] of [[pan.positionX, (x - 0.5) * 4], [pan.positionY, (0.5 - y) * 1.6], [pan.positionZ, -2]]) {
        param.setValueAtTime(param.value, now);
        param.linearRampToValueAtTime(to, gather);
      }
    }
    return place;
  });
}

// ---- instruments --------------------------------------------------------------------------------

// Glass: a sine bent by another at an odd ratio (FM), its shine dying away faster than its body.
function glass(s, into, t, freq, { len = 1.4, gain = 0.04, ratio = 3.5, bright = 2, attack = 0.004 } = {}) {
  const { ctx } = s;
  const car = ctx.createOscillator();
  const mod = ctx.createOscillator();
  const depth = ctx.createGain();
  const env = ctx.createGain();
  car.frequency.value = freq;
  mod.frequency.value = freq * ratio;
  depth.gain.setValueAtTime(freq * bright, t);
  depth.gain.exponentialRampToValueAtTime(freq * 0.02, t + len * 0.5);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + len);
  mod.connect(depth).connect(car.frequency);
  car.connect(env).connect(into);
  for (const osc of [car, mod]) {
    osc.start(t);
    osc.stop(t + len + 0.05);
  }
}

// A tone sliding from one pitch to another: risers, sub drops, lines being drawn.
function glide(s, into, t, from, to, { len, gain, type = 'sine', attack = 0.05 }) {
  const { ctx } = s;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + len);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + len);
  osc.connect(env).connect(into);
  osc.start(t);
  osc.stop(t + len + 0.05);
}

// Air: noise through a filter that sweeps, swelling evenly over `attack`. Breath, wind, warp.
function air(s, into, t, { from, to, len, gain, q = 1, attack = len / 2, type = 'bandpass' }) {
  const { ctx } = s;
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const env = ctx.createGain();
  src.buffer = s.noise;
  src.loop = true;
  filter.type = type;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(to, t + len);
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(gain, t + attack);
  env.gain.exponentialRampToValueAtTime(0.0001, t + len);
  src.connect(filter).connect(env).connect(into);
  src.start(t, Math.random());
  src.stop(t + len + 0.05);
}

// A pad: each note twice, a little out of tune with itself, through a soft filter. Returns the
// filter, so a caller can move it (the sun in "Play a day").
function pad(s, into, t, freqs, { len, gain, attack = 0.6, cutoff = 2200 }) {
  const { ctx } = s;
  const filter = ctx.createBiquadFilter();
  const env = ctx.createGain();
  filter.type = 'lowpass';
  filter.Q.value = 0.4;
  filter.frequency.value = cutoff;
  env.gain.setValueAtTime(0.0001, t);
  env.gain.linearRampToValueAtTime(gain, t + attack);
  env.gain.setValueAtTime(gain, t + Math.max(attack, len - 1.4));
  env.gain.exponentialRampToValueAtTime(0.0001, t + len);
  filter.connect(env).connect(into);
  for (const freq of freqs) {
    for (const cents of [-7, 7]) {
      const osc = ctx.createOscillator();
      const level = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      osc.detune.value = cents;
      level.gain.value = 0.5 / freqs.length;
      osc.connect(level).connect(filter);
      osc.start(t);
      osc.stop(t + len + 0.05);
    }
  }
  return filter;
}

// ---- the name: gathered out of stardust ---------------------------------------------------------

// As the points fly in from deep space: a low swell, grains of light scattered wide that gather
// to the middle as the points land, and the chord the name stands on.
export function arrival(x = 0.5, y = 0.4) {
  const s = rig();
  if (!s) return;
  const t = s.ctx.currentTime + 0.05;
  const mid = at(s, { x, y, wet: 0.5 });
  glide(s, mid, t, 70, 46, { len: 1.6, gain: 0.12, attack: 0.08 });
  air(s, mid, t, { from: 180, to: 5200, len: 2.4, gain: 0.05, q: 1.6, attack: 2 });
  const stardust = cloud(s, 8, { x, y, spread: 0.5, wet: 0.6, gather: t + 2.2 });
  for (let i = 0; i < 46; i++) {
    const k = Math.sqrt(Math.random()); // more of them near the end, as more points land
    glass(s, pick(stardust), t + 0.15 + k * 2.05, note(Math.floor(rand(0, 14)), 6), { len: rand(0.25, 0.7), gain: rand(0.006, 0.014), bright: rand(1, 3) });
  }
  pad(s, mid, t + 2.15, [note(0, 3), note(4, 3), note(1, 4), note(3, 5), note(6, 5)], { len: 3.6, gain: 0.05, attack: 0.25, cutoff: 2600 });
  glass(s, mid, t + 2.2, note(0, 6), { len: 2.2, gain: 0.03, bright: 1.2 });
}

// Pushed by the pointer, the points sing: grains as fast as the points are moving, from where
// the pointer is. `energy` is the scene's measure of that movement: under 2 the points are only
// settling (silence), a sweep of the mouse is about 4 to 25.
let lastDust = -Infinity;
export function dust(energy, x, y) {
  const s = rig();
  if (!s) return;
  const t = s.ctx.currentTime;
  const rate = Math.min(22, energy * 1.1);
  if (rate < 2 || t - lastDust < 1 / rate) return;
  lastDust = t;
  glass(s, at(s, { x, y, z: rand(-0.5, 0.5), wet: 0.55 }), t, note(Math.floor(rand(0, 10)), 6), {
    len: rand(0.18, 0.45), gain: Math.min(0.03, 0.01 + energy * 0.001), bright: rand(0.8, 2.4),
  });
}

// ---- the flight ---------------------------------------------------------------------------------

// Scroll fast and the stars streak: the wind of it, and an engine note that climbs with speed.
// `streak` is the scene's own measure of speed, 0 to 0.35.
let wind = null;
let windAt = -Infinity;
export function flight(streak) {
  const s = rig();
  if (!s) return;
  const { ctx } = s;
  const t = ctx.currentTime;
  if (t - windAt < 0.05) return;
  windAt = t;
  if (!wind) {
    if (streak < 0.01) return;
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const hiss = ctx.createGain();
    const engine = ctx.createOscillator();
    const hum = ctx.createGain();
    const out = ctx.createGain();
    const send = ctx.createGain();
    src.buffer = s.noise;
    src.loop = true;
    filter.type = 'bandpass';
    filter.Q.value = 0.9;
    filter.frequency.value = 300;
    hiss.gain.value = 0;
    engine.type = 'triangle';
    engine.frequency.value = 55;
    hum.gain.value = 0;
    send.gain.value = 0.3;
    src.connect(filter).connect(hiss).connect(out);
    engine.connect(hum).connect(out);
    out.connect(s.dry);
    out.connect(send).connect(s.verb);
    src.start();
    engine.start();
    wind = { src, engine, filter, hiss, hum, out };
  }
  wind.filter.frequency.setTargetAtTime(220 + streak * 9000, t, 0.08);
  wind.hiss.gain.setTargetAtTime(Math.min(0.09, streak * 0.3), t, 0.12);
  wind.engine.frequency.setTargetAtTime(55 * (1 + streak * 2.5), t, 0.2);
  wind.hum.gain.setTargetAtTime(Math.min(0.05, streak * 0.14), t, 0.2);
}

// A jump to hyperspace (a new plan): the floor drops, everything rushes up, and you arrive.
export function hyperspace() {
  const s = rig();
  if (!s) return;
  const t = s.ctx.currentTime + 0.02;
  const mid = at(s, { wet: 0.5 });
  glide(s, mid, t, 110, 30, { len: 1.3, gain: 0.14, attack: 0.02 });
  glide(s, mid, t + 0.1, note(0, 2), note(0, 6), { len: 1.25, gain: 0.03, type: 'sawtooth', attack: 1 });
  air(s, mid, t, { from: 200, to: 9000, len: 1.5, gain: 0.09, q: 1.2, attack: 1.15 });
  for (const [i, step] of [0, 4, 8, 13].entries()) glass(s, at(s, { x: 0.5 + (i - 1.5) * 0.2, wet: 0.6 }), t + 1.3 + i * 0.05, note(step, 5), { len: 2.4, gain: 0.03, bright: 1.6 });
}

// ---- each project's object, assembling out of dust the first time it's seen -------------------

const OBJECTS = {
  // WorkshopOS: three cages of seven rings lock in, deep to high; each of the 21 rings clicks
  // home, faster and faster; then the core of 49 models settles with one bright ping.
  machine(s, x, y, t) {
    const mid = at(s, { x, y, wet: 0.45 });
    [note(0, 2), note(4, 2), note(0, 3)].forEach((f, i) => glass(s, mid, t + i * 0.45, f, { len: 2.4, gain: 0.05, ratio: 1.414, bright: 1.6, attack: 0.02 }));
    const rings = cloud(s, 5, { x, y, spread: 0.15, wet: 0.3 });
    for (let r = 0; r < 21; r++) {
      const when = t + 0.1 + 1.65 * (1 - (1 - r / 20) ** 1.6);
      glass(s, rings[r % 5], when, 2400 + r * 140, { len: 0.05, gain: 0.018, ratio: 1.414, bright: 3 });
    }
    glide(s, mid, t + 1.85, 90, 50, { len: 0.6, gain: 0.1, attack: 0.01 });
    glass(s, mid, t + 1.85, note(0, 6), { len: 1.6, gain: 0.03, bright: 1.5 });
  },
  // Word Hunt: 71 letters rain onto the sphere, 10 players circle it, and one letter, the
  // secret one, rings on its own, on the one note that is Lydian's alone.
  letters(s, x, y, t) {
    const sphere = cloud(s, 6, { x, y, spread: 0.12, wet: 0.4 });
    for (let i = 0; i < 71; i++) glass(s, pick(sphere), t + rand(0, 1.5), note(pick(PENTA), 6), { len: 0.12, gain: 0.008, bright: 2.5 });
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 3;
      glass(s, at(s, { x: x + Math.cos(a) * 0.16, y, z: Math.sin(a) * 1.5, wet: 0.45 }), t + 0.3 + i * 0.13, note(i, 5), { len: 0.5, gain: 0.03, bright: 1.2 });
    }
    glass(s, at(s, { x, y, wet: 0.7 }), t + 1.75, note(3, 6), { len: 2.6, gain: 0.045, bright: 1 });
  },
  // PhysioCoach: it breathes in, its two shells (its two languages) swell an octave apart, and
  // the 10-second hold begins.
  breath(s, x, y, t) {
    const mid = at(s, { x, y, wet: 0.5 });
    air(s, mid, t, { from: 400, to: 2400, len: 2.2, gain: 0.07, q: 0.7, attack: 1.7, type: 'lowpass' });
    pad(s, mid, t + 0.2, [note(4, 3), note(4, 4)], { len: 3.2, gain: 0.06, attack: 1.6, cutoff: 1400 });
    glass(s, mid, t + 1.9, note(4, 5), { len: 2, gain: 0.035, bright: 0.8 });
  },
  // Catering: ten orbits, a note each, going round you; its 24 modules glint; the 6 apps at the
  // centre sound together.
  party(s, x, y, t) {
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      glass(s, at(s, { x: x + Math.cos(a) * 0.18, y, z: Math.sin(a) * 1.5, wet: 0.45 }), t + i * 0.12, note(i, 4), { len: 0.9, gain: 0.03, bright: 1.4 });
    }
    const modules = cloud(s, 6, { x, y, spread: 0.15, wet: 0.6 });
    for (let i = 0; i < 24; i++) glass(s, pick(modules), t + rand(0.2, 1.6), note(pick(PENTA), 6), { len: 0.1, gain: 0.008, bright: 2 });
    const mid = at(s, { x, y, wet: 0.5 });
    for (const step of [0, 2, 4, 6, 8, 10]) glass(s, mid, t + 1.6, note(step, 4), { len: 2.4, gain: 0.018, bright: 1 });
  },
};

export function object(kind, x, y) {
  const s = rig();
  if (s && OBJECTS[kind]) OBJECTS[kind](s, x, y, s.ctx.currentTime + 0.03);
}

// ---- the night sky --------------------------------------------------------------------------------

// The constellations draw themselves in: each project's line sings its note and climbs an octave
// as it goes, with a glint as it reaches stars along the way.
export function chart(x, y) {
  const s = rig();
  if (!s) return;
  const t = s.ctx.currentTime + 0.03;
  for (const [i, p] of Object.keys(NOTE).entries()) {
    const start = t + i * 0.25;
    const line = at(s, { x: x + (i - 1.5) * 0.15, y, wet: 0.55 });
    glide(s, line, start, note(NOTE[p], 4), note(NOTE[p], 5), { len: 2.6, gain: 0.025, attack: 0.4 });
    for (let k = 0; k < 4; k++) glass(s, line, start + rand(0.3, 2.4), note(NOTE[p], 6), { len: 0.5, gain: 0.012, bright: 1.5 });
  }
}

// A star sings the chord of the projects it's in: Python, in all four, is the whole chord.
// Pinning it adds the low note under it.
let lastStar = -Infinity;
export function star(projects, x, y, { pinned = false } = {}) {
  const s = rig();
  if (!s) return;
  const t = s.ctx.currentTime;
  if (t - lastStar < 0.07 && !pinned) return;
  lastStar = t;
  const here = at(s, { x, y, wet: 0.55 });
  const gain = 0.04 / Math.sqrt(projects.length); // one note or four, about as loud
  projects.forEach((p, i) => glass(s, here, t + i * 0.035, note(NOTE[p], 5), { len: 1.6, gain, bright: 1.3 }));
  if (pinned) glass(s, here, t, note(NOTE[projects[0]], 3), { len: 1.4, gain: 0.03, ratio: 2, bright: 0.8 });
}

// "Play a day": a chord that opens up as the sun climbs and closes at night, with a chime as
// the sun comes up and another, falling, as it goes down. `from` is the hour it starts at.
export function day(from, seconds) {
  const s = rig();
  if (!s) return;
  const t = s.ctx.currentTime + 0.05;
  const here = at(s, { y: 0.1, wet: 0.5 });
  const sun = (k) => Math.sin(((((from + k * 24) % 24) - 6) / 12) * Math.PI);
  const curve = new Float32Array(90).map((_, i) => 260 + Math.max(0, sun(i / 89)) ** 0.8 * 3800);
  const filter = pad(s, here, t, [note(0, 3), note(4, 3), note(2, 4), note(6, 4), note(1, 5)], { len: seconds + 1.2, gain: 0.045, attack: 0.6, cutoff: curve[0] });
  filter.frequency.setValueCurveAtTime(curve, t, seconds);
  for (let i = 1; i <= 240; i++) {
    const before = sun((i - 1) / 240);
    const after = sun(i / 240);
    const when = t + (i / 240) * seconds;
    if (before < 0 && after >= 0) [0, 4, 7].forEach((step, k) => glass(s, at(s, { x: 0.2, y: 0.15, wet: 0.6 }), when + k * 0.09, note(step, 5), { len: 1.6, gain: 0.025, bright: 1.2 }));
    if (before >= 0 && after < 0) [7, 4, 0].forEach((step, k) => glass(s, at(s, { x: 0.8, y: 0.15, wet: 0.6 }), when + k * 0.09, note(step, 5), { len: 1.6, gain: 0.025, bright: 1.2 }));
  }
}

// ---- the plan ---------------------------------------------------------------------------------------

// The limit notice rises out of the time machine: two soft notes, then a tone that drains away
// with the bar.
export function limit() {
  const s = rig();
  if (!s) return;
  const t = s.ctx.currentTime + 0.02;
  const here = at(s, { y: 0.95, wet: 0.45 });
  glass(s, here, t, note(6, 5), { len: 0.9, gain: 0.03, bright: 1 });
  glass(s, here, t + 0.14, note(4, 5), { len: 1.2, gain: 0.03, bright: 1 });
  glide(s, here, t + 0.15, note(4, 4), note(4, 3), { len: 1.25, gain: 0.03, type: 'triangle', attack: 0.1 });
}

// ---- leaving 2030 -------------------------------------------------------------------------------------

// Everything still ringing fades out together; the next visit builds a fresh space.
export function stop() {
  if (!space) return;
  const t = space.ctx.currentTime;
  space.bus.gain.setTargetAtTime(0, t, 0.12);
  wind?.src.stop(t + 0.8);
  wind?.engine.stop(t + 0.8);
  wind = null;
  space = null;
}
