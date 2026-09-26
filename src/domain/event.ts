import type { Competition } from './competition';
import { daysBetween, type IsoDate } from './dates';
import type { Partner } from './partner';
import type { SportKind } from './sport';

/** Event accents live inside posters and card rules only; signal orange stays reserved for interaction. */
export type EventAccent = 'signal' | 'amber' | 'pale-blue' | 'mint' | 'rose';

export type EventStatus = 'past' | 'this-week' | 'upcoming';

/** Status filter on the events hub; `all` shows every status. */
export type EventTimeFilter = 'all' | EventStatus;

/** Everything needed to show an event in lists, the deck and the dial. Kept small: it is sent to the browser. */
export interface EventSummary {
  /** Stable identifier; never shown or used in URLs. */
  id: string;
  /** URL segment, unique within its sport. */
  slug: string;
  sportSlug: string;
  name: string;
  year: number;
  date: IsoDate;
  venue: string;
  city: string;
  accent: EventAccent;
  participants: number;
  status: EventStatus;
}

/** Every section an event page can contain (Payload blocks in phase 3). */
export const EVENT_MODULE_TYPES = [
  'story',
  'stats',
  'schedule',
  'teams',
  'groups',
  'bracket',
  'results',
  'players',
  'heats',
  'rankings',
  'records',
  'venue',
  'gallery',
  'partners',
  'registration',
  'related',
] as const;

export type EventModuleType = (typeof EVENT_MODULE_TYPES)[number];

/** The modules a new event starts with, per kind of sport. Editors can reorder, add and remove. */
export const DEFAULT_EVENT_MODULES: Record<SportKind, readonly EventModuleType[]> = {
  team: [
    'story',
    'stats',
    'schedule',
    'teams',
    'groups',
    'bracket',
    'results',
    'players',
    'venue',
    'gallery',
    'partners',
    'registration',
    'related',
  ],
  track: [
    'story',
    'stats',
    'schedule',
    'heats',
    'rankings',
    'records',
    'venue',
    'gallery',
    'partners',
    'registration',
    'related',
  ],
};

export interface ScheduleSlot {
  time: string;
  title: string;
  detail: string;
}

export interface ScheduleDay {
  date: IsoDate;
  title: string;
  slots: ScheduleSlot[];
}

export interface EventDetail extends EventSummary {
  story: { pullQuote: string; pullQuoteEmphasis: string; body: string };
  venueSurface: string;
  schedule: ScheduleDay[];
  competition: Competition;
  modules: EventModuleType[];
  partners: Partner[];
  gallery: GalleryItem[];
}

/** A gallery photo, or (for sample content) a seed for a generated placeholder. */
export type GalleryItem =
  | { kind: 'image'; url: string; alt: string; width: number; height: number }
  | { kind: 'placeholder'; seed: string };

/** An event within the next seven days counts as "this week". */
export const THIS_WEEK_DAYS = 7;

export function getEventStatus(eventDate: IsoDate, today: IsoDate): EventStatus {
  const daysAway = daysBetween(today, eventDate);
  if (daysAway < 0) return 'past';
  return daysAway <= THIS_WEEK_DAYS ? 'this-week' : 'upcoming';
}

export function isOpenForRegistration(event: Pick<EventSummary, 'status'>): boolean {
  return event.status !== 'past';
}

export function compareByDate(a: Pick<EventSummary, 'date'>, b: Pick<EventSummary, 'date'>) {
  return a.date.localeCompare(b.date);
}

/** The soonest event in the same sport that is still open for registration. */
export function getNextOpenEvent<T extends EventSummary>(
  events: T[],
  event: Pick<EventSummary, 'id' | 'sportSlug'>,
): T | undefined {
  return events
    .filter((e) => e.sportSlug === event.sportSlug && e.id !== event.id && isOpenForRegistration(e))
    .sort(compareByDate)[0];
}

const RELATED_FROM_OTHER_YEARS = 2;

/**
 * "Next on the Loop": the following event in the same sport, then the latest editions from other
 * years. `events` must be sorted by date.
 */
export function getRelatedEvents<T extends EventSummary>(events: T[], event: EventSummary): T[] {
  const sameSport = events.filter((e) => e.sportSlug === event.sportSlug && e.id !== event.id);
  const later = events.slice(events.findIndex((e) => e.id === event.id) + 1);
  const next =
    later.find((e) => e.sportSlug === event.sportSlug) ??
    getNextOpenEvent(events, event) ??
    sameSport[0];
  const fromOtherYears = sameSport
    .filter((e) => e !== next && e.year !== event.year)
    .slice(-RELATED_FROM_OTHER_YEARS);
  return next ? [next, ...fromOtherYears] : fromOtherYears;
}

export interface EventFilter {
  year?: number;
  sportSlug?: string;
  status?: EventTimeFilter;
}

export function filterEvents<T extends EventSummary>(events: T[], filter: EventFilter): T[] {
  return events.filter(
    (event) =>
      (filter.year === undefined || event.year === filter.year) &&
      (filter.sportSlug === undefined || event.sportSlug === filter.sportSlug) &&
      (filter.status === undefined || filter.status === 'all' || event.status === filter.status),
  );
}
