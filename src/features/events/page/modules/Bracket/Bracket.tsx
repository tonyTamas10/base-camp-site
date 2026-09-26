import { getTranslations } from 'next-intl/server';

import { SectionHeading } from '@/components/ui/Heading';
import {
  findTeam,
  getKnockouts,
  matchWinnerId,
  type Match,
  type TeamCompetition,
} from '@/domain/competition';
import { cx } from '@/lib/cx';

import { EventSection } from '../../EventSection';
import { Reveal } from '../../Reveal';
import type { EventModuleProps } from '../types';
import styles from './Bracket.module.css';

async function MatchCard({
  match,
  competition,
  isFinal = false,
}: {
  match: Match;
  competition: TeamCompetition;
  isFinal?: boolean;
}) {
  const t = await getTranslations('eventPage.bracket');
  const winner = matchWinnerId(match);
  const sides = [
    {
      teamId: match.homeTeamId,
      goals: match.homeGoals,
      onPenalties: match.penaltyWinner === 'home',
    },
    {
      teamId: match.awayTeamId,
      goals: match.awayGoals,
      onPenalties: match.penaltyWinner === 'away',
    },
  ];

  return (
    <div className={cx(styles.match, isFinal && styles.final)}>
      {sides.map((side) => (
        <div key={side.teamId} className={cx(styles.side, side.teamId === winner && styles.winner)}>
          <span>{findTeam(competition, side.teamId).name}</span>
          <span className={styles.score}>
            {side.goals}
            {side.onPenalties && (
              <abbr title={t('penaltiesFull')} className={styles.pens}>
                {t('penalties')}
              </abbr>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export async function Bracket({ event }: EventModuleProps) {
  const competition = event.competition;
  if (competition.kind !== 'team') return null;
  const t = await getTranslations('eventPage');
  const { semiFinals, final, thirdPlace } = getKnockouts(competition);
  const champion = final ? matchWinnerId(final) : null;

  return (
    <EventSection module="bracket" tone="midnight" eyebrow={t('eyebrow.bracket')}>
      {champion && <SectionHeading>{findTeam(competition, champion).name}</SectionHeading>}
      <Reveal className={styles.bracket}>
        <div className={styles.column}>
          <h3 className={styles.stage}>{t('bracket.semiFinals')}</h3>
          {semiFinals.map((match) => (
            <MatchCard
              key={`${match.homeTeamId}-${match.awayTeamId}`}
              match={match}
              competition={competition}
            />
          ))}
        </div>
        {final && (
          <div className={styles.column}>
            <h3 className={styles.stage}>{t('bracket.final')}</h3>
            <MatchCard match={final} competition={competition} isFinal />
          </div>
        )}
        {thirdPlace && (
          <div className={styles.column}>
            <h3 className={styles.stage}>{t('bracket.thirdPlace')}</h3>
            <MatchCard match={thirdPlace} competition={competition} />
          </div>
        )}
      </Reveal>
    </EventSection>
  );
}
