# 0010. Routes and URL state

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony, Claude (proposal)

## Context

The prototype uses hash routes (`#events-minifootball`, `#event-mf-2025-1`) and
keeps the selected year, sport and time filter in memory. Hash routes can't be
pre-rendered or indexed, and in-memory state is lost on reload and can't be
shared. Event IDs like `mf-2025-1` are generated, not meaningful.

## Decision

### Routes

| Prototype                     | New route                             | Page                                                          |
| ----------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| `#home`                       | `/`                                   | Home                                                          |
| `#events`                     | `/events`                             | Events hub, all sports                                        |
| `#events-<sport>`             | `/events/<sport>`                     | Events hub, one sport                                         |
| `#event-<id>`                 | `/events/<sport>/<event-slug>`        | An event, e.g. `/events/minifootball/autumn-student-cup-2025` |
| `#register`, `#register-<id>` | `/register`, `/register?event=<slug>` | Registration form                                             |
| `#sponsor`                    | `/sponsor`                            | Sponsor form                                                  |
| `#contact`                    | `/contact`                            | Contact form                                                  |
| `#system`                     | `/design-system`                      | Design system and guidelines                                  |
| n/a                           | `/admin`                              | Payload admin (phase 3)                                       |

- Event slugs are human-readable and unique per sport. Admins can edit them, and
  old slugs redirect so shared links keep working.
- In-page anchors (`#schedule`, `#bracket`) stay as hash links within an event page.

### URL state

- The **selected year** and **time filter** live in search params
  (`/events/sprints?year=2025&when=upcoming`), so any view can be shared and
  survives reload. Sport is part of the path.
- The dial updates the URL without a full navigation (shallow replace). Only a
  settled year writes to the URL, not every frame of a drag.
- Purely visual state (deck vs list view, the card in front, dial focus mode)
  stays in component state.

## Consequences

- Every public page can be pre-rendered, indexed and previewed when shared.
- The Loop's "one evolving space" between Home and Events is kept by the shared
  layout (ADR 0002). Navigating between them doesn't remount the dial.
- Old prototype hash links (`#event-...`) can be redirected client-side if
  they've been shared anywhere.

## Alternatives considered

- **Keep hash routes.** No pre-rendering, no SEO, no link previews.
- **Year in the path** (`/events/2025/sprints`). Reads nicely, but the year is a
  filter that the dial changes constantly, which fits search params better.
