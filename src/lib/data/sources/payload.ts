import 'server-only';

import config from '@payload-config';
import { getPayload } from 'payload';

import { compareByDate, type EventSummary } from '@/domain/event';

import { today } from '../clock';
import type { ContentSource } from '../source';
import { mapEvent, mapEventSummary, mapPartner, mapSport, SUMMARY_FIELDS } from './payloadMappers';

const payload = () => getPayload({ config });

const published = { _status: { equals: 'published' } } as const;

async function sportIndex() {
  const { docs } = await (
    await payload()
  ).find({
    collection: 'sports',
    sort: 'order',
    pagination: false,
    depth: 0,
  });
  return docs;
}

/** Content managed by club members in the admin (ADR 0003). Reads published documents only. */
export const payloadSource: ContentSource = {
  async getSports() {
    return (await sportIndex()).map(mapSport);
  },

  async getEventSummaries() {
    const [sports, { docs }] = await Promise.all([
      sportIndex(),
      (await payload()).find({
        collection: 'events',
        where: published,
        select: SUMMARY_FIELDS,
        sort: 'date',
        pagination: false,
        depth: 0,
      }),
    ]);
    const slugs = new Map(sports.map((sport) => [sport.id, sport.slug ?? String(sport.id)]));
    const now = today();
    return docs
      .map((doc) => mapEventSummary(doc, slugs, now))
      .filter((event): event is EventSummary => event !== null)
      .sort(compareByDate);
  },

  async getEvent(sportSlug, slug) {
    const { docs } = await (
      await payload()
    ).find({
      collection: 'events',
      where: {
        and: [published, { slug: { equals: slug } }, { 'sport.slug': { equals: sportSlug } }],
      },
      limit: 1,
      depth: 2,
    });
    const doc = docs[0];
    return doc ? mapEvent(doc, today()) : null;
  },

  async getPartners() {
    const { docs } = await (
      await payload()
    ).find({
      collection: 'partners',
      sort: 'order',
      pagination: false,
      depth: 1,
    });
    return docs.map(mapPartner);
  },

  async getSettings() {
    const settings = await (await payload()).findGlobal({ slug: 'site-settings', depth: 0 });
    const idOf = (value: unknown) =>
      value === null || value === undefined
        ? null
        : String(typeof value === 'object' ? (value as { id: unknown }).id : value);
    return {
      defaultSeasonYear: settings.defaultSeasonYear ?? null,
      contactEmail: settings.contactEmail ?? null,
      heroPosterEventIds: (settings.heroPosterEvents ?? [])
        .map(idOf)
        .filter((id): id is string => id !== null),
      showPrototypeBadge: Boolean(settings.showPrototypeBadge),
      showcaseEventId: idOf(settings.showcaseEvent),
    };
  },
};
