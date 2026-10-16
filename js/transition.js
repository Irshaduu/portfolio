// How one era becomes the next. `render` must be idempotent and read the latest state,
// because a fast visitor can ask for three eras before the first transition finishes.

const root = document.documentElement;

// Every era lays the page out differently, so the same scroll offset lands somewhere else.
// Keep whatever the visitor was reading at the same point of the screen instead.
function keepReadingPosition(render) {
  if (scrollY < 40) return render();

  const probe = Math.min(innerHeight * 0.3, 240);
  let anchor = null;
  for (const el of document.querySelectorAll('[data-anchor]')) {
    const r = el.getBoundingClientRect();
    if (r.top <= probe && r.bottom > probe) anchor = el; // later matches are nested deeper
  }
  if (!anchor) return render();

  const before = anchor.getBoundingClientRect();
  const through = (probe - before.top) / Math.max(before.height, 1);
  render();
  const after = anchor.getBoundingClientRect();
  const delta = after.top + through * after.height - probe;
  if (Math.abs(delta) > 1) scrollTo({ top: scrollY + delta, behavior: 'instant' });
}

function fontsReady(probe, ms) {
  if (!probe || !document.fonts?.load) return Promise.resolve();
  return Promise.race([
    document.fonts.load(probe).catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, ms)),
  ]);
}

let pending = 0;

// direction: 'back' (into the past) or 'forward'. Resolves once the new era is in the DOM.
export async function travel(render, { animate, direction, fontProbe }) {
  const ticket = ++pending;
  const update = () => keepReadingPosition(render);

  if (!animate || !document.startViewTransition) {
    update();
    return;
  }

  // A transition that captures the new era before its font arrives shows a fallback face
  // for a frame. Wait briefly, never long.
  await fontsReady(fontProbe, 260);
  if (ticket !== pending) return; // a newer request owns the screen now

  root.dataset.travel = direction;
  let updated = false;
  const transition = document.startViewTransition(() => {
    updated = true;
    update();
  });
  // A transition waits for the next frame, and a background tab may never paint one.
  // Skipping still runs the update, so the era always lands.
  const guard = setTimeout(() => updated || transition.skipTransition(), 400);
  transition.ready.catch(() => {}); // rejects whenever a transition is skipped; that's expected
  try {
    await transition.updateCallbackDone;
  } catch {
    // The callback still ran, or render() threw; either way there is nothing to undo.
  } finally {
    clearTimeout(guard);
  }
  transition.finished.finally(() => {
    if (ticket === pending) delete root.dataset.travel;
  });
}

// While the slider is being dragged there is no time for a transition per era.
// A short burst of static sells the jump instead.
let warpTimer;
export function warp() {
  root.classList.add('is-warping');
  clearTimeout(warpTimer);
  warpTimer = setTimeout(() => root.classList.remove('is-warping'), 180);
}
