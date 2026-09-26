/*
 * The data-access layer (ADR 0009): the only code that knows where content comes from.
 * Routes call these functions and pass plain data to components as props.
 *
 * Today everything comes from the deterministic sample dataset. In phase 3 these functions query
 * Payload instead; their signatures stay the same, so nothing outside this folder changes.
 */
import 'server-only';

import {
  getNextOpenEvent as findNextOpenEvent,
  getRelatedEvents as findRelatedEvents,
  type EventDetail,
  type EventSummary,
} from '@/domain/event';
import type { Partner } from '@/domain/partner';
import type { Sport } from '@/domain/sport';

import { HERO_POSTER_EVENT_IDS, SAMPLE_DEFAULT_YEAR, SHOWCASE_EVENT_ID } from './sample/content';
import { generateSampleDataset, type SampleDataset } from './sample/generate';

let dataset: SampleDataset | undefined;
const sample = () => (dataset ??= generateSampleDataset());

function toSummary(event: EventDetail): EventSummary {
  const { id, slug, sportSlug, name, year, date, venue, city, accent, participants, status } =
    event;
  return { id, slug, sportSlug, name, year, date, venue, city, accent, participants, status };
}

export async function getSports(): Promise<Sport[]> {
  return sample().sports;
}

export async function getSport(slug: string): Promise<Sport | null> {
  return sample().sports.find((sport) => sport.slug === slug) ?? null;
}

/** Every season on the Loop, oldest first, including years without events. */
export async function getSeasonYears(): Promise<number[]> {
  return sample().years;
}

/** The season the Loop opens on. */
export async function getDefaultSeasonYear(): Promise<number> {
  return SAMPLE_DEFAULT_YEAR;
}

/** All events, oldest first, in the lightweight form used by the dial, deck and lists. */
export async function getEventSummaries(): Promise<EventSummary[]> {
  return sample().events.map(toSummary);
}

export async function getEvent(sportSlug: string, slug: string): Promise<EventDetail | null> {
  return (
    sample().events.find((event) => event.sportSlug === sportSlug && event.slug === slug) ?? null
  );
}

/** Route parameters for every event page, for static generation. */
export async function getEventRouteParams(): Promise<Array<{ sport: string; slug: string }>> {
  return sample().events.map((event) => ({ sport: event.sportSlug, slug: event.slug }));
}

export async function getRelatedEvents(event: EventSummary): Promise<EventSummary[]> {
  return findRelatedEvents(sample().events, event).map(toSummary);
}

export async function getNextOpenEvent(event: EventSummary): Promise<EventSummary | null> {
  const next = findNextOpenEvent(sample().events, event);
  return next ? toSummary(next) : null;
}

/** Events that can still be registered for, soonest first. */
export async function getOpenEvents(): Promise<EventSummary[]> {
  return (await getEventSummaries()).filter((event) => event.status !== 'past');
}

export async function getPartners(): Promise<Partner[]> {
  return sample().partners;
}

/** Whether the site is showing generated placeholder content (drives the "Prototype" badge). */
export async function isUsingSampleData(): Promise<boolean> {
  return true;
}

/** An event that shows off the event page well, linked from the prototype badge. */
export async function getShowcaseEvent(): Promise<EventSummary | null> {
  const showcase = sample().events.find((event) => event.id === SHOWCASE_EVENT_ID);
  return showcase ? toSummary(showcase) : null;
}

/** Past events whose posters decorate the home hero. */
export async function getHeroPosterEvents(): Promise<EventSummary[]> {
  return HERO_POSTER_EVENT_IDS.flatMap((id) => {
    const event = sample().events.find((candidate) => candidate.id === id);
    return event ? [toSummary(event)] : [];
  });
}
