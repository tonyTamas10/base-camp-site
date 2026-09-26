import { describe, expect, it } from 'vitest';

import { computeGroupStandings, rankAthletes } from '@/domain/competition';
import type { Event, Partner, Sport } from '@/payload-types';

import { mapEvent, mapEventSummary, mapPartner } from './payloadMappers';

const sport = (overrides: Partial<Sport> = {}): Sport => ({
  id: 1,
  name: 'Minifootball',
  slug: 'minifootball',
  kind: 'team',
  geometry: 'mini-pitch',
  updatedAt: '',
  createdAt: '',
  ...overrides,
});

const baseEvent = (overrides: Partial<Event> = {}): Event => ({
  id: 7,
  name: 'Autumn Cup',
  slug: 'autumn-cup-2025',
  sport: sport(),
  // Stored at noon UTC: still 18 October in Cluj.
  date: '2025-10-18T12:00:00.000Z',
  venue: 'Zorilor',
  city: 'Cluj-Napoca',
  accent: 'mint',
  kind: 'team',
  participants: 2,
  updatedAt: '',
  createdAt: '',
  ...overrides,
});

describe('mapEvent', () => {
  it('maps a team event and its results into the domain model', () => {
    const event = mapEvent(
      baseEvent({
        teams: [
          {
            name: 'Nord Stars',
            code: 'NS',
            group: 'A',
            crestFill: '#000000',
            crestInk: '#ffffff',
            players: [{ name: 'Ana', goals: 2 }],
          },
          {
            name: 'Lane Six',
            code: 'LS',
            group: 'A',
            crestFill: '#000000',
            crestInk: '#ffffff',
            players: [{ name: 'Ion', goals: null }],
          },
        ],
        matches: [
          {
            stage: 'group',
            group: 'A',
            round: 1,
            homeTeam: 'NS',
            awayTeam: 'LS',
            homeGoals: 2,
            awayGoals: 0,
          },
        ],
        modules: [
          { blockType: 'story', pullQuote: 'Two teams.', pullQuoteEmphasis: 'One winner.' },
          { blockType: 'groups' },
          { blockType: 'venue', surface: 'Turf' },
        ],
      }),
      '2025-10-01',
    )!;

    expect(event).toMatchObject({
      id: '7',
      sportSlug: 'minifootball',
      date: '2025-10-18',
      year: 2025,
      status: 'upcoming',
      participants: 2,
      modules: ['story', 'groups', 'venue'],
      story: { pullQuote: 'Two teams.', pullQuoteEmphasis: 'One winner.', body: '' },
      venueSurface: 'Turf',
    });
    if (event.competition.kind !== 'team') throw new Error('expected team results');
    expect(computeGroupStandings(event.competition, 'A')[0]).toMatchObject({
      teamId: 'NS',
      points: 3,
    });
  });

  it('maps heats, keeping empty lanes empty', () => {
    const event = mapEvent(
      baseEvent({
        sport: sport({ slug: 'sprints', kind: 'track', geometry: 'lanes' }),
        kind: 'track',
        distance: '60m',
        heats: [
          {
            number: 1,
            startTime: '10:00',
            lanes: [
              { lane: 1, athlete: 'Diana O.', club: 'Iris', time: 7.38 },
              { lane: 2, athlete: null, time: null },
            ],
          },
        ],
      }),
      '2025-10-01',
    )!;
    if (event.competition.kind !== 'track') throw new Error('expected track results');
    expect(event.competition.heats[0]!.lanes[1]).toEqual({ lane: 2, athlete: null, time: null });
    expect(rankAthletes(event.competition)[0]!.athlete.name).toBe('Diana O.');
  });

  it('skips events that are not complete enough to show', () => {
    expect(mapEvent(baseEvent({ sport: 1 }), '2025-10-01')).toBeNull();
    expect(mapEvent(baseEvent({ slug: null }), '2025-10-01')).toBeNull();
  });

  it('falls back to the name when there is no story block', () => {
    expect(mapEvent(baseEvent(), '2025-10-01')!.story.pullQuote).toBe('Autumn Cup');
  });
});

describe('mapEventSummary', () => {
  it('resolves the sport from an id without a join', () => {
    const summary = mapEventSummary(
      baseEvent({ sport: 1 }),
      new Map([[1, 'minifootball']]),
      '2026-01-01',
    );
    expect(summary).toMatchObject({ sportSlug: 'minifootball', status: 'past', participants: 2 });
  });
});

describe('mapPartner', () => {
  const partner = (overrides: Partial<Partner>): Partner => ({
    id: 3,
    name: 'Cluj Coffee',
    updatedAt: '',
    createdAt: '',
    ...overrides,
  });

  it('prefers an uploaded logo, then a placeholder mark, then a wordmark', () => {
    const logo = {
      id: 1,
      alt: 'Logo',
      url: '/logo.png',
      width: 200,
      height: 50,
      updatedAt: '',
      createdAt: '',
    };
    expect(mapPartner(partner({ logo })).logo).toEqual({
      kind: 'image',
      url: '/logo.png',
      width: 200,
      height: 50,
    });
    expect(mapPartner(partner({ placeholderMark: 2 })).logo).toEqual({
      kind: 'placeholder',
      variant: 2,
    });
    expect(mapPartner(partner({})).logo).toEqual({ kind: 'wordmark' });
  });
});
