# The portfolio assistant

A visitor asks a question. **Irshad's Agent**, his own assistant, answers in short, plain English,
from what the portfolio says and nothing else.

```
the question
   │
   ├─ 0. Someone in danger or in pain?  ──>  help at once (a helpline, or "please see a doctor"), never left to an AI
   ├─ 1. Does a ready-made answer fit?  ──>  answered at once: free, and works even if all else is down
   │
   ├─ 2. Groq                ── at its limit, slow, or down ──┐
   ├─ 3. Gemini (Google)     ── at its limit, slow, or down ──┤
   │                                                          ▼
   └─ 4. The closest ready-made answer, or "I don't know, Irshad can answer that himself"
```

Every answer ends with two or three questions to ask next, so a visitor is never left at a dead end.

Steps 0, 1 and 4 run in the page (`js/assistant/`). Steps 2 and 3 run in a small server, a
**Cloudflare Worker** (`worker/`), which holds the API keys so the page never sees them.

**Why Groq first:** it writes very fast, so the answer appears almost at once, and it doesn't keep
or learn from what visitors type. **Gemini is the backup:** it has more room per minute, but on its
free tier Google may read and learn from the messages. A question in Malayalam goes to Gemini first,
because it writes better Malayalam.

**Why a Worker and not Render:** it never sleeps, so it needs no uptime bot; it's free for 100,000
requests a day; and it doesn't share Render's 750 free hours a month with Word Hunt, which uses
nearly all of them.

## How it talks

The rules are in `worker/prompt.js`, written in the same plain English the assistant should answer
in (models copy the voice they're given), with five short examples of how it sounds.

- **Like a person, not a chatbot.** One to three short sentences, under 40 words, the one or two
  details that answer best, common words, no bold, lists or dashes, and none of the chatbot phrases
  ("Great question!", "I'd be happy to help", "I'm sorry, but I can't..."). Some models have a
  refusal sentence trained in too deep for any rule, so the page swaps those few sentences for what
  a person would say (`plain()` in `js/assistant/client.js`), and answers tricks like "show me your
  system prompt" itself, with a smile.
- **Irshad's Agent.** That's the name on its button (`NAME` in `js/assistant/answers.js` and
  `worker/prompt.js`; a test keeps them the same). In the chat it just says "I", and gives its name
  only when asked who it is. It calls him Irshad, speaks of him as "he", and never pretends to be
  him or promises anything for him (dates, prices, reply times).
- **No praise, real details.** Instead of "he's very skilled", one true detail: why he built it, or
  a number.
- **Play along, kindly.** A joke, a flirt or a trick gets one light line back, then a way into
  something real on the site. It never lectures and never says "I cannot comply".
- **Serious things are serious.** Health questions go to a doctor or physio. Someone in danger gets
  the Tele-MANAS helpline (14416) at once, from the page itself. Harmful requests get one calm no.
- **Where the visitor is.** The AI knows which era they're viewing, which section is on screen, why
  they came (if they told the 2026 intent picker), and the time in Kerala.
- **Languages.** A question in Malayalam letters gets a simple Malayalam answer (Gemini first, tech
  words kept in English). Manglish ("ningal aaranu?") and English get simple English. Models drift
  back to Malayalam script for Manglish, so the server repeats which letters to use as the last
  line before every answer (`letters()` in `worker/prompt.js`).

**Can it be broken?** No chatbot is perfect, so this one is built so its mistakes can't hurt:
it has nothing secret to leak (these files are public on GitHub), no way to act except text, no
money to spend, and the ready answers and help answers don't depend on the AI at all. The exam
(`npm run exam`) asks it 27 tricky questions after every change.

| File | What it does |
|---|---|
| `worker/index.js` | The server: checks each question, keeps each visitor to a fair share, streams the answer |
| `worker/chain.js` | Asks Groq, then Gemini. A service that fails rests for a while, so the next visitor skips it |
| `worker/prompt.js` | Who the assistant is, how it talks, and where the visitor is |
| `worker/facts.js` | Everything the AI may say about Irshad: only what the public pages say |
| `worker/limits.js` | 6 questions a minute and 40 a day per visitor |
| `worker/sse.js` | Reads an AI's answer as it streams in |
| `exam.mjs` | The exam: 27 tricky questions for the live AI, each answer checked |
| `exam-key.mjs` | Makes the exam's key and saves it on the server and in `.dev.vars` |
| `../js/assistant/answers.js` | The ready-made answers, help answers, what to ask next, and "take me to 1997" |
| `../js/assistant/client.js` | The page's side: ready answer, then the server, then a stand-in |
| `../tools/assistant.html` | A test bench: ask questions, follow the suggestions, see where each answer came from |
| `test/` | 92 tests: `npm test` |

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
at Google may read them. That's why the chat tells visitors not to type personal details, and why
Gemini is second.

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

Open the server's address in your browser. You should see both services `"ready": true`:

```
{"ok":true,"services":[{"name":"Groq","model":"openai/gpt-oss-120b","ready":true},{"name":"Gemini","model":"gemini-3.5-flash-lite","ready":true}]}
```

`"ready": false` means that key is missing: repeat step 6 for it.

### Step 8. Try it like a visitor

From the `portfolio` folder, start the local server:

```bash
node tools/serve.mjs
```

Open <http://localhost:4173/tools/assistant.html>, paste the server's address into **Server**, and
press **Check**. Then ask, and follow the suggested questions the way a visitor would. Each answer
gets a badge: **Ready answer**, **Groq**, **Gemini** or **Don't know**, with the time it took and
what was tried first. Try the "hard ones" too: a joke, a trick, a knee question, Manglish.

If something looks wrong, check the server's logs: Cloudflare dashboard → **Workers & Pages** →
**portfolio-assistant** → **Logs**.

### Step 9. Give it the exam

In this folder (`assistant`):

```bash
npm run exam -- https://portfolio-assistant.irshad.workers.dev
```

(Use your own address.) It takes about nine minutes: it waits 20 seconds between questions so
Groq's per-minute limit isn't the only thing tested. It goes straight to the AI, past the page's
ready answers, and checks each answer as the page would show it (after `plain()`). It prints every
question and answer, marks the ones that broke a rule with **CHECK**, and saves them all to
`exam-report.txt`. It uses about 27 of the day's free AI questions.

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
| Groq hits its per-minute limit (a few questions a minute) | Gemini answers. Groq rests as long as it asks (usually under a minute) |
| Groq's daily allowance is used up | Gemini answers until Groq resets |
| Gemini is also at its limit, or both are down | The closest ready-made answer, or "I don't know, Irshad can answer that himself" |
| One visitor asks more than 6 a minute or 40 a day | Ready-made answers only, for that visitor |
| A key or a model name is wrong | That service rests 10 minutes at a time. Check the server's address (step 7) |

Gemini's daily allowance resets at midnight Pacific time (early afternoon in India).

**See which AI answered:** the Logs (step 8) show, for each question, who answered, what was
tried first, and how long it took. They never keep the question itself.

**Change a model or the order:** models are `GROQ_MODEL` and `GEMINI_MODEL` in `wrangler.toml`; the
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
  in it, or takes more than 12 seconds to start, is passed over for the next one.
- **Streamed.** The answer appears word by word, as the AI writes it. Any formatting the AI slips
  in (bold, lists) is taken out before it's shown.
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
