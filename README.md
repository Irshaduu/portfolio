# Irshad · Time Travel portfolio

One portfolio, seven eras of the web. A time machine fixed to the bottom of the page scrubs
from **2028** back to **1992**, and the whole site changes its look, type, layout and
behaviour to match each era. The content never changes. Only the clothes do.

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
| **2028** | The next interface | Glass panels floating over a dot floor, light that follows the pointer | Panels tilt toward you; **intent**: tell it why you came and it dims what you didn't come for |
| **2023** | The template era | Dark mode, purple blobs, grid lines, bento cards, gradient text | Nothing. That's the joke: it looks like everyone's portfolio |
| **2013** | Flat | Turquoise band, thin uppercase Lato, a 40-step long shadow, flat circles | Ghost buttons, coloured tiles |
| **2007** | Web 2.0 | Glossy blue header, reflected lowercase wordmark, `beta`, a starburst, tag cloud | Glossy tabs, 80×15 badges |
| **2001** | The Flash years | A fixed-width "movie" on gunmetal: chrome Orbitron, pixel labels, LED readouts, corner brackets, the Story as a Flash timeline with keyframes and a red playhead | The **Skip Intro** screen (a loading bar that stalls like a 56k modem, letters flying in, a white flash, Enter site), a sound toggle, rollover blips |
| **1997** | The homepage years | Starfield tiles, rainbow Impact, Comic Sans, bevelled tables, a Win95 taskbar | Marquee, blinking NEW!, a sparkle cursor trail, a visitor counter, a webring that travels in time, MIDI music made with Web Audio |
| **1992** | Hypertext | The browser's own stylesheet. Nothing else | Links are numbered like the 1991 Line Mode Browser: type a number and press Return |

**The year matters, not only the era.** Every tool in the Stack section knows the year it
arrived (`data-since`). Drag back and Django greys out before 2005, WebSockets before 2011,
and the line above the stack counts down: *"In 1997, 6 of the 25 tools I use exist. Next:
REST and SQLite, in 2000."* Every project knows when it was built (`data-when`), so in 1997
WorkshopOS is *29 years from now*. The copyright year follows the slider.

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
- `era`: the seven eras. A later layer always wins, whatever the selectors, so an era never
  needs `!important` to beat the base.

`print.css` is unlayered, so it beats everything: printing sends you back to 1992.

### Ornaments

Things only one era has (the marquee, the starburst, the HUD, the intent picker) live in the
HTML as `.orn` elements with `data-orn="1997"`. The base layer hides every ornament; each
era shows only its own. Decorative ones are `aria-hidden`; working ones (the MIDI button,
the intent buttons, the webring) are real buttons and links.

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

`js/eras/1992.js`, `1997.js`, `2001.js` and `2028.js` each export `enter()` and `leave()`. Only the
current era's module is loaded (dynamic `import()`) and running; leaving an era removes its
listeners, its sparkles, its music, its intro and its pointer tracking. 2007, 2013 and 2023 need no
JavaScript at all.

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
- Sound is **off** until you switch it on. Then every rollover blips, as every Flash site did.

### The first paint

A small inline script in `<head>` reads `?y=` and sets `data-era` before the page paints,
so a shared 1997 link never flashes 2028 first. Without JavaScript the page is fully readable
in 2028 and the time machine is hidden.

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
js/eras/*.js          era behaviour: 1992 line mode, 1997 sparkles/MIDI/counter, 2001 intro/sound, 2028 light/tilt/intent
tools/serve.mjs       zero-dependency local server
assets/               resume PDF
```

## Adding an era

1. Add it to `ERAS` in `js/eras.js`, and its year to the inline list in `index.html`.
2. Create `css/eras/<year>.css` scoped by `:root[data-era="<year>"]`, inside `@layer era`.
   Show its ornaments with `& :where(.orn[data-orn~="<year>"]) { display: revert; }`.
3. Link the stylesheet in `index.html`.
4. If it needs behaviour, add `js/eras/<year>.js` and set `module: true`.

## Keyboard

- Arrow keys on the slider move one year; Home and End jump to 1992 and 2028.
- `[` and `]` step one era from anywhere.
- In 1992, type a link's number and press Return.

## Performance and accessibility

- No images, no framework, no build. Era scenery is CSS gradients.
- Unminified, uncompressed: 24 KB of HTML, 107 KB of CSS for all seven eras, 32 KB of JavaScript. Only the current era's JavaScript module runs.
- The slider is a native `<input type="range">` with `aria-valuetext` ("1997, The homepage
  years"); era changes are announced through a polite live region.
- `prefers-reduced-motion` turns off view transitions, the static burst, the marquee, blinking,
  sparkles, tilt, drifting blobs and scroll-driven motion.
