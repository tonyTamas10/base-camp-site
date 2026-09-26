/*
 * Generates the placeholder dataset. A faithful port of the prototype's generator: the RNG is
 * consumed in the same order, so names, dates and results match the prototype exactly.
 */
import {
  computeGroupStandings,
  countAthletesInHeat,
  countParticipants,
  type Athlete,
  type Competition,
  type GroupId,
  type Heat,
  type LaneResult,
  type Match,
  type MatchStage,
  type Team,
  type TeamCompetition,
  type TrackCompetition,
} from '@/domain/competition';
import { addDays, type IsoDate } from '@/domain/dates';
import {
  compareByDate,
  getEventStatus,
  type EventDetail,
  type EventModuleType,
  type ScheduleDay,
} from '@/domain/event';
import type { Partner } from '@/domain/partner';
import type { Sport, SportKind } from '@/domain/sport';
import { createRng, pick, shuffle, type Rng } from '@/lib/random';
import { slugify } from '@/lib/slugify';

import {
  ACCENTS,
  CREST_COLOURS,
  FIRST_NAMES,
  LAST_INITIALS,
  PLACEHOLDER_PARTNER_COUNT,
  SAMPLE_CITY,
  SAMPLE_SPORTS,
  SAMPLE_TODAY,
  SAMPLE_YEARS,
  SHOWCASE_EVENT_ID,
  TEAM_NAMES,
  VENUES,
} from './content';

export interface SampleDataset {
  sports: Sport[];
  years: number[];
  events: EventDetail[];
  partners: Partner[];
}

const DEFAULT_MODULES: Record<SportKind, EventModuleType[]> = {
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

const PARTNERS_PER_EVENT = 6;
const GALLERY_TILES = 6;

const pad = (n: number) => String(n).padStart(2, '0');
const isoDate = (year: number, monthIndex: number, day: number): IsoDate =>
  `${year}-${pad(monthIndex + 1)}-${pad(day)}`;

export function generateSampleDataset(): SampleDataset {
  const partners: Partner[] = Array.from({ length: PLACEHOLDER_PARTNER_COUNT }, (_, i) => ({
    id: `partner-${i}`,
    name: `Placeholder partner ${String.fromCharCode(65 + i)}`,
    logo: { kind: 'placeholder', variant: i },
  }));

  const drafts = SAMPLE_SPORTS.flatMap((sport) =>
    SAMPLE_YEARS.flatMap((year, yearIndex) => {
      const count = sport.eventsPerYear[yearIndex] ?? 0;
      return Array.from({ length: count }, (_, i) => {
        const id = `${sport.code}-${year}-${i + 1}`;
        const rng = createRng(id);
        let name = sport.eventNames[(i * 3 + year) % sport.eventNames.length] ?? sport.name;
        const month = Math.min(11, Math.max(0, Math.floor(((i + rng()) * 12) / count)));
        let date = isoDate(year, month, 1 + Math.floor(rng() * 27));
        if (id === SHOWCASE_EVENT_ID) {
          name = 'Autumn Student Cup';
          date = '2025-10-18';
        }
        return {
          id,
          sport,
          year,
          name,
          date,
          venue: pick(rng, VENUES),
          accent: pick(rng, ACCENTS),
        };
      });
    }),
  );

  // One minifootball event "this week", to demonstrate the current-state UI.
  const nextMinifootball = drafts
    .filter((d) => d.sport.slug === 'minifootball' && d.year === 2026 && d.date > SAMPLE_TODAY)
    .sort(compareByDate)[0];
  if (nextMinifootball) {
    nextMinifootball.date = '2026-09-27';
    nextMinifootball.name = 'Student Cup';
  }

  const usedSlugs = new Set<string>();
  const events: EventDetail[] = drafts.map((draft) => {
    const competition = generateCompetition(draft.id, draft.sport);
    return {
      id: draft.id,
      slug: uniqueSlug(`${draft.sport.slug}/${slugify(`${draft.name} ${draft.year}`)}`, usedSlugs),
      sportSlug: draft.sport.slug,
      name: draft.name,
      year: draft.year,
      date: draft.date,
      venue: draft.venue,
      city: SAMPLE_CITY,
      accent: draft.accent,
      participants: countParticipants(competition),
      status: getEventStatus(draft.date, SAMPLE_TODAY),
      story: storyFor(competition),
      venueSurface: draft.sport.kind === 'team' ? 'Artificial turf' : 'Synthetic track',
      schedule: scheduleFor(competition, draft.date),
      competition,
      modules: DEFAULT_MODULES[draft.sport.kind],
      partners: partners.slice(0, PARTNERS_PER_EVENT),
      gallerySeeds: Array.from({ length: GALLERY_TILES }, (_, i) => `${draft.id}-${i}`),
    };
  });

  return {
    sports: SAMPLE_SPORTS.map(({ slug, name, kind, geometry, squadSize }) => ({
      slug,
      name,
      kind,
      geometry,
      ...(squadSize === undefined ? {} : { squadSize }),
    })),
    years: [...SAMPLE_YEARS],
    events: events.sort(compareByDate),
    partners,
  };
}

/** Slugs are unique within a sport; the sport prefix is stripped after checking. */
function uniqueSlug(scopedSlug: string, used: Set<string>): string {
  let candidate = scopedSlug;
  for (let n = 2; used.has(candidate); n++) candidate = `${scopedSlug}-${n}`;
  used.add(candidate);
  return candidate.slice(candidate.indexOf('/') + 1);
}

function personName(rng: Rng): string {
  const firstName = pick(rng, FIRST_NAMES);
  const initial = LAST_INITIALS[Math.floor(rng() * LAST_INITIALS.length)];
  return `${firstName} ${initial}.`;
}

/** Goals per side, skewed towards low scores; `rate` sets the average. */
function randomGoals(rng: Rng, rate: number): number {
  return Math.min(9, Math.floor(-Math.log(1 - rng() * 0.97) * rate));
}

function generateCompetition(eventId: string, sport: Sport): Competition {
  const rng = createRng(`d-${eventId}`);
  return sport.kind === 'team'
    ? generateTeamCompetition(rng, sport)
    : generateTrackCompetition(rng, sport);
}

const GROUPS: readonly GroupId[] = ['A', 'B'];

const GROUP_FIXTURES = [
  [0, 1],
  [2, 3],
  [0, 2],
  [1, 3],
  [0, 3],
  [1, 2],
] as const;

function generateTeamCompetition(rng: Rng, sport: Sport): TeamCompetition {
  const teams: Team[] = shuffle(rng, TEAM_NAMES)
    .slice(0, 8)
    .map((name, index) => ({
      id: slugify(name),
      name,
      code: name
        .split(/\s+/)
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      crest: CREST_COLOURS[index] ?? ['#050A2C', '#F7F7F2'],
      group: index < 4 ? 'A' : 'B',
      players: Array.from({ length: sport.squadSize ?? 0 }, () => ({
        name: personName(rng),
        goals: 0,
      })),
    }));

  const rate = sport.slug === 'minifootball' ? 2.1 : 1.3;
  const matches: Match[] = [];

  GROUPS.forEach((group, groupIndex) => {
    const groupTeams = teams.slice(groupIndex * 4, groupIndex * 4 + 4);
    GROUP_FIXTURES.forEach(([home, away], fixtureIndex) => {
      matches.push({
        stage: 'group',
        group,
        round: Math.floor(fixtureIndex / 2) + 1,
        homeTeamId: groupTeams[home]!.id,
        awayTeamId: groupTeams[away]!.id,
        homeGoals: randomGoals(rng, rate),
        awayGoals: randomGoals(rng, rate),
      });
    });
  });

  const competition: TeamCompetition = { kind: 'team', teams, matches };
  const [winnerA, runnerUpA] = computeGroupStandings(competition, 'A');
  const [winnerB, runnerUpB] = computeGroupStandings(competition, 'B');

  const knockout = (stage: MatchStage, homeTeamId: string, awayTeamId: string) => {
    const homeGoals = randomGoals(rng, rate);
    const awayGoals = randomGoals(rng, rate);
    const match: Match = { stage, homeTeamId, awayTeamId, homeGoals, awayGoals };
    if (homeGoals === awayGoals) match.penaltyWinner = rng() < 0.5 ? 'home' : 'away';
    matches.push(match);
    const homeWon = homeGoals > awayGoals || match.penaltyWinner === 'home';
    return homeWon
      ? { winner: homeTeamId, loser: awayTeamId }
      : { winner: awayTeamId, loser: homeTeamId };
  };

  const semi1 = knockout('semi-final', winnerA!.teamId, runnerUpB!.teamId);
  const semi2 = knockout('semi-final', winnerB!.teamId, runnerUpA!.teamId);
  knockout('third-place', semi1.loser, semi2.loser);
  knockout('final', semi1.winner, semi2.winner);

  const squadOf = (teamId: string) => teams.find((team) => team.id === teamId)!.players;
  for (const match of matches) {
    for (let g = 0; g < match.homeGoals; g++) pick(rng, squadOf(match.homeTeamId)).goals++;
    for (let g = 0; g < match.awayGoals; g++) pick(rng, squadOf(match.awayTeamId)).goals++;
  }

  return competition;
}

const BASE_TIMES: Record<string, number> = { '60m': 7.1, '100m': 11.3, '200m': 23.2, '400m': 52.5 };
const TRACK_CLUBS = ['Unattached', ...TEAM_NAMES.slice(0, 6)];
const LANES_PER_HEAT = 8;
const EMPTY_LANE_CHANCE = 0.12;

function generateTrackCompetition(rng: Rng, sport: Sport): TrackCompetition {
  const distance = pick(rng, sport.slug === 'sprints' ? ['60m', '100m'] : ['100m', '200m', '400m']);
  const baseTime = BASE_TIMES[distance] ?? 12;
  const heatCount = 3 + Math.floor(rng() * 4);

  const heats: Heat[] = Array.from({ length: heatCount }, (_, h) => {
    const lanes: LaneResult[] = [];
    for (let lane = 1; lane <= LANES_PER_HEAT; lane++) {
      if (rng() < EMPTY_LANE_CHANCE) {
        lanes.push({ lane, athlete: null, time: null });
        continue;
      }
      const athlete: Athlete = { name: personName(rng), club: pick(rng, TRACK_CLUBS) };
      const time = +(baseTime * (1 + rng() * 0.26 + rng() * 0.08)).toFixed(2);
      lanes.push({ lane, athlete, time });
    }
    const minutes = h * 20;
    return {
      number: h + 1,
      startTime: `${10 + Math.floor(minutes / 60)}:${pad(minutes % 60)}`,
      lanes,
    };
  });

  return { kind: 'track', distance, heats };
}

function storyFor(competition: Competition): EventDetail['story'] {
  return competition.kind === 'team'
    ? {
        pullQuote: 'Eight teams. Two days.',
        pullQuoteEmphasis: 'One final.',
        body: 'Student and community teams from across Cluj. Groups on day one, knockouts on day two.',
      }
    : {
        pullQuote: 'Eight lanes. One straight.',
        pullQuoteEmphasis: 'Every hundredth counts.',
        body: `Open ${competition.distance}. Heats in the morning, the fastest eight race the final.`,
      };
}

function scheduleFor(competition: Competition, date: IsoDate): ScheduleDay[] {
  if (competition.kind === 'team') {
    return [
      {
        date,
        title: 'Group stage',
        slots: [1, 2, 3].map((round, i) => ({
          time: ['10:00', '11:30', '13:00'][i]!,
          title: `Round ${round}`,
          detail: 'Groups A & B · 4 matches',
        })),
      },
      {
        date: addDays(date, 1),
        title: 'Knockouts',
        slots: [
          { time: '10:00', title: 'Semi-finals', detail: '2 matches' },
          { time: '12:00', title: '3rd place', detail: '1 match' },
          { time: '13:30', title: 'Final', detail: '1 match · awards after' },
        ],
      },
    ];
  }

  const lastHeat = competition.heats.at(-1)!;
  const [hour, minute] = lastHeat.startTime.split(':');
  return [
    {
      date,
      title: `${competition.distance} programme`,
      slots: [
        ...competition.heats.map((heat) => ({
          time: heat.startTime,
          title: `Heat ${heat.number}`,
          detail: `${countAthletesInHeat(heat)} athletes`,
        })),
        {
          time: `${Number(hour) + 1}:${minute}`,
          title: 'Final',
          detail: 'Fastest 8 across heats',
        },
      ],
    },
  ];
}
