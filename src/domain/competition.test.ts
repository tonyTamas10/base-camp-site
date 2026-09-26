import { describe, expect, it } from 'vitest';

import {
  computeGroupStandings,
  countParticipants,
  getClosestFinish,
  getKnockouts,
  getTopScorers,
  getTotalGoals,
  matchWinnerId,
  rankAthletes,
  type Match,
  type Team,
  type TeamCompetition,
  type TrackCompetition,
} from './competition';

const team = (id: string, group: 'A' | 'B' = 'A', goals: number[] = [0]): Team => ({
  id,
  name: id,
  code: id.slice(0, 2).toUpperCase(),
  crest: ['#000000', '#ffffff'],
  group,
  players: goals.map((g, i) => ({ name: `${id}-${i}`, goals: g })),
});

const groupMatch = (home: string, away: string, homeGoals: number, awayGoals: number): Match => ({
  stage: 'group',
  group: 'A',
  homeTeamId: home,
  awayTeamId: away,
  homeGoals,
  awayGoals,
});

describe('matchWinnerId', () => {
  it('returns the side with more goals', () => {
    expect(matchWinnerId(groupMatch('a', 'b', 2, 1))).toBe('a');
    expect(matchWinnerId(groupMatch('a', 'b', 0, 3))).toBe('b');
  });

  it('returns null for a draw without penalties', () => {
    expect(matchWinnerId(groupMatch('a', 'b', 1, 1))).toBeNull();
  });

  it('uses the penalty winner for a level knockout', () => {
    const final: Match = { ...groupMatch('a', 'b', 2, 2), stage: 'final', penaltyWinner: 'away' };
    expect(matchWinnerId(final)).toBe('b');
  });
});

describe('computeGroupStandings', () => {
  const competition: TeamCompetition = {
    kind: 'team',
    teams: [team('a'), team('b'), team('c'), team('z', 'B')],
    matches: [
      groupMatch('a', 'b', 2, 0), // a win
      groupMatch('b', 'c', 1, 1), // draw
      groupMatch('c', 'a', 3, 1), // c win
      { ...groupMatch('z', 'a', 9, 0), group: 'B' }, // other group: ignored
    ],
  };

  it('awards three points for a win and one for a draw', () => {
    const rows = computeGroupStandings(competition, 'A');
    const byTeam = Object.fromEntries(rows.map((row) => [row.teamId, row]));

    expect(byTeam.a).toMatchObject({ played: 2, won: 1, lost: 1, points: 3, goalsFor: 3 });
    expect(byTeam.b).toMatchObject({ played: 2, drawn: 1, lost: 1, points: 1 });
    expect(byTeam.c).toMatchObject({ played: 2, won: 1, drawn: 1, points: 4 });
  });

  it('orders by points, then goal difference, then goals scored', () => {
    expect(computeGroupStandings(competition, 'A').map((row) => row.teamId)).toEqual([
      'c',
      'a',
      'b',
    ]);
  });

  it('breaks a points tie on goal difference', () => {
    const tied: TeamCompetition = {
      kind: 'team',
      teams: [team('x'), team('y'), team('w')],
      matches: [groupMatch('x', 'w', 1, 0), groupMatch('y', 'w', 5, 0)],
    };
    expect(computeGroupStandings(tied, 'A')[0]?.teamId).toBe('y');
  });
});

describe('team helpers', () => {
  const competition: TeamCompetition = {
    kind: 'team',
    teams: [team('a', 'A', [3, 1]), team('b', 'A', [0, 5])],
    matches: [
      groupMatch('a', 'b', 1, 2),
      { stage: 'semi-final', homeTeamId: 'a', awayTeamId: 'b', homeGoals: 1, awayGoals: 0 },
      { stage: 'final', homeTeamId: 'a', awayTeamId: 'b', homeGoals: 3, awayGoals: 3 },
    ],
  };

  it('ranks top scorers across teams', () => {
    expect(getTopScorers(competition, 2).map((s) => s.goals)).toEqual([5, 3]);
  });

  it('totals every goal in every match', () => {
    expect(getTotalGoals(competition)).toBe(10);
  });

  it('splits knockout matches by stage', () => {
    const knockouts = getKnockouts(competition);
    expect(knockouts.semiFinals).toHaveLength(1);
    expect(knockouts.final?.homeGoals).toBe(3);
    expect(knockouts.thirdPlace).toBeUndefined();
  });

  it('counts every squad member as a participant', () => {
    expect(countParticipants(competition)).toBe(4);
  });
});

describe('track helpers', () => {
  const athlete = (name: string) => ({ name, club: 'Club' });
  const competition: TrackCompetition = {
    kind: 'track',
    distance: '100m',
    heats: [
      {
        number: 1,
        startTime: '10:00',
        lanes: [
          { lane: 1, athlete: athlete('slow'), time: 12.4 },
          { lane: 2, athlete: null, time: null },
          { lane: 3, athlete: athlete('fast'), time: 11.1 },
        ],
      },
      {
        number: 2,
        startTime: '10:20',
        lanes: [
          { lane: 1, athlete: athlete('close-1'), time: 11.5 },
          { lane: 2, athlete: athlete('close-2'), time: 11.52 },
        ],
      },
    ],
  };

  it('ranks athletes across heats, fastest first, skipping empty lanes', () => {
    expect(rankAthletes(competition).map((r) => r.athlete.name)).toEqual([
      'fast',
      'close-1',
      'close-2',
      'slow',
    ]);
  });

  it('finds the heat with the smallest winning margin', () => {
    expect(getClosestFinish(competition)).toEqual({ heat: 2, gap: 0.02 });
  });

  it('counts athletes, not lanes', () => {
    expect(countParticipants(competition)).toBe(4);
  });
});
