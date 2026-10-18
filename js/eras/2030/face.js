// 2030: Irshad's Agent's face, a globe of light. css/eras/2030.css gives it a soft orb to stand
// in until this arrives; this draws the globe in every face on the page (its button, and beside
// its name): points of light along its lines of latitude, turning, the near side bright and the
// far side faint. It spins up and ripples while the AI answers, and turns slowly,
// in gold, while it rests. With reduced motion it holds still.

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const TILT = 0.38; // the globe leans its top toward the visitor (radians)
const SPEED = { idle: 0.45, busy: 2.6, resting: 0.12 }; // turns, in radians a second
// Light along the longitudes, in the 2030 colours (ice, mint, ice, rose), and gold for resting.
const HUES = [[159, 232, 255], [157, 255, 214], [159, 232, 255], [255, 143, 184]];
const GOLD = [255, 210, 138];

// Seven lines of latitude, with fewer points toward the poles.
const POINTS = [];
for (const lat of [-66, -44, -22, 0, 22, 44, 66]) {
  const phi = (lat * Math.PI) / 180;
  const n = Math.round(14 * Math.cos(phi));
  for (let k = 0; k < n; k++) POINTS.push([phi, (k / n) * Math.PI * 2 + lat / 20]);
}

let faces = [];
let frame = 0;
let last = 0;

// The colour at a longitude: the four hues blend around the globe.
function hueAt(lon) {
  const turn = (((lon / (Math.PI * 2)) % 1) + 1) % 1;
  const at = turn * HUES.length;
  const from = HUES[Math.floor(at)];
  const to = HUES[(Math.floor(at) + 1) % HUES.length];
  const f = at % 1;
  return from.map((c, i) => Math.round(c + (to[i] - c) * f));
}

function draw({ el, canvas, ctx, angle }, now, busy, resting) {
  const size = canvas.clientWidth;
  if (!size) return; // hidden: nothing to draw
  const box = canvas.getBoundingClientRect();
  if (box.bottom < 0 || box.top > innerHeight) return;
  const px = Math.round(size * Math.min(devicePixelRatio || 1, 3));
  if (canvas.width !== px) canvas.width = canvas.height = px;

  const mid = px / 2;
  const radius = px * 0.42;
  const t = now / 1000;
  ctx.clearRect(0, 0, px, px);
  ctx.globalCompositeOperation = 'lighter';
  for (const [phi, lon] of POINTS) {
    const turned = lon + angle;
    const x = Math.cos(phi) * Math.sin(turned);
    const y = Math.sin(phi);
    const z = Math.cos(phi) * Math.cos(turned);
    const up = y * Math.cos(TILT) - z * Math.sin(TILT);
    const near = (y * Math.sin(TILT) + z * Math.cos(TILT) + 1) / 2; // 0 far side … 1 near side
    const ripple = busy ? 1 + 0.08 * Math.sin(t * 7 + phi * 4 + lon * 2) : 1;
    const [r, g, b] = resting ? GOLD : hueAt(lon);
    ctx.fillStyle = `rgb(${r} ${g} ${b} / ${0.1 + 0.9 * near ** 1.6})`;
    ctx.beginPath();
    ctx.arc(mid + x * radius * ripple, mid - up * radius * ripple, Math.max(0.6, px * (0.016 + 0.026 * near)), 0, Math.PI * 2);
    ctx.fill();
  }
}

function tick(now) {
  frame = requestAnimationFrame(tick);
  // About 30 frames a second is plenty for something this small. Held still, it only looks twice
  // a second, for a rest that starts or ends.
  if (now - last < (reduced.matches ? 500 : 32)) return;
  const seconds = Math.min(0.1, (now - last) / 1000);
  last = now;
  for (const face of faces) {
    const panel = face.el.closest('.agent');
    const resting = Boolean(panel?.hasAttribute('data-resting'));
    const busy = !resting && Boolean(panel?.querySelector('.agent__form.is-busy'));
    if (!reduced.matches) face.angle += seconds * SPEED[resting ? 'resting' : busy ? 'busy' : 'idle'];
    draw(face, now, busy, resting);
  }
}

export function startFace() {
  stopFace();
  for (const el of document.querySelectorAll('.agent-face')) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return stopFace(); // no canvas: the soft orb stays
    el.prepend(canvas);
    faces.push({ el, canvas, ctx, angle: Math.random() * Math.PI * 2 });
  }
  frame = requestAnimationFrame(tick);
}

export function stopFace() {
  cancelAnimationFrame(frame);
  for (const { canvas } of faces) canvas.remove();
  faces = [];
}
