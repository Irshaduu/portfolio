// Irshad's Agent on the page: the chat panel, and what its answers do to the page.
//
// The answers come from js/assistant/client.js (a tapped suggestion's ready answer, a typed
// question's AI answer, or a stand-in when the AI rests). This file shows them as they arrive,
// keeps the conversation for the visit, and acts on the page: an answer about a part of the page
// scrolls there and lights it up, and "take me to 1997" travels.
// It's loaded the first time someone opens the agent (js/eras/2026.js), never before.

import { ask, plain } from './assistant/client.js';
import { START } from './assistant/answers.js';
import { blip } from './sound.js';

const KEY = 'tt-agent'; // the conversation, kept for this visit (sessionStorage)
const KEEP = 30; // messages kept

// Where an answer can point, and what to call it in "See …".
const PLACES = {
  '#top': 'the top', '#work': 'Work', '#workshopos': 'WorkshopOS', '#word-hunt': 'Word Hunt',
  '#physiocoach': 'PhysioCoach', '#catering': 'the catering system', '#stack': 'the Stack',
  '#story': 'the Story', '#contact': 'Contact', 'resume/': 'the resume', 'work/workshopos/#map': 'the system map',
};

// The first questions offered, by why the visitor came (the 2026 intent picker).
const STARTERS = {
  hire: ['Is he free to hire?', 'What are his skills?', 'Show me his biggest project'],
  build: ['Could he build a system for my business?', 'Tell me about the catering project', 'How can I contact him?'],
  explore: ['Can I play his game?', 'Take me to 1997', 'What has he built?'],
};
const GREETING = "Hi! I know Irshad's work inside out. Ask me anything, or pick one below.";

// "(#word-hunt)" at the end of an AI answer: the page shows it as "See Word Hunt" instead.
const CITE = /\s*\((#[a-z-]+)(?:[\s,]+#[a-z-]+)*\)/g;

// Under an answer, visitors see only "Quick answer", for one the page knew without asking the AI:
// it shows the care taken over speed and cost, and explains an answer that fits a little loosely.
// Never under the helpline or a trip in time; AI answers carry no label. Which AI answered
// ("Gemini · 1.9 s", "Groq") is for Irshad, not visitors: they should meet Irshad's Agent, not a
// brand they use every day. ?trace in the address shows it, and it stays on in that browser;
// ?trace=off turns it off. Cloudflare's logs record which AI answered every question too.
const showTrace = (() => {
  const asked = new URLSearchParams(location.search).get('trace');
  try {
    if (asked !== null) localStorage.setItem('tt-agent-trace', asked === 'off' ? '0' : '1');
    return localStorage.getItem('tt-agent-trace') === '1';
  } catch {
    return asked !== null && asked !== 'off';
  }
})();

const read = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
};
const write = (messages) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(messages.slice(-KEEP)));
  } catch {
    // Storage blocked: the conversation just won't outlive the page.
  }
};

const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

export function mount(ctx) {
  const panel = document.getElementById('agent');
  const launchers = () => document.querySelectorAll('.agent-launch');
  const log = panel.querySelector('.agent__log');
  const live = panel.querySelector('.agent__live');
  const form = panel.querySelector('.agent__form');
  const input = form.elements.q;
  const sendButton = form.querySelector('.agent__send');

  let messages = read(); // { role: 'user' | 'assistant', text, by?, link?, next?, trace? }
  let busy = false;
  const wide = matchMedia('(min-width: 900px)');
  // A touch screen: its keyboard is on the screen, and covers half of it while it's up.
  const touch = matchMedia('(pointer: coarse)');

  // ---- showing ---------------------------------------------------------------------------

  // Scroll the conversation so a message sits at the top of the view: the visitor's question, with
  // the answer reading on from its first word below it. (Scrolling to the very bottom would show
  // the next-question buttons and hide the answer above them.)
  const showFrom = (node) => { log.scrollTop = Math.max(0, node.offsetTop - 10); };

  function userBubble(text) {
    const li = el('li', 'agent__msg agent__msg--me', text);
    log.append(li);
    return li;
  }

  function botMessage() {
    const li = el('li', 'agent__msg agent__msg--bot');
    const text = el('p', 'agent__text');
    text.append(el('span', 'agent__typing'));
    text.lastChild.append(el('i'), el('i'), el('i'));
    text.lastChild.setAttribute('aria-label', 'Thinking');
    li.append(text);
    log.append(li);
    return li;
  }

  // The answer's words, without the "(#section)" the AI adds for the page.
  const words = (raw) => plain(raw).replace(CITE, '').trim();

  function finish(li, { text, link, next, trace, label, more }) {
    li.querySelector('.agent__text').textContent = words(text);
    if (link && PLACES[link]) {
      const see = el('p', 'agent__see');
      const a = el('a', null, `See ${PLACES[link]}`);
      a.href = link;
      if (link.startsWith('#')) a.dataset.agentPoint = link;
      see.append(a);
      li.append(see);
    }
    const line = showTrace ? trace : label;
    if (line) {
      const p = el('p', 'agent__trace', line);
      if (!showTrace && line.startsWith('Quick answer')) p.title = 'Answered instantly, without asking the AI.';
      li.append(p);
    }
    if (next?.length || more) {
      const row = el('div', 'agent__next');
      for (const q of next ?? []) {
        const b = el('button', null, q);
        b.type = 'button';
        b.dataset.ask = q;
        row.append(b);
      }
      if (more) {
        const b = el('button', 'agent__more', 'Tell me more');
        b.type = 'button';
        b.dataset.ask = more;
        b.dataset.deep = '';
        row.append(b);
      }
      li.append(row);
    }
  }

  // Only the newest answer offers what to ask next; older suggestions would only clutter the log.
  const clearOldNext = () => log.querySelectorAll('.agent__next').forEach((row) => row.remove());

  function render() {
    log.replaceChildren();
    const intent = ctx.root.dataset.intent;
    finish(botMessage(), { text: GREETING, next: STARTERS[intent] ?? START });
    messages.forEach((m, i) => {
      if (m.role === 'user') return userBubble(m.text);
      const last = i === messages.length - 1;
      finish(botMessage(), { ...m, next: last ? m.next : null, more: last ? m.more : null });
    });
    if (messages.length) log.querySelector('.agent__next')?.remove(); // the greeting's starters, once talking
    const lastQuestion = [...log.querySelectorAll('.agent__msg--me')].at(-1);
    if (lastQuestion) showFrom(lastQuestion);
    else log.scrollTop = 0;
  }

  // ---- asking ----------------------------------------------------------------------------

  // The part of the page in the middle of the screen: a project card, else a section.
  function onScreen() {
    const middle = innerHeight / 2;
    const ids = ['#workshopos', '#word-hunt', '#physiocoach', '#catering', '#top', '#work', '#stack', '#story', '#contact'];
    for (const id of ids) {
      const r = document.querySelector(id)?.getBoundingClientRect();
      if (r && r.top <= middle && r.bottom >= middle) return id;
    }
    return undefined;
  }

  // For Irshad (?trace): where the answer came from, how long it took, and what was busy.
  function traceOf(by, tried, ms, rested) {
    if (by === 'ready') return ['Quick answer', rested].filter(Boolean).join(' · ');
    if (by === 'none') return ['No answer found', rested].filter(Boolean).join(' · ');
    const busyOnes = tried.filter((t) => !t.endsWith('answered')).map((t) => t.split(':')[0]);
    return [`${by} · ${(ms / 1000).toFixed(1)} s`, ...busyOnes.map((name) => `${name} was busy`)].join(' · ');
  }

  // For visitors: "Quick answer" under a ready answer, saying so when it stood in for a resting AI.
  function labelOf({ by, id, travel }, rested) {
    if (id === 'crisis' || travel) return null;
    if (by === 'ready') return rested ? 'Quick answer · the AI is resting' : 'Quick answer';
    if (by === 'none') return 'The AI is resting';
    return null;
  }

  // `tapped`: a suggestion button, whose ready answer comes at once. Typed questions go to the AI.
  async function send(question, { deep = false, tapped = false } = {}) {
    question = question.trim().slice(0, 600);
    if (!question || busy) return;
    busy = true;
    form.classList.add('is-busy');
    input.value = '';
    sendButton.disabled = true;
    // On a touch screen, put the keyboard away so the whole answer has room.
    if (touch.matches) input.blur();
    clearOldNext();
    const asked = userBubble(deep ? `Tell me more: ${question}` : question);
    const li = botMessage();
    showFrom(asked);
    blip(520, 0.05);

    const started = performance.now();
    const history = messages.map(({ role, text }) => ({ role, content: text }));
    let raw = '';
    let by = null;
    let tried = [];
    let rested = null; // why the AI couldn't answer, if it couldn't
    try {
      const result = await ask(question, history, {
        deep,
        tapped,
        context: { era: ctx.root.dataset.era, section: onScreen(), intent: ctx.root.dataset.intent },
        on(e) {
          if (e.type === 'step' && !/^(Looking for|Asking)/.test(e.text)) rested = e.text;
          if (e.type === 'source') { by = e.by; tried = e.tried ?? []; }
          if (e.type === 'text') {
            raw += e.t;
            li.querySelector('.agent__text').textContent = words(raw);
          }
        },
      });
      const more = result.by === 'ready' && result.next?.length && !result.travel && !deep ? question : null;
      const answer = { role: 'assistant', text: result.text, by: result.by, link: result.link, next: result.next, more, trace: traceOf(result.by, tried, performance.now() - started, rested), label: labelOf(result, rested) };
      finish(li, answer);
      messages.push({ role: 'user', text: question }, answer);
      write(messages);
      live.textContent = words(result.text);
      blip(880, 0.08);
      act(result);
    } catch {
      finish(li, { text: "Something went wrong on my side. Please try again, or ask Irshad directly in Contact.", next: ['How can I contact him?'] });
    } finally {
      busy = false;
      form.classList.remove('is-busy');
      sendButton.disabled = false;
      showFrom(asked);
      // With a real keyboard, ready for the next question. A touch keyboard waits for a tap.
      if (!panel.hidden && !touch.matches) input.focus({ preventScroll: true });
    }
  }

  // ---- acting on the page ----------------------------------------------------------------

  function act({ link, travel }) {
    if (travel) {
      // Say it, then go. The agent lives in 2026 for now, so it closes on the way out.
      setTimeout(() => {
        close();
        ctx.goTo(travel);
      }, 900);
      return;
    }
    // On a wide screen the panel sits beside the page, so the page can show what the answer is
    // about. On a phone it would scroll behind the panel, unseen: there "See …" does it instead.
    if (link?.startsWith('#') && wide.matches) point(link);
  }

  // Scroll a part of the page into view and light it up for a moment.
  function point(id) {
    const target = document.querySelector(id);
    if (!target) return;
    const r = target.getBoundingClientRect();
    const visible = r.top >= 0 && r.top < innerHeight * 0.6;
    if (!visible) target.scrollIntoView({ behavior: ctx.reducedMotion ? 'auto' : 'smooth', block: target.matches('.project') ? 'center' : 'start' });
    setTimeout(() => spot(target), visible || ctx.reducedMotion ? 0 : 650);
  }

  // A ring of light laid over the target, removed when it fades. It never touches the target's own
  // styles, which its era owns.
  function spot(target) {
    const box = target.matches('.project, .section__title') ? target : target.querySelector('.section__title') ?? target;
    const r = box.getBoundingClientRect();
    const ring = el('div', 'agent-spot');
    const pad = 8;
    Object.assign(ring.style, {
      left: `${r.left + scrollX - pad}px`, top: `${r.top + scrollY - pad}px`,
      width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px`,
      borderRadius: getComputedStyle(box).borderRadius === '0px' ? '16px' : `calc(${getComputedStyle(box).borderTopLeftRadius} + ${pad}px)`,
    });
    document.body.append(ring);
    setTimeout(() => ring.remove(), 2800);
  }

  // ---- opening and closing ---------------------------------------------------------------

  // A phone's keyboard covers the bottom of the screen without moving anything fixed there, so it
  // would hide the box you type in. While it's up, the panel sits on top of it, in the part of the
  // screen still visible (the visual viewport).
  const title = panel.querySelector('.agent__title');
  title.tabIndex = -1;
  function fitKeyboard() {
    const vv = window.visualViewport;
    if (!vv || panel.hidden) return;
    const covered = Math.max(0, Math.round(innerHeight - (vv.offsetTop + vv.height)));
    const up = touch.matches && covered > 80;
    panel.toggleAttribute('data-keyboard', up);
    panel.style.setProperty('--kb', `${covered}px`);
    panel.style.setProperty('--vvh', `${Math.round(vv.height)}px`);
  }
  window.visualViewport?.addEventListener('resize', fitKeyboard);
  window.visualViewport?.addEventListener('scroll', fitKeyboard);
  input.addEventListener('focus', () => setTimeout(fitKeyboard, 300)); // after the keyboard has risen
  input.addEventListener('blur', () => setTimeout(fitKeyboard, 300));

  let returnTo = null;
  function open() {
    if (!panel.hidden) return touch.matches ? undefined : input.focus({ preventScroll: true });
    returnTo = document.activeElement;
    render();
    panel.hidden = false;
    launchers().forEach((b) => b.setAttribute('aria-expanded', 'true'));
    // A real keyboard can type at once. On a touch screen the keyboard would cover the starter
    // questions, so it waits until the visitor taps the box; focus goes to the panel's title.
    (touch.matches ? title : input).focus({ preventScroll: true });
    const lastQuestion = [...log.querySelectorAll('.agent__msg--me')].at(-1);
    if (lastQuestion) showFrom(lastQuestion);
    fitKeyboard();
  }

  function close() {
    if (panel.hidden) return;
    const hadFocus = panel.contains(document.activeElement);
    panel.hidden = true;
    panel.removeAttribute('data-keyboard');
    launchers().forEach((b) => b.setAttribute('aria-expanded', 'false'));
    if (hadFocus) (returnTo?.isConnected && returnTo.offsetParent ? returnTo : launchers()[0])?.focus({ preventScroll: true });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    send(input.value);
  });
  panel.addEventListener('click', (event) => {
    if (event.target.closest('[data-agent-close]')) return close();
    const chip = event.target.closest('[data-ask]');
    if (chip) return send(chip.dataset.ask, { deep: 'deep' in chip.dataset, tapped: true });
    const see = event.target.closest('[data-agent-point]');
    if (see && !wide.matches) close(); // a phone: get the panel out of the way, then follow the link
  });
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  return { open, close, isOpen: () => !panel.hidden };
}
