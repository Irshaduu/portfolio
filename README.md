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

---

## The eras

| Era | Name | What it looks like | What it does |
|---|---|---|---|
| **2030** | The page becomes a place | Deep space, drawn live in WebGL: the name in thousands of points of light, a starfield, an object beside each project built from that project's own numbers, and the Stack as a night sky | Scroll to fly; the name parts around your pointer or finger and flows back; each project is a constellation you can light; the sky follows your clock; the time machine has a **token limit** |
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

### Project pictures

Each project carries one picture, a `.shot` that links to its full size: the WorkshopOS system
map, the two live apps, and the first pages of the catering documents. Each era only frames them
(a ridged border in 1997, a white photo frame in 2007, nothing at all in 2013). 1992 had no
inline images, so there the picture is a numbered `[IMAGE]` link, as a text browser shows it.
Print keeps the system map and drops the screens.

**The live apps are a computer and a phone, and the devices change with the era.** The page
holds only the two real screens of each app (`assets/shots/*-desk.webp` and `*-phone.webp`);
the hardware around them is CSS, so every era draws the devices of its own time:

| Era | Computer | Phone |
|---|---|---|
| 1997 | A beige CRT with a power light, a Windows 95 window, Netscape in the title bar | A brick phone with an antenna and a keypad |
| 2001 | A silver flat panel on a stand, a Flash player's chrome title bar | A silver phone with a blue light, a nav pad and orange corner brackets |
| 2007 | A glossy Safari window with three drops | The first iPhone: black glass, a steel rim, a home button. Both stand on a shiny floor |
| 2013 | A flat monitor with a silver chin | A flat phone with a ring for a home button |
| 2023 | A dark window with traffic lights | A titanium phone with side buttons, in front of the obligatory purple glow |
| 2026 | Today's dark browser window | Today's phone |
| 2030 | No devices: each screen is a pane of light with a holographic edge, cast by an emitter below it | |

The rules that keep the screens readable in every era (`.duo` in `css/base.css`):

- **Nothing lies over a screen.** Bezels, buttons, gloss and brackets sit around the screens,
  never on them. 2007's gloss is on the glass around the screen, not on it.
- **The screens keep their place.** The phone hides the same 35 units (of 800) of the computer
  screen's left edge as it always has, in every era. An era with thick bezels makes the picture
  wider instead, so it scales down by 1 to 3%; it never covers more.
- **One unit for everything.** Every size is in `--u`, a fraction of the picture's width
  (container query units), so the devices scale as one picture on any screen.

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
In 1992 it's a plain button that says *Sound: off*. Eras with something in that corner (the
1997 marquee, 2001's title bar, 2007's starburst, 2030's sky clock) make room for it on
phones. Sound starts **off**: a page that suddenly makes noise on a
phone in an office gets closed, and browsers don't allow it before a tap anyway. One press
turns it on for the whole site, and the choice is remembered (`localStorage`). After that,
travelling makes its own sounds, with no more pressing:

- **Leaving:** into the past, a tape rewinds; into the future, the air rushes past.
- **Landing**, one short sound per era: a terminal bell (1992), a one-second dial-up modem
  (1997), a Flash swoosh and click (2001), a glossy bubble pop (2007), a clean tick (2013), a
  notification ding (2023), an airy chord (2026), and a shimmer in deep space (2030), where a
  very quiet hum then stays in the background.
- **Dragging** through eras, a soft detent click for each one; the landing waits for you to
  let go.

It's all made live in `js/sound.js` with the Web Audio API, like Word Hunt's sounds: no audio
files. 1997's **Play MIDI music** plays through the same switch
(pressing Play turns sound on, and turning sound off stops the music). A hidden tab stays
silent. If sound was on last visit, it wakes on the first tap or key press, as browsers require.

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

**The token limit.** In 2030 even time travel has a plan. A readout in the time machine counts
down the 30 seconds that come with Pro. When they run out, a notice rises out of the time
machine: *Pro limit reached · Resets 1 Jan 2031*, with **Get Max · ₹0** for 5 more minutes,
then Max 20x. Usage-limit messages have kept getting shorter, from a paragraph to one line
and a reset time, so the 2030 one is a single quiet line: no popup over the page, no dimmed
backdrop, and it never takes focus. The count runs only while the tab is visible, each limit
shows once per visit, and ×, Escape or either button puts it away.

### The first paint

A small inline script in `<head>` reads `?y=` and sets `data-era` before the page paints,
so a shared 1997 link never flashes 2026 first. Without JavaScript the page is fully readable
in 2026 and the time machine is hidden.

---

## Files

```
index.html            all content, once
css/base.css          layers, reset, shared mechanics, view transitions
css/eras/<year>.css   one file per era
css/print.css         print = 1992
js/main.js            state, URL, fonts, era modules, keyboard
js/eras.js            the eras: years, names, notes, fonts, favicons, titles
js/time.js            year-dependent content: tools that exist yet, "N years from now"
js/transition.js      view transitions, scrub static, keeping the reading position
js/timemachine.js     the slider and its buttons
js/sound.js           the one sound switch and every sound, made with Web Audio
js/clips.js           the live apps' phone clips: play on screen, pause off it
js/eras/*.js          era behaviour: 1992 line mode, 1997 sparkles/MIDI/counter, 2001 intro/sound,
                      2026 light/intent, 2030 scene and token limit
js/eras/2030/         the WebGL scene (scene.js), the shapes built from project numbers (shapes.js),
                      the Stack constellation (constellation.js), the sky clock (sky.js)
tools/serve.mjs       zero-dependency local server
tools/share-card.html the link preview picture (assets/share.png); how to rebuild it is inside
tools/duo.html        the full-size laptop-and-phone pictures the live-app cards link to
assets/               resume PDF, link preview picture, project pictures and clips (shots/)
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
  screen). Era scenery and devices are CSS, except 2030's scenery, which is drawn by code.
- Unminified, uncompressed: 34 KB of HTML, 178 KB of CSS for all eight eras, 93 KB of JavaScript,
  of which 48 KB is 2030. Only the current era's JavaScript module runs.
- The slider's year labels shorten (2026, then '26, then 26) only if they would touch at the
  current width in the current era's type. With even spacing, a 375 px phone fits them in full in
  every era except 1992, whose plain buttons use '92.
- The slider is a native `<input type="range">` with `aria-valuetext` ("1997, The homepage
  years"); era changes are announced through a polite live region.
- `prefers-reduced-motion` turns off view transitions, the static burst, the marquee, blinking,
  sparkles, drifting blobs, scroll-driven motion and the 2030 arrival and physics.
