// 2026: light that follows the pointer across the glass panels, and intent: tell the page why you
// came and it leans toward what matters to you, with "ask my agent" at the end of its hint (the
// agent itself is the whole page's: js/main.js loads it). On a phone, cards fold their details and
// the time machine steps aside while you read.

const ASK = ' Or <button type="button" class="intent__ask" data-agent-open>ask my agent</button>.';
const HINTS = {
  hire: `Start with <a href="#workshopos">WorkshopOS</a>, the biggest system I have built alone, then read the <a href="resume/">resume</a>.${ASK}`,
  build: `See how I scope work in the <a href="work/catering/">catering spec</a>, then <a href="#workshopos">WorkshopOS</a>. Ready to talk? <a href="https://wa.me/919567937397?text=Hi%20Irshad%2C%20I%20have%20a%20project." rel="noopener">WhatsApp me</a>.${ASK}`,
  explore: `Play <a href="#word-hunt">Word Hunt</a>, then drag the time machine back to 1997.${ASK}`,
};

let cleanups = [];
const onLeave = (fn) => cleanups.push(fn);

function pointerLight(root) {
  const lit = [...document.querySelectorAll('.project, .fact')];
  let x = -1000;
  let y = -1000;
  let frame = 0;

  const paint = () => {
    frame = 0;
    root.style.setProperty('--mx', `${x}px`);
    root.style.setProperty('--my', `${y}px`);
    for (const el of lit) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -400 || r.top > innerHeight + 400) continue; // far off screen
      el.style.setProperty('--lx', `${x - r.left}px`);
      el.style.setProperty('--ly', `${y - r.top}px`);
    }
  };

  const onMove = (event) => {
    x = event.clientX;
    y = event.clientY;
    if (!frame) frame = requestAnimationFrame(paint);
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(paint);
  };

  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('scroll', onScroll, { passive: true });
  onLeave(() => {
    removeEventListener('pointermove', onMove);
    removeEventListener('scroll', onScroll);
    cancelAnimationFrame(frame);
    for (const prop of ['--mx', '--my']) root.style.removeProperty(prop);
    for (const el of lit) for (const prop of ['--lx', '--ly']) el.style.removeProperty(prop);
  });
}

function intent(root) {
  const buttons = [...document.querySelectorAll('[data-intent-pick]')];
  const hint = document.querySelector('.intent__hint');

  const set = (value) => {
    if (value) root.dataset.intent = value;
    else delete root.dataset.intent;
    for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.intentPick === value));
    hint.innerHTML = value ? HINTS[value] : '';
  };

  const onClick = (event) => {
    const pick = event.currentTarget.dataset.intentPick;
    set(root.dataset.intent === pick ? null : pick);
  };
  for (const b of buttons) b.addEventListener('click', onClick);

  // Intent is a 2026 idea; other eras never see it.
  onLeave(() => {
    for (const b of buttons) b.removeEventListener('click', onClick);
    set(null);
  });
}

// On a phone each card's details fold behind "How it works", so the page reads as cards first and
// the depth is one tap away. The switch is a 2026 ornament: wider screens hide it and keep the
// details open (css/eras/2026.css), and other eras never see it.
function folds() {
  const made = [];
  for (const card of document.querySelectorAll('.project')) {
    const points = card.querySelector('.points');
    if (!points) continue;
    const ownId = !points.id;
    if (ownId) points.id = `${card.id}-details`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'orn project__more';
    button.dataset.orn = '2026';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', points.id);
    button.innerHTML = 'How it works<span class="project__more-icon" aria-hidden="true"></span>';
    button.addEventListener('click', () => button.setAttribute('aria-expanded', String(card.toggleAttribute('data-open'))));
    points.before(button);
    card.dataset.folds = '';
    made.push({ card, points, button, ownId });
  }
  onLeave(() => {
    for (const { card, points, button, ownId } of made) {
      button.remove();
      delete card.dataset.folds;
      delete card.dataset.open;
      if (ownId) points.removeAttribute('id');
    }
  });
}

// On a phone the docked time machine steps aside while you read down the page, and comes back as
// soon as you scroll up, reach either end of the page, or tab into it. The CSS also keeps it in
// place while the agent is open.
function tuck(root) {
  const phone = matchMedia('(max-width: 760px)');
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
    if (!phone.matches || nearTop || nearEnd || keyboardIn()) {
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

  addEventListener('scroll', onScroll, { passive: true });
  bar.addEventListener('focusin', show);
  phone.addEventListener('change', check);
  onLeave(() => {
    removeEventListener('scroll', onScroll);
    bar.removeEventListener('focusin', show);
    phone.removeEventListener('change', check);
    cancelAnimationFrame(frame);
    set(false);
  });
}

export function enter(ctx) {
  const { root } = ctx;
  const finePointer = matchMedia('(pointer: fine)').matches;
  if (finePointer) pointerLight(root);
  intent(root);
  folds();
  tuck(root);
}

export function leave() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}
