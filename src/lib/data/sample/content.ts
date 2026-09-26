/*
 * ALL PLACEHOLDER. Sample content used until the CMS holds real Base Camp data (ADR 0007).
 * Order matters: the generator picks from these lists with a seeded RNG, so reordering changes
 * the generated events.
 */
import type { EventAccent } from '@/domain/event';
import type { Sport } from '@/domain/sport';

export const SAMPLE_TODAY = '2026-09-24';

export const SAMPLE_YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026] as const;

export const SAMPLE_CITY = 'Cluj-Napoca';

interface SampleSport extends Sport {
  /** Short code used in internal ids and RNG seeds, e.g. "mf-2025-1". */
  code: string;
  /** Events per year, aligned with SAMPLE_YEARS. */
  eventsPerYear: readonly number[];
  eventNames: readonly string[];
}

export const SAMPLE_SPORTS: readonly SampleSport[] = [
  {
    slug: 'minifootball',
    name: 'Minifootball',
    kind: 'team',
    geometry: 'mini-pitch',
    squadSize: 8,
    code: 'mf',
    eventsPerYear: [2, 3, 4, 1, 3, 5, 6, 6, 7, 5],
    eventNames: [
      'Student Cup',
      'Campus 5s',
      'Night League',
      'Spring Open',
      'Faculty Derby',
      'Winter Indoor Cup',
      'Community 6s',
    ],
  },
  {
    slug: 'football',
    name: 'Football',
    kind: 'team',
    geometry: 'pitch',
    squadSize: 14,
    code: 'fb',
    eventsPerYear: [1, 1, 2, 0, 1, 2, 2, 3, 3, 2],
    eventNames: ['Weekend League', 'Autumn Open', 'Amateur 11s', 'Base Camp Classic'],
  },
  {
    slug: 'athletics',
    name: 'Athletics',
    kind: 'track',
    geometry: 'oval',
    code: 'at',
    eventsPerYear: [0, 0, 1, 0, 1, 1, 2, 2, 3, 2],
    eventNames: ['Open Track Day', 'Relay Weekend', 'Field & Track Meet', 'Masters Mile'],
  },
  {
    slug: 'sprints',
    name: 'Sprints',
    kind: 'track',
    geometry: 'lanes',
    code: 'sp',
    eventsPerYear: [0, 1, 1, 0, 1, 2, 2, 3, 4, 3],
    eventNames: [
      'Night Sprint',
      '60m Challenge',
      'Straight Line Series',
      '100m Open',
      'Flying 30s',
    ],
  },
];

export const VENUES = [
  'Mărăști',
  'Gheorgheni',
  'Zorilor',
  'Mănăștur',
  'Grigorescu',
  'Centru',
  'Bună Ziua',
  'Iris',
] as const;

export const ACCENTS: readonly EventAccent[] = ['signal', 'amber', 'pale-blue', 'mint', 'rose'];

export const TEAM_NAMES = [
  'Lane Six',
  'Someș United',
  'Cetățuia 5',
  'Hoia Runners',
  'Iris Collective',
  'Mărăști Night',
  'Campus Blue',
  'Feleac Athletic',
  'Nord Stars',
  'Turzii Kickers',
  'Grădini FC',
  'Pasaj 7',
] as const;

export const CREST_COLOURS: ReadonlyArray<readonly [string, string]> = [
  ['#FF5B1A', '#050A2C'],
  ['#F7F7F2', '#1C2E9E'],
  ['#C3CFFF', '#050A2C'],
  ['#050A2C', '#FF5B1A'],
  ['#FFB23F', '#050A2C'],
  ['#7FE3C4', '#050A2C'],
  ['#1C2E9E', '#F7F7F2'],
  ['#FF6F91', '#050A2C'],
];

export const FIRST_NAMES = [
  'Andrei',
  'Ioana',
  'Mihai',
  'Ștefan',
  'Radu',
  'Alexandra',
  'Bogdan',
  'Tudor',
  'Maria',
  'Vlad',
  'Elena',
  'Cristian',
  'Ana',
  'Dragoș',
  'Irina',
  'Paul',
  'Sorin',
  'Bianca',
  'Luca',
  'Teodora',
  'Matei',
  'Diana',
  'Horia',
  'Oana',
  'Răzvan',
  'Ilinca',
] as const;

export const LAST_INITIALS = 'ABCDFGHIMNOPRSȘTȚVZ';

/** The showcase event linked from the prototype badge and the design system. */
export const SHOWCASE_EVENT_ID = 'mf-2025-1';

export const PLACEHOLDER_PARTNER_COUNT = 8;
