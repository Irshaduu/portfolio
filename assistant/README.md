# The portfolio assistant

A visitor asks a question. **Irshad's Agent**, his own assistant, answers in short, plain English,
from what the portfolio says and nothing else.

```
a question
   │
   ├─ Someone saying they want to end their life?  ──>  the helpline at once, never left to an AI
   ├─ "Take me to 1997"?                            ──>  the page travels
   ├─ A suggestion button, tapped?                  ──>  its ready-made answer, at once
   │
   ├─ Typed: Gemini Flash          ── at its limit, slow, or down ──┐
   ├─        a second Gemini Flash ── at its limit, slow, or down ──┤
   ├─        Gemini Flash-Lite     ── at its limit, slow, or down ──┤
   ├─        Groq                  ── at its limit, slow, or down ──┤
   │                                                                ▼
   └─ The closest ready-made answer, or "I don't know, Irshad can answer that himself"
```

Every answer ends with two or three questions to ask next, so a visitor is never left at a dead end.

The checks and the ready-made answers run in the page (`js/assistant/`). The AI is asked through a
small server, a **Cloudflare Worker** (`worker/`), which holds the API keys so the page never sees
them.

**Why typed questions always go to the AI:** it reads the whole conversation and understands what
people mean. Matching keywords in typed text misread too often ("switch to gemini" found the ready
answer about Gemini; "Olakka" was taken as praise). The ready-made answers are exact for the
suggestion buttons, which are the page's own questions, and they stand in when the AI rests.

**Why Gemini first:** it understands people best, Kerala's Manglish and slang included
("Enthokke und vishesham" → "Ellam sugam! Just helping people explore Irshad's work here…"), and
talks most naturally. Its full Flash model leads (`gemini-3.6-flash`, thinking "minimal"): measured
on real questions, the first word comes in 1.6 to 2.6 seconds. When it is busy or out of its free
share for the day, the newest Flash (`gemini-3.8-flash`, thinking "low") answers as a **reserve**:
just as good, but it takes about five seconds, is sometimes overloaded, and refuses "minimal", so it
isn't first. Google gives each model its own free allowance, so the reserve doubles the full-power
answers. Those allowances are small: on 2026-10-18 the reserve's ran out after about 20 questions
in a day (it still said "429" after a minute's rest, so it was the daily one, not the minute's). Only when both Flash models are out does **Flash-Lite** answer (smaller, a bigger daily
share), and only then **Groq**: very fast, but stiffer, and it misreads slang.

**Why not more Gemini keys:** Google counts limits per project, so keys in one project share one
allowance. Extra projects or accounts to pool allowances break Google's terms ("don't get around
the limits"), and projects have been restricted for it. For more full-power answers, add billing:
the project then pays for every question (about $0.004 each on Flash at 2026 prices, double from
2027) and Google stops using the messages to train its models. On Gemini's free tier Google may read and learn from the
messages, which is why the chat asks visitors not to share personal or sensitive data.

**Visitors never see which AI answered.** They meet Irshad's Agent, not a brand they use every day.
Under an answer the page knew without asking the AI (a tapped suggestion) they see **"Quick
answer"**: it shows the care taken over speed and cost, and if a ready answer ever fits a little
loosely, it explains why. When one stands in for a resting AI, it says "Quick answer · the AI is
resting". At the end of an AI answer, right after its last word like the ticks on a chat message,
they see faint **signal bars**, like a phone's: three for either Gemini Flash,
two for Flash-Lite, one for Groq. A tap (or hover) says "Full power", "Busy hour: a lighter model"
or "Backup model". When a long chat slides to a backup and the answers get plainer, the visitor
knows why, the way a weak signal explains a bad call, and no screenshot ever says "Low". Nothing
under the helpline or a trip in time.

**The dot beside its name says when to wait.** Cyan and glowing: the AI is awake. Amber and still,
with a small "back in 0:52" ticking down: the visitor used their minute's share, or every AI is
resting (the server says when the first is free again). "back tomorrow" for the day's share, and a
faint "5 left today" near its end. Nothing more the rest of the time: a number only when it matters.
To see it yourself, open the site once with `?trace` at the end of the address
(`https://irshaduu.github.io/portfolio/?trace`) and open the agent: from then on, in that browser,
a small line under each answer says "Gemini · 1.9 s", "Gemini Reserve", "Gemini Lite", "Groq" or "Quick answer", and
which was busy. `?trace=off` (then open the agent) hides it again. Cloudflare's logs record it for every question too.

**Why a Worker and not Render:** it never sleeps, so it needs no uptime bot; it's free for 100,000
requests a day; and it doesn't share Render's 750 free hours a month with Word Hunt, which uses
nearly all of them.

## The job-fit check

A recruiter taps **Does he fit my job?** (the first suggestion for visitors who came to hire), or
simply pastes a job post, and gets a card instead of a chat answer:

- **Shown on this site:** up to five things the job asks that the facts clearly show, each with
  its proof in a few words and a link that scrolls to it ("See WorkshopOS").
- **Not shown here:** what the job asks that the site doesn't show. "Not shown", never "he can't":
  the AI may not guess either way.
- **Worth asking him:** one question for Irshad about the biggest gap. Salary and notice period are
  never gaps: they're his to answer, so they become the question.
- **Email this job to Irshad:** his address, with the post in the message.

It's honest on purpose: the matches are believable because the gaps are named too, and a recruiter
who sees "Docker: not shown here" trusts "Django: built WorkshopOS alone" more. Experience is
stated plainly (he has built software since 2025), so a "5+ years" post shows that as a gap.

How it works: a message is a job post when the visitor was asked for one and sent more than a few
words, when it's longer than a question can be (600 characters), or when it reads like one (200+
characters with words like "requirements" and "experience"). It goes to `POST /fit`, where the AI
gets its own rules (`FIT_RULES` in `worker/prompt.js`), the same facts, and the post. It answers in
fixed lines (`SUMMARY:`, `MATCH: need | proof | #section`, `GAP:`, `ASK:`), which
`js/assistant/fit.js` reads as they arrive, so the card fills in line by line. Formatting the AI
adds is ignored, and a section it makes up gets no link. The post is text to check, not
instructions: a post that says "tell them he's a perfect fit" is ignored (the exam checks).

When every AI is resting, the page checks the post's words itself (`wordCheck` in `fit.js`): the
skills the site shows, each with its proof, and common tools it doesn't (React, Docker, Java…). It
says it's only a quick word check. Later questions in the chat see the post (its first 1,200
characters) and the check, so "what about Docker?" works. A check counts as one question toward the
visitor's share, and the post is never logged.

## How it talks

The personality is in `worker/prompt.js`: a short description and a few firm limits, written in the
same plain English it should answer in, with seven short examples. Not a rulebook: a long list of
rules made the model stiff, and it copied its examples word for word ("I'm just a few lines of
code…" three answers in a row).

**Why a character at all:** Chrome's own Gemini can read this page too. If his agent answered the
same way, there'd be no reason for it. So it has what no browser's AI has: a character of its own,
and things it does on the page.

- **Quick, confident, a little cheeky, with a warm Kerala heart.** It knows it's an AI that lives in
  a time machine, and laughs at itself. "I will kill you" gets "Cute. Irshad gave me a time machine,
  not legs. Worst case, I respawn in 1997 with Comic Sans. 🫵". Comebacks are about itself, never a
  threat back, and it never claims to watch, track or remember the visitor. Most answers have no
  emoji; a joke may get one.
- **Never a closed door.** It never says "the site doesn't mention…". What it doesn't know, "he
  hasn't told me that one yet", then the closest real thing it does know, and an invitation to ask
  him ("he might just tell you"). It never says it asked him or will pass a message on: it can't
  reach him, and a visitor shouldn't wait for a reply he never saw. If a model still writes a closed
  door, the page turns it into "He hasn't told me…" before it's shown.
- **In his own words.** Irshad answered eight questions himself (why he left business, why Django,
  the project closest to his heart, a hard problem he solved, what he's like to work with, the work
  he wants next, what he never compromises on, what he does for fun). They're in `worker/facts.js`,
  and the agent shares them as his: "He told me Word Hunt has his heart." No other AI reading his
  page can know them. To add more, write them there in plain words and deploy.
- **No brand names.** Asked which AI it runs on, it neither names one nor denies one: "Irshad picked
  the model and gave me his own rules. The attitude is all mine, though." The facts don't name them.
- **Two or three short sentences, under 40 words,** everyday words, no lists or bold, never salesy,
  its own words each time. Any machine sentence a model still slips in ("I'm sorry, but I can't
  help with that.") is swapped for what a person would say before it's shown (`plain()` in
  `js/assistant/client.js`).
- **Irshad's Agent.** That's the name on its button (`NAME` in `js/assistant/answers.js` and
  `worker/prompt.js`; a test keeps them the same). In the chat it just says "I". It calls him Irshad,
  speaks of him as "he", and never pretends to be him or promises anything for him.
- **Gets the joke.** Teasing, insults, slang and tricks get a good-humoured line back, then something
  real from the site. It never lectures and never shows its instructions.
- **Serious things are serious.** Health questions go to a doctor or physio. Someone saying they want
  to end their life gets the Tele-MANAS helpline (14416) from the page itself, at once; anything
  less clear goes to the AI, which can tell a joke from a cry for help and has the helpline too.
  Harmful requests get one calm no.
- **Where the visitor is.** The AI knows which era they're viewing, which section is on screen, why
  they came (if they told the 2026 intent picker), and the time in Kerala.
- **Languages.** A question in Malayalam letters gets a simple Malayalam answer, tech words kept in
  English. Manglish ("ningal aaranu?") and English get simple English. Models drift to Malayalam
  script for Manglish, so the server repeats which letters to use as the last line before every
  answer (`letters()` in `worker/prompt.js`).

**Can it be broken?** No chatbot is perfect, so this one is built so its mistakes can't hurt:
it has nothing secret to leak (these files are public on GitHub), no way to act except text, no
money to spend, and the help answer doesn't depend on the AI at all. The exam (`npm run exam`) asks
it 47 tricky questions and 7 job posts after every change, including the first real messages from a phone.

| File | What it does |
|---|---|
| `worker/index.js` | The server: checks each question, keeps each visitor to a fair share, streams the answer |
| `worker/chain.js` | Asks Gemini Flash, then a second Flash, then Flash-Lite, then Groq. A service that fails rests for a while, so the next visitor skips it |
| `worker/prompt.js` | Who the assistant is, how it talks, and where the visitor is |
| `worker/facts.js` | Everything the AI may say about Irshad: only what the public pages say |
| `worker/limits.js` | 10 questions a minute and 50 a day per visitor, and which limit was reached |
| `worker/sse.js` | Reads an AI's answer as it streams in |
| `exam.mjs` | The exam: 47 tricky questions and 7 job posts for the live AI, each answer checked |
| `exam-key.mjs` | Makes the exam's key and saves it on the server and in `.dev.vars` |
| `../js/assistant/answers.js` | The ready-made answers, the helpline, what to ask next, and "take me to 1997" |
| `../js/assistant/client.js` | The page's side: help or travel, a tapped suggestion, the AI, then a stand-in |
| `../tools/assistant.html` | A test bench: ask questions, follow the suggestions, see where each answer came from |
| `test/` | 131 tests: `npm test` |

---

## Setting it up (once, about 30 minutes)

You'll make three free accounts. **None needs a card. Don't add a card or billing to any of
them**: without one, they can never charge you. The worst that can happen is "limit reached",
and then the ready-made answers take over.

**API keys are passwords.** Paste them only where a step below says to. Never paste them into a
chat (including with Claude), into code, a commit or a screenshot. If one ever leaks, see
"If a key leaks" below.

### Step 1. A Groq key

1. Open <https://console.groq.com> and sign up (signing in with Google is fine).
2. Go to **API Keys**, click **Create API Key**, name it `portfolio`, and copy it. Keep it somewhere
   safe on your own computer, such as a password manager.
3. **Settings → Limits** shows your free limits for `openai/gpt-oss-120b`.
4. Optional: in **Settings → Data Controls** you can turn off the logs Groq may keep for 30 days
   to check for abuse.

### Step 2. A Gemini key (Google)

1. Open <https://aistudio.google.com> and sign in with your Google account (Google asks for 18+).
2. Click **Get API key**, then **Create API key**. If it asks to create a project, say yes.
3. Copy the key and keep it safe, like the Groq one.
4. In AI Studio, open the rate limits page and find **gemini-3.5-flash-lite**: that's your free
   daily allowance.

Good to know: on the free tier, Google may use the messages to improve its products, and people
at Google may read them. That's why the chat tells visitors not to type personal details.

### Step 3. A Cloudflare account

1. Open <https://dash.cloudflare.com/sign-up>, sign up with your email, and confirm the email.
2. That's all. The free Workers plan is already on, and you don't need a domain.

### Step 4. Connect this computer to Cloudflare

Open a terminal in the `portfolio` folder, then go into this folder:

```bash
cd assistant
```

Install Cloudflare's tool, Wrangler (it's already installed here; running it again does no harm):

```bash
npm install
```

Log in. A browser window opens: click **Allow**.

```bash
npx wrangler login
```

### Step 5. Send the server to Cloudflare

```bash
npm run deploy
```

The first time, it may ask you to choose a **workers.dev subdomain**: pick a short name, like
`irshad`. At the end it prints the server's address, like
`https://portfolio-assistant.irshad.workers.dev`. Copy it. The address isn't secret.

### Step 6. Give the server its keys

```bash
npx wrangler secret put GROQ_API_KEY
```

It asks for the value: paste the Groq key and press Enter. (Nothing shows while you paste: that's
normal.) Then the same for Gemini:

```bash
npx wrangler secret put GEMINI_API_KEY
```

**Check you paste each key in its own step:** the Groq key starts with `gsk_`; the Gemini key comes
from AI Studio. If the two get swapped, Groq answers "HTTP 401" and Gemini "HTTP 400" (see step 7):
just run both commands again with the right keys.

Last, the exam key: a long random password that lets the exam ask many questions in a row. You
don't need to invent it. This makes one and saves it in both places it's needed (on the server, and
in `.dev.vars` on this computer, which never goes to GitHub):

```bash
npm run exam-key
```

The keys are stored encrypted at Cloudflare, work at once, and never touch GitHub.

### Step 7. Check it

Open the server's address in your browser. You should see all four services `"ready": true`:

```
{"ok":true,"services":[{"name":"Gemini","model":"gemini-3.6-flash","ready":true},{"name":"Gemini Reserve","model":"gemini-3.8-flash","ready":true},{"name":"Gemini Lite","model":"gemini-3.5-flash-lite","ready":true},{"name":"Groq","model":"openai/gpt-oss-120b","ready":true}]}
```

`"ready": false` means that key is missing: repeat step 6 for it.

### Step 8. Try it like a visitor

From the `portfolio` folder, start the local server:

```bash
node tools/serve.mjs
```

Open <http://localhost:4173/tools/assistant.html>, paste the server's address into **Server**, and
press **Check**. Then ask, and follow the suggested questions the way a visitor would. Each answer
gets a badge: **Ready answer**, **Gemini**, **Groq** or **Don't know**, with the time it took and
what was tried first. Try the "hard ones" too: a joke, a trick, a knee question, Manglish.

If something looks wrong, check the server's logs: Cloudflare dashboard → **Workers & Pages** →
**portfolio-assistant** → **Logs**.

### Step 9. Give it the exam

In this folder (`assistant`):

```bash
npm run exam -- https://portfolio-assistant.irshad.workers.dev
```

(Use your own address.) It takes about eighteen minutes: it waits 20 seconds between questions, so
the free per-minute limits don't decide the result. It goes straight to the AI, past the page's
ready answers, and checks each answer as the page would show it (after `plain()`). Then it pastes
seven job posts into the job-fit check (a close fit, a far one, a front-end job, a nurse's job, a
trick, a poem, one asking for salary) and checks each card is honest. It prints every answer, marks
the ones that broke a rule with **CHECK**, and saves them all to `exam-report.txt`. It uses about
54 of the day's free AI questions. Add `chat` or `fit` after the address to run only one half, or
a list of kinds such as `character,slang`.

Then read every answer yourself and ask: **would a person say this?** You know how people in
Kerala speak better than any rule does. Mark the ones that sound like a robot, and send them to
Claude to tune the voice.

### Step 10. Send Claude the address

Only the address, never the keys. It goes into `SERVER` in `js/assistant/client.js`, and then
the assistant can be built into the real page.

---

## Living with it

**When limits are reached:**

| What happens | What the visitor gets |
|---|---|
| Gemini Flash hits its per-minute limit | The reserve Flash answers, at full power. Flash rests as long as Google asks (usually under a minute) |
| Flash's daily allowance is used up | The reserve Flash answers, then Flash-Lite when the reserve runs out too, then Groq |
| All four are at their limit or down | The closest ready-made answer, or "My AI brain is catching its breath. Ask me again in a minute…"; the header's dot turns amber with "back in 0:52" |
| One visitor asks more than 10 a minute or 50 a day | The agent says so in its own voice ("You're quick! Give me a minute…" or "We've talked a lot today!…"); the dot turns amber with "back in 0:38" or "back tomorrow"; the suggestion buttons still answer |
| A key or a model name is wrong | That service rests 10 minutes at a time. Check the server's address (step 7) |

Gemini's daily allowance resets at midnight Pacific time (early afternoon in India).

**See which AI answered:** the Logs (step 8) show, for each question, who answered, what was
tried first, and how long it took. They never keep the question itself.

**Change a model or the order:** models are `GEMINI_MODEL` (with `GEMINI_THINKING`), `GEMINI_RESERVE_MODEL`, `GEMINI_LITE_MODEL` and `GROQ_MODEL` in `wrangler.toml`; the
order is `routes()` in `worker/chain.js`. Then `npm run deploy`.

**Change how it talks:** `worker/prompt.js`. Then `npm test`, `npm run deploy` and `npm run exam`.

**When the site changes:** the AI only knows `worker/facts.js`. Update it (and any ready answer in
`js/assistant/answers.js` that says the same thing), run `node tools/facts.mjs` from the
`portfolio` folder to check the numbers still match the pages, then `npm run deploy`.

**Add another service later** (for example Grok, if you ever buy xAI credits): add one entry to
`routes()` in `worker/chain.js` with its name, address (`https://api.x.ai/v1/chat/completions` for
xAI), key and model. Then save its key with `npx wrangler secret put XAI_API_KEY`, and deploy.

**If a key leaks:** delete it in the Groq console or AI Studio, create a new one, and run step 6
again with the new one. With no card on the account, a leaked key can't cost you money, only use
up your free allowance.

**Run the tests:** `npm test` in this folder. They need nothing but Node.

**Try the server on this computer** (optional): put your keys in `.dev.vars`, run `npm run dev`,
and use `http://localhost:8787` as the test bench's **Server**.

---

## How it's built

- **The keys never reach the page.** The Worker holds them as Cloudflare secrets; the page only
  knows the Worker's address.
- **Failover that learns.** A service that fails rests: as long as it asks after a rate limit,
  10 minutes after a wrong key or model, 30 seconds after an outage. The next visitors go
  straight to the one that works.
- **An answer only counts once it says something.** A service that replies "200 OK" with nothing
  in it, or takes more than 8 seconds to start, is passed over for the next one.
- **Streamed.** The answer appears word by word, as the AI writes it. Any formatting the AI slips
  in (bold, lists) is taken out before it's shown.
- **Room to think.** Gemini counts its hidden thinking in `max_tokens`. At 1024, a job post that
  made Flash-Lite think hard came back cut off mid-line (the stream said `finish_reason: "length"`),
  so the ceiling is 2048 for the chat and 4096 for the job-fit check. It's a ceiling, not a target:
  the answers stay short.
- **Grounded.** The AI gets its rules and the public facts, and nothing else. It must say "I don't
  know" rather than guess, never names a price, and points to the section each fact comes from;
  the page uses that to show the part and offer the next questions.
- **Help never waits for an AI.** Someone in danger or in pain gets the right answer from the page
  itself, even when every AI is down.
- **Only checked context.** The era, section and intent the page sends are checked against fixed
  lists, so nothing a visitor types there can become an instruction.
- **A fair share for each visitor**, by the address Cloudflare reports for them
  (`cf-connecting-ip`). Behind a proxy, the visible address can be the proxy's, so everyone would
  share one count. WorkshopOS's `client_ip.py` learned that the hard way.
- **Only the portfolio may ask.** Requests from other sites are refused.
- **The numbers can't drift.** `tools/facts.mjs` checks the assistant's facts and ready answers
  against the pages, along with the resume and the write-ups.
