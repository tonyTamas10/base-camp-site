# 0007. Migration in phases, prototype kept as reference

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony

## Context

Rewriting the prototype, adding a CMS and a database, and making forms real
all at once would leave nothing reviewable for weeks, and mix design, data and
infrastructure problems in the same changes.

## Decision

Work in four phases. Each ends with something running and reviewable.

1. **Foundation.** Next.js + TypeScript scaffold, tooling, CI, design tokens,
   i18n setup, ADRs, contributor docs. The prototype moves to `prototype/`
   unchanged, so it can still be opened as the visual reference.
2. **Port the public site.** Rebuild the site component by component, matching
   the prototype's look and behaviour. Data comes from typed sample data served
   through the data-access layer, the same seeded generator the prototype uses,
   rewritten in TypeScript.
3. **Admin and database.** Add Payload, Postgres and the collections and blocks.
   Switch the data-access layer from sample data to Payload. Components don't
   change.
4. **Forms and launch readiness.** Registrations, sponsor and contact forms
   stored in Payload, email notifications, spam protection, analytics, SEO and
   accessibility audits.

Once phase 2 reaches parity, the `prototype/` folder is deleted (it stays in Git
history).

## Consequences

- Visible progress early, and every PR stays reviewable.
- Some phase 2 work (the sample data generator) is partly temporary. That's
  acceptable: it also becomes our test fixtures and local seed data.
- Visual parity with the prototype is the acceptance bar for phase 2. Redesigns
  happen after, as separate, deliberate changes.

## Open questions (to decide in later ADRs)

- Email provider for notifications (phase 4).
- Spam protection approach for public forms (phase 4).
- Analytics tool, if any, with privacy/GDPR in mind (phase 4).
- Roles and permissions model for admin users (phase 3).

## Alternatives considered

- **Data model and admin first.** Less throwaway work, but nothing visible for a
  long stretch.
- **Redesign while porting.** Mixes two kinds of change; slower and harder to
  review.
