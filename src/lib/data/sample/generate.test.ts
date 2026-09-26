import { describe, expect, it } from 'vitest';

import { findTeam, getKnockouts, matchWinnerId, rankAthletes } from '@/domain/competition';

import { generateSampleDataset } from './generate';

const dataset = generateSampleDataset();
const byId = (id: string) => dataset.events.find((event) => event.id === id)!;

describe('generateSampleDataset', () => {
  // Reference values verified against the original prototype's generator when it was ported.
  it('reproduces the prototype dataset', () => {
    expect(dataset.events).toHaveLength(88);
    expect(dataset.events[0]?.id).toBe('mf-2017-1');

    const showcase = byId('mf-2025-1');
    expect(showcase).toMatchObject({
      slug: 'autumn-student-cup-2025',
      date: '2025-10-18',
      venue: 'Zorilor',
      accent: 'mint',
      participants: 64,
    });
    if (showcase.competition.kind !== 'team') throw new Error('expected a team event');
    const finalWinner = matchWinnerId(getKnockouts(showcase.competition).final!)!;
    expect(findTeam(showcase.competition, finalWinner).name).toBe('Cetățuia 5');

    const sprint = byId('sp-2025-2');
    if (sprint.competition.kind !== 'track') throw new Error('expected a track event');
    const fastest = rankAthletes(sprint.competition)[0]!;
    expect(`${fastest.athlete.name} ${fastest.time}`).toBe('Diana O. 7.38');
  });

  it('is deterministic', () => {
    expect(generateSampleDataset()).toEqual(dataset);
  });

  it('orders events by date', () => {
    const dates = dataset.events.map((event) => event.date);
    expect(dates).toEqual([...dates].sort());
  });

  it('gives every event a slug that is unique within its sport', () => {
    const keys = dataset.events.map((event) => `${event.sportSlug}/${event.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('has exactly one event this week, for the current-state demo', () => {
    expect(dataset.events.filter((event) => event.status === 'this-week')).toEqual([
      expect.objectContaining({ slug: 'student-cup-2026', date: '2026-09-27' }),
    ]);
  });

  it('only references teams that exist in the competition', () => {
    for (const event of dataset.events) {
      if (event.competition.kind !== 'team') continue;
      const teamIds = new Set(event.competition.teams.map((team) => team.id));
      for (const match of event.competition.matches) {
        expect(teamIds.has(match.homeTeamId) && teamIds.has(match.awayTeamId)).toBe(true);
      }
    }
  });
});
