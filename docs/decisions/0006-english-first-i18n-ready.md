# 0006. English first, built i18n-ready

- **Status:** Accepted
- **Date:** 2026-09-25
- **Deciders:** Tony

## Context

Base Camp is in Cluj-Napoca. The site launches in English, but Romanian is a
likely addition. Retrofitting translations into a codebase full of hard-coded
strings means touching every component, while routing text through a
translation layer from day one costs little.

There are two kinds of text:

- **Interface text** written by developers (buttons, labels, empty states,
  error messages),
- **Content** written by club members in the admin (event names, descriptions).

## Decision

- **Interface text** goes through **next-intl** from the first component. No
  user-facing string is hard-coded in a component. English messages live in
  `src/i18n/messages/en.json`.
- **Content** uses Payload's field-level localisation, switched on when a second
  language is added. Until then, content fields are single-language.
- Dates, numbers and times are formatted through the i18n layer
  (`Intl`-based), not by hand as in the prototype.
- Routes are prepared for a locale segment. It stays hidden while English is the
  only language, and appears (`/ro/...`) when Romanian is added.

## Consequences

- Adding Romanian means translating `ro.json`, enabling Payload localisation and
  adding content translations. No component changes.
- Contributors must add new strings to the messages file rather than writing
  them inline. Linting will flag literal strings in JSX where practical.
- Fonts already cover Romanian diacritics (ș ț ă â î), as noted in the prototype.

## Alternatives considered

- **Romanian and English at launch.** Doubles content work before launch.
- **English only, no translation layer.** Cheapest now, expensive to retrofit.
