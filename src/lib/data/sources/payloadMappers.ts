/*
 * Converts Payload documents into domain objects. Pure functions, so they can be tested without a
 * database. Anything derived (standings, rankings, status) stays in the domain layer.
 */
import type { Competition, Heat, LaneResult } from '@/domain/competition';
import { countParticipants } from '@/domain/competition';
import {
  EVENT_MODULE_TYPES,
  getEventStatus,
  type EventDetail,
  type EventModuleType,
  type EventSummary,
  type GalleryItem,
} from '@/domain/event';
import type { Partner } from '@/domain/partner';
import type { Sport } from '@/domain/sport';
import type {
  Event as EventDoc,
  Media as MediaDoc,
  Partner as PartnerDoc,
  Sport as SportDoc,
} from '@/payload-types';

import { toClubDate } from '../clock';

type Relation<T> = number | T | null | undefined;
const resolved = <T extends object>(value: Relation<T>): T | null =>
  value && typeof value === 'object' ? value : null;

export function mapSport(doc: SportDoc): Sport {
  return {
    slug: doc.slug ?? String(doc.id),
    name: doc.name,
    kind: doc.kind,
    geometry: doc.geometry,
    ...(doc.squadSize ? { squadSize: doc.squadSize } : {}),
  };
}

export function mapPartner(doc: PartnerDoc): Partner {
  const logo = resolved<MediaDoc>(doc.logo);
  return {
    id: String(doc.id),
    name: doc.name,
    logo:
      logo?.url && logo.width && logo.height
        ? { kind: 'image', url: logo.url, width: logo.width, height: logo.height }
        : typeof doc.placeholderMark === 'number'
          ? { kind: 'placeholder', variant: doc.placeholderMark }
          : { kind: 'wordmark' },
  };
}

function mapCompetition(doc: EventDoc, kind: 'team' | 'track'): Competition {
  if (kind === 'team') {
    return {
      kind: 'team',
      teams: (doc.teams ?? []).map((team) => ({
        id: team.code,
        name: team.name,
        code: team.code,
        crest: [team.crestFill, team.crestInk] as const,
        group: team.group,
        players: (team.players ?? []).map((player) => ({
          name: player.name,
          goals: player.goals ?? 0,
        })),
      })),
      matches: (doc.matches ?? []).map((match) => ({
        stage: match.stage,
        ...(match.group ? { group: match.group } : {}),
        ...(match.round ? { round: match.round } : {}),
        homeTeamId: match.homeTeam,
        awayTeamId: match.awayTeam,
        homeGoals: match.homeGoals,
        awayGoals: match.awayGoals,
        ...(match.penaltyWinner ? { penaltyWinner: match.penaltyWinner } : {}),
      })),
    };
  }
  return {
    kind: 'track',
    distance: doc.distance ?? '',
    heats: (doc.heats ?? []).map((heat): Heat => ({
      number: heat.number,
      startTime: heat.startTime,
      lanes: (heat.lanes ?? []).map((lane): LaneResult =>
        lane.athlete && typeof lane.time === 'number'
          ? {
              lane: lane.lane,
              athlete: { name: lane.athlete, club: lane.club ?? '' },
              time: lane.time,
            }
          : { lane: lane.lane, athlete: null, time: null },
      ),
    })),
  };
}

type ModuleBlock = NonNullable<EventDoc['modules']>[number];
const blockOf = <T extends ModuleBlock['blockType']>(doc: EventDoc, type: T) =>
  (doc.modules ?? []).find(
    (block): block is Extract<ModuleBlock, { blockType: T }> => block.blockType === type,
  );

const isModuleType = (value: string): value is EventModuleType =>
  (EVENT_MODULE_TYPES as readonly string[]).includes(value);

/** The columns a summary needs; everything else stays in the database. */
export const SUMMARY_FIELDS = {
  name: true,
  slug: true,
  sport: true,
  date: true,
  venue: true,
  city: true,
  accent: true,
  participants: true,
} as const;

type SummaryDoc = Pick<
  EventDoc,
  'id' | 'name' | 'slug' | 'sport' | 'date' | 'venue' | 'city' | 'accent' | 'participants'
>;

/** Maps an event's summary columns; `sportSlugs` resolves the sport without a join. */
export function mapEventSummary(
  doc: SummaryDoc,
  sportSlugs: ReadonlyMap<number, string>,
  today: string,
): EventSummary | null {
  const sportId = typeof doc.sport === 'object' && doc.sport ? doc.sport.id : doc.sport;
  const sportSlug = typeof sportId === 'number' ? sportSlugs.get(sportId) : undefined;
  if (!sportSlug || !doc.slug) return null;
  const date = toClubDate(doc.date);
  return {
    id: String(doc.id),
    slug: doc.slug,
    sportSlug,
    name: doc.name,
    year: Number(date.slice(0, 4)),
    date,
    venue: doc.venue,
    city: doc.city,
    accent: doc.accent,
    participants: doc.participants ?? 0,
    status: getEventStatus(date, today),
  };
}

/** Maps a published event. Returns null if it isn't complete enough to show (e.g. no sport). */
export function mapEvent(doc: EventDoc, today: string): EventDetail | null {
  const sport = resolved<SportDoc>(doc.sport);
  if (!sport?.slug || !doc.slug) return null;

  const date = toClubDate(doc.date);
  const competition = mapCompetition(doc, doc.kind ?? sport.kind);
  const story = blockOf(doc, 'story');
  const gallery: GalleryItem[] = (blockOf(doc, 'gallery')?.photos ?? [])
    .map((photo) => resolved<MediaDoc>(photo))
    .flatMap((photo) =>
      photo?.url && photo.width && photo.height
        ? [
            {
              kind: 'image' as const,
              url: photo.url,
              alt: photo.alt,
              width: photo.width,
              height: photo.height,
            },
          ]
        : [],
    );
  const partners = (blockOf(doc, 'partners')?.partners ?? [])
    .map((partner) => resolved<PartnerDoc>(partner))
    .flatMap((partner) => (partner ? [mapPartner(partner)] : []));

  return {
    id: String(doc.id),
    slug: doc.slug,
    sportSlug: sport.slug,
    name: doc.name,
    year: Number(date.slice(0, 4)),
    date,
    venue: doc.venue,
    city: doc.city,
    accent: doc.accent,
    participants: countParticipants(competition),
    status: getEventStatus(date, today),
    story: {
      pullQuote: story?.pullQuote ?? doc.name,
      pullQuoteEmphasis: story?.pullQuoteEmphasis ?? '',
      body: story?.body ?? '',
    },
    venueSurface: blockOf(doc, 'venue')?.surface ?? '',
    schedule: (doc.schedule ?? []).map((day) => ({
      date: toClubDate(day.date),
      title: day.title,
      slots: (day.slots ?? []).map((slot) => ({
        time: slot.time,
        title: slot.title,
        detail: slot.detail ?? '',
      })),
    })),
    competition,
    modules: (doc.modules ?? []).map((block) => block.blockType).filter(isModuleType),
    partners,
    gallery,
  };
}
