# 0001. Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony

## Context

The site is moving from a single-file prototype to a production codebase that
several people will work on over time, including club members who were not in
the original discussions. Decisions made in chat or in someone's head get lost,
and later contributors either repeat old debates or undo choices without knowing
why they were made.

## Decision

Every significant decision (technology, architecture, conventions, process) is
written as an Architecture Decision Record in `docs/decisions/`, one Markdown
file per decision, numbered in order. ADRs are reviewed in pull requests like
code. Accepted ADRs are never rewritten; a changed mind becomes a new ADR that
supersedes the old one.

## Consequences

- The reasoning behind the codebase is versioned with the code and available to
  anyone who clones the repo.
- Writing an ADR adds a little friction to big changes. That is intended.
- Someone has to keep the index in `README.md` current.

## Alternatives considered

- **A shared online document.** Easier for non-developers to read, but it drifts
  from the code and has no review step. Rejected as the source of truth.
- **Decisions only in PR descriptions.** Hard to find later and scattered.
