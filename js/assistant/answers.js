// Ready-made answers: the common questions, answered instantly, for free, and always correctly.
//
// They answer the suggestion buttons (a tap gets its answer at once), and stand in when the AI is
// resting. A typed question goes to the AI, which reads the whole conversation: matching words in
// typed text misread too often ("switch to gemini" found the answer about Gemini). Every answer
// says only what the page itself says, in short, plain sentences, and links to where the page says
// it. Numbers are checked against the pages by tools/facts.mjs.
//
// Every answer also offers what to ask next (`next`), so a visitor is never left at a dead end.
// A next question never leads back to the answer it came from (the tests check).
//
// How a question finds its answer: each answer lists words that point to it. `phrases` score 3,
// `words` 2 and `weak` 1. A `words` entry of four letters or more also matches longer forms ("skill"
// finds "skills"); a weak one matches only itself, so "work" doesn't find "WorkshopOS". The best
// score wins, and on a tie the earlier answer. It counts as a sure fit only when those words are most
// of what the question says: "What are his skills?" is, but "Which of his skills would suit a
// fintech startup?" asks something more, so it goes to the AI.

// The assistant's name, for its button on the page. In the chat it just says "I", and gives its name
// only when asked who it is. (The AI's rules say the same: assistant/worker/prompt.js.)
export const NAME = "Irshad's Agent";

// Checked before anything else, typed or tapped, and never left to the AI: someone saying they want
// to end their life. Only plain first-person words count, so a joke like "wanna die?" thrown at the
// agent goes to the AI, which can tell a joke from a cry for help, and has the helpline too.
export const URGENT = [
  {
    id: 'crisis',
    phrases: ['kill myself', 'killing myself', 'end my life', 'ending my life', 'take my life', 'take my own life', 'i want to die',
      'i wanna die', 'hurt myself', 'harm myself', 'self harm', 'no reason to live', 'dont want to live', 'dont want to be alive'],
    words: ['suicide', 'suicidal'],
    text: "I'm really sorry you're feeling this way. Please talk to someone you trust, or call a helpline now. In India, Tele-MANAS is free, day and night: 14416. You don't have to go through this alone.",
    link: null,
    next: [],
  },
];

export const ANSWERS = [
  {
    id: 'assistant',
    phrases: ['who are you', 'what are you', 'are you ai', 'are you a bot', 'how do you work'],
    words: ['assistant', 'agent', 'chatbot', 'bot', 'gemini', 'groq'],
    text: `I'm ${NAME}, his own assistant on this site, and one of his projects. He built me, so I know his work well. The suggestion buttons get an answer at once. For anything you type, I ask an AI that only knows what's on this site.`,
    link: '#irshads-agent',
    next: ['What is his best project?', 'Can I try one of his apps?', 'Is he free to hire?'],
  },
  {
    id: 'about',
    phrases: ['who is he', 'who is irshad', 'who is mohammed', 'who is this', 'about him', 'about irshad'],
    words: ['introduc', 'summary', 'himself', 'yourself'],
    text: 'Irshad is a Python developer from Malappuram, in Kerala, India. He builds the software a business runs on, from the first job card to the profit page. Before coding, he ran an events company for four years.',
    link: '#top',
    next: ['What has he built?', 'Why did he move from business to code?', 'What does he do for fun?'],
  },
  {
    id: 'skills',
    phrases: ['tech stack'],
    words: ['skill', 'stack', 'technolog', 'tech', 'tools', 'languages', 'framework', 'expertise', 'proficien'],
    text: 'Mostly Python and Django, with PostgreSQL for data and plain JavaScript in the browser. He also works with WebSockets, PWAs, Web Push, and the Web Audio and Web Speech APIs. And he tests a lot: 3,500+ automated tests across his projects.',
    link: '#stack',
    next: ['Where did he use WebSockets?', 'How does he test his code?', 'Show me his biggest project'],
  },
  {
    id: 'django',
    words: ['django', 'python', 'backend'],
    text: 'Python is his main language and Django is his main tool. All four of his projects use it. WorkshopOS is a big Django and PostgreSQL system, and Word Hunt runs live games on Django Channels.',
    link: '#stack',
    next: ['Tell me about WorkshopOS', 'How does Word Hunt work?', 'Can I see his code?'],
  },
  // Before the projects: "Can I play his game?" wants the game itself, not a story about it.
  {
    id: 'demo',
    phrases: ['try it', 'try one', 'try them', 'play it', 'play now'],
    words: ['demo', 'play', 'try'],
    text: "Yes, two of them are live. Play Word Hunt at word-hunt-game.onrender.com, or open PhysioCoach at therapist.pythonanywhere.com. Each has a demo button, so you don't need to sign up.",
    link: '#word-hunt',
    next: ['How does Word Hunt work?', 'Tell me about PhysioCoach'],
  },
  {
    id: 'workshopos',
    phrases: ['workshop os', 'car workshop', 'formula d'],
    words: ['workshopos', 'titan', 'garage', 'workshop'],
    text: 'WorkshopOS runs Formula D, a premium car workshop in Kerala. It replaced their paper job cards, WhatsApp groups and spreadsheets. Irshad built it alone: 49 models, 324 routes and 140 screens, with 3,185 Django tests. The owners tested it and approved it for go-live.',
    link: '#workshopos',
    next: ['What was the hardest problem in it?', 'Show me the system map', 'How does it keep the money right?'],
  },
  {
    id: 'map',
    phrases: ['system map'],
    words: ['map', 'diagram'],
    text: "Here's all of WorkshopOS on one page: the owner, the office and the floor, with the job card in the middle. Open it full size to zoom in.",
    link: 'work/workshopos/#map',
    next: ['How does it keep the money right?', 'Tell me about WorkshopOS'],
  },
  {
    id: 'word-hunt',
    phrases: ['word hunt', 'word game'],
    words: ['wordhunt', 'game', 'multiplayer', 'websocket', 'channels', 'realtime'],
    text: "Word Hunt is a word game Irshad made for voice calls with friends. Up to 10 players hunt for one hidden word while their time runs out. It runs live on Django Channels and costs $0 a month to run. It has 78 tests. You can play the demo now, no sign-up.",
    link: '#word-hunt',
    next: ['Can I play it now?', 'What happens if my internet drops?', 'Why is it free to run?'],
  },
  {
    id: 'physiocoach',
    phrases: ['physio coach', 'knee surgery'],
    words: ['physiocoach', 'physio', 'therapist', 'rehab', 'knee', 'exercise', 'malayalam', 'surgery'],
    text: 'Irshad built PhysioCoach after his own knee surgery, and used it every day of his recovery. You press Start and put the phone down: it counts the holds and reps out loud, in English or Malayalam. It works offline too. It has 80 tests.',
    link: '#physiocoach',
    next: ['Can I try it?', 'How does the voice work?', 'What if the phone goes offline?'],
  },
  {
    id: 'catering',
    phrases: ['event management', 'staff app'],
    words: ['catering', 'badusha', 'specification', 'consult'],
    weak: ['architecture'],
    text: 'Badusha Event Management ran its catering staff on paper and WhatsApp. Irshad wrote the full plan for an app to replace that: a 10-role catering staff app. It has 24 modules, ranked MVP, Optional or Deferred, across six Django apps. Other developers can build it from his plan.',
    link: '#catering',
    next: ['How do staff move up?', 'What about privacy of staff data?', 'Can I read the plan?'],
  },
  // After the projects themselves: on a tie the earlier answer wins, so "the catering project" finds
  // the catering answer, not this list.
  {
    id: 'projects',
    phrases: ['his work', 'what has he built', 'what did he build'],
    words: ['project', 'portfolio', 'apps'],
    weak: ['work', 'built', 'build', 'made', 'app'],
    text: "Five main ones. WorkshopOS runs a car workshop. Word Hunt is a live word game. PhysioCoach is a knee rehab coach that talks. He planned a staff app for a catering company. And he built me. You can try Word Hunt and PhysioCoach right now, and you're already talking to me.",
    link: '#work',
    next: ['Tell me about WorkshopOS', 'Can I try one?', 'Which one was the hardest?'],
  },
  {
    id: 'tests',
    phrases: ['how many tests', 'code quality'],
    words: ['test', 'testing', 'quality'],
    text: "He tests a lot: 3,500+ automated tests across his projects. WorkshopOS alone has 3,185 Django tests and 71 JavaScript tests. That's 1.34 lines of test for every line of app code.",
    link: '#workshopos',
    next: ['How does he keep the money right?', 'Tell me about WorkshopOS', 'Can I see his code?'],
  },
  {
    id: 'story',
    phrases: ['before coding', 'before code', 'algorithmic trading'],
    words: ['experience', 'background', 'career', 'story', 'history', 'trading', 'founder', 'business', 'company', 'years'],
    text: 'Before code, he ran his own event management company for four years, from 2019 to 2023. Then he ran automated trading systems for a year. He learned Python and Django in 2025, and he has worked as a freelance developer since 2026.',
    link: '#story',
    next: ['How does business help his coding?', 'What did he study?', 'What is he working on now?'],
  },
  {
    id: 'education',
    words: ['education', 'degree', 'certific', 'course', 'study', 'studied', 'qualific', 'college', 'entri'],
    text: 'He did a Python and Django full-stack course at Entri Elevate in 2025, with Grade A+ (98%). He also has a Python certificate from Illinois Institute of Technology (Certified User).',
    link: '#story',
    next: ['What has he built since?', 'What are his skills?', 'Is he free to hire?'],
  },
  // The job-fit check: the visitor pastes a job post next, and js/agent.js waits for it (js/assistant/fit.js).
  // Before 'hire', which "job" also points to.
  {
    id: 'fit',
    phrases: ['fit my job', 'fit the job', 'fit this job', 'fit our job', 'fit my role', 'fit our role', 'fit the role',
      'job fit', 'another job', 'check a job', 'check my job', 'check this job', 'match my job', 'compare my job'],
    text: "Paste the job post below, the whole thing. I'll check it against what this site shows: what matches, with proof, and what isn't shown here.",
    link: null,
    next: [], // the visitor's next move is the paste
  },
  {
    id: 'hire',
    phrases: ['open to', 'looking for a job', 'work with him', 'work with you'],
    words: ['hire', 'hiring', 'available', 'availability', 'freelance', 'job', 'role', 'position', 'opportunit', 'recruit'],
    text: "Yes. He's open to full-time roles and freelance projects. Message him on WhatsApp or email irshaduu01@gmail.com, whichever is easier for you.",
    link: '#contact',
    next: ['Does he fit my job?', 'What is he like to work with?', 'Can I see his resume?'],
  },
  {
    id: 'contact',
    phrases: ['get in touch', 'reach him', 'talk to him'],
    words: ['contact', 'email', 'mail', 'whatsapp', 'phone', 'number', 'call', 'linkedin', 'message'],
    text: "WhatsApp or email: irshaduu01@gmail.com. Both are in the Contact part of this page. He's on GitHub and LinkedIn too.",
    link: '#contact',
    next: ['Is he free to hire?', 'Can I see his resume?'],
  },
  {
    id: 'location',
    phrases: ['time zone', 'where is he', 'where does he live', 'where is he from'],
    words: ['location', 'located', 'based', 'timezone', 'kerala', 'india', 'malappuram', 'remote', 'relocat', 'onsite', 'country', 'city'],
    text: 'He lives in Malappuram, Kerala, India. His time zone is IST (UTC+5:30). For remote work or moving for a job, please ask him directly.',
    link: '#contact',
    next: ['Is he free to hire?', 'How can I contact him?'],
  },
  {
    id: 'resume',
    words: ['resume', 'cv', 'pdf'],
    text: "Here's his resume. You can read it on the page or download the PDF.",
    link: 'resume/',
    next: ['What are his skills?', 'Is he free to hire?'],
  },
  {
    id: 'code',
    phrases: ['source code', 'open source'],
    words: ['github', 'code', 'repo', 'repository'],
    text: 'Word Hunt and PhysioCoach are open on GitHub (github.com/Irshaduu). WorkshopOS belongs to a client, so its code is private. Its overview and system map are public.',
    link: '#work',
    next: ['Tell me about Word Hunt', 'Show me the system map'],
  },
  {
    id: 'price',
    phrases: ['how much'],
    words: ['price', 'pricing', 'rate', 'rates', 'charge', 'salary', 'budget', 'fee', 'fees', 'quote', 'ctc', 'expected'],
    text: "That depends on the work, so I don't give numbers. Tell Irshad what you need, and he'll reply himself.",
    link: '#contact',
    next: ['How can I contact him?', 'What has he built?'],
  },
  {
    id: 'site',
    phrases: ['this site', 'this website', 'this portfolio', 'time machine'],
    words: ['site', 'website', 'eras', 'era', 'slider'],
    text: "This page has eight looks, one for each era of the web. Tap a year on the time machine at the bottom, or drag it, to visit 1992, 1997, 2001, 2007, 2013, 2023, 2026 or 2030. The content stays the same. Only the clothes change. It's plain HTML, CSS and JavaScript, with no framework.",
    link: '#top',
    next: ['Take me to 1997', 'Why build it this way?'],
  },
  // A small model's jokes rarely land, so the joke is written here, and it leads somewhere.
  {
    id: 'joke',
    phrases: ['make me laugh', 'say something funny'],
    words: ['joke', 'jokes', 'funny'],
    text: 'Why did the website travel back to 1997? It missed the blinking text. You can see it too.',
    link: null,
    next: ['Take me to 1997', 'What has he built?'],
  },
  {
    id: 'thanks',
    words: ['thanks', 'thank', 'thx'],
    text: "You're welcome! Irshad is one message away on WhatsApp or email, if you want to talk to him.",
    link: '#contact',
    next: ['How can I contact him?'],
  },
  {
    id: 'hello',
    phrases: ['good morning', 'good evening', 'good afternoon'],
    words: ['hi', 'hello', 'hey', 'hai', 'namaste', 'hola'],
    text: "Hi! I know Irshad's work inside out. Ask me anything, or pick one below.",
    link: null,
    next: null, // the opening questions
  },
];

// The first questions offered, before the visitor types anything.
export const START = ['What has he built?', 'Can I play his game?', 'Is he free to hire?'];

// What the assistant says when nothing fits and the AI is resting (or out of reach): the truth, in
// its own voice. The header's dot says how long the rest will be.
export const DONT_KNOW = 'My AI brain is catching its breath. Ask me again in a minute. The buttons below still work, and Irshad is one message away on WhatsApp or email.';
export const DONT_KNOW_NEXT = ['How can I contact him?', 'What has he built?'];

// When a visitor reaches their share of AI questions (assistant/worker/limits.js), the agent says so
// in its own voice, so it never looks broken. The suggestion buttons still answer instantly.
export const LIMIT = {
  minute: {
    text: "You're quick! Give me a minute to catch up, then ask again. The buttons below still answer instantly.",
    next: START,
  },
  day: {
    text: "We've talked a lot today! I'm resting till tomorrow. The buttons below still work, and Irshad is one message away on WhatsApp or email.",
    next: ['How can I contact him?', 'Can I play his game?', 'What has he built?'],
  },
};

// What to offer after an answer that points to `link` (an AI answer points with "(#word-hunt)"):
// that section's own answer's next questions, else any answer's that points there, else the start.
export function nextFor(link) {
  if (!link) return START;
  return ANSWERS.find((a) => `#${a.id}` === link)?.next ?? ANSWERS.find((a) => a.link === link && a.next)?.next ?? START;
}

// The eras the time machine stops at (the same years as js/eras.js).
export const ERAS = [1992, 1997, 2001, 2007, 2013, 2023, 2026, 2030];

// "Take me to 1997": the era to travel to, and what to say on the way. Null if it isn't that.
export function travel(question) {
  const m = normalize(question).match(/\b(?:take me|go|travel|jump|back|switch|show me)(?: back)? to (?:the )?(?:year )?((?:19|20)\d\d)s?\b/)
    ?? normalize(question).match(/^(?:show me )?((?:19|20)\d\d)$/);
  if (!m) return null;
  const year = Number(m[1]);
  const era = [...ERAS].reverse().find((e) => e <= year) ?? ERAS[0];
  const text = year > ERAS.at(-1) ? `${era} is as far as the time machine goes. Off we go.`
    : year < ERAS[0] ? `${era} is the first stop. Off we go.`
    : `Off to ${era}. Watch the page change.`;
  return { id: 'travel', era, text, link: null, next: ['Why build it this way?', 'What has he built?'] };
}

// Words that don't change what a question is about.
const STOP = new Set(`a an the is are was were be been am do does did done can could would should will
  may might must i im me my you your we our he hes him his she her they them their it its this that
  these those what whats which who whom whose when where why how there here of in on at for to from
  by with about as into like than then so and or but not no yes please tell show give know want need
  let lets any some many much more most very just also really ok okay irshad irshads mohammed one
  has have had get got`.split(/\s+/));

export function normalize(text) {
  return text.toLowerCase().replace(/['’]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

const hits = (token, word) => token === word || (word.length >= 4 && token.startsWith(word));

// The best ready answer for a question: { ...answer, score, sure }, or null if nothing points to one.
// `sure` means it can be shown as the answer; otherwise it's only a stand-in for when the AI rests.
// An urgent answer, when anything points to it, is always sure.
export function match(question) {
  const tokens = normalize(question).split(' ').filter(Boolean);
  if (!tokens.length) return null;
  const padded = ` ${tokens.join(' ')} `;

  const scored = (answer) => {
    let score = 0;
    const covered = new Set(); // positions of the question's words this answer explains
    for (const phrase of answer.phrases ?? []) {
      const at = padded.indexOf(` ${phrase} `);
      if (at < 0) continue;
      score += 3;
      const start = padded.slice(0, at).split(' ').filter(Boolean).length;
      phrase.split(' ').forEach((_, i) => covered.add(start + i));
    }
    tokens.forEach((token, i) => {
      if (answer.words?.some((w) => hits(token, w))) {
        score += 2;
        covered.add(i);
      } else if (answer.weak?.includes(token)) {
        score += 1;
        covered.add(i);
      }
    });
    return { answer, score, covered };
  };

  for (const answer of URGENT) {
    const { score } = scored(answer);
    if (score) return { ...answer, score, sure: true };
  }

  let best = null;
  for (const answer of ANSWERS) {
    const s = scored(answer);
    if (s.score > (best?.score ?? 0)) best = s;
  }
  if (!best) return null;

  const unexplained = tokens.filter((token, i) => !best.covered.has(i) && !STOP.has(token)).length;
  const share = best.covered.size / (best.covered.size + unexplained);
  return { ...best.answer, score: best.score, sure: best.score >= 2 && share >= 0.5 };
}
