# 0005. CSS Modules and design tokens

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony

## Context

The prototype's visual identity is carefully tuned: a colour system (cobalt
environment, signal orange used for exactly one thing per view), three
typefaces, a 4px spacing scale, and three named motion curves. Much of the UI
is bespoke: the canvas dial, the 3D deck, poster art, reveal animations. All of
it lives in one global stylesheet today, where any rule can affect any element.

## Decision

- Style components with **CSS Modules**: one `Component.module.css` next to each
  component, with class names scoped to that component automatically.
- Define every colour, font, spacing step, radius, easing curve and duration once
  as **CSS custom properties** in `src/styles/tokens.css`. Components use tokens,
  never raw values. The `:root` block of the prototype is the starting point.
- Keep global CSS to a minimum: tokens, a reset, base typography and
  accessibility helpers (`.sr-only`, focus styles, reduced-motion rules).
- Tokens are also exported as a typed TypeScript object for the few places that
  need them in code (canvas drawing, poster SVG generation).
- Token names follow the design system's own vocabulary (`--color-cobalt`,
  `--color-signal`, `--ease-sprint`) rather than the prototype's shorthand
  (`--blue`, `--orange`, `--e-sprint`).
- Fonts are self-hosted through `next/font`: downloaded at build time, served
  from our domain, so visitors make no requests to Google (faster, and simpler
  for GDPR). Google has merged "Big Shoulders Display" into **Big Shoulders**,
  whose optical-size axis selects the display cut at large sizes.

## Consequences

- The prototype's CSS ports almost directly, rule by rule, into the component
  that owns it.
- Styles can't leak between components, so contributors can change one
  component safely.
- Plain CSS is familiar to every contributor; there's no framework to learn.
- The tokens file becomes the contract between design and code. Changing a
  token changes the whole site, so changes to it deserve review.
- Keeping `tokens.css` and its TypeScript mirror in sync needs discipline or a
  small generation step. We'll decide which when the duplication appears.

## Alternatives considered

- **Tailwind CSS.** Popular and quick for standard UI, but the dial, deck and
  poster effects would still need custom CSS, and utility-heavy markup is harder
  for newcomers to read in a design-heavy site.
- **CSS-in-JS (styled-components, Emotion).** Runtime cost, and friction with
  React Server Components.
- **Keep one global stylesheet.** No isolation, and it grows into the problem we
  are leaving.
