/*
 * URL builders for the site's routes (ADR 0010). Kept in a plain module so server and client
 * components can both use them.
 */
import type { EventSummary } from '@/domain/event';

type EventRef = Pick<EventSummary, 'sportSlug' | 'slug'>;

export const eventHref = (event: EventRef) => `/events/${event.sportSlug}/${event.slug}` as const;

/** Registration form, preselecting an event. Slugs are unique only within a sport, so both are sent. */
export const registerHref = (event: EventRef) =>
  `/register?sport=${encodeURIComponent(event.sportSlug)}&event=${encodeURIComponent(event.slug)}` as const;
