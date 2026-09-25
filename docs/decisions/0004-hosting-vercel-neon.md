# 0004. Hosting on Vercel with Neon Postgres

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony

## Context

Base Camp is a community club: budget is small and nobody is on call for
servers. We need hosting for a Next.js + Payload app, a Postgres database and
file storage for uploads. Contributors benefit from seeing each change live
before it merges.

## Decision

- **App:** Vercel. Every pull request gets its own preview URL.
- **Database:** Neon (managed serverless Postgres). A separate database branch
  per preview deployment where practical, so previews never touch production data.
- **File storage:** Vercel Blob via Payload's storage adapter. Cloudflare R2
  (S3-compatible) is the fallback if Blob costs or limits become a problem.
- Configuration goes through environment variables only. Nothing
  provider-specific lives in the application code beyond the adapters.

## Consequences

- Near-zero operations work: no servers, OS updates or manual backups.
- Free tiers cover the site at first; expect roughly $20/month per service once
  it outgrows them. Usage should be reviewed when traffic grows.
- Serverless functions have execution-time limits. Long-running jobs (bulk
  imports, image processing) must be designed around them.
- Because we use standard Postgres and S3-compatible storage, moving to another
  host later is a configuration change plus a data migration, not a rewrite.

## Alternatives considered

- **Self-hosted VPS with Docker** (e.g. Hetzner, about €5/month). Cheapest at
  scale, but someone must own updates, backups, TLS and uptime.
- **Deciding later.** Rejected because preview deployments and the database
  choice affect how we set up CI and development from day one.
