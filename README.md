# Base Camp — website prototype

An interactive, single-file prototype of the website for **Base Camp**, a
community sports club in Cluj-Napoca, Romania. Built around "the Base Camp
Loop" — a circular year dial that doubles as the site's main navigation and
timeline.

**Everything in this prototype is placeholder content** — event names,
dates, teams, results, participant counts and sponsor marks are all
generated sample data, clearly separated from real Base Camp information.

## Viewing it

Open `index.html` directly in a browser — no build step or server needed.
It's a self-contained page (HTML, CSS and JS inline).

## Project structure

```
index.html        the built, single-file prototype (open this)
src/               source, split into logical fragments
  1_head.html        <title>, fonts, all CSS
  2_body.html        page markup (nav, home, events hub, forms, the dial, the deck)
  3_data.js          sample data generator (years, sports, events, posters, partner marks)
  4_app.js           app state, the year dial, the event deck, the events hub, nav
  5_pages.js         individual event page rendering, forms, reveal animations
  6_sys.js           design-system page, ambient background, router, boot
build.sh           concatenates src/* into index.html
```

To make changes: edit the relevant file(s) in `src/`, then run:

```
./build.sh
```

which rebuilds `index.html` from the current source fragments.

## Concept

- **The Base Camp Loop**: years 2017–2026 sit on a very wide circular dial,
  of which only a shallow top cap is visible — drag, scroll or use the
  arrow keys to turn it. It wraps forever (a dashed seam marks where 2026
  meets 2017).
- Selecting a year opens its events as a 3D deck of posters on desktop, or
  a swipeable vertical stack on mobile.
- Each event page is built from shared foundations (identity, poster,
  metadata, sponsors, the Loop motif) plus optional modules depending on
  the sport — team sports get schedules/tables/brackets, track sports get
  heats/lanes/rankings.
- Full design rationale, palette, type scale, motion system and component
  states are documented on the in-app **Design system** page
  (`index.html#system`).

## Routes

| Hash | Page |
|---|---|
| `#home` | Homepage |
| `#events`, `#events-<sport>` | Events hub |
| `#event-<id>` | An individual event (e.g. `#event-mf-2025-1`) |
| `#register`, `#sponsor`, `#contact` | Forms |
| `#system` | Design system & guidelines |

## Status

Working prototype / design exploration — not production code. No backend,
no real data, no build tooling required.
