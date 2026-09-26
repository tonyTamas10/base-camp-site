/*
 * Design-system reference content. This page documents the system for designers and developers,
 * so it is English reference text kept with the feature rather than interface strings (ADR 0006).
 */
import { colors } from '@/styles/tokens';

export const SECTIONS = [
  ['principles', 'Principles'],
  ['colour', 'Colour'],
  ['type', 'Type'],
  ['spacing', 'Spacing'],
  ['motion', 'Motion'],
  ['states', 'Components & states'],
  ['responsive', 'Responsive'],
  ['imagery', 'Imagery'],
  ['modules', 'Event modules'],
  ['new-sport', 'Adding a sport'],
  ['key-frames', 'Key frames'],
  ['access', 'Access & performance'],
] as const;

export const PRINCIPLES = [
  [
    'The Loop is the interface.',
    'History, navigation and progress share one line. If a feature needs a new navigation pattern, first try to express it on the Loop.',
  ],
  [
    'Blue is the world, white is clarity, orange is energy.',
    'Orange marks exactly one thing per view: the selected year, the active card, the primary action, the key number.',
  ],
  [
    'Show, don’t tell.',
    'Posters, numbers, lines and colour carry the story. Text appears only to guide, name or give context. Extra detail sits behind a disclosure.',
  ],
  [
    'Motion explains change.',
    'Animate relationships (a year opening into events, a team entering a bracket), not decoration.',
  ],
  [
    'Honest content.',
    'No invented results, totals or sponsors. While data is sample data, one Prototype badge says so, instead of labels on every element.',
  ],
] as const;

export const SWATCHES = [
  ['Deep cobalt', colors.cobalt, 'Environment. The world everything lives in.', colors.warmWhite],
  ['Deep field', colors.cobaltDeep, 'Lower field, gradients, depth.', colors.warmWhite],
  ['Midnight', colors.midnight, 'Cards, contrast bands, text on orange.', colors.warmWhite],
  ['Warm white', colors.warmWhite, 'Type on blue. Open space.', colors.midnight],
  ['Paper', colors.paper, 'Quiet editorial sections.', colors.ink],
  [
    'Signal orange',
    colors.signal,
    'Selected, active, CTA, key stats. Never body text on blue.',
    colors.midnight,
  ],
  ['Deep signal', colors.signalDeep, 'Large orange text on paper only.', colors.warmWhite],
  ['Pale blue', colors.paleBlue, 'Secondary text on blue and midnight.', colors.midnight],
  ['Slate', colors.slate, 'Secondary text on paper.', colors.warmWhite],
] as const;

/** [foreground, background, name]: contrast is computed live from the tokens. */
export const CONTRAST_PAIRS = [
  [colors.warmWhite, colors.cobalt, 'White on cobalt'],
  [colors.paleBlue, colors.cobalt, 'Pale on cobalt'],
  [colors.midnight, colors.signal, 'Midnight on orange'],
  [colors.ink, colors.paper, 'Ink on paper'],
  [colors.slate, colors.paper, 'Slate on paper'],
  [colors.signalDeep, colors.paper, 'Deep signal on paper'],
  [colors.signal, colors.midnight, 'Orange on midnight'],
  [colors.signal, colors.cobalt, 'Orange on cobalt'],
] as const;

export const TYPE_SCALE = [
  ['Display XL · 900', 'clamp(64–250px) · lh .78', 'display', 'Mănăștur'],
  ['H1 event · 900', 'clamp(56–128px)', 'h1', 'Încă o finală'],
  ['Section · 900', 'clamp(44–88px)', 'section', 'Țintă atinsă'],
  ['Card title · 800', '26px · lh .95', 'card', 'Student Cup'],
  ['Body · 400', '16–18px · lh 1.55', 'body', 'Șase echipe, o țintă. Încă o finală până la capăt.'],
  ['Label · Mono 11px', '+.06em, uppercase', 'mono', '02 / 06 · 12:30 · 7.24s'],
] as const;

export const SPACING_SCALE = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128] as const;

export const MOTION_CURVES = [
  [
    'Ambient',
    'Track lines drift, runners loop the lanes, the ribbon moves slowly. Pauses offscreen, when the tab is hidden, and under reduced motion.',
    'linear · 30fps canvas · 60s ribbon loop',
    'linear',
  ],
  [
    'Interface',
    'Hover, focus, selection, deck cards. Fast and physical, with a slight overshoot on passes.',
    '160–320ms · cubic-bezier(.34, 1.3, .64, 1)',
    'var(--ease-pass)',
  ],
  [
    'Narrative',
    'Route transitions, Loop expansion, event storytelling. A drive phase, then a long glide.',
    '620–720ms · cubic-bezier(.7, 0, .2, 1)',
    'var(--ease-sprint)',
  ],
] as const;

export const RESPONSIVE_ROWS = [
  [
    'Navigation',
    'Vertical, 236px, no panel, line and dot markers',
    'Top bar with Events and Register always visible; full-screen menu',
  ],
  [
    'Loop dial',
    'A very wide dial: only its top cap (100–140px) shows across the content width. Years 140–200px apart; shallower on the events hub.',
    'A shallow full-width arc about 78px tall, years 100px apart; turn with a finger and tap a year',
  ],
  [
    'Deck',
    '3D stack, three cards visible behind, the wheel advances one card per gesture',
    'Vertical swipe stack, two cards peek below, counter and buttons, List view toggle',
  ],
  ['Ribbon', 'Top band, 60s loop', 'Below the top bar; marks keep optical height'],
  [
    'Event page',
    'Right-side rail with section markers (≥1100px), top progress line below that',
    'Top progress line, single column',
  ],
  ['Touch targets', '≥ 44 × 44px everywhere; primary actions 48px', 'Same'],
] as const;

export const NEW_SPORT_STEPS = [
  [
    'Register the sport.',
    'Name, slug and kind (team or track today; field, course and community later). The kind picks default modules and how results are shown.',
  ],
  [
    'Draw its geometry.',
    'One line motif from the real field, court or course, added to the poster geometries. Line-only, 1.5–2px, readable on all five poster grounds.',
  ],
  [
    'Choose modules.',
    'Start from the kind’s default set (see the matrix above). Add a new module only when existing ones can’t express the data: one component plus a registry entry.',
  ],
  [
    'Pick an accent per event.',
    'From the event accent list. Orange stays reserved for interaction.',
  ],
  [
    'Add events to the Loop.',
    'The navigation entry, hub page and year counts appear automatically. No layout changes needed.',
  ],
  [
    'Expanding beyond Cluj.',
    'Events already carry a city. The Loop can gain a city filter next to the time filter, using the same segmented control.',
  ],
] as const;

export const KEY_FRAMES = [
  'Rest. The dial sits on the lower edge, half visible.',
  'Detach. Hero fades, the ring brightens.',
  'Expand. The radius grows.',
  'Travel. The dial rises onto the sport row.',
  'Momentum. The ring turns, then settles on the year.',
  'Categories. Sport entries arrive in sequence.',
  'Deck. Posters rise out of the dial.',
] as const;

export const STORY_FRAMES = [
  ['Poster fragments', 'Four slices of the poster settle into one image.'],
  ['Numbers', 'Stats count up once, when they first enter view.'],
  ['Tables', 'Rows resolve from blurred and compressed.'],
  ['Continuation', 'The progress line bends into the next event.'],
] as const;

export const ACCESS_RULES = [
  [
    'Every gesture has a button.',
    'Dial: arrow keys, Home/End, Enter, tap a year. Deck: arrow keys, previous/next buttons, an Open link, and a list view on phones.',
  ],
  [
    'The Loop is a slider.',
    'role="slider" with the year and event count in its value text; settled years are announced politely.',
  ],
  [
    'No traps.',
    'Stages don’t scroll, so wheel and swipe on the dial and deck never fight the page. Event pages use native scroll only. Content behind an open deck is inert.',
  ],
  [
    'Nothing hidden by reveals.',
    'Only content below the fold is armed for reveal; without JavaScript or with reduced motion, everything renders in place.',
  ],
  [
    'Light by design.',
    'Pages are pre-rendered. No video backgrounds. One ambient canvas at 30fps, paused when hidden. Gallery images draw when near the viewport. Posters are vector.',
  ],
] as const;
