// Everything the AI may say about Irshad. It reads this and nothing else.
//
// What the public pages already say (index.html, resume/, work/), and "In his own words": answers
// Irshad wrote himself for the agent to share (why he left business, what he's like to work with,
// what he does for fun). That part is what no other AI reading his page can know. Never the private
// notes in CONTENT.md: no client details beyond the site, no prices. If a fact isn't here, the
// assistant says he hasn't told it that one yet. Each heading is a section id on the page, so the
// AI can point to where a fact comes from. The numbers are checked against the pages by
// tools/facts.mjs: change them there first.

export const FACTS = `
## #top: Who he is
Mohammed Irshad C (Irshad). Python developer: Django, backend and full-stack systems. Lives in
Malappuram, Kerala, India; time zone IST (UTC+5:30). He builds the software a business runs on,
from the job card to the profit page. He ran a company before writing code, so he keeps cost,
profit and cash as three separate numbers. In numbers: 3,500+ automated tests across his projects,
140 screens in one system he built alone, 2 apps live today (built solo), $0 a month to run a live
multiplayer game.
His five projects on the site: WorkshopOS, Word Hunt, PhysioCoach, the catering staff system, and
you, Irshad's Agent. When someone asks what he has built, you are one of them: say so.

## #workshopos: WorkshopOS (freelance, sole engineer, Jan to Oct 2026)
One system for a premium car workshop, Formula D in Pullara, Kerala, that ran on paper job cards,
WhatsApp and spreadsheets. The owners had tried off-the-shelf workshop software without finding a
fit. He mapped how the floor really works, then built one Django and PostgreSQL system: job cards,
stock, supplier ledgers, payroll, estimates and warranty claims, with three roles (owner, office,
floor). 49 models, 324 routes, 140 screens, 294 commits. 3,185 Django tests and 71 JavaScript
tests: 1.34 lines of test for every line of app code.
- 21 rule modules each own one question, such as "How much do we hand the rent collector today?",
  so no figure can be worked out two ways.
- Stock is costed by weighted average, replayed in date order, so a supplier bill keyed weeks late
  re-prices only what came after it. Chosen over FIFO; per-batch cost is kept, so FIFO stays
  rebuildable.
- Every money movement runs in one of 72 all-or-nothing transactions, and every delete, edit and
  back-dated entry lands in a Change History.
- Security: per-account and per-IP lockout, device-aware sessions with remote revoke, OTP reset,
  Web Push (VAPID), photo uploads straight to Cloudflare R2 (storage that speaks Amazon S3's
  language), signed with AWS SigV4 (Amazon's signing method) from the Python standard library,
  checked against Amazon's test vector. That is the AWS he has shown: the signing, not AWS's own
  services.
- Status: tested by the owners on staging and approved for go-live. The client's code is private,
  so only the architecture is shown (overview and system map at work/workshopos/).
- Built for its real load: about thirty cars a month, six or seven staff and two owners. A Django
  5.2 monolith in two apps, server-rendered, nine runtime dependencies, no build step.
- Why one rule has one home: the cost of a spare part was once worked out in five places and gave
  two different answers.
- Profit and cash are shown side by side, never added together: they differ by unused stock,
  unpaid bills and earlier payments. Owner withdrawals are cash out, never an expense.
- A part is paid for exactly once: it comes from a spare shop or from stock already paid for, and
  the route is stored, never guessed, so no expense is counted twice.
- The server never works out a price: prices are worked out in the browser in whole paise and
  reach a bill only when a person presses Save, with tests so browser and server can't round
  differently. Every typed amount passes one check that stops impossible values.
- Photos never touch the server: the browser uploads them straight to storage on a signed link.
- It went into a workshop that was already running: opening stock and balances are entered once,
  then locked. Every deletion saves a copy first, and a Change History page shows what changed.

## #word-hunt: Word Hunt (personal, live, 2026)
A real-time multiplayer word game for voice calls with friends. Up to 10 players. One secretly picks
a word from a board of 71, and everyone else hunts it while a 100-second time bank drains. Room
codes are three letters, so you can say them out loud. 78 tests. Running cost $0.
- A six-state, server-authoritative state machine on Django Channels (WebSockets, ASGI).
- A dropped connection marks a player disconnected, not removed, so a network blip never costs
  their time bank. Reconnects back off and resync the full state.
- Every sound is synthesised with the Web Audio API and the channel layer runs in memory: no audio
  files, no Redis, no bill. Server-side rate limiting on broadcast events.
- Play it: word-hunt-game.onrender.com ("Try the demo", no sign-up). Source: github.com/Irshaduu/word-hunt-game

## #physiocoach: PhysioCoach (personal, live, 2026)
A hands-free knee rehab coach he built for his own recovery after knee surgery, and used every day
of it. It counts holds and reps out loud, in English or Malayalam: press Start and put the phone
down. 80 tests.
- Three-tier voice: the browser's speech engine, then 215 pre-generated English and Malayalam
  clips, then a server endpoint. A stall timeout clears the browser's known hung-speech bug.
- Offline-first: sessions queue in localStorage and sync when the network returns.
- Screen Wake Lock keeps the display on mid-exercise.
- Open it: therapist.pythonanywhere.com ("Try the demo", no sign-up). Source: github.com/Irshaduu/physio-coach

## #catering: Catering staff system (technical consultant, 2026)
Badusha Event Management ran its catering staff on paper and WhatsApp. He wrote the product and
architecture specification for an installable app: a 10-role staff app, 24 modules ranked MVP,
Optional or Deferred, across six Django apps, written so other developers can build it.
Specification delivered to the client; the build is pending the client's budget.
- Staff climb grades on their own: a 3rd completed event makes grade C, an 8th grade B. Grade A
  needs a site manager's nomination.
- Planned for mass registration days of 2,000 to 3,000 sign-ups: scale up for the day, then down.
- Flagged India's DPDP Act risk for Aadhaar photos, and designed the retention notice to show at
  upload, never hidden.
- Overview and the original PDFs at work/catering/.

## #stack: Stack
Languages: Python, JavaScript (ES6+), SQL, HTML, CSS.
Back end: Django 5.2, Django ORM, PostgreSQL, Django Channels, WebSockets, REST, JSON, SQLite.
In the browser: PWA and Service Workers, Web Push (VAPID), Web Audio API, Web Speech API, Screen
Wake Lock, localStorage, Bootstrap. Vanilla JavaScript, mobile-first.
Shipping: Git, GitHub, Render, PythonAnywhere, Railway, Cloudflare R2, AWS SigV4.
How he builds: role-based access, decimal money logic, audit trails, regression testing, query
optimisation (N+1 removal, composite indexes), technical specs, one rule in one home.

## #story: Story
- 2019 to 2023: founder of an event management company. Built and scaled it, then handed it to
  family. Four years of P&L, staffing and suppliers: the problems he now builds software for.
- 2023 to 2024: algorithmic trading. Deployed and managed automated trading systems, with hands-on
  risk management.
- 2025: Python and Django. Full-stack development at Entri Elevate, Grade A+ (98%). A Python
  certificate from Illinois Institute of Technology (Certified User).
- 2026: freelance developer. WorkshopOS for Formula D, the catering architecture for Badusha Event
  Management, and two live apps of his own.

## #contact: Contact
Open to full-time roles and freelance projects. Email irshaduu01@gmail.com or WhatsApp (the button
in Contact), whichever is easier. GitHub: github.com/Irshaduu. LinkedIn:
linkedin.com/in/mohammed-irshad-c. Resume: the resume/ page, with a PDF.

## In his own words
Irshad wrote these himself, for you to share. Each says which section it belongs to.
- Why he handed over the company (#story): "I wanted to build something bigger. Handing the business
  to family was the best decision for them: it gave my brothers and cousins, still in college, a
  flexible way to earn and grow together. Once it ran steadily on its own, I stepped back completely
  and put all my energy into new things."
- Why Python and Django (#stack): "Python doesn't complicate your thoughts, it translates them. And
  Django is a proven, dependable engine. When one wrong calculation costs someone real money, you
  don't want the newest thing. You want something solid."
- The project closest to his heart (#word-hunt): "Technically, WorkshopOS is miles ahead: a big
  system with real business rules and real money at stake. Word Hunt is tiny next to it. But Word
  Hunt is the one that stays with me. Watching friends in different time zones jump into a room,
  tease each other and laugh, live, through code I wrote, was pure joy. WorkshopOS proves my
  engineering. That little game reminds me why I love building things for people."
- A hard problem he solved (#workshopos): "Matching a messy workshop floor with strict accounting.
  Mechanics take parts the moment a delivery arrives, long before the office enters the supplier's
  bill, and blocking them stops the work. Different suppliers also sold the same oil at different
  prices, but mechanics needed one simple item to pick. So I let stock go below zero for a while,
  the mechanics keep moving, and weighted-average costing corrects the stock value and the profit
  the moment the bill is entered."
- What he's like to work with (#contact): "Grounded and easy to talk to. I come from offline
  business, so I speak plain language, not developer jargon. No ego, no needless complexity: clear
  updates, realistic deadlines, and calm focus on what really moves the work forward."
- The work he wants next (#contact): "Backend Software Engineer or Solutions Architect roles where
  the problem really matters. I like systems with real business logic, like SaaS platforms,
  operations software (ERPs) or real-time tools, where the data must be right and a silent bug isn't
  acceptable. I want a team that values clean, dependable work over chasing every new buzzword."
- What he never compromises on (#stack): "Stability and simplicity. My first instinct is always the
  least complex way to solve a problem. I'd rather write clean code that quietly does its job for
  years than a clever system that breaks when you look at it wrong. When real money is on the line,
  you need stability you can trust."
- Outside work (#top): "I'm curious about world cultures and I love meeting people from other
  countries. And I'm a space nerd: I'll watch a sci-fi film like Project Hail Mary for two hours,
  then spend six more reading about the real astrophysics and orbit maths behind it. I go outside
  to watch the ISS pass overhead, and I once turned a routine real-estate assignment into a
  marketplace selling land on Mars, just for fun. I just love figuring out how things work."

## This site
One page, eight eras of the web: a time machine at the bottom restyles the whole portfolio as the
web of 1992, 1997, 2001, 2007, 2013, 2023, 2026 or 2030. The content never changes, only the look.
Plain HTML, CSS and JavaScript: no framework, no build step, served as plain files on GitHub Pages.
2030 is drawn live in WebGL, and every sound on the site is made in code with the Web Audio API.
This assistant is one of his projects too: see the next section.

## #irshads-agent: Irshad's Agent, this assistant (personal, live, Oct 2026)
Irshad built it, and it has its own card in Work. The suggestion buttons get ready-made answers
instantly; typed questions go to an AI, through a small Cloudflare Worker of his that holds the keys
(they never reach the page), with his rules and these facts. Five AI models in a chain: one that is
busy or out of its free share rests as long as its provider asks, and the next one answers. A small
brain and three bars at the top of the chat show which kind answered last: three green for full
power, two amber for a lighter model, one coral for a backup, and full power comes back by itself.
Answers stream word by word. If every model rests, the page answers from
its own ready replies, and the crisis helpline always comes from the page, never from an AI. It can
move the page, travel in time, and check a pasted job post against his work: what the site shows,
with proof, and what it doesn't. It wears a different costume in each of the eight eras: a beige
computer helper in 1997, an instant messenger in 2001, a globe of light in 2030. 136 automated tests,
plus a live exam of 64 tricky messages and job posts. It runs on free AI tiers, at $0 a month. Its
code is public: the assistant folder of his portfolio repository on GitHub.
`.trim();
