import 'server-only';

import type { EventDetail, EventSummary } from '@/domain/event';

import { HERO_POSTER_EVENT_IDS, SAMPLE_DEFAULT_YEAR, SHOWCASE_EVENT_ID } from '../sample/content';
import { generateSampleDataset, type SampleDataset } from '../sample/generate';
import type { ContentSource } from '../source';

let dataset: SampleDataset | undefined;
const sample = () => (dataset ??= generateSampleDataset());

function toSummary(event: EventDetail): EventSummary {
  const { id, slug, sportSlug, name, year, date, venue, city, accent, participants, status } =
    event;
  return { id, slug, sportSlug, name, year, date, venue, city, accent, participants, status };
}

/** Generated placeholder content: lets the site run without a database. */
export const sampleSource: ContentSource = {
  getSports: async () => sample().sports,
  getEventSummaries: async () => sample().events.map(toSummary),
  getEvent: async (sportSlug, slug) =>
    sample().events.find((event) => event.sportSlug === sportSlug && event.slug === slug) ?? null,
  getPartners: async () => sample().partners,
  getSettings: async () => ({
    defaultSeasonYear: SAMPLE_DEFAULT_YEAR,
    contactEmail: null,
    heroPosterEventIds: [...HERO_POSTER_EVENT_IDS],
    showPrototypeBadge: true,
    showcaseEventId: SHOWCASE_EVENT_ID,
  }),
};
