# Base Camp

The website for **Base Camp**, a community sports club in Cluj-Napoca, Romania.
It's built around **the Base Camp Loop**, a circular year dial that is both the
site's navigation and its timeline.

## Status

The site is being rebuilt from a single-file prototype into a production
Next.js application, in four phases ([ADR 0007](docs/decisions/0007-migration-phases.md)):

1. **Foundation**: tooling, CI, design tokens, i18n, decision records. ✓
2. **Port the public site** to React components, on typed sample data. ✓
3. **Admin and database** with Payload CMS and Postgres. ← _current_
4. **Forms and launch readiness.**

The original single-file prototype was retired once the rebuild matched it. It is in Git
history (commit `3add57f`) if you ever need the reference.

## Quick start

Requires Node.js 24+ and pnpm 12. Full setup, including the local database and admin, is in
[CONTRIBUTING.md](CONTRIBUTING.md#setup). The short version:

```bash
pnpm install
cp .env.example .env.local   # then set PAYLOAD_SECRET
pnpm db                      # in its own terminal
pnpm seed && pnpm dev
```

The site is at http://localhost:3000 and the admin at http://localhost:3000/admin. Without a
database (no `DATABASE_URI`), the site runs on generated sample content.

## Scripts

| Command                         | What it does                                                     |
| ------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                      | Start the development server                                     |
| `pnpm build` / `pnpm start`     | Production build / serve it                                      |
| `pnpm check`                    | Typecheck, lint, format check and unit tests: run before pushing |
| `pnpm test` / `pnpm test:watch` | Unit and component tests (Vitest)                                |
| `pnpm test:e2e`                 | End-to-end and accessibility tests (Playwright)                  |
| `pnpm lint:fix` / `pnpm format` | Auto-fix lint issues / format all files                          |
| `pnpm db`                       | Run the local Postgres database                                  |
| `pnpm seed` / `pnpm seed:reset` | Load the sample content into the database                        |
| `pnpm migrate:create <name>`    | Create a database migration after changing the CMS schema        |

## Stack

Next.js (App Router) · React · TypeScript · CSS Modules with design tokens · next-intl ·
Payload CMS · Postgres · Vitest · Playwright. Hosting is planned on Vercel with Neon
([ADR 0004](docs/decisions/0004-hosting-vercel-neon.md)).

## Documentation

- [Architecture decisions](docs/decisions/README.md): every significant decision, with the reasoning behind it.
- [Contributing](CONTRIBUTING.md): setup, workflow and code conventions.
- The design system (colours, type, motion, components, event modules) lives on the site at
  `/design-system`, generated partly from the code so it stays current.

## Where things are

| Path                   | What                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/app/`             | Routes. `(loop)` holds home and the events hub (they share the dial); `(pages)` holds scrolling pages. |
| `src/features/loop/`   | The Base Camp Loop: dial geometry, physics, canvas painting, controller, shared state.                 |
| `src/features/deck/`   | The 3D event deck and event cards.                                                                     |
| `src/features/events/` | Events hub and the modular event page (`page/modules/registry.ts`).                                    |
| `src/features/forms/`  | Registration, sponsor and contact forms.                                                               |
| `src/domain/`          | Types and pure rules: events, standings, rankings, dates.                                              |
| `src/lib/data/`        | Data-access layer, the only code that knows where content comes from.                                  |
| `src/lib/forms/`       | Form validation, server actions and delivery to the admin's Inbox.                                     |
| `src/cms/`             | Payload schema: collections, page-section blocks, access rules.                                        |
| `src/migrations/`      | Database migrations (generated, committed).                                                            |
| `scripts/`             | Local database, seeding and migration helpers.                                                         |
| `src/styles/`          | Design tokens, fonts, global styles.                                                                   |
