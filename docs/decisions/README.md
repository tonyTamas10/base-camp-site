# Architecture Decision Records

This folder records every significant decision about the Base Camp site: what we
chose, why, and what we gave up. Before changing something covered here, read
the record first. If you disagree with a decision, write a new ADR that
supersedes it; don't edit the old one.

## Statuses

- **Proposed**: drafted, waiting for review. Open for discussion in the PR.
- **Accepted**: agreed and in effect.
- **Superseded by NNNN**: replaced by a later decision (kept for history).
- **Deprecated**: no longer relevant, not replaced.

## Index

| # | Decision | Status |
|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](0002-nextjs-react-typescript.md) | Next.js (App Router) with React and TypeScript | Accepted |
| [0003](0003-payload-cms-for-admin-and-content.md) | Payload CMS for the admin and content | Accepted |
| [0004](0004-hosting-vercel-neon.md) | Hosting on Vercel with Neon Postgres | Accepted |
| [0005](0005-css-modules-and-design-tokens.md) | CSS Modules and design tokens | Accepted |
| [0006](0006-english-first-i18n-ready.md) | English first, built i18n-ready | Accepted |
| [0007](0007-migration-phases.md) | Migration in phases, prototype kept as reference | Accepted |
| [0008](0008-tooling-baseline.md) | Tooling baseline | Accepted |
| [0009](0009-project-structure-and-components.md) | Project structure and component conventions | Accepted |
| [0010](0010-routes-and-url-state.md) | Routes and URL state | Accepted |

## Writing a new ADR

1. Copy [template.md](template.md) to `NNNN-short-title.md` using the next number.
2. Fill it in. Keep it short: context, decision, consequences, alternatives.
3. Add it to the index above and open a PR. Discussion happens in the PR.
