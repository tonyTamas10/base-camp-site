/*
 * Results of an event. Standings, brackets, rankings and records are always derived from the
 * raw results by the functions below, never stored, so they can't disagree with each other.
 */

export type GroupId = 'A' | 'B';

export interface Player {
  name: string;
  goals: number;
}

export interface Team {
  id: string;
  name: string;
  /** Two-letter abbreviation shown on the crest. */
  code: string;
  /** Crest fill and ink colours (hex). */
  crest: readonly [string, string];
  group: GroupId;
  players: Player[];
}

export type MatchStage = 'group' | 'semi-final' | 'third-place' | 'final';

export interface Match {
  stage: MatchStage;
  group?: GroupId;
  round?: number;
  homeTeamId: string;
  awayTeamId: string;
  homeGoals: number;
  awayGoals: number;
  /** Set when a knockout match was level and decided on penalties. */
  penaltyWinner?: 'home' | 'away';
}

export interface TeamCompetition {
  kind: 'team';
  teams: Team[];
  matches: Match[];
}

export interface Athlete {
  name: string;
  club: string;
}

export type LaneResult =
  { lane: number; athlete: Athlete; time: number } | { lane: number; athlete: null; time: null };

export interface Heat {
  number: number;
  startTime: string;
  lanes: LaneResult[];
}

export interface TrackCompetition {
  kind: 'track';
  /** e.g. "100m". */
  distance: string;
  heats: Heat[];
}

export type Competition = TeamCompetition | TrackCompetition;

/* ---------- team competitions ---------- */

export function findTeam(competition: TeamCompetition, teamId: string): Team {
  const team = competition.teams.find((candidate) => candidate.id === teamId);
  if (!team) throw new Error(`Unknown team "${teamId}"`);
  return team;
}

/** The winning team's id, or null for a drawn group match. */
export function matchWinnerId(match: Match): string | null {
  if (match.homeGoals > match.awayGoals || match.penaltyWinner === 'home') return match.homeTeamId;
  if (match.awayGoals > match.homeGoals || match.penaltyWinner === 'away') return match.awayTeamId;
  return null;
}

export interface StandingRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

const POINTS_FOR_WIN = 3;
const POINTS_FOR_DRAW = 1;

/** Group table, ordered by points, then goal difference, then goals scored. */
export function computeGroupStandings(competition: TeamCompetition, group: GroupId): StandingRow[] {
  const rows = new Map<string, StandingRow>(
    competition.teams
      .filter((team) => team.group === group)
      .map((team) => [
        team.id,
        {
          teamId: team.id,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0,
        },
      ]),
  );

  for (const match of competition.matches) {
    if (match.stage !== 'group' || match.group !== group) continue;
    const home = rows.get(match.homeTeamId);
    const away = rows.get(match.awayTeamId);
    if (!home || !away) continue;

    recordResult(home, match.homeGoals, match.awayGoals);
    recordResult(away, match.awayGoals, match.homeGoals);
  }

  return [...rows.values()].sort(
    (a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor,
  );
}

function recordResult(row: StandingRow, scored: number, conceded: number) {
  row.played += 1;
  row.goalsFor += scored;
  row.goalsAgainst += conceded;
  row.goalDifference = row.goalsFor - row.goalsAgainst;
  if (scored > conceded) {
    row.won += 1;
    row.points += POINTS_FOR_WIN;
  } else if (scored < conceded) {
    row.lost += 1;
  } else {
    row.drawn += 1;
    row.points += POINTS_FOR_DRAW;
  }
}

export interface Knockouts {
  semiFinals: Match[];
  thirdPlace: Match | undefined;
  final: Match | undefined;
}

export function getKnockouts(competition: TeamCompetition): Knockouts {
  return {
    semiFinals: competition.matches.filter((match) => match.stage === 'semi-final'),
    thirdPlace: competition.matches.find((match) => match.stage === 'third-place'),
    final: competition.matches.find((match) => match.stage === 'final'),
  };
}

export interface Scorer {
  name: string;
  teamId: string;
  goals: number;
}

/** Highest scorers first; ties keep squad order so the list is stable. */
export function getTopScorers(competition: TeamCompetition, limit: number): Scorer[] {
  return competition.teams
    .flatMap((team) =>
      team.players.map((player) => ({ name: player.name, teamId: team.id, goals: player.goals })),
    )
    .sort((a, b) => b.goals - a.goals)
    .slice(0, limit);
}

export function getTotalGoals(competition: TeamCompetition): number {
  return competition.matches.reduce((sum, match) => sum + match.homeGoals + match.awayGoals, 0);
}

/* ---------- track competitions ---------- */

export interface RankedResult {
  athlete: Athlete;
  time: number;
  heat: number;
  lane: number;
}

function occupiedLanes(heat: Heat) {
  return heat.lanes.filter(
    (lane): lane is Extract<LaneResult, { athlete: Athlete }> => lane.athlete !== null,
  );
}

/** Every athlete across all heats, fastest first. */
export function rankAthletes(competition: TrackCompetition): RankedResult[] {
  return competition.heats
    .flatMap((heat) =>
      occupiedLanes(heat).map((lane) => ({
        athlete: lane.athlete,
        time: lane.time,
        heat: heat.number,
        lane: lane.lane,
      })),
    )
    .sort((a, b) => a.time - b.time);
}

export function getHeatWinningTime(heat: Heat): number | null {
  const times = occupiedLanes(heat).map((lane) => lane.time);
  return times.length > 0 ? Math.min(...times) : null;
}

export function countAthletesInHeat(heat: Heat): number {
  return occupiedLanes(heat).length;
}

export interface ClosestFinish {
  heat: number;
  /** Seconds between first and second place. */
  gap: number;
}

/** The heat with the smallest gap between its winner and runner-up. */
export function getClosestFinish(competition: TrackCompetition): ClosestFinish | null {
  let closest: ClosestFinish | null = null;
  for (const heat of competition.heats) {
    const [first, second] = occupiedLanes(heat)
      .map((lane) => lane.time)
      .sort((a, b) => a - b);
    if (first === undefined || second === undefined) continue;
    const gap = roundToHundredths(second - first);
    if (!closest || gap < closest.gap) closest = { heat: heat.number, gap };
  }
  return closest;
}

export function roundToHundredths(seconds: number): number {
  return Math.round(seconds * 100) / 100;
}

/* ---------- both ---------- */

export function countParticipants(competition: Competition): number {
  return competition.kind === 'team'
    ? competition.teams.reduce((sum, team) => sum + team.players.length, 0)
    : competition.heats.reduce((sum, heat) => sum + countAthletesInHeat(heat), 0);
}
