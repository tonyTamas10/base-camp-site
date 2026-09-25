# Base Camp

The website for **Base Camp**, a community sports club in Cluj-Napoca, Romania.
It's built around **the Base Camp Loop**, a circular year dial that is both the
site's navigation and its timeline.

## Status

The site is being rebuilt from a single-file prototype into a production
Next.js application, in four phases ([ADR 0007](docs/decisions/0007-migration-phases.md)):

1. **Foundation**: tooling, CI, design tokens, i18n, decision records. ← _current_
2. **Port the public site** to React components, on typed sample data.
3. **Admin and database** with Payload CMS and Postgres.
4. **Forms and launch readiness.**

The original prototype is in [`prototype/`](prototype/README.md). Open
`prototype/index.html` in a browser to see the target look and behaviour.

## Quick start

Requires Node.js 24+ and pnpm 12 (see [CONTRIBUTING.md](CONTRIBUTING.md#setup)).

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Scripts

| Command                         | What it does                                                     |
| ------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                      | Start the development server                                     |
| `pnpm build` / `pnpm start`     | Production build / serve it                                      |
| `pnpm check`                    | Typecheck, lint, format check and unit tests: run before pushing |
| `pnpm test` / `pnpm test:watch` | Unit and component tests (Vitest)                                |
| `pnpm test:e2e`                 | End-to-end and accessibility tests (Playwright)                  |
| `pnpm lint:fix` / `pnpm format` | Auto-fix lint issues / format all files                          |

## Stack

Next.js (App Router) · React · TypeScript · CSS Modules with design tokens ·
next-intl · Vitest · Playwright. Payload CMS, Postgres (Neon) and Vercel follow
in phase 3.

## Documentation

- [Architecture decisions](docs/decisions/README.md): every significant decision, with the reasoning behind it.
- [Contributing](CONTRIBUTING.md): setup, workflow and code conventions.
- The design system (colours, type, motion, components) will live at `/design-system`, ported from the prototype.
