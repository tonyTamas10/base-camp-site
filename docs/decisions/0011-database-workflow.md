# 0011. Database workflow: local Postgres, migrations and content sources

- **Status:** Proposed
- **Date:** 2026-09-26
- **Deciders:** Tony (to review), Claude (proposal)

## Context

Phase 3 adds Payload and Postgres (ADRs 0003, 0004). Contributors need a database to work on the
admin, CI needs one to test against, and production must only ever change schema deliberately.
Not every contributor has Docker or a Postgres install, and some work (UI, styling) doesn't need
a database at all.

## Decision

### Local database

- `pnpm db` runs a real **Postgres 17** from npm (`embedded-postgres`), with its data in the
  gitignored `.postgres/` folder. No Docker or system install is needed. It creates a development
  database (`basecamp`) and a disposable test database (`basecamp_test`).
- Postgres 17 matches Neon's default, so development and production run the same engine.

### Schema changes

- In development, Payload applies schema changes automatically (`push`) for speed.
- **Production only changes through migrations** in `src/migrations`, created with
  `pnpm migrate:create <name>` and committed with the change that needs them.
- Deployments run `payload migrate` before `next build` (the `vercel-build` script), so a
  schema change can never reach the site without its migration.
- CI builds its database from migrations only, and fails if the collections changed without a
  migration.

### Content sources

- The data layer (ADR 0009) reads from **Payload** when `DATABASE_URI` is set, and otherwise from
  the **generated sample dataset**. Both return the same domain objects, so the rest of the code
  can't tell them apart.
- `pnpm seed` loads the sample dataset into an empty database, so a fresh environment or preview
  looks like the prototype. `pnpm seed:reset` replaces existing content, for local use only.
- Event status (past, this week, upcoming) is computed from the date and "today" in the club's
  time zone, never stored. `SITE_TODAY` pins today for tests.

### Performance

- Lists, the dial and the deck use a lean summary query (top-level columns only). Full details,
  with rosters and results, are loaded only for the event being viewed. Participant counts are
  stored when an event is saved, so summaries never load rosters.
- Pages are pre-rendered and regenerate when content changes (Payload hooks revalidate the site),
  and at least hourly, because statuses change with the calendar.

## Consequences

- `pnpm install && pnpm db && pnpm seed && pnpm dev` gives a working site and admin on any
  machine that runs Node.
- UI work needs no database at all: without `DATABASE_URI` the site runs on sample content.
- Contributors who change a collection must remember `pnpm migrate:create`; CI enforces it.
- Payload's generated migrations need a small import fix under this project's TypeScript
  settings; `pnpm migrate:create` applies it automatically.
- `embedded-postgres` is published as beta builds. It is a development tool only, pinned to an
  exact version, and replaceable by any Postgres (Docker, Postgres.app) through `DATABASE_URI`.

## Alternatives considered

- **Docker Compose for Postgres.** Standard, but adds a heavy install and a running daemon for
  every contributor, which the club's volunteers may not have.
- **A shared cloud development database (Neon branch).** No local setup, but requires an
  account per contributor, is slower, and couples everyone's work.
- **SQLite locally, Postgres in production.** Simple, but different engines behave differently
  and bugs would only appear in production.
- **Schema push in production.** Convenient, but changes the live database implicitly with no
  review or rollback path.
