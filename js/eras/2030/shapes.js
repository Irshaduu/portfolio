// Geometry for the 2030 scene. Everything is a cloud of points, and each project's cloud is
// built from that project's own numbers. Seeded, so every visitor sees the same shapes.
//
// Each point is eight floats, which the object shader reads as two vec4s (a0, a1). What they
// mean depends on the shape; a1.z is always a random seed and a1.w the point size in CSS px.

const TAU = Math.PI * 2;

function seeded(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Point i of n, spread evenly over a unit sphere.
function fibonacci(i, n) {
  const y = 1 - (2 * (i + 0.5)) / n;
  const r = Math.sqrt(1 - y * y);
  const a = i * 2.399963229728653;
  return [Math.cos(a) * r, y, Math.sin(a) * r];
}

// WorkshopOS: its 21 rule modules are 21 rings in three nested cages, its 72 transaction
// blocks are beads riding the rings, and its 49 models sit together at the core.
// a0 = (angle, radius, ring, type: 0 ring, 1 bead, 2 core), a1 = (yaw, pitch, seed, size)
function machine() {
  const rand = seeded(49);
  const out = [];
  const rings = [];
  for (let r = 0; r < 21; r++) {
    const radius = [1, 0.8, 0.6][Math.floor(r / 7)];
    const ring = { radius, yaw: rand() * TAU, pitch: (rand() - 0.5) * Math.PI };
    rings.push(ring);
    const n = Math.round(300 * radius);
    for (let i = 0; i < n; i++) out.push((i / n) * TAU, radius, r, 0, ring.yaw, ring.pitch, rand(), 1 + rand() * 0.7);
  }
  for (let b = 0; b < 72; b++) {
    const r = b % 21;
    const { radius, yaw, pitch } = rings[r];
    out.push(rand() * TAU, radius, r, 1, yaw, pitch, rand(), 3 + rand() * 1.2);
  }
  for (let c = 0; c < 49; c++) {
    const [x, y, z] = fibonacci(c, 49);
    const k = 0.17 + rand() * 0.08;
    out.push(x * k, y * k, z * k, 2, 0, 0, rand(), 2.4 + rand() * 1.6);
  }
  return new Float32Array(out);
}

// Letters are sampled from the font into small point grids, once per letter.
const glyphs = new Map();
let glyphCanvas = null;

function glyph(ch) {
  if (glyphs.has(ch)) return glyphs.get(ch);
  const S = 36;
  glyphCanvas ??= Object.assign(document.createElement('canvas'), { width: S, height: S });
  const g = glyphCanvas.getContext('2d', { willReadFrequently: true });
  g.clearRect(0, 0, S, S);
  g.fillStyle = '#fff';
  g.font = `500 ${S * 0.8}px "Geist Mono", ui-monospace, monospace`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(ch, S / 2, S / 2 + S * 0.04);
  const { data } = g.getImageData(0, 0, S, S);
  let pts = [];
  for (let y = 0; y < S; y += 2) {
    for (let x = 0; x < S; x += 2) if (data[(y * S + x) * 4 + 3] > 120) pts.push([x / S - 0.5, 0.5 - y / S]);
  }
  if (pts.length > 30) pts = pts.filter((_, i) => i % Math.ceil(pts.length / 30) === 0);
  glyphs.set(ch, pts);
  return pts;
}

// Word Hunt: a board of 71 letters wrapped round a sphere. One glows: the secret word
// everyone is hunting. Ten players circle it.
// letters: a0 = (direction, secret), a1 = (u, v, seed, size)
// players: a0 = (inclination, phase, speed, 2), a1 = (trail step, 0, seed, size)
function letters() {
  const rand = seeded(71);
  const pool = 'WORDHUNTSECRETBOARDTIMEBANKROOMCODEPLAYERSGUESSVOICECALLFRIENDS';
  const out = [];
  const secret = 23;
  for (let i = 0; i < 71; i++) {
    const [x, y, z] = fibonacci(i, 71);
    for (const [u, v] of glyph(pool[Math.floor(rand() * pool.length)])) {
      out.push(x, y, z, i === secret ? 1 : 0, u, v, rand(), 1.3 + rand() * 0.5);
    }
  }
  for (let p = 0; p < 10; p++) {
    const incl = (rand() - 0.5) * 2.4;
    const phase = rand() * TAU;
    const speed = (0.3 + rand() * 0.35) * (p % 2 ? 1 : -1);
    for (let k = 0; k < 9; k++) out.push(incl, phase, speed, 2, k, 0, rand(), 3.4 - k * 0.25);
  }
  return new Float32Array(out);
}

// PhysioCoach: a shape that breathes, with a shell for each of its two languages, and the ten
// dots of the 10-second hold it counts out loud.
// shells: a0 = (direction, 0), a1 = (shell, 0, seed, size)
// count dots: a0 = (dot, 0, 0, 1), a1 = (offset x, offset y, seed, size)
function breath() {
  const rand = seeded(215);
  const out = [];
  for (let i = 0; i < 1300; i++) out.push(...fibonacci(i, 1300), 0, 0, 0, rand(), 1.1 + rand() * 0.8);
  for (let i = 0; i < 520; i++) out.push(...fibonacci(i, 520), 0, 1, 0, rand(), 1 + rand() * 0.6);
  for (let d = 0; d < 10; d++) {
    for (let k = 0; k < 14; k++) {
      const a = rand() * TAU;
      const r = Math.sqrt(rand()) * 0.035;
      out.push(d, 0, 0, 1, Math.cos(a) * r, Math.sin(a) * r, rand(), 2 + rand());
    }
  }
  return new Float32Array(out);
}

// Catering: its 10 staff roles are 10 orbits, its 24 modules are bright beads trailing
// light round them, and its 6 Django apps turn at the centre.
// beads and trails: a0 = (orbit, phase, trail offset, type: 1 bead, 0 trail), a1 = (bead, 0, seed, size)
// centre: a0 = (app, 0, 0, 2)
function party() {
  const rand = seeded(24);
  const out = [];
  for (let b = 0; b < 24; b++) {
    const orbit = b % 10;
    const phase = rand() * TAU;
    out.push(orbit, phase, 0, 1, b, 0, rand(), 3.6);
    for (let k = 1; k <= 34; k++) out.push(orbit, phase, k * 0.032, 0, b, 0, rand(), 1.7);
  }
  for (let a = 0; a < 6; a++) out.push(a, 0, 0, 2, 0, 0, rand(), 3.2);
  return new Float32Array(out);
}

// Irshad's Agent: its 4 AI models are 4 nested shells. One speaks while the others wait, then
// rests and hands over to the next, as the chain does. Its 8 costumes circle it, one for each
// era, and its 133 tests sit at the core.
// shells: a0 = (direction, 0), a1 = (shell, 0, seed, size)
// costumes: a0 = (era, phase, 0, 1), a1 = (trail step, 0, seed, size)
// tests: a0 = (position, 2)
function chain() {
  const rand = seeded(133);
  const out = [];
  [560, 430, 320, 230].forEach((n, shell) => {
    for (let i = 0; i < n; i++) out.push(...fibonacci(i, n), 0, shell, 0, rand(), 1 + rand() * 0.6);
  });
  for (let era = 0; era < 8; era++) {
    const phase = rand() * TAU;
    for (let k = 0; k < 10; k++) out.push(era, phase, 0, 1, k, 0, rand(), 3.2 - k * 0.22);
  }
  for (let c = 0; c < 133; c++) {
    const [x, y, z] = fibonacci(c, 133);
    const k = 0.12 + rand() * 0.07;
    out.push(x * k, y * k, z * k, 2, 0, 0, rand(), 1.4 + rand() * 0.9);
  }
  return new Float32Array(out);
}

export const SHAPES = { machine, letters, breath, party, chain };

// The starfield: n stars, two vertices each (head and tail, for streaks at speed).
// Per vertex: x, y (spread across the screen), depth slot (0..1), seed, end (0 head, 1 tail).
export function stars(n) {
  const rand = seeded(1992);
  const out = new Float32Array(n * 2 * 5);
  for (let i = 0; i < n; i++) {
    let x;
    let y;
    do {
      x = rand() * 2 - 1;
      y = rand() * 2 - 1;
    } while (x * x + y * y < 0.003); // keep the vanishing point clear
    const z = rand();
    const seed = rand();
    out.set([x, y, z, seed, 0, x, y, z, seed, 1], i * 10);
  }
  return out;
}
