// 2026: light that follows the pointer across the glass panels, and intent: tell the
// page why you came and it leans toward what matters to you.

const HINTS = {
  hire: 'Start with <a href="#workshopos">WorkshopOS</a>, the biggest system I have built alone, then take the <a href="assets/Mohammed_Irshad_C_Resume.pdf" download="Mohammed_Irshad_C_Resume.pdf">resume</a>.',
  build: 'See how I scope work in the <a href="#catering">catering spec</a>, then <a href="#workshopos">WorkshopOS</a>. Ready to talk? <a href="https://wa.me/919567937397?text=Hi%20Irshad%2C%20I%20have%20a%20project." rel="noopener">WhatsApp me</a>.',
  explore: 'Play <a href="#word-hunt">Word Hunt</a>, then drag the time machine back to 1997.',
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

export function enter({ root }) {
  const finePointer = matchMedia('(pointer: fine)').matches;
  if (finePointer) pointerLight(root);
  intent(root);
}

export function leave() {
  cleanups.forEach((fn) => fn());
  cleanups = [];
}
