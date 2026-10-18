// Irshad's Agent on the page: the chat panel, and what its answers do to the page.
//
// The answers come from js/assistant/client.js (a ready answer, else the AI, else a stand-in). This
// file shows them as they arrive, keeps the conversation for the visit, and acts on the page: an
// answer about a part of the page scrolls there and lights it up, and "take me to 1997" travels.
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

  // ---- showing ---------------------------------------------------------------------------

  const scrollLog = () => { log.scrollTop = log.scrollHeight; };

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

  function finish(li, { text, link, next, trace, more }) {
    li.querySelector('.agent__text').textContent = words(text);
    if (link && PLACES[link]) {
      const see = el('p', 'agent__see');
      const a = el('a', null, `See ${PLACES[link]}`);
      a.href = link;
      if (link.startsWith('#')) a.dataset.agentPoint = link;
      see.append(a);
      li.append(see);
    }
    if (trace) li.append(el('p', 'agent__trace', trace));
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
    scrollLog();
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

  function traceOf(by, tried, ms) {
    if (by === 'ready') return 'Quick answer';
    if (by === 'none') return 'No answer found';
    const busyOnes = tried.filter((t) => !t.endsWith('answered')).map((t) => t.split(':')[0]);
    return [`${by} · ${(ms / 1000).toFixed(1)} s`, ...busyOnes.map((name) => `${name} was busy`)].join(' · ');
  }

  async function send(question, { deep = false } = {}) {
    question = question.trim().slice(0, 600);
    if (!question || busy) return;
    busy = true;
    form.classList.add('is-busy');
    input.value = '';
    sendButton.disabled = true;
    clearOldNext();
    userBubble(deep ? `Tell me more: ${question}` : question);
    const li = botMessage();
    scrollLog();
    blip(520, 0.05);

    const started = performance.now();
    const history = messages.map(({ role, text }) => ({ role, content: text }));
    let raw = '';
    let by = null;
    let tried = [];
    try {
      const result = await ask(question, history, {
        deep,
        context: { era: ctx.root.dataset.era, section: onScreen(), intent: ctx.root.dataset.intent },
        on(e) {
          if (e.type === 'source') { by = e.by; tried = e.tried ?? []; }
          if (e.type === 'text') {
            raw += e.t;
            li.querySelector('.agent__text').textContent = words(raw);
            scrollLog();
          }
        },
      });
      const more = result.by === 'ready' && result.next?.length && !result.travel && !deep ? question : null;
      const answer = { role: 'assistant', text: result.text, by: result.by, link: result.link, next: result.next, more, trace: traceOf(result.by, tried, performance.now() - started) };
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
      scrollLog();
      if (!panel.hidden && wide.matches) input.focus({ preventScroll: true });
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

  let returnTo = null;
  function open() {
    if (!panel.hidden) return input.focus({ preventScroll: true });
    returnTo = document.activeElement;
    render();
    panel.hidden = false;
    launchers().forEach((b) => b.setAttribute('aria-expanded', 'true'));
    input.focus({ preventScroll: true });
    scrollLog();
  }

  function close() {
    if (panel.hidden) return;
    const hadFocus = panel.contains(document.activeElement);
    panel.hidden = true;
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
    if (chip) return send(chip.dataset.ask, { deep: 'deep' in chip.dataset });
    const see = event.target.closest('[data-agent-point]');
    if (see && !wide.matches) close(); // a phone: get the panel out of the way, then follow the link
  });
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  return { open, close, isOpen: () => !panel.hidden };
}
