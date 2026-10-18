// The eras, oldest first. An era owns every year from its `from` up to the next era's `from`.
// The milestone years are also inlined in index.html's head script; keep the two in step.

const svg = (body) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">${body}</svg>`)}`;

const gf = (query) => `https://fonts.googleapis.com/css2?${query}&display=swap`;

export const MIN_YEAR = 1992;
export const MAX_YEAR = 2030;
export const DEFAULT_YEAR = 2026; // the present: the page opens here

export const ERAS = [
  {
    id: '1992',
    from: 1992,
    name: 'Hypertext',
    note: 'The web is a year old. Images arrive in 1993, JavaScript in 1995, CSS in 1996. What you see is the plain HTML every other era is dressed over.',
    title: 'Mohammed Irshad C - Home Page',
    fonts: [],
    module: true,
    agent: true, // Irshad's Agent visits (css/agent.css dresses it here)
    favicon: svg(`<rect width="32" height="32" fill="#fff"/><text x="16" y="25" font-family="Times New Roman,serif" font-size="26" text-anchor="middle" fill="#000">i</text>`),
  },
  {
    id: '1997',
    from: 1997,
    name: 'The homepage years',
    note: 'Tables for layout, tiled backgrounds, marquees, visitor counters. Nobody had taste. Everybody had a homepage.',
    title: "~*~ Irshad's Home Page ~*~",
    fonts: [gf('family=Comic+Neue:wght@400;700')],
    fontProbe: '700 1em "Comic Neue"',
    module: true,
    agent: true, // Irshad's Agent visits (css/agent.css dresses it here)
    favicon: svg(`<rect width="32" height="32" fill="#000"/><polygon points="16,3 19.5,12 29,12 21.5,18 24.5,28 16,22 7.5,28 10.5,18 3,12 12.5,12" fill="#ff0"/>`),
  },
  {
    id: '2001',
    from: 2001,
    name: 'The Flash years',
    note: 'Loading bars, Skip Intro buttons, tiny pixel fonts, chrome on everything, and sound you never asked for.',
    title: ':: IRSHAD :: interactive portfolio v2.001 ::',
    fonts: [gf('family=Orbitron:wght@500;700;900'), gf('family=Silkscreen')],
    fontProbe: '700 1em Orbitron',
    module: true,
    agent: true, // Irshad's Agent visits (css/agent.css dresses it here)
    favicon: svg(`<rect width="32" height="32" rx="6" fill="#15181d"/><circle cx="16" cy="16" r="10" fill="none" stroke="#ff9900" stroke-width="3" stroke-dasharray="44 20"/><circle cx="16" cy="16" r="4" fill="#3fa9f5"/>`),
  },
  {
    id: '2007',
    from: 2007,
    name: 'Web 2.0',
    note: 'Gloss, gradients, rounded corners and reflections. Everything is in beta. The iPhone ships this year.',
    title: 'irshad (beta) | Python Developer',
    fonts: [gf('family=Nunito:wght@400;800;900')],
    fontProbe: '900 1em Nunito',
    module: false,
    agent: true, // Irshad's Agent visits (css/agent.css dresses it here)
    favicon: svg(`<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc0f2"/><stop offset=".5" stop-color="#2f80c9"/><stop offset=".5" stop-color="#1f6fb8"/><stop offset="1" stop-color="#3a8fd8"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="7" fill="url(#g)"/><text x="16" y="23" font-family="Arial,sans-serif" font-weight="bold" font-size="18" text-anchor="middle" fill="#fff">i</text>`),
  },
  {
    id: '2013',
    from: 2013,
    name: 'Flat',
    note: 'iOS 7 takes the shadows away. Bold flat colour, thin type, long shadows and big buttons.',
    title: 'Irshad — Developer',
    fonts: [gf('family=Lato:wght@300;400;700;900')],
    fontProbe: '300 1em Lato',
    module: false,
    agent: true, // Irshad's Agent visits (css/agent.css dresses it here)
    favicon: svg(`<rect width="32" height="32" fill="#1abc9c"/><text x="16" y="23" font-family="Arial,sans-serif" font-weight="bold" font-size="18" text-anchor="middle" fill="#fff">I</text>`),
  },
  {
    id: '2023',
    from: 2023,
    name: 'The template era',
    note: 'Dark mode, gradient glow, glass and bento grids. AI can now make this page in seconds, which is why it looks like everyone else’s.',
    title: 'Irshad ✦ Developer',
    fonts: [gf('family=Inter:wght@400;500;600;700'), gf('family=Instrument+Serif:ital@0;1')],
    fontProbe: '600 1em Inter',
    module: false,
    agent: true, // Irshad's Agent visits (css/agent.css dresses it here)
    favicon: svg(`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#60a5fa"/></linearGradient></defs><rect x="2" y="2" width="28" height="28" rx="9" fill="url(#g)"/>`),
  },
  {
    id: '2026',
    from: 2026,
    name: 'Depth and intent',
    note: 'Now. Light that follows you, panels with depth, and intent: tell the page why you came, and it leans toward it.',
    title: 'Irshad · 2026',
    fonts: [
      gf('family=Unbounded:wght@300;400;500'),
      gf('family=Geist:wght@300..600&family=Geist+Mono:wght@400;500'),
    ],
    fontProbe: '300 1em Unbounded',
    module: true,
    agent: true, // Irshad's Agent visits (css/agent.css dresses it here)
    favicon: svg(`<circle cx="16" cy="16" r="11" fill="none" stroke="#7df3ff" stroke-width="3"/><circle cx="16" cy="16" r="4" fill="#b8a4ff"/>`),
  },
  {
    id: '2030',
    from: 2030,
    name: 'The page becomes a place',
    note: 'Four years from now. The page is a space you fly through, drawn live from real data. Scroll to fly.',
    title: 'Irshad · 2030',
    fonts: [
      gf('family=Sora:wght@200;300;400'),
      gf('family=Geist:wght@300..600&family=Geist+Mono:wght@400;500'),
    ],
    fontProbe: '200 1em Sora',
    module: true,
    favicon: svg(`<circle cx="16" cy="16" r="15" fill="#03040a"/><ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="#ffd28a" stroke-width="2" transform="rotate(-24 16 16)"/><circle cx="16" cy="16" r="5" fill="#9fe8ff"/>`),
  },
];

export function eraForYear(year) {
  let era = ERAS[0];
  for (const e of ERAS) if (year >= e.from) era = e;
  return era;
}

export const eraIndex = (era) => ERAS.indexOf(era);
