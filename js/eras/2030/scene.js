// The 2030 scene: one WebGL2 canvas behind the page, drawing three things.
//   The name: thousands of points that fly in from deep space, then part around the pointer
//   (or a finger) and flow back.
//   A starfield you fly through as you scroll.
//   An object for each project, built from that project's own numbers (shapes.js), placed
//   wherever the CSS puts that project's empty .orb element.
// The text stays real HTML on top; this only paints scenery. Without WebGL2 the page keeps
// its CSS fallback and nothing here runs.

import { SHAPES, stars } from './shapes.js';
import * as audio from './audio.js';

const root = document.documentElement;
const KIND = { machine: 0, letters: 1, breath: 2, party: 3 };

const small = matchMedia('(max-width: 760px)').matches;
const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
const NAME_MAX = small || weak ? 5000 : 11000;
const STAR_COUNT = small ? 700 : 1500;

// ---- shaders ------------------------------------------------------------------------------

const POINT_FS = `#version 300 es
precision mediump float;
in vec4 vColor;
uniform highp float uLine; // shared with the star shader, so the precisions must match
out vec4 outColor;
void main() {
  float a = vColor.a;
  if (uLine < 0.5) {
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    float d = dot(c, c);
    if (d > 1.0) discard;
    a *= 1.0 - smoothstep(0.2, 1.0, d);
  }
  outColor = vec4(vColor.rgb * a, a);
}`;

// The 2030 palette as one loop: ice, mint, gold, rose.
const HOLO = `
vec3 holo(float t) {
  t = fract(t) * 4.0;
  vec3 ice = vec3(0.62, 0.91, 1.0), mint = vec3(0.62, 1.0, 0.84);
  vec3 gold = vec3(1.0, 0.82, 0.54), rose = vec3(1.0, 0.56, 0.72);
  if (t < 1.0) return mix(ice, mint, t);
  if (t < 2.0) return mix(mint, gold, t - 1.0);
  if (t < 3.0) return mix(gold, rose, t - 2.0);
  return mix(rose, ice, t - 3.0);
}`;

const STAR_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec4 aStar;
layout(location = 1) in float aEnd;
uniform float uDpr, uCam, uStreak, uTime, uLine, uLight;
out vec4 vColor;
void main() {
  float z = fract(aStar.z - uCam);
  if (uLine < 0.5 && aEnd > 0.5) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); vColor = vec4(0.0); return; }
  float depth = max(z + aEnd * uStreak, 0.02);
  gl_Position = vec4(aStar.xy * 1.1 / depth, 0.0, 1.0);
  gl_PointSize = mix(3.2, 0.8, z) * uDpr;
  float fade = smoothstep(1.0, 0.55, z) * smoothstep(0.0, 0.06, z);
  float twinkle = 0.7 + 0.3 * sin(uTime * (1.0 + aStar.w * 2.0) + aStar.w * 60.0);
  vec3 tint = aStar.w > 0.92 ? vec3(1.0, 0.85, 0.62) : aStar.w > 0.84 ? vec3(0.7, 1.0, 0.9) : vec3(0.78, 0.86, 1.0);
  float a = fade * twinkle * mix(1.0, 0.4, z) * uLight;
  if (uLine > 0.5) a *= clamp(uStreak * 10.0, 0.0, 0.9);
  vColor = vec4(tint, a);
}`;

const NAME_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec3 aPos;   // px from the heading's corner; z < 0 is away from you
layout(location = 1) in vec4 aInfo;  // position across the name (0..1), line, seed, size
uniform vec2 uView, uOrigin;
uniform float uDpr, uTime;
out vec4 vColor;
${HOLO}
void main() {
  float s = aInfo.z;
  vec2 drift = vec2(sin(uTime * 0.9 + s * 40.0), cos(uTime * 0.7 + s * 31.0)) * 0.55;
  vec2 c = uView * 0.5;
  float persp = 900.0 / (900.0 - aPos.z);
  vec2 screen = c + (uOrigin + aPos.xy + drift - c) * persp;
  gl_Position = vec4((screen / uView * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
  gl_PointSize = aInfo.w * uDpr * clamp(persp, 0.25, 3.0);
  vec3 iris = holo(aInfo.x * 0.8 - uTime * 0.04);
  vec3 col = mix(vec3(0.93, 0.95, 1.0), iris, 0.12 + aInfo.y * 0.8);
  float shimmer = 0.6 + 0.4 * sin(uTime * 1.7 + s * 90.0 + aInfo.x * 8.0);
  float far = smoothstep(-2600.0, -300.0, aPos.z);
  vColor = vec4(col, (0.62 + 0.3 * shimmer) * mix(0.25, 1.0, far));
}`;

const OBJECT_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec4 a0;
layout(location = 1) in vec4 a1;
uniform int uKind;
uniform vec2 uView, uCenter, uTilt;
uniform float uRadius, uDpr, uTime, uFocus, uBuild;
out vec4 vColor;
const float TAU = 6.28318530718;
mat3 rotX(float a) { float c = cos(a), s = sin(a); return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c); }
mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c); }
vec3 hash3(float n) { return fract(sin(vec3(n, n + 1.7, n + 3.1)) * 43758.5453); }
void main() {
  vec3 p;
  vec3 col;
  float alpha;
  float size = a1.w * 1.35;
  float t = uTime;

  if (uKind == 0) {
    // WorkshopOS: rings, beads riding them, and the core.
    if (a0.w < 1.5) {
      float group = floor(a0.z / 7.0);
      float spin = (0.12 + 0.035 * mod(a0.z, 7.0)) * (mod(group, 2.0) < 0.5 ? 1.0 : -1.0);
      float ang = a0.x + t * spin * (1.0 + a0.w * 2.5);
      p = rotY(a1.x) * rotX(a1.y) * vec3(cos(ang), sin(ang), 0.0) * a0.y;
      col = mix(vec3(1.0, 0.76, 0.42), vec3(0.62, 0.95, 1.0), a0.w);
      alpha = mix(0.85, 1.0, a0.w);
    } else {
      float pulse = 0.5 + 0.5 * sin(t * 2.0 + a1.z * TAU);
      p = a0.xyz * (1.0 + 0.1 * pulse);
      col = mix(vec3(1.0, 0.82, 0.55), vec3(1.0), pulse);
      alpha = 0.55 + 0.45 * pulse;
    }
    p = rotY(t * 0.1) * rotX(0.35) * p;
  } else if (uKind == 1) {
    // Word Hunt: letters on a sphere, one secret, players circling.
    if (a0.w < 1.5) {
      vec3 n = a0.xyz;
      vec3 east = normalize(cross(vec3(0.0, 1.0, 0.0), n) + vec3(1e-4, 0.0, 0.0));
      vec3 north = cross(n, east);
      p = n + (east * a1.x + north * a1.y) * 0.2;
      float glow = 0.55 + 0.45 * sin(t * 3.0);
      col = mix(vec3(0.75, 0.9, 1.0), vec3(1.0, 0.42, 0.7), a0.w);
      alpha = mix(0.9, glow, a0.w);
      size *= 1.0 + a0.w * 0.6;
    } else {
      float ang = a0.y + t * a0.z - a1.x * 0.07 * sign(a0.z);
      p = rotX(a0.x) * vec3(cos(ang), 0.0, sin(ang)) * 1.34;
      col = vec3(1.0, 0.9, 0.7);
      alpha = 1.0 - a1.x / 9.0;
    }
    p = rotY(t * 0.16) * rotX(0.3) * p;
  } else if (uKind == 2) {
    // PhysioCoach: breathe in while it counts the hold, then let go.
    float phase = mod(t, 12.0);
    float hold = phase < 10.0 ? phase / 10.0 : 1.0 - (phase - 10.0) / 2.0;
    hold = smoothstep(0.0, 1.0, hold);
    if (a0.w < 0.5) {
      vec3 n = a0.xyz;
      float wob = sin(n.x * 3.1 + t * 0.7) * sin(n.y * 2.7 + t * 0.5) * sin(n.z * 3.3 + t * 0.6);
      p = n * mix(1.0, 0.66, a1.x) * (0.84 + 0.14 * hold) * (1.0 + 0.12 * wob);
      p = rotY(t * 0.08) * p;
      col = mix(vec3(0.6, 1.0, 0.86), vec3(1.0, 0.8, 0.62), a1.x);
      alpha = 0.72;
    } else {
      float ang = TAU * (0.25 - a0.x / 10.0); // from the top, clockwise
      p = vec3(cos(ang), sin(ang), 0.0) * 1.42 + vec3(a1.xy, 0.0);
      float lit = phase < 10.0 ? step(a0.x, floor(phase)) : 1.0 - (phase - 10.0) / 2.0;
      col = vec3(1.0, 0.95, 0.85);
      alpha = 0.1 + 0.9 * lit;
    }
  } else {
    // Catering: beads and their trails on ten orbits, six apps at the centre.
    if (a0.w < 1.5) {
      float radius = 0.42 + a0.x * 0.064;
      float incl = (fract(a0.x * 0.618) - 0.5) * 1.5;
      float ang = a0.y + t * (0.5 / radius) - a0.z;
      p = rotY(a0.x * 2.399) * rotX(incl) * vec3(cos(ang), 0.0, sin(ang)) * radius;
      float k = mod(a1.x, 4.0);
      col = k < 0.5 ? vec3(1.0, 0.8, 0.45) : k < 1.5 ? vec3(1.0, 0.5, 0.72) : k < 2.5 ? vec3(1.0, 0.62, 0.36) : vec3(1.0, 0.94, 0.84);
      float trail = a0.z / 1.1;
      alpha = a0.w > 0.5 ? 1.0 : pow(1.0 - trail, 1.6) * 0.95;
      size *= a0.w > 0.5 ? 1.0 : 1.0 - trail * 0.6;
    } else {
      float ang = a0.x * TAU / 6.0 + t * 0.4;
      p = vec3(cos(ang), 0.0, sin(ang)) * 0.15;
      col = vec3(1.0);
      alpha = 0.9;
    }
    p = rotX(0.62) * rotY(t * 0.05) * p;
  }

  // Lean toward the visitor, then assemble out of scattered dust the first time it's seen.
  p = rotX(uTilt.y) * rotY(uTilt.x) * p;
  float b = clamp(uBuild * 1.6 - a1.z * 0.6, 0.0, 1.0);
  b = b * b * (3.0 - 2.0 * b);
  p = mix((hash3(a1.z * 97.0) - 0.5) * 5.0, p, b);

  float persp = 1.0 / (1.0 - p.z * 0.3);
  vec2 screen = uCenter + vec2(p.x, -p.y) * uRadius * persp;
  gl_Position = vec4((screen / uView * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
  gl_PointSize = max(1.0, size * uDpr * persp * (0.75 + 0.25 * uFocus));
  float depthFade = 0.4 + 0.6 * smoothstep(-1.2, 1.0, p.z);
  vColor = vec4(col, alpha * depthFade * mix(0.35, 1.0, uFocus) * (0.25 + 0.75 * b));
}`;

// ---- WebGL plumbing ---------------------------------------------------------------------------

let canvas = null;
let gl = null;
let broken = false;
let P = null;
let starMesh = null;
const meshes = new Map();
let nameGL = null;

function program(vsSource) {
  const prog = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER, vsSource], [gl.FRAGMENT_SHADER, POINT_FS]]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    gl.attachShader(prog, shader);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  const u = {};
  for (let i = 0; i < gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS); i++) {
    const { name } = gl.getActiveUniform(prog, i);
    u[name] = gl.getUniformLocation(prog, name);
  }
  return { prog, u };
}

// An interleaved, static vertex array. layout: [[location, floats], ...]
function mesh(data, layout) {
  const va = gl.createVertexArray();
  gl.bindVertexArray(va);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  const floats = layout.reduce((sum, [, n]) => sum + n, 0);
  let offset = 0;
  for (const [loc, n] of layout) {
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, n, gl.FLOAT, false, floats * 4, offset);
    offset += n * 4;
  }
  gl.bindVertexArray(null);
  return { va, count: data.length / floats };
}

function init() {
  canvas = document.createElement('canvas');
  canvas.className = 'stage';
  document.querySelector('.backdrop').append(canvas);
  gl = canvas.getContext('webgl2', { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true });
  if (!gl) return false;
  try {
    P = { stars: program(STAR_VS), name: program(NAME_VS), object: program(OBJECT_VS) };
  } catch (err) {
    console.error('2030 scene: shader failed', err);
    return false;
  }
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    broken = true;
    stopScene();
    root.dataset.gl = 'off';
  });

  starMesh = mesh(stars(STAR_COUNT), [[0, 4], [1, 1]]);
  for (const [kind, build] of Object.entries(SHAPES)) meshes.set(KIND[kind], mesh(build(), [[0, 4], [1, 4]]));

  const va = gl.createVertexArray();
  gl.bindVertexArray(va);
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, NAME_MAX * 12, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
  const infoBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, infoBuf);
  gl.bufferData(gl.ARRAY_BUFFER, NAME_MAX * 16, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  nameGL = { va, posBuf, infoBuf };

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE); // light adds up
  gl.clearColor(0, 0, 0, 0);
  return true;
}

// ---- the name, as particles --------------------------------------------------------------------

const name = {
  count: 0,
  pos: new Float32Array(NAME_MAX * 3),
  vel: new Float32Array(NAME_MAX * 3),
  target: new Float32Array(NAME_MAX * 2),
  info: new Float32Array(NAME_MAX * 4),
  delay: new Float32Array(NAME_MAX),
  w: 0,
  h: 0,
  start: 0,
  awake: true,
};
let nameEl = null;

// Draw the heading's text into a canvas exactly where the page lays it out, and pick points
// from its pixels. `arrive`: every point starts again from deep space.
function sampleName(box, arrive) {
  const W = Math.ceil(box.width);
  const H = Math.ceil(box.height);
  if (W < 10 || H < 10) return false;
  const lines = nameEl.querySelectorAll('.name__first, .name__last');
  const fontSize = parseFloat(getComputedStyle(lines[0]).fontSize);
  const scale = fontSize < 80 ? 2 : 1; // small type needs finer sampling
  const c = Object.assign(document.createElement('canvas'), { width: W * scale, height: H * scale });
  const g = c.getContext('2d', { willReadFrequently: true });
  g.scale(scale, scale);
  g.fillStyle = '#fff';

  const tops = [];
  for (const line of lines) {
    const cs = getComputedStyle(line);
    const r = line.getBoundingClientRect();
    g.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ('letterSpacing' in g) g.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
    // Only the line's own text: the 2007 "beta" badge lives inside it but is hidden here.
    const text = [...line.childNodes]
      .filter((n) => n.nodeType === Node.TEXT_NODE)
      .map((n) => n.textContent)
      .join('')
      .trim();
    const m = g.measureText(text);
    const size = parseFloat(cs.fontSize);
    const ascent = m.fontBoundingBoxAscent ?? size * 0.95;
    const descent = m.fontBoundingBoxDescent ?? size * 0.25;
    const lineHeight = parseFloat(cs.lineHeight) || r.height;
    const top = r.top - box.top;
    // CSS centres the font's ascent and descent inside the line box.
    g.fillText(text, r.left - box.left, top + (lineHeight - ascent - descent) / 2 + ascent);
    tops.push(top);
  }

  const { data } = g.getImageData(0, 0, c.width, c.height);
  const filled = [];
  for (let i = 3, p = 0; i < data.length; i += 4, p++) if (data[i] > 128) filled.push(p);
  if (!filled.length) return false;

  const count = Math.min(NAME_MAX, Math.max(1500, Math.round(filled.length / (scale * scale) / 2.2)));
  const size = Math.min(2.6, Math.max(1.6, fontSize / 50));
  const secondLine = tops[1] ?? Infinity;
  for (let i = 0; i < count; i++) {
    const p = filled[(Math.random() * filled.length) | 0];
    const tx = ((p % c.width) + Math.random()) / scale;
    const ty = (Math.floor(p / c.width) + Math.random()) / scale;
    name.target[i * 2] = tx;
    name.target[i * 2 + 1] = ty;
    name.info.set([tx / W, ty >= secondLine ? 1 : 0, Math.random(), size * (0.7 + Math.random() * 0.6)], i * 4);
    if (arrive || i >= name.count) {
      const j = i * 3;
      if (reduced) {
        name.pos.set([tx, ty, 0], j);
      } else {
        name.pos.set([tx + (Math.random() - 0.5) * view.w * 1.4, ty + (Math.random() - 0.5) * view.h * 1.4, -(300 + Math.random() * 2600)], j);
      }
      name.vel.fill(0, j, j + 3);
      name.delay[i] = Math.random() * 380 + (tx / W) * 420; // sweeps in left to right
    }
  }
  name.count = count;
  name.w = W;
  name.h = H;
  name.awake = true;
  gl.bindBuffer(gl.ARRAY_BUFFER, nameGL.infoBuf);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, name.info, 0, count * 4);
  uploadName();
  return true;
}

function uploadName() {
  gl.bindBuffer(gl.ARRAY_BUFFER, nameGL.posBuf);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, name.pos, 0, name.count * 3);
}

let resampleTimer = 0;
function scheduleResample() {
  clearTimeout(resampleTimer);
  resampleTimer = setTimeout(() => live && sampleName(nameEl.getBoundingClientRect(), false), 160);
}

// Springs pull each point home; the pointer pushes them aside and drags them along.
function stepName(dt, box) {
  const s = Math.min(dt / 16.667, 3);
  const k = 0.028 * s;
  const damp = 0.86 ** s;
  const { pos, vel, target, delay, count } = name;
  const R = pointer.radius;
  const R2 = R * R;
  const mx = pointer.x - box.left;
  const my = pointer.y - box.top;
  const push = pointer.active;
  const pvx = pointer.vx * 0.14;
  const pvy = pointer.vy * 0.14;
  const elapsed = performance.now() - name.start;
  let energy = 0;
  for (let i = 0; i < count; i++) {
    const j = i * 3;
    const x = pos[j];
    const y = pos[j + 1];
    const z = pos[j + 2];
    let vx = vel[j];
    let vy = vel[j + 1];
    let vz = vel[j + 2];
    if (elapsed > delay[i]) {
      vx += (target[i * 2] - x) * k;
      vy += (target[i * 2 + 1] - y) * k;
      vz -= z * k;
    }
    if (push > 0.01) {
      const dx = x - mx;
      const dy = y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < R2) {
        const d = Math.sqrt(d2) + 0.01;
        const q = 1 - d / R;
        const f = q * q * push * s;
        vx += ((dx / d) * 2.4 + pvx) * f;
        vy += ((dy / d) * 2.4 + pvy) * f;
        vz += 4 * f; // and toward you
      }
    }
    vx *= damp;
    vy *= damp;
    vz *= damp;
    pos[j] = x + vx * s;
    pos[j + 1] = y + vy * s;
    pos[j + 2] = Math.min(400, z + vz * s);
    vel[j] = vx;
    vel[j + 1] = vy;
    vel[j + 2] = vz;
    energy += Math.abs(vx) + Math.abs(vy) + Math.abs(vz);
  }
  return energy / Math.max(count, 1);
}

// ---- input --------------------------------------------------------------------------------------

const pointer = { x: -1e5, y: -1e5, vx: 0, vy: 0, active: 0, want: 0, mouse: false, radius: 100 };

function movePointer(x, y) {
  if (pointer.x > -1e4) {
    pointer.vx += (x - pointer.x - pointer.vx) * 0.5;
    pointer.vy += (y - pointer.y - pointer.vy) * 0.5;
  }
  pointer.x = x;
  pointer.y = y;
}
const onPointerMove = (event) => {
  if (event.pointerType === 'touch') return; // touches are tracked below, through scrolling too
  movePointer(event.clientX, event.clientY);
  pointer.mouse = true;
  pointer.want = 1;
  pointer.radius = 100;
};
const onPointerOut = (event) => {
  if (!event.relatedTarget) pointer.want = 0;
};
const onTouchStart = (event) => {
  const t = event.touches[0];
  pointer.x = t.clientX;
  pointer.y = t.clientY;
  pointer.vx = pointer.vy = 0;
  pointer.mouse = false;
  pointer.want = 1;
  pointer.radius = 70;
};
const onTouchMove = (event) => {
  const t = event.touches[0];
  if (t) movePointer(t.clientX, t.clientY);
};
const onTouchEnd = () => {
  pointer.want = 0;
};

// ---- the frame ------------------------------------------------------------------------------------

const view = { w: 0, h: 0, dpr: 1 };
const cam = { scroll: 0, drift: 0, value: 0, streak: 0 };
let starlight = 1; // daylight dims the stars (sky.js)
let orbs = [];
let live = false;
let reduced = false;
let raf = 0;
let pending = 0;
let last = 0;
let t0 = 0;
let quality = 1;
let slow = 0;

function resize() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const dpr = Math.min(devicePixelRatio || 1, small ? 2 : 1.5) * quality;
  if (w === view.w && h === view.h && dpr === view.dpr) return;
  Object.assign(view, { w, h, dpr });
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function render(now, dt) {
  resize();
  const s = dt / 16.667;
  const time = reduced ? 6 : (now - t0) / 1000;
  gl.clear(gl.COLOR_BUFFER_BIT);

  pointer.active += (pointer.want - pointer.active) * Math.min(1, 0.12 * s);
  pointer.vx *= 0.85 ** s;
  pointer.vy *= 0.85 ** s;

  // Stars: scrolling flies you forward; speed draws streaks.
  if (!reduced) {
    const before = cam.value;
    cam.scroll += (scrollY / 2600 - cam.scroll) * (1 - 0.86 ** s);
    cam.drift += dt * 0.000012;
    cam.value = cam.scroll + cam.drift;
    const speed = Math.abs(cam.value - before) / Math.max(s, 0.01);
    cam.streak += (Math.min(0.35, speed * 7) - cam.streak) * (1 - 0.8 ** s);
    audio.flight(cam.streak);
  }
  gl.useProgram(P.stars.prog);
  gl.uniform1f(P.stars.u.uDpr, view.dpr);
  gl.uniform1f(P.stars.u.uCam, cam.value % 1000);
  gl.uniform1f(P.stars.u.uStreak, cam.streak);
  gl.uniform1f(P.stars.u.uTime, time);
  gl.uniform1f(P.stars.u.uLight, starlight);
  gl.bindVertexArray(starMesh.va);
  gl.uniform1f(P.stars.u.uLine, 0);
  gl.drawArrays(gl.POINTS, 0, starMesh.count);
  if (cam.streak > 0.004) {
    gl.uniform1f(P.stars.u.uLine, 1);
    gl.drawArrays(gl.LINES, 0, starMesh.count);
  }

  // Objects, beside their projects.
  gl.useProgram(P.object.prog);
  gl.uniform2f(P.object.u.uView, view.w, view.h);
  gl.uniform1f(P.object.u.uDpr, view.dpr);
  gl.uniform1f(P.object.u.uTime, time);
  for (const orb of orbs) {
    const r = orb.el.getBoundingClientRect();
    if (!r.width) continue;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const radius = r.width * 0.42;
    if (cy + radius * 1.8 < 0 || cy - radius * 1.8 > view.h) continue;
    if (!orb.seen) {
      orb.seen = now;
      if (!reduced) audio.object(orb.el.dataset.orb, cx / view.w, cy / view.h); // it assembles; it sounds
    }
    const focus = 1 - Math.min(1, Math.abs(cy - view.h * 0.46) / (view.h * 0.7));
    orb.focus += (focus - orb.focus) * (reduced ? 1 : Math.min(1, 0.1 * s));
    const tx = pointer.mouse && !reduced ? Math.max(-0.5, Math.min(0.5, (pointer.x - cx) / view.w)) * 0.8 : 0;
    const ty = pointer.mouse && !reduced ? Math.max(-0.5, Math.min(0.5, (pointer.y - cy) / view.h)) * 0.6 : 0;
    orb.tx += (tx - orb.tx) * Math.min(1, 0.05 * s);
    orb.ty += (ty - orb.ty) * Math.min(1, 0.05 * s);
    const m = meshes.get(orb.kind);
    gl.uniform1i(P.object.u.uKind, orb.kind);
    gl.uniform2f(P.object.u.uCenter, cx, cy);
    gl.uniform2f(P.object.u.uTilt, orb.tx, orb.ty);
    gl.uniform1f(P.object.u.uRadius, radius);
    gl.uniform1f(P.object.u.uFocus, orb.focus);
    gl.uniform1f(P.object.u.uBuild, reduced ? 1 : Math.min(1, (now - orb.seen) / 1900));
    gl.bindVertexArray(m.va);
    gl.drawArrays(gl.POINTS, 0, m.count);
  }

  // The name.
  const box = nameEl.getBoundingClientRect();
  if (name.count && box.bottom > -150 && box.top < view.h + 150) {
    if (Math.abs(box.width - name.w) > 1.5 || Math.abs(box.height - name.h) > 1.5) scheduleResample();
    if (!reduced) {
      const R = pointer.radius;
      const lx = pointer.x - box.left;
      const ly = pointer.y - box.top;
      const near = pointer.active > 0.01 && lx > -R && lx < name.w + R && ly > -R && ly < name.h + R;
      if (name.awake || near) {
        const energy = stepName(dt, box);
        name.awake = near || energy > 0.03 || now - name.start < 2600;
        if (near && now - name.start > 2600) audio.dust(energy, pointer.x / view.w, pointer.y / view.h);        uploadName();
      }
    }
    gl.useProgram(P.name.prog);
    gl.uniform2f(P.name.u.uView, view.w, view.h);
    gl.uniform2f(P.name.u.uOrigin, box.left, box.top);
    gl.uniform1f(P.name.u.uDpr, view.dpr);
    gl.uniform1f(P.name.u.uTime, time);
    gl.bindVertexArray(nameGL.va);
    gl.drawArrays(gl.POINTS, 0, Math.round(name.count * (quality < 0.6 ? 0.6 : 1)));
  }
  gl.bindVertexArray(null);
}

function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = Math.min(now - last, 64);
  last = now;
  render(now, dt);
  // A device that can't keep up (under 25 fps for a while) gets fewer pixels.
  slow = slow * 0.97 + (dt > 40 ? 0.03 : 0);
  if (slow > 0.5 && quality > 0.5) {
    quality -= 0.25;
    slow = 0;
  }
}

// Reduced motion: no loop. Draw a still frame, and again only when the page moves.
const requestRender = () => {
  pending ||= requestAnimationFrame((now) => {
    pending = 0;
    if (live) render(now, 16.667);
  });
};

// ---- lifecycle ------------------------------------------------------------------------------------

let ticket = 0;
let arriveTimer = 0;
const off = [];
const on = (target, type, fn, opts) => {
  target.addEventListener(type, fn, opts);
  off.push(() => target.removeEventListener(type, fn, opts));
};

async function fontsReady() {
  const weight = getComputedStyle(document.querySelector('.name__first')).fontWeight;
  const loads = Promise.all([document.fonts.load(`${weight} 100px Sora`), document.fonts.load('500 32px "Geist Mono"')]);
  await Promise.race([loads.catch(() => {}), new Promise((resolve) => setTimeout(resolve, 1800))]);
}

export async function startScene(ctx) {
  const mine = ++ticket;
  reduced = ctx.reducedMotion;
  if (broken) {
    root.dataset.gl = 'off';
    return;
  }
  await fontsReady();
  if (mine !== ticket) return; // left 2030 while the fonts were coming
  if (!gl && !init()) {
    broken = true;
    root.dataset.gl = 'off';
    return;
  }

  nameEl = document.querySelector('.name');
  orbs = [...document.querySelectorAll('.orb[data-orb]')].map((el) => ({ el, kind: KIND[el.dataset.orb], seen: 0, focus: 0, tx: 0, ty: 0 }));
  resize();
  name.count = 0;
  if (!sampleName(nameEl.getBoundingClientRect(), true)) {
    root.dataset.gl = 'off';
    return;
  }
  const now = performance.now();
  name.start = now;
  t0 ||= now;
  live = true;
  root.dataset.gl = 'on';

  on(document.fonts, 'loadingdone', scheduleResample);
  if (reduced) {
    on(window, 'scroll', requestRender, { passive: true });
    on(window, 'resize', requestRender);
    requestRender();
    return;
  }
  root.dataset.arriving = '';
  arriveTimer = setTimeout(() => delete root.dataset.arriving, 2600);
  const box = nameEl.getBoundingClientRect();
  audio.arrival((box.left + box.width / 2) / view.w, (box.top + box.height / 2) / view.h);
  on(window, 'pointermove', onPointerMove, { passive: true });
  on(document, 'pointerout', onPointerOut);
  on(window, 'touchstart', onTouchStart, { passive: true });
  on(window, 'touchmove', onTouchMove, { passive: true });
  on(window, 'touchend', onTouchEnd, { passive: true });
  on(window, 'touchcancel', onTouchEnd, { passive: true });
  last = now;
  raf = requestAnimationFrame(frame);
}

export function stopScene() {
  ticket++;
  live = false;
  cancelAnimationFrame(raf);
  cancelAnimationFrame(pending);
  raf = pending = 0;
  clearTimeout(arriveTimer);
  clearTimeout(resampleTimer);
  off.splice(0).forEach((fn) => fn());
  audio.stop();
  pointer.want = pointer.active = 0;
  delete root.dataset.arriving;
  if (root.dataset.gl === 'on') delete root.dataset.gl;
  // Clear the canvas, or the next visit's first frame shows this one's last.
  if (gl && !gl.isContextLost()) gl.clear(gl.COLOR_BUFFER_BIT);
}

// How bright the stars are: 1 at night, lower by day. Set by the sky clock (sky.js).
export function setStarlight(value) {
  starlight = value;
  if (live && reduced) requestRender();
}
