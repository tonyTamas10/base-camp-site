/*
 * The data-access layer (ADR 0009): the only code that knows where content comes from.
 * Routes call these functions and pass plain data to components as props.
 *
 * Content comes from Payload when a database is configured, otherwise from the generated sample
 * dataset (CONTENT_SOURCE=sample forces it). Both return the same domain objects.
 */
import 'server-only';

import { cache } from 'react';

import {
  compareByDate,
  getEventStatus,
  getNextOpenEvent as findNextOpenEvent,
  getRelatedEvents as findRelatedEvents,
  type EventDetail,
  type EventSummary,
} from '@/domain/event';
import type { Partner } from '@/domain/partner';
import type { Sport } from '@/domain/sport';
import { siteConfig } from '@/lib/site';

import { today } from './clock';
import type { ContentSource } from './source';

export const contentSourceName = (): 'payload' | 'sample' =>
  process.env.CONTENT_SOURCE === 'sample' || !process.env.DATABASE_URI ? 'sample' : 'payload';

async function source(): Promise<ContentSource> {
  // Imported lazily so the sample source never loads Payload (or needs a database).
  return contentSourceName() === 'payload'
    ? (await import('./sources/payload')).payloadSource
    : (await import('./sources/sample')).sampleSource;
}

/** Status always follows the calendar, whatever the source stored. */
const withCurrentStatus = <T extends EventSummary>(event: T, now: string): T => ({
  ...event,
  status: getEventStatus(event.date, now),
});

// Each is fetched once per request, however many components ask.
const loadSports = cache(async () => (await source()).getSports());
const loadPartners = cache(async () => (await source()).getPartners());
const loadSettings = cache(async () => (await source()).getSettings());
const loadSummaries = cache(async (): Promise<EventSummary[]> => {
  const now = today();
  return (await (await source()).getEventSummaries())
    .map((event) => withCurrentStatus(event, now))
    .sort(compareByDate);
});
const loadEvent = cache(async (sportSlug: string, slug: string): Promise<EventDetail | null> => {
  const event = await (await source()).getEvent(sportSlug, slug);
  return event ? withCurrentStatus(event, today()) : null;
});

export async function getSports(): Promise<Sport[]> {
  return loadSports();
}

export async function getSport(slug: string): Promise<Sport | null> {
  return (await loadSports()).find((sport) => sport.slug === slug) ?? null;
}

/** Every season on the Loop, oldest first, including years without events, up to this year. */
export async function getSeasonYears(): Promise<number[]> {
  const events = await loadSummaries();
  const thisYear = Number(today().slice(0, 4));
  const first = events[0]?.year ?? thisYear;
  const last = Math.max(thisYear, events.at(-1)?.year ?? thisYear);
  return Array.from({ length: last - first + 1 }, (_, i) => first + i);
}

/** The season the Loop opens on. */
export async function getDefaultSeasonYear(): Promise<number> {
  const [settings, years] = await Promise.all([loadSettings(), getSeasonYears()]);
  const preferred = settings.defaultSeasonYear ?? Number(today().slice(0, 4));
  return years.includes(preferred) ? preferred : (years.at(-1) ?? preferred);
}

/** All events, oldest first, in the lightweight form used by the dial, deck and lists. */
export async function getEventSummaries(): Promise<EventSummary[]> {
  return loadSummaries();
}

export async function getEvent(sportSlug: string, slug: string): Promise<EventDetail | null> {
  return loadEvent(sportSlug, slug);
}

/** Route parameters for every event page, for static generation. */
export async function getEventRouteParams(): Promise<Array<{ sport: string; slug: string }>> {
  return (await loadSummaries()).map((event) => ({ sport: event.sportSlug, slug: event.slug }));
}

export async function getRelatedEvents(event: EventSummary): Promise<EventSummary[]> {
  return findRelatedEvents(await loadSummaries(), event);
}

export async function getNextOpenEvent(event: EventSummary): Promise<EventSummary | null> {
  return findNextOpenEvent(await loadSummaries(), event) ?? null;
}

/** Events that can still be registered for, soonest first. */
export async function getOpenEvents(): Promise<EventSummary[]> {
  return (await loadSummaries()).filter((event) => event.status !== 'past');
}

export async function getPartners(): Promise<Partner[]> {
  return loadPartners();
}

/** Whether to show the "Prototype" badge saying the content is sample data. */
export async function isUsingSampleData(): Promise<boolean> {
  return (await loadSettings()).showPrototypeBadge;
}

/** An event that shows off the event page well, linked from the prototype badge. */
export async function getShowcaseEvent(): Promise<EventSummary | null> {
  const { showcaseEventId } = await loadSettings();
  return (await loadSummaries()).find((event) => event.id === showcaseEventId) ?? null;
}

/** Past events whose posters decorate the home hero. */
export async function getHeroPosterEvents(): Promise<EventSummary[]> {
  const [{ heroPosterEventIds }, events] = await Promise.all([loadSettings(), loadSummaries()]);
  return heroPosterEventIds.flatMap((id) => {
    const event = events.find((candidate) => candidate.id === id);
    return event ? [event] : [];
  });
}

/** Whether form submissions are stored (in the admin's Inbox) rather than discarded. */
export async function areSubmissionsStored(): Promise<boolean> {
  return contentSourceName() === 'payload';
}

/** Where people can write to the club. */
export async function getContactEmail(): Promise<string> {
  return (await loadSettings()).contactEmail ?? siteConfig.contactEmail;
}
