# Irshad · Time Travel portfolio

One portfolio, eight eras of the web. A time machine fixed to the bottom of the page opens on
**2026**, today. Drag it back to **1992** or ahead to **2030**, and the whole site changes its
look, type, layout and behaviour to match each era. The content never changes. Only the
clothes do.

```bash
node tools/serve.mjs
```

Then open http://localhost:4173. A plain local server is needed because ES modules don't
load from `file://`. No install, no dependencies, no build step.

Share an era with a link: `?y=1997`.

**Before every commit that changes CSS or JS, run `node tools/stamp.mjs`** (see "When something
fails" below). `node tools/stamp.mjs --check` says whether the stamps are up to date.

---

## The eras

| Era | Name | What it looks like | What it does |
|---|---|---|---|
| **2030** | The page becomes a place | Deep space, drawn live in WebGL: the name in thousands of points of light, a starfield, an object beside each project built from that project's own numbers, and the Stack as a night sky | Scroll to fly; the name parts around your pointer or finger and flows back; each project is a constellation you can light; the sky follows your clock |
| **2026** | Depth and intent | Glass panels floating over a dot floor, light that follows the pointer | **Intent**: tell it why you came and it dims what you didn't come for |
| **2023** | The template era | Dark mode, purple blobs, grid lines, bento cards, gradient text | Nothing. That's the joke: it looks like everyone's portfolio |
| **2013** | Flat | Turquoise band, thin uppercase Lato, a 40-step long shadow, flat circles | Ghost buttons, coloured tiles |
| **2007** | Web 2.0 | Glossy blue header, reflected lowercase wordmark, `beta`, a starburst, tag cloud | Glossy tabs, 80×15 badges |
| **2001** | The Flash years | A fixed-width "movie" on gunmetal: chrome Orbitron, pixel labels, LED readouts, corner brackets, the Story as a Flash timeline with keyframes and a red playhead | The **Skip Intro** screen (a loading bar that stalls like a 56k modem, letters flying in, a white flash, Enter site), rollover blips with sound on |
| **1997** | The homepage years | Starfield tiles, rainbow Impact, Comic Sans, bevelled tables, a Win95 taskbar | Marquee, blinking NEW!, a sparkle cursor trail, a visitor counter, a webring that travels in time, MIDI music made with Web Audio |
| **1992** | Hypertext | The browser's own stylesheet. Nothing else | Links are numbered like the 1991 Line Mode Browser: type a number and press Return |

**The year matters, not only the look.** Every tool in the Stack section knows the year it
arrived (`data-since`). Drag back and Django greys out in 2001, WebSockets in 2007, and the
line above the stack counts down: *"In 1997, 6 of the 25 tools I use exist. Next: REST and
SQLite, in 2000."* Every project knows when it was built (`data-when`), so in 1997 WorkshopOS
is *29 years from now*. The copyright year follows the slider.

---

## Architecture

### One document, many stylesheets

There is one HTML file with all the content, written once, in plain semantic markup. Each
era is a stylesheet scoped by one attribute:

```css
:root[data-era="1997"] { … }
```

Changing era is a single attribute write on `<html>`. The browser restyles the page in one
pass. No DOM is rebuilt, no components re-render, no content is duplicated. This is the CSS
Zen Garden idea (2003), stretched across time.

The 1992 era proves it: it doesn't style the page at all. `all: revert` hands every element
back to the browser's built-in stylesheet, so what you see in 1992 is the real HTML that
every other era is dressed over.

### Cascade layers keep eras from fighting

```
@layer reset, base, era;
```

- `reset`: a small modern reset.
- `base`: shared mechanics only: the time machine's skeleton, the hidden ornaments, the
  view transitions, reduced motion.
- `era`: the eight eras. A later layer always wins, whatever the selectors, so an era never
  needs `!important` to beat the base.

`print.css` is unlayered, so it beats everything: printing sends you back to 1992.

### Ornaments

Things only one era has (the marquee, the starburst, the HUD, the intent picker) live in the
HTML as `.orn` elements with `data-orn="1997"`. The base layer hides every ornament; each
era shows only its own. Decorative ones are `aria-hidden`; working ones (the MIDI button,
the intent buttons, the webring) are real buttons and links.

### Project symbols

Every project title starts with its own symbol: a wrench for WorkshopOS, a magnifier for Word
Hunt, a hold timer (a ring nine tenths closed, with a hand) for PhysioCoach, a serving dome for
the catering system. Each is a small line drawing inside its title (`.mark`), hidden from screen
readers, so the title still reads as just its name. One drawing serves every era; the era dresses
it through `--mk-*` properties (fills, the ring's colour and width, the dot):

| Era | The symbol |
|---|---|
| 1992 | None |
| 1997 | A Windows 95 icon: bright fills, a black outline, jagged edges, on a raised grey button |
| 2001 | An orange drawing with a glow on a gunmetal key, in the era's corner brackets |
| 2007 | A glossy app icon in the project's colour, the drawing in white under the shine |
| 2013 | A white drawing in a darker circle, casting the era's long shadow |
| 2023, 2026, 2030 | The drawing alone in the era's colour: no box, no glow |

The symbol sits centred on the title's first line, so a title that wraps keeps it beside its
first word. **In 2030 the symbols move.** Each one draws itself line by line as you scroll toward
its station (tied to scroll in CSS, where the browser can do that), the timer's hand sweeping
round in nine ticks. When the station arrives (`js/eras/2030/marks.js`), each makes one move of
its own: the wrench tightens, the magnifier scans, the hand settles, the dome lifts. Hovering a
card plays it again. With reduced motion nothing draws or moves.

**Cards side by side line up.** Where 2026 puts three cards in a row, they share their rows
(CSS subgrid): labels and titles, pictures, summaries, lists, numbers, tags and links each start
at the same height, however much one card wraps.

### Project pictures

Each project carries one picture, a `.shot` that links to its full size: the WorkshopOS system
map, the two live apps, and the first pages of the catering documents. Each era only frames them
(a ridged border in 1997, a white photo frame in 2007, nothing at all in 2013). 1992 had no
inline images, so there the picture is a numbered `[IMAGE]` link, as a text browser shows it.
Print keeps the system map and drops the screens.

**The catering documents take turns at the front.** The card holds the first page of each
(`assets/shots/catering-report.webp` and `catering-plan.webp`, rendered from the PDFs). Every few
seconds the back page lifts out from behind, comes over the top and settles in front while the
other sinks back. It's one loop for both pages, half a cycle apart (`tt-shuffle` in
`css/base.css`), and it runs only while the card is on screen (`js/clips.js`), never with reduced
motion. 1997 jumps between the poses like an animated GIF, 2013 keeps the pages flat, 2030 lets
them drift slower, as if weightless, and 1992 has no pictures to move.

**The live apps are a computer and a phone, and the devices change with the era.** The page
holds only the two real screens of each app (`assets/shots/*-desk.webp` and `*-phone.webp`);
the hardware around them is CSS, plus drawings for the 1997, 2001 and 2013 devices
(`assets/devices/`), so every era draws the devices of its own time:

| Era | Computer | Phone |
|---|---|---|
| 1997 | A beige CRT with control buttons and a power light, a Windows 95 window, Netscape in the title bar | A brick phone with an antenna and a real keypad: call, menu, end, and 1 to 9 with their letters |
| 2001 | A silver flat panel on a stand, a Flash player's chrome title bar | A silver phone with a dark face plate, a blue light, soft keys, call and end, a nav pad and orange corner brackets |
| 2007 | A glossy Safari window with three drops | The first iPhone: black glass, a steel rim, a home button. Both stand on a shiny floor |
| 2013 | An all-in-one in aluminium and black glass: a camera at the top, a plain chin, a stand. The window inside is flat | A space grey phone: a polished edge, earpiece and camera, a steel ring round the home button, buttons on the side |
| 2023 | A dark window with traffic lights | A titanium phone with side buttons, in front of the obligatory purple glow |
| 2026 | Today's dark browser window | Today's phone |
| 2030 | Almost all screen: a thin graphite frame with tight corners and a polished edge that catches the light, and the faintest reflection on the glass | The same, with a third of 2026's bezel. No colour, no buttons |

The rules that keep the screens readable in every era (`.duo` in `css/base.css`):

- **Nothing lies over a screen.** Bezels, buttons, gloss and brackets sit around the screens,
  never on them. 2007's gloss is on the glass around the screen, not on it.
- **The screens keep their place.** The phone hides the same 35 units (of 800) of the computer
  screen's left edge as it always has, in every era. An era with thick bezels makes the picture
  wider instead, so it scales down by 1 to 3%; it never covers more.
- **One unit for everything.** Every size is in `--u`, a fraction of the picture's width
  (container query units), so the devices scale as one picture on any screen.

**Before 2010 the screens change too.** Today's app on a 1997 brick phone looked wrong, so the
three oldest eras show each app the way its own time would have: the same content, word for word
and number for number (Robo's 90.9s, the hunt for "movement", rep 4 of 20, the ten days of
scores), in the era's look. 1997 has a page in Netscape and a green-lit dot display, 2001 a Flash
movie and one of the first colour phones, 2007 a Web 2.0 page in Safari and the first iPhone's own
look. They are pictures (`assets/shots/eras/`, 34 to 105 KB), drawn in `tools/era-screens.html`
and photographed by `node tools/screens.mjs`; each era loads only its own. The real screenshots
stay underneath for screen readers, and a click still opens them. From 2013 on, the screens are
the real app.

The phone's screen is the first frame of a short silent clip of the real app, recorded on a
phone-size screen: Robo picks a word and you find it in Word Hunt; a 10-second hold counts up in
PhysioCoach. The clip plays exactly over that screen, so starting it changes nothing but the
motion (`js/clips.js`):

- it plays only while its card is on screen, and loads only then;
- never with reduced motion or Save-Data, when the still stands in;
- not before 2010, when the web had no video: the clip is `data-since="2010"` and hidden.

### The time machine

- **It stops only at the eight era years.** The years between two eras look exactly like the
  first of them, so there is nothing to stop at there: drag from 2013 and the next stop is 2023,
  never 2014 to 2022. Every era gets the same width on the slider, however many years it spans,
  so 2023, 2026 and 2030 never crowd together at the end. A link to a year in between, like
  `?y=2015`, lands on its era (2013).
- **On a phone it docks to the bottom edge** in every era, solid, with a thumb big enough to
  grab. 1992 keeps it to one line of text and one row of year buttons there, and drops the
  "type a link number" prompt on touch screens, which have no keyboard to type it with.
- Until you first travel, it says **Drag to time travel**.

### Sound

One small speaker button, fixed in the top right corner: the same place and size in every era
(set outside the cascade layers, so no era can move it), dressed like that era's own buttons.
In 1992 it's a plain button that says *Sound: on*. Eras with something in that corner (the
1997 marquee, 2001's title bar, 2007's starburst, 2030's sky clock) make room for it on
phones. Sound is **on** from the start, but the page always opens silent: browsers let a page
make sound only after a click, tap or key press, so sound wakes on your first one, and that
click's own sound plays (the capture phase wakes it before the click is handled). Nothing
ever plays before you do something. One press on the switch mutes the whole site, and the
choice is remembered (`localStorage`). An iPhone on silent stays silent. While it's on,
travelling makes its own sounds, with no buttons to press:

- **Leaving**, into the past or the future: the air rushes past.
- **Landing**, one short sound per era: a terminal bell (1992), a one-second dial-up modem
  (1997), a Flash swoosh and click (2001), a glossy bubble pop (2007), a clean tick (2013), a
  notification ding (2023), an airy chord (2026), and an airlock opening onto deep space (2030),
  where a very quiet hum then stays in the background.
- **Dragging** through eras, a soft detent click for each one; the landing waits for you to
  let go.

If you've turned it off, the switch **calls** you back, gently. Once the page has settled it
slides open for four seconds to say *Turn on sound*, dressed as that era's button (a Windows 95
bevel in 1997, chrome in 2001, gloss in 2007, flat in 2013, glass from 2023), with two rings
spreading out from it in the era's colour. After that, only the rings, each time an era lands
with a sound you didn't hear: four calls a visit at most, and none in 1992, whose button
already says *Sound: off* in words. No rings with reduced motion. Hover it and it says *Turn
sound on*.

It's all made live in `js/sound.js` with the Web Audio API, like Word Hunt's sounds: no audio
files. 1997's **Play MIDI music** plays through the same switch
(pressing Play turns sound on, and turning sound off stops the music). A hidden tab stays
silent.

**2030 has a score of its own** (`js/eras/2030/audio.js`): every animation there makes its
sound, at the moment it moves.

| When | What you hear |
|---|---|
| The name flies in from deep space | A low swell, grains of light that start wide and gather to the middle as the points land, then the chord the name stands on |
| You push the name's points around | They sing: grains as fast as the points are moving, from under your pointer |
| You scroll fast and the stars streak | The wind of it, and an engine note that climbs with your speed |
| Each project's object assembles | A motif built from that project's numbers, like its shape: WorkshopOS locks 21 rings into place, faster and faster, and its core settles; Word Hunt rains 71 letters, circles 10 players round you and rings one secret note; PhysioCoach breathes in and its 2 shells swell; Catering sends 10 orbit notes round you and sounds its 6 apps together |
| The constellations draw themselves in | Each project's line sings its note and climbs an octave |
| You touch a star | It sings the chord of the projects it's in: Python, in all four, is the whole chord |
| Play a day | A chord that opens up as the sun climbs and closes at night, a chime at sunrise and a falling one at sunset |

Three rules keep it from sounding like a set of beeps:

- **One key.** Every note is in A Lydian, the key of the 2030 hum. Each project has its note, and
  the four together make A major 7, so whatever plays at once is in tune.
- **One place.** Every sound comes from where it happens on the screen, in 3D (HRTF panning:
  with headphones, an object on the right is heard on the right), and rings out in the same
  space, a reverb generated in code.
- **Restraint.** Nothing plays on its own except as something moves; sounds tied to motion
  don't play with reduced motion; leaving 2030 fades everything still ringing.

Every sound was rendered offline (silently) and measured: the big moments (the arrival,
WorkshopOS) peak around -20 dB, touches and stars around -35 to -45 dB, nothing
clips, and each renders 3 to 11 times faster than real time.

### The transition

`js/transition.js` decides how one era becomes the next:

- **Clicking a year, the arrows, or the keyboard** uses the View Transitions API. Going back
  in time, the present folds away like old film and the past wipes in line by line; going
  forward, the old page dissolves into light. Browsers without it switch instantly.
- **Dragging the slider** passes through many eras a second, so there's no transition per
  era, just a short burst of static (`.warp`).
- **Reading position is kept.** Each era lays the page out differently, so before switching it
  finds the section or project under the top third of the screen and puts it back in the same
  place afterwards.
- **Fonts first.** Each era's Google Fonts stylesheet loads the first time the era is needed
  (and all of them once the page is idle; font files still download only when used). A
  transition waits up to 260 ms for the new era's font, so it doesn't capture a fallback face.
- **Rendering reads state, never arguments.** A fast visitor can ask for three eras before the
  first transition finishes; every overlapping call ends in the latest state.

### Era behaviour

`js/eras/1992.js`, `1997.js`, `2001.js`, `2026.js` and `2030.js` each export `enter()` and `leave()`.
Only the current era's module is loaded (dynamic `import()`) and running; leaving an era removes its
listeners, its sparkles, its music, its intro, its pointer tracking and its render loop. 2007, 2013
and 2023 need no JavaScript at all.

### The 2001 intro

The Skip Intro screen is a native `<dialog>` opened with `showModal()`, so focus moves to
**Skip intro**, the rest of the page is inert, and Escape closes it, with no extra code.

- It plays **once per visit**, the first time you arrive in 2001 *and stay*: clicking a year,
  stepping, the webring, a `?y=2001` link, or letting go of the slider inside 2001. Dragging
  straight through 2001 doesn't trigger it (the time machine fires `timemachine:release`
  when a drag ends, and the era waits for it).
- About seven seconds end to end: a loading bar that stalls in the 70s, then the letters fly in,
  the tagline types itself, a white flash, and **Enter site** enters for you if you don't.
- **Replay intro** in the title bar plays it again. Leaving 2001 closes it.
- With reduced motion it never plays on its own; Replay shows it still, waiting for Enter.
- With sound on (the site's one switch, see Sound), every rollover blips, as every Flash site did.

### The 2030 scene

2030 is the one era that paints with WebGL2 (`js/eras/2030/scene.js`, no libraries). One canvas
sits behind the page, and the text stays real HTML on top of it.

- **The name** is drawn into an offscreen canvas exactly where the page lays it out, then
  sampled into up to 11,000 points. They fly in from deep space on arrival, and springs pull
  each one home. A pointer or a finger pushes them aside and drags them along; they flow back.
  The heading's text is still there, invisible, for reading, search and screen readers.
- **The starfield** moves with the scroll position, so scrolling is flying. Fast scrolling
  stretches the stars into streaks.
- **Each project has an object**, built from its own numbers (`js/eras/2030/shapes.js`):
  - WorkshopOS: 21 rings for its 21 rule modules, 72 beads for its 72 transaction blocks, and 49 core points for its 49 models.
  - Word Hunt: 71 letters on a sphere, one secret one glowing, and 10 players circling it.
  - PhysioCoach: a shape that breathes, with a shell for each of its 2 languages, counting its 10-second hold.
  - Catering: 10 orbits for its 10 roles, and 24 beads for its 24 modules.

  The CSS decides where each object goes, through an empty `.orb` element in each project. The
  scene draws the object wherever that element is, so layout stays in CSS.
- **Cost:** the module loads only when you travel to 2030. It stops when the tab is hidden or you
  leave 2030. Phones and low-core devices get fewer points, and a device that falls under
  25 fps gets fewer pixels. The canvas and its GPU buffers are made once and reused.
- **Without WebGL2**, the page shows the name in gradient type and a soft glow where each
  object would be. With reduced motion there is no arrival and no physics, and the scene is
  redrawn only when you scroll.

**The Stack is a night sky** (`js/eras/2030/constellation.js`). Every tool is a star, brighter
for the tools I use most, and every project is a constellation. Each chip's `data-in` lists the
projects it was used in, and the script joins each project's stars with the shortest set of
lines that connects them all (a minimum spanning tree, drawn as SVG). Python is in all four, so
they all meet there. Hover or touch a star to light every project that uses it, and tap to
keep it lit. The legend buttons light one project and work from the keyboard. The lit
projects' cards glow up in Work, for whoever follows the link in the caption.

**The sky follows your clock** (`js/eras/2030/sky.js`): a sunrise low on the left in the
morning, daylight blue at noon with fewer stars, a sunset on the right in the evening, and deep
space at night. **Play a day**, at the top of the page, runs all 24 hours in nine seconds.

### The first paint

A small inline script in `<head>` reads `?y=` and sets `data-era` before the page paints,
so a shared 1997 link never flashes 2026 first. Without JavaScript the page is fully readable
in 2026 and the time machine is hidden.

### When something fails

Every era should arrive whole, whatever the network or the device does. What happens when:

- **A file changed in the last deploy.** GitHub Pages lets browsers keep each file for 10
  minutes, which could pair a new page with an old stylesheet. `tools/stamp.mjs` gives every
  stylesheet and script a `?v=` fingerprint of its contents, and index.html an import map that
  does the same for the scripts that load other scripts. A changed file always arrives fresh,
  an unchanged one stays cached.
- **The network drops a script.** Era code loads through `js/load.js`, which asks again twice,
  a little later each time, with a fresh URL (a browser may remember a failed load).
- **One part of 2030 fails.** Its scene, sky, star map and symbols each load and start on their
  own (`js/eras/2030.js`), so one failing never stops the others. The sky hands the scene its
  starlight through 2030.js instead of importing it, and the score (`audio.js`) is optional
  everywhere: until it arrives, or if it never does, the parts are simply silent.
- **No WebGL2, a broken shader, a lost graphics context, or the drawing throws.** The scene
  stops and the name comes back as text, in the 2030 colours. If the scene never even starts,
  CSS brings the text back after 3 seconds on its own.
- **Fonts are blocked.** Every era waits for its fonts a moment at most, then uses its fallbacks.
- **No JavaScript at all.** The page is styled in the era from the link, readable and complete;
  only the moving parts and the time machine's slider are missing.
- **A stylesheet is late.** The project symbols carry their own small size, so they never
  appear huge.

These were all tested in a headless browser by blocking the files and faking the failures.

---

## The resume and the write-ups

`resume/` is the resume, and the only source of it. It's a page anyone can read before
downloading: a sheet of A4 paper on a desk (dark around it at night), edge to edge on a phone,
with **Print** and **Download PDF** above it. It doesn't travel in time; recruiters get the same
calm page in every era.

The PDF, `assets/Mohammed_Irshad_C_Resume.pdf`, is that page printed, so the page, the print and
the download always match, and links shared before keep working. To change the resume:

1. Edit `resume/index.html`, and the date in its bar.
2. If the fact also appears in the portfolio (`index.html`) or a write-up (`work/`), change it there
   too.
3. Run `node tools/facts.mjs`. It finds the 18 facts the pages share (test counts, models, routes,
   modules and so on) by their wording on each page, and in the assistant's fact sheet and ready
   answers, and says where any two disagree. It
   also checks that "3,400+ tests" still adds up, that the resume's phone number is the one the
   WhatsApp links use, and that no Google Drive link has come back.
4. Run `node tools/pdf.mjs`. It starts its own local server, prints every document page with
   headless Edge or Chrome, and stops. Check the resume is still one page.

Git keeps every version, so an old resume can always be brought back.

The phone number is the WhatsApp number, as a tap-to-call link on the page, in print and in the
PDF. The text is laid out in reading order, so applicant tracking systems read the summary first. The shared design is
`css/doc.css`.

The project cards' documents are pages in the same design, under `work/`, each printed to
`assets/docs/` by the same script:

- `work/workshopos/`: the WorkshopOS technical overview and the system map. The map is
  `system-map.svg`, the same diagram as the PDF that used to be on Google Drive. The page draws it
  inline so its text stays sharp at any zoom. On a wide screen it spreads past the paper like a
  fold-out, on a phone it scrolls sideways, and on paper it gets a landscape page of its own.
  "Open the map full size" opens the SVG alone, to zoom.
- `work/catering/`: the catering staff system, written for a reader: the problem, the role ladder,
  the flow, the rules, the registration-day plan, the cost and the module plan. The two documents
  the client received, the architecture report and the module plan, sit in `assets/docs/` exactly
  as delivered and are linked at the end. Don't edit them.

## The assistant

Irshad's Agent, his own assistant, in short, plain English. A typed question goes to an AI, which
reads the whole conversation and answers from the portfolio's public facts: Google Gemini Flash
first, then Flash-Lite, then Groq, and the closest ready-made answer
(`js/assistant/answers.js`) when both rest. A tapped suggestion gets its ready-made answer at once.
Someone saying they want to end their life gets the helpline from the page itself, never from an AI. Every answer
offers what to ask next. The AI is asked through a Cloudflare Worker (`assistant/`) that holds the
keys, so the page never sees them. `assistant/README.md` has how it talks, the setup step by step,
and how it's built; `tools/assistant.html` is its test bench.

**On the page** (`js/agent.js`, loaded by `js/main.js`): the agent itself says "Ask me" from a
button floating just above the time machine, and the 2026 intent hint ends with "Or ask my
agent". Neither opens it by itself. The button and the chat's header wear the agent's face (`.agent-face`), a different one in every era (below). Where
it has eyes, it blinks and looks around now and then, looks up and wanders while the AI thinks,
and shuts its eyes while the AI rests; 2023's mark and 2030's globe have no eyes, and spin instead. The chat is a glass panel beside the page (a sheet rising from the time machine on a
phone), loaded only when first opened. It greets the visitor with three questions to start from,
chosen by why they came, and every answer ends with what to ask next. Answers act on the page: on
a wide screen an answer about Word Hunt scrolls there and lays a ring of light over the card
(`.agent-spot`, never touching the card's own styles); "See Word Hunt" does it on a phone; "take me
to 1997" travels. Visitors never see which AI answered: "Quick answer" sits under an answer the page
knew without asking the AI, and faint signal bars after an AI answer's last word (three for full power, fewer
when a backup answered; a tap says it in words). Open the page once with `?trace` and a small line under every
answer says where it came from ("Gemini · 1.9 s", "Groq", what was busy). The conversation is kept for the visit (sessionStorage), across eras and reloads.

**The job-fit check:** a recruiter taps "Does he fit my job?" or just pastes a job post, and gets a
card instead of a chat answer: what the job asks that the site shows (each with its proof and a
link that lights it up), what the site doesn't show (never "he can't"), one question worth asking
him, and a button to email the job to him. Honest on purpose, so the matches are believable. When
every AI rests, the page checks the post's words itself. `assistant/README.md` has how it works.
**In every era, its own clothes** (`css/agent.css`): one brain, and a costume for each era it
visits. The layout (floating above the time machine, phone and keyboard) is shared; the modern
eras share a glass look in their own colours (2026 cyan; 2023 indigo, like that year's chat
apps), and each era adds its habits. In 2026 its face is a ball of blue glass with two white eyes
that turns its head to look around. In 1997 it's a desktop helper: a little beige computer with a
face (its own character, nobody's paperclip) that blinks beside a yellow help balloon, and a
Windows 95 window: "It looks like you're visiting a homepage! Would you like help?" It stays open
through a trip in time, changing clothes and greeting with the page. In 1992 it's plain
hypertext: a typed face, `[o_o]`, that blinks to `[-_-]`, browser buttons, a box with a thin black
rule, the visitor's words as typed lines ("> …"), "Ask:" and Submit: "Welcome. This is Irshad's
agent, an experimental hypertext service." In 2001 it's an instant messenger in Flash chrome: a
yellow smiley with a Flash outline that winks, a gunmetal IM window, "IrshadsAgent signed on.",
the chat as a transcript of screen names, chrome capsule buttons. In 2007 it's a glossy live-chat
widget, in beta of course: its face a glossy blue speech bubble with cartoon eyes that hops, a
blue gloss title bar with a "beta" badge, shiny speech bubbles with tails, green ticks, an orange
Send, and the yellow fade on the part of the page an answer points to. In 2013 it's flat, the way
iOS 7 drew a conversation: its face a flat squircle icon with a long shadow, a midnight bar with
thin type, flat blue and grey bubbles, ghost buttons, and Siri's "What can I help you with?". In
2023 its face is a rosette knotted round a hexagon, like that year's best-known AI mark but its
own, in the year's gradient, with no eyes, turning slowly and spinning while it answers. In 2030
it's a globe of light over the stars: 2026's glass ball turned to points of light on lines of latitude, past needing eyes
(`js/eras/2030/face.js`), turning faster while it answers and slowly, in gold, while it rests,
and the glass in ice with a holographic edge: "Hello from 2030. Here the page is a place, and I'm
its guide." It visits every era
(`agent: true` in `js/eras.js`); in other eras its buttons hide and the panel closes, and the
conversation waits for the way back.

---

## Files

```
index.html            all content, once
css/base.css          layers, reset, shared mechanics, view transitions
css/eras/<year>.css   one file per era
css/agent.css         Irshad's Agent's clothes: the shared layout, and the glass look the modern eras share
css/print.css         print = 1992
css/doc.css           the document pages: a sheet of A4 on screen, in print and as a PDF
resume/index.html     the resume, the source of its PDF
work/<project>/       a project's write-up (workshopos: overview and system-map.svg; catering: the spec), the source of its PDF
js/main.js            state, URL, fonts, era modules, keyboard
js/eras.js            the eras: years, names, notes, fonts, favicons, titles
js/time.js            year-dependent content: tools that exist yet, "N years from now"
js/transition.js      view transitions, scrub static, keeping the reading position
js/timemachine.js     the slider and its buttons
js/sound.js           the one sound switch and every sound, made with Web Audio
js/clips.js           the live apps' phone clips: play on screen, pause off it
js/load.js            loads a script and asks again if the network drops it
js/eras/*.js          era behaviour: 1992 line mode, 1997 sparkles/MIDI/counter, 2001 intro/sound,
                      2026 light/intent, 2030 scene
js/eras/2030/         the WebGL scene (scene.js), the shapes built from project numbers (shapes.js),
                      the Stack constellation (constellation.js), the sky clock (sky.js), the
                      2030 score (audio.js), and the moment each project symbol moves (marks.js)
js/agent.js           Irshad's Agent on the page: the chat panel, and what its answers do to the page
js/assistant/         the assistant's page side: ready-made answers (answers.js), asking (client.js), the job-fit check (fit.js)
assistant/            the assistant's server, a Cloudflare Worker, with its tests and setup guide
tools/serve.mjs       zero-dependency local server
tools/stamp.mjs       fingerprints every stylesheet and script, so a deploy never mixes versions
tools/pdf.mjs         prints the document pages to their PDFs (the resume, the write-ups)
tools/facts.mjs       checks the portfolio, resume, write-ups and assistant agree on the facts they share
tools/assistant.html  the assistant's test bench: ask, and see where each answer came from
tools/share-card.html the link preview picture (assets/share.png); how to rebuild it is inside
tools/duo.html        the full-size laptop-and-phone pictures the live-app cards link to
tools/era-screens.html the live apps' screens as 1997, 2001 and 2007 would have shown them
tools/screens.mjs     photographs those screens into assets/shots/eras/
assets/               resume PDF, the write-ups' PDFs (docs/), link preview picture, project pictures and clips (shots/),
                      the old eras' screens (shots/eras/), and the drawn 1997, 2001 and 2013 devices (devices/)
```

## Adding an era

1. Add it to `ERAS` in `js/eras.js`, and its year to the inline list in `index.html`.
2. Create `css/eras/<year>.css` scoped by `:root[data-era="<year>"]`, inside `@layer era`.
   Show its ornaments with `& :where(.orn[data-orn~="<year>"]) { display: revert; }`.
3. Link the stylesheet in `index.html`.
4. If it needs behaviour, add `js/eras/<year>.js` and set `module: true`.

## Keyboard

- Arrow keys and Page Up and Page Down on the slider move one era; Home and End jump to 1992
  and 2030.
- `[` and `]` step one era from anywhere.
- In 1992, type a link's number and press Return.

## Performance and accessibility

- No framework, no build. The only images are the project pictures (WebP, lazy-loaded): the
  system map and the documents (65 and 75 KB), and the live apps' screens (13 to 39 KB each).
  The only video is the two phone clips (75 and 138 KB, fetched when their card comes on
  screen). Era scenery and devices are CSS, except 2030's scenery, which is drawn by code, and
  the 1997, 2001 and 2013 devices, which are small SVG drawings (2 to 6 KB) loaded only in their
  era. 1997, 2001 and 2007 also load their own four screen pictures.
- Unminified, uncompressed: 34 KB of HTML, 174 KB of CSS for all eight eras, 114 KB of JavaScript,
  of which 68 KB is 2030. Only the current era's JavaScript module runs.
- The slider's year labels shorten (2026, then '26, then 26) only if they would touch at the
  current width in the current era's type. With even spacing, a 375 px phone fits them in full in
  every era except 1992, whose plain buttons use '92.
- The slider is a native `<input type="range">` with `aria-valuetext` ("1997, The homepage
  years"); era changes are announced through a polite live region.
- `prefers-reduced-motion` turns off view transitions, the static burst, the marquee, blinking,
  sparkles, drifting blobs, scroll-driven motion and the 2030 arrival and physics.
