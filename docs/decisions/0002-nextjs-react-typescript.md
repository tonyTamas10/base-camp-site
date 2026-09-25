# 0002. Next.js (App Router) with React and TypeScript

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony

## Context

The prototype is one 2,000-line HTML file of hand-written JavaScript: global
state, string-built HTML, hash routes (`#event-mf-2025-1`). It works as a
design exploration but is hard to extend, test or split between contributors.

The production site needs:

- reusable components that several people can work on in parallel,
- type safety, so data-shape mistakes are caught before they ship,
- event pages that search engines and link previews (WhatsApp, Facebook) can
  read, because events are shared in group chats,
- a server side for the admin, database and forms (see ADR 0003),
- the Loop dial and deck staying mounted while moving between Home and Events,
  as they do in the prototype.

## Decision

Build the site with **Next.js using the App Router**, **React** and
**TypeScript in strict mode**, as a single application (no monorepo).

- Pages render on the server by default. Only interactive parts (the dial, the
  deck, forms) are Client Components.
- Event pages are pre-rendered and revalidated when content changes, so they
  load fast and carry proper metadata and Open Graph images.
- A shared layout holds the navigation, ambient background and the Loop, so they
  persist across route changes.

## Consequences

- Real URLs replace hash routes (details in ADR 0010).
- Contributors need to understand the Server/Client Component split. ADR 0009
  sets the conventions.
- Payload CMS installs into this same Next.js app, so there is one codebase and
  one deployment.
- We follow Next.js release cadence; upgrades must be checked against Payload's
  supported versions.

## Alternatives considered

- **Vite + React Router (SPA).** Simplest and closest to the prototype, but
  content rendered only in the browser is poorly indexed and gives empty link
  previews. It also needs a separate backend for the admin.
- **Astro with React islands.** Excellent for content sites, but the dial and
  deck share state across pages, which works against Astro's page-by-page model.
- **Keep vanilla JavaScript and modularise it.** Least migration work, but no
  component model, no types, and a small hiring and contributor pool.
