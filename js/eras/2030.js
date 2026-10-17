// 2030: the page becomes a place. This file starts and stops its parts:
//   2030/scene.js          the WebGL scene behind the page
//   2030/constellation.js  the Stack as a night sky
//   2030/sky.js            a sky that follows the visitor's clock
//   2030/marks.js          the moment each project's symbol makes its move

import { startScene, stopScene } from './2030/scene.js';
import { startConstellation, stopConstellation } from './2030/constellation.js';
import { startSky, stopSky } from './2030/sky.js';
import { startMarks, stopMarks } from './2030/marks.js';
import { setHum } from '../sound.js';

export function enter(ctx) {
  startScene(ctx);
  startSky();
  startConstellation();
  startMarks();
  setHum(true); // only heard with sound on
}

export function leave() {
  stopMarks();
  stopConstellation();
  setHum(false);
  stopSky();
  stopScene();
}
