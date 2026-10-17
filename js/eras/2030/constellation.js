// 2030: the Stack as a night sky. Every tool is a star, and every project is a constellation:
// the tools it was built with (each chip's data-in), joined by the shortest set of lines that
// connects them all. Python is in every one, so all four meet there.
//
// Hover or touch a star to light every project that uses it; tap to keep it lit. The legend
// buttons light one project, and work from the keyboard. The lit projects' cards glow too.

import * as audio from './audio.js';

const LABELS = { workshopos: 'WorkshopOS', 'word-hunt': 'Word Hunt', physiocoach: 'PhysioCoach', catering: 'Catering' };
const IN_A_SENTENCE = { ...LABELS, catering: 'the catering spec' };
const PROJECTS = Object.keys(LABELS);
const SVG = 'http://www.w3.org/2000/svg';
const root = document.documentElement;

const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const and = (items) => (items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items[0]);
const projectsOf = (chip) => chip.dataset.in.split(' ');
// Where an element is on the screen, 0 to 1 each way: where its sound comes from.
const placeOf = (el) => {
  const r = el.getBoundingClientRect();
  return [(r.left + r.width / 2) / innerWidth, (r.top + r.height / 2) / innerHeight];
};

// The smallest set of lines that joins every point (Prim's algorithm), as one SVG path.
// The first point is the root, so each constellation grows out of Python.
function tree(points) {
  let d = '';
  const joined = [points[0]];
  const rest = points.slice(1);
  while (rest.length) {
    let best = null;
    for (const a of joined) {
      for (let k = 0; k < rest.length; k++) {
        const dist = Math.hypot(rest[k][0] - a[0], rest[k][1] - a[1]);
        if (!best || dist < best.dist) best = { a, k, dist };
      }
    }
    const [b] = rest.splice(best.k, 1);
    joined.push(b);
    d += `M${best.a[0].toFixed(1)} ${best.a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  return d;
}

let cleanups = [];

export function startConstellation() {
  const stack = document.querySelector('.stack');
  const chips = [...stack.querySelectorAll('.chip[data-in]')];
  const legend = [...document.querySelectorAll('[data-sky-project]')];
  const caption = document.querySelector('.sky__caption');

  const svg = document.createElementNS(SVG, 'svg');
  svg.classList.add('sky-lines');
  svg.setAttribute('aria-hidden', 'true');
  const paths = {};
  for (const p of PROJECTS) {
    const path = document.createElementNS(SVG, 'path');
    path.classList.add('sky-line');
    path.dataset.project = p;
    path.setAttribute('pathLength', '1'); // so CSS can draw each one in, whatever its length
    svg.append(path);
    paths[p] = path;
  }
  stack.prepend(svg);

  // Where each star's dot is, inside the Stack. The dot is the chip's ::before.
  const starOf = (chip, box) => {
    const r = chip.getBoundingClientRect();
    const dot = getComputedStyle(chip, '::before');
    const x = r.left - box.left + parseFloat(getComputedStyle(chip).paddingLeft) + parseFloat(dot.marginLeft) + parseFloat(dot.width) / 2;
    return [x, r.top - box.top + r.height / 2];
  };
  const draw = () => {
    const box = stack.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    for (const p of PROJECTS) {
      const stars = chips.filter((c) => projectsOf(c).includes(p)).map((c) => starOf(c, box));
      paths[p].setAttribute('d', stars.length > 1 ? tree(stars) : '');
    }
  };
  draw();
  const resized = new ResizeObserver(draw);
  resized.observe(stack);
  document.fonts?.addEventListener('loadingdone', draw);

  // The lines draw themselves in the first time the sky scrolls into view.
  const seen = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    svg.classList.add('is-drawn');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) audio.chart(...placeOf(stack)); // they draw in, they sing
    seen.disconnect();
  }, { threshold: 0.2 });
  seen.observe(stack);

  // ---- lighting ----
  let pinnedChip = null;
  let pinnedProject = null;

  const chipText = (chip) => {
    const links = projectsOf(chip).map((p) => `<a href="#${p}">${IN_A_SENTENCE[p]}</a>`);
    return `<strong>${escape(chip.textContent.trim())}</strong> is in ${and(links)}.`;
  };
  const projectText = (p) => {
    const n = chips.filter((c) => projectsOf(c).includes(p)).length;
    const verb = p === 'catering' ? 'is designed with' : 'was built with';
    return `<a href="#${p}">${LABELS[p]}</a> ${verb} ${n} of these.`;
  };

  // The caption, and beside it, hidden, the longest caption it can show, holding the room
  // (2030.css): touching a star never moves the sky.
  caption.innerHTML = '<span class="sky__now"></span><span class="sky__room" aria-hidden="true"></span>';
  const now = caption.firstChild;
  const plain = (html) => html.replace(/<[^>]+>/g, '');
  caption.lastChild.innerHTML = [...chips.map(chipText), ...PROJECTS.map(projectText)]
    .reduce((a, b) => (plain(b).length > plain(a).length ? b : a));

  const show = (projects, html = '') => {
    if (projects.length) {
      stack.dataset.lit = projects.join(' ');
      root.dataset.lit = projects.join(' ');
    } else {
      delete stack.dataset.lit;
      delete root.dataset.lit;
    }
    now.innerHTML = html;
  };
  const showChip = (chip) => show(projectsOf(chip), chipText(chip));
  const showProject = (p) => show([p], projectText(p));
  const restore = () => {
    if (pinnedChip) showChip(pinnedChip);
    else if (pinnedProject) showProject(pinnedProject);
    else show([]);
  };
  const paintPins = () => {
    for (const c of chips) c.toggleAttribute('data-pinned', c === pinnedChip);
    for (const b of legend) b.setAttribute('aria-pressed', String(b.dataset.skyProject === pinnedProject));
  };

  const onOver = (event) => {
    const chip = event.target.closest?.('.chip[data-in]');
    if (chip && event.pointerType === 'mouse') {
      showChip(chip);
      audio.star(projectsOf(chip), ...placeOf(chip));
    }
  };
  const onOut = (event) => {
    const chip = event.target.closest?.('.chip[data-in]');
    if (chip && event.pointerType === 'mouse' && !chip.contains(event.relatedTarget)) restore();
  };
  const onClick = (event) => {
    const chip = event.target.closest('.chip[data-in]');
    if (!chip) return;
    pinnedChip = pinnedChip === chip ? null : chip;
    pinnedProject = null;
    paintPins();
    restore();
    if (pinnedChip) audio.star(projectsOf(chip), ...placeOf(chip), { pinned: true });
  };
  const onLegend = (event) => {
    const p = event.currentTarget.dataset.skyProject;
    pinnedProject = pinnedProject === p ? null : p;
    pinnedChip = null;
    paintPins();
    restore();
    if (pinnedProject) audio.star([p], ...placeOf(event.currentTarget), { pinned: true });
  };
  const onKey = (event) => {
    if (event.key !== 'Escape' || !(pinnedChip || pinnedProject)) return;
    pinnedChip = pinnedProject = null;
    paintPins();
    restore();
  };

  stack.addEventListener('pointerover', onOver);
  stack.addEventListener('pointerout', onOut);
  stack.addEventListener('click', onClick);
  for (const b of legend) b.addEventListener('click', onLegend);
  addEventListener('keydown', onKey);

  cleanups.push(() => {
    resized.disconnect();
    seen.disconnect();
    document.fonts?.removeEventListener('loadingdone', draw);
    stack.removeEventListener('pointerover', onOver);
    stack.removeEventListener('pointerout', onOut);
    stack.removeEventListener('click', onClick);
    for (const b of legend) b.removeEventListener('click', onLegend);
    removeEventListener('keydown', onKey);
    pinnedChip = pinnedProject = null;
    paintPins();
    show([]);
    caption.textContent = '';
    svg.remove();
  });
}

export function stopConstellation() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}
