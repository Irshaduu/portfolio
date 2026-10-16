// The control fixed to the bottom of the page. It only reports what the visitor asked for;
// main.js decides what that means.

export function mountTimeMachine(el, { eras, min, max, onYear, onStep }) {
  const range = el.querySelector('.tm__range');
  const yearOut = el.querySelector('.tm__year');
  const nameOut = el.querySelector('.tm__era-name');
  const noteOut = el.querySelector('.tm__note');
  const live = el.querySelector('.tm__live');
  const ticks = el.querySelector('.tm__ticks');
  const root = document.documentElement;

  // Every era gets the same width on the track, however many years it spans, so the
  // milestones sit evenly and 2023, 2026 and 2030 never crowd together. The years inside an
  // era share its width. The range itself counts track positions, not years.
  const SPAN = 60; // track positions per era
  const stops = eras.map((e) => e.from);
  if (stops.at(-1) < max) stops.push(max);
  const top = (stops.length - 1) * SPAN;
  range.min = 0;
  range.max = top;
  range.step = 1;

  const posOf = (year) => {
    for (let k = 0; k < stops.length - 1; k++) {
      if (year < stops[k + 1]) return k * SPAN + ((year - stops[k]) / (stops[k + 1] - stops[k])) * SPAN;
    }
    return top;
  };
  const yearAt = (pos) => {
    const k = Math.min(Math.floor(pos / SPAN), stops.length - 2);
    return stops[k] + Math.round(((pos - k * SPAN) / SPAN) * (stops[k + 1] - stops[k]));
  };

  ticks.innerHTML = eras
    .map(
      (e) =>
        `<li style="--pos:${(posOf(e.from) / top) * 100}%"><button type="button" data-year="${e.from}" aria-label="Travel to ${e.from}, ${e.name}">` +
        `<span class="tm__tick-long">${e.from}</span>` +
        `<span class="tm__tick-short"><span class="tm__tick-apos">'</span>${String(e.from).slice(2)}</span></button></li>`,
    )
    .join('');

  // Milestones three years apart collide on a narrow track. Use the longest labels that
  // fit this era's type at this width: 2026, then '26, then 26.
  const fitTicks = () => {
    for (const size of ['long', 'short', 'tiny']) {
      ticks.dataset.size = size;
      const label = size === 'long' ? '.tm__tick-long' : '.tm__tick-short';
      const boxes = [...ticks.querySelectorAll(label)].map((el) => el.getBoundingClientRect());
      const clear = boxes.every((b, i) => {
        const prev = boxes[i - 1];
        return !prev || b.top >= prev.bottom || b.left >= prev.right + 4; // a wrapped row is fine
      });
      if (clear) return;
    }
  };
  new ResizeObserver(fitTicks).observe(ticks);
  document.fonts?.addEventListener('loadingdone', fitTicks);

  // A pointer on the thumb means scrubbing: many eras per second, no transitions.
  let scrubbing = false;
  range.addEventListener('pointerdown', () => {
    scrubbing = true;
    el.dataset.scrubbing = '';
  });
  const release = () => {
    if (!scrubbing) return;
    scrubbing = false;
    delete el.dataset.scrubbing;
    // Eras that react to "the visitor stopped here" (2001's intro) listen for this.
    document.dispatchEvent(new CustomEvent('timemachine:release'));
  };
  addEventListener('pointerup', release);
  addEventListener('pointercancel', release);

  range.addEventListener('input', () => {
    root.dataset.traveled = '';
    onYear(yearAt(Number(range.value)), { scrub: scrubbing });
  });

  // The keys still move in years, not track positions: arrows one year, Page keys one era.
  range.addEventListener('keydown', (event) => {
    const year = yearAt(Number(range.value));
    const by = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[event.key];
    let to = null;
    if (by) to = year + by;
    else if (event.key === 'Home') to = min;
    else if (event.key === 'End') to = max;
    else if (event.key === 'PageDown' || event.key === 'PageUp') {
      event.preventDefault();
      root.dataset.traveled = '';
      return onStep(event.key === 'PageUp' ? 1 : -1);
    }
    if (to === null) return;
    event.preventDefault();
    root.dataset.traveled = '';
    onYear(Math.min(max, Math.max(min, to)), { scrub: false });
  });

  el.addEventListener('click', (event) => {
    const tick = event.target.closest('button[data-year]'); // not <html data-year>

    if (tick) return onYear(Number(tick.dataset.year), { scrub: false });
    const step = event.target.closest('[data-step]');
    if (step) onStep(Number(step.dataset.step));
  });

  // Reserve room at the bottom of the page for the bar, whatever height this era gives it.
  new ResizeObserver(([entry]) => {
    root.style.setProperty('--tm-h', `${Math.ceil(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight)}px`);
  }).observe(el);

  let lastEra = null;
  return {
    isScrubbing: () => scrubbing,
    render(year, era) {
      // Mid-drag the thumb stays where the finger is; it only snaps when the year differs.
      if (yearAt(Number(range.value)) !== year) range.value = posOf(year);
      range.style.setProperty('--p', `${(Number(range.value) / top) * 100}%`);
      range.setAttribute('aria-valuetext', `${year}, ${era.name}`);
      yearOut.textContent = year;
      if (era !== lastEra) {
        nameOut.textContent = era.name;
        noteOut.textContent = era.note;
        for (const b of ticks.querySelectorAll('button')) {
          if (Number(b.dataset.year) === era.from) b.setAttribute('aria-current', 'true');
          else b.removeAttribute('aria-current');
        }
        if (lastEra) live.textContent = `${era.from}: ${era.name}`;
        lastEra = era;
        fitTicks(); // every era sets its own type
      }
    },
  };
}
