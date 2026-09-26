# 0009. Project structure and component conventions

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony, Claude (proposal)

## Context

The main goals of the rewrite are reuse, extensibility and parallel work by
several contributors. That depends on a predictable structure: anyone should be
able to guess where code lives, and adding a feature (a new sport, a new event
module) should touch as few files as possible.

## Decision

### Folder structure

```
src/
  app/                       Next.js routes only: thin files that fetch data and compose features
    (site)/                  public site; its layout holds nav, ambient background and the Loop
    (payload)/               Payload admin (phase 3)
  components/
    ui/                      design-system primitives with no domain knowledge:
                             Button, Chip, Tag, SegmentedControl, IconButton, Field, ...
    layout/                  site chrome: Navigation, TopBar, Footer, AmbientBackground
  features/                  one folder per domain feature, owning its components, hooks and logic
    loop/                    the year dial (canvas rendering, physics, keyboard, a11y)
    deck/                    the 3D poster deck
    events/                  events hub, event page, and event modules (schedule, bracket, heats...)
    posters/                 procedural poster art
    sponsors/                partner marks and the sponsor ribbon
    forms/                   registration, sponsor and contact forms
  cms/                       Payload schema: collections, blocks, access rules, hooks (ADR 0003)
  lib/
    data/                    data-access layer: the only code that knows where data comes from
    format/                  dates, numbers (through i18n)
  domain/                    TypeScript types and pure business rules (Event, Sport, standings...)
  i18n/                      next-intl setup and message files
  styles/                    tokens.css, reset, globals
```

### Rules

1. **Dependencies point one way:** `app → features → components/ui → styles`.
   `features` may use `lib` and `domain`. `components/ui` never imports from
   `features`. Features don't import each other's internals; they import from a
   feature's `index.ts`.
2. **One component per folder:** `Button/Button.tsx`,
   `Button/Button.module.css`, `Button/Button.test.tsx`, `Button/index.ts`.
3. **Server Components by default.** Add `'use client'` only to the smallest
   interactive piece (the dial, the deck, a form), never to a whole page.
4. **Logic out of components.** Physics, geometry, standings and data generation
   are plain TypeScript functions in the feature (or in `domain/`) with unit
   tests. Components render and wire events.
5. **Components never fetch or know the data source.** They receive typed props.
   Routes call `lib/data`, which today returns sample data and later calls
   Payload (ADR 0003).
6. **Naming:** PascalCase components and their files, camelCase functions and
   hooks (`useDialPhysics`), kebab-case routes. Names describe the domain
   (`YearDial`, `EventDeck`, `GroupTable`), not the implementation.
7. **Accessibility is part of the component.** Keyboard support, ARIA roles and
   reduced-motion handling are part of a component's definition of done, as in
   the prototype.

### Extension points

- **Adding a sport:** data only. A sport has a `kind` (team, track, and later
  field, course, community) that picks its default event modules and its poster
  geometry. No layout changes.
- **Adding an event module:** create `features/events/modules/<Name>/`, register
  it in the module registry (`moduleType → component`), and in phase 3 add the
  matching Payload block. The event page renders whatever modules the event
  lists, in order.

## Consequences

- New contributors can find code by domain, and features can be built in
  parallel with few merge conflicts.
- The rules add some ceremony (index files, props instead of fetching). It pays
  off as the codebase grows.
- Import-direction rules will be enforced with an ESLint rule rather than by
  memory.

## Alternatives considered

- **Group by file type** (`components/`, `hooks/`, `utils/` at top level).
  Familiar, but a single feature ends up scattered across the tree.
- **Monorepo with packages** (`ui`, `web`, `cms`). Premature for one app and one
  team. Can be revisited if a second app appears.
