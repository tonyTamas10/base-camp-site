# Contributing

Thanks for helping build the Base Camp site. This guide covers setup, the
workflow for changes, and the conventions that keep the codebase consistent.
The reasoning behind each convention is in [docs/decisions](docs/decisions/README.md).

## Setup

1. **Node.js 24 or newer.** Production runs on Node 24 LTS (`.nvmrc`). With a
   version manager: `fnm use` or `nvm use`.
2. **pnpm 12.** Node 25+ no longer bundles Corepack, so install pnpm directly:
   ```bash
   npm install -g pnpm@12
   ```
   If that needs admin rights, use the standalone installer from
   [pnpm.io/installation](https://pnpm.io/installation) instead.
3. **Install and run:**
   ```bash
   pnpm install
   pnpm dev
   ```
4. **For end-to-end tests,** install the browser once: `pnpm exec playwright install chromium`.

Recommended VS Code extensions are listed in `.vscode/extensions.json`. With
them, files are formatted and lint-fixed on save.

### Dependency install scripts

pnpm blocks install scripts from dependencies unless they're listed in
`pnpm-workspace.yaml` under `allowBuilds`. If `pnpm install` reports ignored
builds after you add a package, check whether the package really needs its
script (most ship prebuilt binaries), then approve or deny it with
`pnpm approve-builds <pkg>` or `pnpm approve-builds '!<pkg>'`.

## Workflow

1. Branch from `main`: `feat/event-deck`, `fix/dial-keyboard`, `docs/adr-email`.
2. Commit using [Conventional Commits](https://www.conventionalcommits.org/):
   `feat: add event deck`, `fix: stop dial overshooting on wheel`,
   `docs: record email provider decision`. A pre-commit hook formats and lints
   staged files.
3. Run `pnpm check` before pushing.
4. Open a pull request. CI must pass, and the PR template's checklist must be done.
5. Changing an architectural decision? Add a new ADR in the same PR.

## Code conventions

The full rules are in [ADR 0009](docs/decisions/0009-project-structure-and-components.md).
The short version:

### Where code goes

| Folder                   | Contains                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `src/app/`               | Routes only. Thin files that load data and compose features.                         |
| `src/components/ui/`     | Design-system primitives with no domain knowledge (`Button`, `Tag`, ...).            |
| `src/components/layout/` | Site chrome (navigation, footer, background).                                        |
| `src/features/<name>/`   | One domain feature: its components, hooks and logic (`loop`, `deck`, `events`, ...). |
| `src/domain/`            | Types and pure business rules. No React.                                             |
| `src/lib/`               | Utilities and the data-access layer (`lib/data`). No React components.               |
| `src/i18n/`              | Translation setup and message files.                                                 |
| `src/styles/`            | Design tokens, fonts, global styles.                                                 |

Imports flow one way: `app → features → components → styles`. ESLint enforces
this, so a wrong-direction import fails lint with an explanation.

### Components

- One component per folder: `Button/Button.tsx`, `Button.module.css`,
  `Button.test.tsx`, `index.ts`. Import from the folder: `@/components/ui/Button`.
- Server Components by default. Add `'use client'` only to the smallest
  interactive piece.
- Components get their data through typed props. They never fetch.
- Keep logic out of components: calculations, physics and data shaping are plain
  functions with their own unit tests.
- `Button` and `Tag` in `src/components/ui/` are the reference examples.

### Styling

- CSS Modules, one file per component. Use design tokens from
  `src/styles/tokens.css` (`var(--color-signal)`, `var(--space-4)`), never raw
  colours or spacing values.
- Signal orange marks one thing per view: the selection, active state or primary
  action. Don't use it for decoration.
- Every animation must respect `prefers-reduced-motion`.

### Text and translations

- No user-facing text is hard-coded in components. Add it to
  `src/i18n/messages/en.json` and use `useTranslations` (or `getTranslations` in
  async server code). Keys are type-checked, so typos fail the build.
- Format dates and numbers through next-intl, not by hand.

### Accessibility

Part of the definition of done: everything works with the keyboard alone, has a
visible focus state, meets WCAG 2.1 AA contrast, and respects reduced motion.
The end-to-end tests run axe on every tested page.

### Tests

- **Unit/component (Vitest + Testing Library):** test behaviour the user sees
  (roles, labels, what happens on click), not implementation details. Put the
  test next to the code: `Thing.test.tsx`.
- **End-to-end (Playwright):** main user journeys in `e2e/`, run on desktop and
  phone viewports.
