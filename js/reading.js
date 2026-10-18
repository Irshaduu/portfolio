// Room to read, for the eras that want it (2026 and 2030 today). Each era dresses these in its
// own sheet; each function returns its own undo, for the era to call when the visitor leaves.
//   tuck()   the time machine steps aside while you read down the page
//   folds()  on a tablet or a phone, each card's details fold behind "How it works"

// The time machine steps aside while you read down the page (the era's CSS moves it when the root
// has data-tucked), and comes back as soon as you scroll up, reach either end of the page, tab into
// it, or (with a mouse) point at the bottom edge where it lives. The CSS also keeps it in place
// while the agent is open.
export function tuck(root, { finePointer }) {
  const bar = document.querySelector('.timemachine');
  let lastY = scrollY;
  let frame = 0;
  const set = (on) => root.toggleAttribute('data-tucked', on);
  // A keyboard inside the bar keeps it; a tap on its arrows (which leaves focus there) doesn't.
  const keyboardIn = () => bar.contains(document.activeElement) && document.activeElement.matches(':focus-visible');

  const check = () => {
    frame = 0;
    const y = scrollY;
    const nearTop = y < innerHeight * 0.6;
    const nearEnd = y + innerHeight > document.documentElement.scrollHeight - 120;
    if (nearTop || nearEnd || keyboardIn() || bar.matches(':hover')) {
      lastY = y;
      set(false);
      return;
    }
    if (Math.abs(y - lastY) < 12) return; // a finger resting on the glass, not a direction
    set(y > lastY);
    lastY = y;
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(check);
  };
  const show = () => {
    if (keyboardIn()) set(false);
  };
  const onPointer = (event) => {
    if (event.clientY > innerHeight - 110) set(false);
  };

  addEventListener('scroll', onScroll, { passive: true });
  bar.addEventListener('focusin', show);
  if (finePointer) addEventListener('pointermove', onPointer, { passive: true });
  return () => {
    removeEventListener('scroll', onScroll);
    bar.removeEventListener('focusin', show);
    removeEventListener('pointermove', onPointer);
    cancelAnimationFrame(frame);
    set(false);
  };
}

// Each card's details fold behind "How it works", so the page reads as cards first and the depth
// is one tap away. The switch is an ornament of the era that asks for it (`era`): the era's sheet
// shows it only on a tablet or a phone and keeps the details open wider, and other eras never see it.
export function folds(era) {
  const made = [];
  for (const card of document.querySelectorAll('.project')) {
    const points = card.querySelector('.points');
    if (!points) continue;
    const ownId = !points.id;
    if (ownId) points.id = `${card.id}-details`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'orn project__more';
    button.dataset.orn = era;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', points.id);
    button.innerHTML = 'How it works<span class="project__more-icon" aria-hidden="true"></span>';
    button.addEventListener('click', () => button.setAttribute('aria-expanded', String(card.toggleAttribute('data-open'))));
    points.before(button);
    card.dataset.folds = '';
    made.push({ card, points, button, ownId });
  }
  return () => {
    for (const { card, points, button, ownId } of made) {
      button.remove();
      delete card.dataset.folds;
      delete card.dataset.open;
      if (ownId) points.removeAttribute('id');
    }
  };
}
