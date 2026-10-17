// 2030: the page becomes a place. This file starts and stops its parts:
//   2030/scene.js          the WebGL scene behind the page
//   2030/sky.js            a sky that follows the visitor's clock
//   2030/constellation.js  the Stack as a night sky
//   2030/marks.js          the moment each project's symbol makes its move
// Each part loads and starts on its own, so one that fails (a dropped file, a graphics card
// without WebGL2) never stops the others. Without the scene, the name simply stays as text.

import { setHum } from '../sound.js';
import { load } from '../load.js';

const root = document.documentElement;
const part = (path, start, stop) => ({ url: new URL(path, import.meta.url), start, stop });

// The sky sets how bright the stars are; the scene draws them. Whichever arrives first, the
// scene gets the latest value.
let scene = null;
let starlight = null;
const PARTS = [
  part('./2030/scene.js', (m, ctx) => {
    scene = m;
    if (starlight !== null) m.setStarlight(starlight);
    return m.startScene(ctx);
  }, (m) => m.stopScene()),
  part('./2030/sky.js', (m) => m.startSky((value) => {
    starlight = value;
    scene?.setStarlight(value);
  }), (m) => m.stopSky()),
  part('./2030/constellation.js', (m) => m.startConstellation(), (m) => m.stopConstellation()),
  part('./2030/marks.js', (m) => m.startMarks(), (m) => m.stopMarks()),
];

let visit = 0;
const running = new Map();

function failed(p, err) {
  console.error(`2030: ${p.url.pathname.split('/').pop()} failed`, err);
  if (p === PARTS[0]) root.dataset.gl = 'off'; // the name comes back as text at once
}

export function enter(ctx) {
  const mine = ++visit;
  for (const p of PARTS) {
    load(p.url)
      .then((mod) => {
        if (mine !== visit) return; // left 2030 while it was loading
        running.set(p, mod);
        return p.start(mod, ctx);
      })
      .catch((err) => failed(p, err));
  }
  setHum(true); // only heard with sound on
}

export function leave() {
  visit++;
  for (const [p, mod] of [...running].reverse()) {
    try {
      p.stop(mod);
    } catch (err) {
      console.error('2030: a part failed to stop', err);
    }
  }
  running.clear();
  setHum(false);
}
