# 0003. Payload CMS for the admin and content

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony

## Context

Club members, not developers, will create and edit events through an admin UI.
How much they can customise will grow over time. That means we need:

- logins, with different roles (e.g. admin, editor),
- structured editing of events, sports, teams, results and sponsors,
- uploads for posters, photos and sponsor logos,
- drafts and a way to see what changed and undo mistakes,
- storage for form submissions (registrations, sponsor enquiries, contact).

The prototype already composes each event page from **modules** (story,
schedule, bracket, heats, rankings, venue, gallery...) chosen per sport. Admins
should be able to compose pages the same way.

## Decision

Use **Payload CMS (v3)**, installed inside the Next.js app (ADR 0002), with
**Postgres** as its database.

- Content types (Events, Sports, Teams, Sponsors, Media, Registrations, Users)
  are Payload collections defined in TypeScript. The admin UI and the typed API
  are generated from them.
- Event page modules become Payload **blocks**. Admins add, reorder and fill
  blocks; each block has one matching React component on the public site.
- Admin screens can be extended with our own React components when the
  generated UI isn't enough.
- The public site reads content only through our data-access layer
  (`src/lib/data`, ADR 0009), never by calling Payload directly from components.

## Consequences

- We get auth, roles, uploads, drafts, versions and admin screens without
  building them.
- Payload's conventions shape our data model. Its schema definitions are our
  source of truth for content types.
- Adding a new event module means adding a block schema and a React component.
  The pattern is documented in ADR 0009.
- Payload upgrades need testing alongside Next.js upgrades.

## Alternatives considered

- **Custom admin built from scratch** (Next.js + Drizzle + an auth library).
  Full control, but we would build and maintain auth, permissions, uploads,
  validation and every CRUD screen. Months of extra work for a small team.
- **Hosted headless CMS (Sanity, Contentful).** Polished editing, but the content
  lives with a vendor, costs grow with seats and usage, and registrations would
  still need our own database.
