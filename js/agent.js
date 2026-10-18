// Irshad's Agent on the page: the chat panel, and what its answers do to the page.
//
// The answers come from js/assistant/client.js (a tapped suggestion's ready answer, a typed
// question's AI answer, or a stand-in when the AI rests). This file shows them as they arrive,
// keeps the conversation for the visit, and acts on the page: an answer about a part of the page
// scrolls there and lights it up, and "take me to 1997" travels. A pasted job post gets the
// job-fit check instead (js/assistant/fit.js), shown as a card: what matches, each with its proof
// on the page, what the site doesn't show, and a question worth asking Irshad.
// It's loaded the first time someone opens the agent (js/main.js), never before, and dressed by
// css/agent.css and each era it visits.

import { ask, checkFit, plain } from './assistant/client.js';
import { START } from './assistant/answers.js';
import { MAX_POST, isJobPost, parseFit } from './assistant/fit.js';
import { blip } from './sound.js';

const KEY = 'tt-agent'; // the conversation, kept for this visit (sessionStorage)
const WAIT_KEY = 'tt-agent-wait'; // a rest being counted down, and questions left today (sessionStorage)
const KEEP = 30; // messages kept

// Where an answer can point, and what to call it in "See …".
const PLACES = {
  '#top': 'the top', '#work': 'Work', '#workshopos': 'WorkshopOS', '#word-hunt': 'Word Hunt',
  '#physiocoach': 'PhysioCoach', '#catering': 'the catering system', '#stack': 'the Stack',
  '#story': 'the Story', '#contact': 'Contact', 'resume/': 'the resume', 'work/workshopos/#map': 'the system map',
};

// The first questions offered, by why the visitor came (the 2026 intent picker).
const STARTERS = {
  hire: ['Does he fit my job?', 'Is he free to hire?', 'Show me his biggest project'],
  build: ['Could he build a system for my business?', 'Tell me about the catering project', 'How can I contact him?'],
  explore: ['Can I play his game?', 'Take me to 1997', 'What has he built?'],
};
const GREETING = "Hi! I know Irshad's work inside out. Ask me anything, or pick one below.";
// Some eras greet in their own way; the agent behind it is the same everywhere.
const GREETINGS = {
  1992: "Welcome. This is Irshad's agent, an experimental hypertext service. Type a question and press Return, or select a topic below.",
  1997: "It looks like you're visiting a homepage! Would you like help? Ask me anything about Irshad, or pick one below.",
  2001: "IrshadsAgent signed on. Hey! I know Irshad's work inside out. Ask me anything, or pick one below.",
  2007: "Hi! I'm Irshad's Agent (beta). Now with AJAX! Ask me anything about Irshad, or pick one below.",
  2013: "What can I help you with? Ask me anything about Irshad, or pick one below.",
  2030: "Hello from 2030. Here the page is a place, and I'm its guide. Ask me anything about Irshad, or pick one below.",
};

// "(#word-hunt)" at the end of an AI answer: the page shows it as "See Word Hunt" instead.
const CITE = /\s*\((#[a-z-]+)(?:[\s,]+#[a-z-]+)*\)/g;

// Under an answer, visitors see "Quick answer" for one the page knew without asking the AI: it
// shows the care taken over speed and cost, and explains an answer that fits a little loosely.
// Under an AI answer, faint signal bars say how strong the AI that answered was (POWER): when the
// strongest is busy and a backup answers, a weaker answer is explained the way a weak phone signal
// explains a bad call, without the word "low" on anyone's screenshot. A tap says it in words.
// Nothing under the helpline or a trip in time. Which AI answered ("Gemini · 1.9 s", "Groq") is for
// Irshad, not visitors: they should meet Irshad's Agent, not a brand they use every day. ?trace in
// the address shows it, and it stays on in that browser; ?trace=off turns it off. Cloudflare's
// logs record which AI answered every question too.
const POWER = { Gemini: [3, 'Full power'], 'Gemini Lite': [2, 'Busy hour: a lighter model'], Groq: [1, 'Backup model'] };
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
  const askHint = input.placeholder;

  // { role: 'user' | 'assistant', text, post?, id?, by?, link?, next?, fit?, trace?, label? }
  // (post: the visitor's message is a job post; id: which ready answer; fit: the check of a post)
  let messages = read();
  let busy = false;
  let waiting = false; // for a job post, after "Does he fit my job?"
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

  // A pasted job post: its first lines, folded, so it doesn't push the check out of view.
  function postBubble(text) {
    const li = el('li', 'agent__msg agent__msg--me agent__msg--post');
    li.append(el('span', 'agent__post-head', 'Job post'), el('span', 'agent__post-text', text));
    log.append(li);
    return li;
  }

  // `status`: what it's doing, beside the dots, for an answer that takes a few seconds.
  function botMessage(status) {
    const li = el('li', 'agent__msg agent__msg--bot');
    const text = el('p', 'agent__text');
    text.append(el('span', 'agent__typing'));
    text.lastChild.append(el('i'), el('i'), el('i'));
    text.lastChild.setAttribute('aria-label', 'Thinking');
    if (status) text.append(el('span', 'agent__status', status));
    li.append(text);
    log.append(li);
    return li;
  }

  // The answer's words, without the "(#section)" the AI adds for the page.
  const words = (raw) => plain(raw).replace(CITE, '').trim();

  // A link to a part of the page; on a wide screen it scrolls there and lights it up.
  function placeLink(className, link, text) {
    const a = el('a', className, text);
    a.href = link;
    if (link.startsWith('#')) a.dataset.agentPoint = link;
    return a;
  }

  // The job-fit check as a card, redrawn as its lines arrive. The summary takes the answer's usual
  // place; the matches, gaps and question follow.
  function drawFit(li, fit) {
    li.classList.add('agent__msg--fit');
    if (fit.summary) li.querySelector('.agent__text').textContent = fit.summary;
    const card = li.querySelector('.fit') ?? li.appendChild(el('div', 'fit'));
    card.replaceChildren();
    if (fit.matches.length) {
      const list = el('ul', 'fit__list fit__list--match');
      for (const m of fit.matches) {
        const row = el('li', 'fit__row');
        row.append(el('span', 'fit__need', m.need));
        if (m.proof) row.append(el('span', 'fit__proof', m.proof));
        if (m.link && PLACES[m.link]) row.append(placeLink('fit__link', m.link, `See ${PLACES[m.link]}`));
        list.append(row);
      }
      card.append(el('p', 'fit__head', 'Shown on this site'), list);
    }
    if (fit.gaps.length) {
      const list = el('ul', 'fit__list fit__list--gap');
      for (const gap of fit.gaps) list.append(el('li', 'fit__row', gap));
      card.append(el('p', 'fit__head', 'Not shown here'), list);
    }
    if (fit.ask) {
      const ask = el('p', 'fit__ask');
      ask.append(el('span', 'fit__head', 'Worth asking him'), el('span', null, fit.ask));
      card.append(ask);
    }
    if (!card.childElementCount) card.remove();
  }

  // "Email this job to Irshad": his address from the Contact section, the post in the body.
  function mailLink(post) {
    const to = document.querySelector('#contact a[href^="mailto:"]')?.getAttribute('href').split('?')[0] ?? 'mailto:irshaduu01@gmail.com';
    const body = `Hi Irshad,\n\nI checked this job against your portfolio. Could we talk?\n\n${post.slice(0, 800)}${post.length > 800 ? '…' : ''}`;
    const a = el('a', 'fit__mail', 'Email this job to Irshad');
    a.href = `${to}?subject=${encodeURIComponent('A job that may fit you')}&body=${encodeURIComponent(body)}`;
    return a;
  }

  // The signal bars, as a button: a tap (or a hover) says what they mean.
  function signal([level, note]) {
    const b = el('button', 'agent__signal');
    b.type = 'button';
    b.title = note;
    b.setAttribute('aria-label', `Answer strength: ${note}`);
    for (let i = 1; i <= 3; i++) b.append(el('i', i <= level ? 'is-on' : null));
    b.append(el('span', 'agent__signal-note', note));
    return b;
  }

  // `seen`: the answer just before pointed to the same part, so its "See …" isn't repeated.
  function finish(li, { text, fit, post, link, seen, next, by, trace, label, more }) {
    if (fit) {
      drawFit(li, fit);
      if (!fit.summary) li.querySelector('.agent__text').textContent = 'Here is how the post compares with his work.';
      if (post) li.append(mailLink(post));
    } else {
      li.querySelector('.agent__text').textContent = words(text);
    }
    if (link && PLACES[link] && !seen) {
      const see = el('p', 'agent__see');
      see.append(placeLink(null, link, `See ${PLACES[link]}`));
      li.append(see);
    }
    const line = showTrace ? trace : label;
    if (line) {
      const p = el('p', 'agent__trace', line);
      if (!showTrace && line.startsWith('Quick answer')) p.title = 'Answered instantly, without asking the AI.';
      li.append(p);
    } else if (!showTrace && POWER[by]) {
      // Right after the last word, like the ticks on a chat message: no line of its own.
      li.querySelector('.agent__text').append(signal(POWER[by]));
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
    finish(botMessage(), { text: GREETINGS[ctx.root.dataset.era] ?? GREETING, next: STARTERS[intent] ?? START });
    let before = null; // the part of the page the answer before pointed to
    messages.forEach((m, i) => {
      if (m.role === 'user') return m.post ? postBubble(m.text) : userBubble(m.text);
      const last = i === messages.length - 1;
      const post = m.fit && messages[i - 1]?.post ? messages[i - 1].text : null;
      finish(botMessage(), { ...m, post, seen: m.link === before, next: last ? m.next : null, more: last ? m.more : null });
      before = m.link;
    });
    if (messages.length) log.querySelector('.agent__next')?.remove(); // the greeting's starters, once talking
    setWaiting(messages.at(-1)?.id === 'fit'); // still waiting for the job post it asked for
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
  function traceOf({ by, id }, tried, ms, rested) {
    if (by === 'ready') return [id === 'fit-check' ? 'Word check' : 'Quick answer', rested].filter(Boolean).join(' · ');
    if (by === 'none') return ['No answer found', rested].filter(Boolean).join(' · ');
    if (by === 'limit') return 'Visitor limit reached';
    const busyOnes = tried.filter((t) => !t.endsWith('answered')).map((t) => t.split(':')[0]);
    return [`${by} · ${(ms / 1000).toFixed(1)} s`, ...busyOnes.map((name) => `${name} was busy`)].join(' · ');
  }

  // For visitors: "Quick answer" under a ready answer, saying so when it stood in for a resting AI.
  // Not under "paste the job post", nor under a job-fit check: a word check says what it is itself.
  function labelOf({ by, id, travel }, rested) {
    if (id === 'crisis' || id === 'fit' || id === 'fit-check' || travel) return null;
    if (by === 'ready') return rested ? 'Quick answer · the AI is resting' : 'Quick answer';
    return null; // AI answers have their bars; a resting answer says so, and the header's dot says how long
  }

  // The box grows with what's typed or pasted, up to a few lines (its max-height), then scrolls.
  function grow() {
    if (panel.hidden) return;
    input.style.height = 'auto';
    // scrollHeight leaves out the box's own border (1992's has one), which would add a scroll bar.
    input.style.height = `${input.scrollHeight + input.offsetHeight - input.clientHeight}px`;
    const cs = getComputedStyle(input);
    const oneLine = parseFloat(cs.lineHeight) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    form.toggleAttribute('data-tall', input.scrollHeight > oneLine * 1.5);
  }

  // After "Does he fit my job?": the box asks for the post, and whatever comes next is checked.
  function setWaiting(on) {
    waiting = on;
    form.toggleAttribute('data-paste', on);
    input.placeholder = on ? 'Paste the job post here' : askHint;
    grow();
  }

  // `tapped`: a suggestion button, whose ready answer comes at once. Typed questions go to the AI,
  // and a job post to the job-fit check.
  async function send(question, { deep = false, tapped = false } = {}) {
    question = question.trim();
    const post = !tapped && isJobPost(question, { waiting });
    question = question.slice(0, post ? MAX_POST : 600);
    if (!question || busy) return;
    busy = true;
    setWaiting(false);
    form.classList.add('is-busy');
    input.value = '';
    grow();
    sendButton.disabled = true;
    // On a touch screen, put the keyboard away so the whole answer has room.
    if (touch.matches) input.blur();
    clearOldNext();
    const asked = post ? postBubble(question) : userBubble(deep ? `Tell me more: ${question}` : question);
    const li = botMessage(post ? 'Reading the job post' : null);
    showFrom(asked);
    blip(520, 0.05);

    const started = performance.now();
    // What the AI reads of the conversation: the last few real turns (the server reads eight). The
    // agent's own stand-ins ("catching its breath", "You're quick!") were never the AI's words, so
    // they're left out. An earlier job post goes shortened: its check, the answer after it, says the rest.
    const history = messages
      .filter((m) => !(m.role === 'assistant' && (m.by === 'none' || m.by === 'limit')))
      .slice(-8)
      .map(({ role, text, post: pasted }) => ({ role, content: pasted ? `A job post (the start of it): ${text.slice(0, 1200)}` : text.slice(0, 2000) }));
    let raw = '';
    let tried = [];
    let rested = null; // why the AI couldn't answer, if it couldn't
    const on = (e) => {
      if (e.type === 'step' && !/^(Looking for|Asking|Reading)/.test(e.text)) rested = e.text;
      if (e.type === 'source') tried = e.tried ?? [];
      if (e.type === 'text') {
        raw += e.t;
        if (post) drawFit(li, parseFit(raw, { done: false }));
        else li.querySelector('.agent__text').textContent = words(raw);
      }
    };
    try {
      const result = post
        ? await checkFit(question, { on })
        : await ask(question, history, { deep, tapped, on, context: { era: ctx.root.dataset.era, section: onScreen(), intent: ctx.root.dataset.intent } });
      const more = result.by === 'ready' && result.next?.length && !result.travel && !result.fit && !deep ? question : null;
      const answer = { role: 'assistant', id: result.id, text: result.text, by: result.by, link: result.link, next: result.next, more, fit: result.fit, trace: traceOf(result, tried, performance.now() - started, rested), label: labelOf(result, rested) };
      const before = messages.findLast((m) => m.role === 'assistant')?.link;
      finish(li, { ...answer, post: post ? question : null, seen: answer.link === before });
      messages.push(post ? { role: 'user', text: question, post: true } : { role: 'user', text: deep ? `Tell me more: ${question}` : question }, answer);
      write(messages);
      live.textContent = words(result.text);
      blip(880, 0.08);
      if (result.id === 'fit') setWaiting(true);
      noteStatus(result);
      act(result);
    } catch {
      li.querySelector('.fit')?.remove();
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
      // Say it, then go. The agent travels too, changing clothes with the page (js/main.js closes
      // it only in an era it doesn't visit yet).
      setTimeout(() => ctx.goTo(travel), 900);
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

  // ---- the header's dot: is the AI awake? ------------------------------------------------

  // Cyan and glowing, as always: the AI is awake. Amber and still, with "back in 0:52" ticking
  // down: the visitor used their minute's share, or every AI is resting. "back tomorrow" for the
  // day's share, and a faint "5 left today" near its end, so a long chat never ends by surprise.
  // Nothing more the rest of the time: a number only when it matters.
  const status = el('span', 'agent__wait');
  status.setAttribute('aria-hidden', 'true'); // the answer says it in words; a ticking clock would chatter
  title.append(status);
  let rest = { until: 0, reason: null, left: null };
  try {
    rest = { ...rest, ...JSON.parse(sessionStorage.getItem(WAIT_KEY)) };
  } catch {
    // Nothing kept, or storage blocked: awake.
  }
  let ticking = null;

  const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  function drawStatus() {
    const s = Math.ceil((rest.until - Date.now()) / 1000);
    const resting = s > 0;
    panel.toggleAttribute('data-resting', resting);
    status.textContent = resting ? (rest.reason === 'day' ? 'back tomorrow' : `back in ${clock(s)}`)
      : Number.isInteger(rest.left) && rest.left <= 5 ? `${rest.left} left today` : '';
    if (resting && !ticking) ticking = setInterval(drawStatus, 1000);
    if (!resting && ticking) {
      clearInterval(ticking);
      ticking = null;
    }
  }

  // What an answer says about the AI: a rest to count down, how many are left today, or, when a
  // model answered, that it's awake again.
  function noteStatus({ by, wait, left }) {
    if (wait) rest = { ...rest, until: Date.now() + wait.seconds * 1000, reason: wait.reason };
    else if (POWER[by]) rest = { ...rest, until: 0, reason: null };
    // The server says how many are left only when 5 or fewer: an AI answer without it means plenty.
    if (Number.isInteger(left)) rest.left = left;
    else if (POWER[by]) rest.left = null;
    try {
      sessionStorage.setItem(WAIT_KEY, JSON.stringify(rest));
    } catch {
      // Storage blocked: the dot just won't outlive the page.
    }
    drawStatus();
  }
  drawStatus();

  let returnTo = null;
  function open() {
    if (!panel.hidden) return touch.matches ? undefined : input.focus({ preventScroll: true });
    returnTo = document.activeElement;
    render();
    panel.hidden = false;
    grow();
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
  input.addEventListener('input', grow);
  // Enter sends, as in any chat; Shift+Enter starts a new line. A phone's Send key often arrives
  // while the last word is still being composed (Android), when keydown can't tell: the line break
  // it is about to insert (beforeinput) sends instead. A paste with line breaks stays a paste.
  let shift = false;
  input.addEventListener('keydown', (event) => {
    shift = event.shiftKey;
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  input.addEventListener('beforeinput', (event) => {
    if ((event.inputType === 'insertParagraph' || event.inputType === 'insertLineBreak') && !shift) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  panel.addEventListener('click', (event) => {
    if (event.target.closest('[data-agent-close]')) return close();
    const bars = event.target.closest('.agent__signal');
    if (bars) return bars.toggleAttribute('data-open');
    const chip = event.target.closest('[data-ask]');
    if (chip) return send(chip.dataset.ask, { deep: 'deep' in chip.dataset, tapped: true });
    const see = event.target.closest('[data-agent-point]');
    if (!see) return;
    if (wide.matches) {
      // Beside the page: scroll there and light it up, with the panel still open.
      event.preventDefault();
      point(see.dataset.agentPoint);
    } else {
      close(); // a phone: get the panel out of the way, then follow the link
    }
  });
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  // After a trip in time: greet the way the new era does (not while an answer is still arriving).
  const refresh = () => {
    if (!panel.hidden && !busy) render();
  };

  return { open, close, refresh, isOpen: () => !panel.hidden };
}
