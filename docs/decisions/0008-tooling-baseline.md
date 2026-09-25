# 0008. Tooling baseline

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony, Claude (proposal)

## Context

Several contributors with different editors and habits will work on the repo.
Formatting debates, "works on my machine" failures and broken main branches
waste review time. The tooling should catch problems automatically and stay
small enough that newcomers aren't overwhelmed.

## Decision

- **Runtime:** Node.js 24 LTS in production and CI, pinned in `.nvmrc`.
  `package.json#engines` allows `>=24`, so newer local Node versions still work.
- **Package manager:** pnpm 12, version pinned via `packageManager` in
  `package.json`. One lockfile, committed. Node 25+ no longer bundles Corepack,
  so contributors install pnpm themselves (see `CONTRIBUTING.md`).
- **TypeScript:** 6.0, with `strict: true` plus `noUncheckedIndexedAccess`. No
  `any` without a comment explaining why. TypeScript 7 (the native compiler) is
  out, but typescript-eslint supports only `<6.1` so far. Upgrade when it does.
- **Linting:** ESLint with the Next.js, typescript-eslint and jsx-a11y rule
  sets.
- **Formatting:** Prettier, run on save and in CI. Formatting is never a review
  comment.
- **Unit and component tests:** Vitest + React Testing Library. Pure logic (dial
  geometry, data generation, table standings) is unit-tested first.
- **End-to-end tests:** Playwright, covering the main journeys: turn the dial,
  open a year, open an event, submit a form. Includes automated accessibility
  checks (axe).
- **Pre-commit:** Husky runs lint-staged, which runs Prettier and ESLint on
  staged files only, so it stays fast.
- **CI:** GitHub Actions runs typecheck, lint, unit tests, build and E2E on every
  pull request. `main` is protected: PRs only, CI must pass.
- **Commit messages:** Conventional Commits (`feat:`, `fix:`, `docs:`...), which
  makes history scannable and enables changelogs later.

## Consequences

- Most style and correctness issues are caught before review.
- Contributors need Node 24 and pnpm installed. `CONTRIBUTING.md` covers setup.
- CI minutes are free for public repos and generous for private ones at our scale.

## Alternatives considered

- **Biome instead of ESLint + Prettier.** Faster, one tool, but weaker coverage
  of Next.js and accessibility rules today.
- **npm or Yarn.** Both work. pnpm is faster, stricter about undeclared
  dependencies, and the de facto choice in the Next.js/Payload ecosystem.
- **Jest.** Slower and more configuration than Vitest for a TypeScript/ESM
  codebase.
