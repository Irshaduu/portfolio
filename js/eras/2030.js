// 2030: the page becomes a place. This file starts and stops its parts:
//   2030/scene.js          the WebGL scene behind the page
//   2030/constellation.js  the Stack as a night sky
//   2030/sky.js            a sky that follows the visitor's clock

import { startScene, stopScene } from './2030/scene.js';
import { startConstellation, stopConstellation } from './2030/constellation.js';
import { startSky, stopSky } from './2030/sky.js';
import { setHum } from '../sound.js';

export function enter(ctx) {
  startScene(ctx);
  startSky();
  startConstellation();
  setHum(true); // only heard with sound on
}

export function leave() {
  stopConstellation();
  setHum(false);
  stopSky();
  stopScene();
}
