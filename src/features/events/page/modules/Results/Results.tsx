import { getTranslations } from 'next-intl/server';

import { findTeam, type Match } from '@/domain/competition';

import { Disclosure } from '../../Disclosure';
import { EventSection } from '../../EventSection';
import type { EventModuleProps } from '../types';
import styles from './Results.module.css';

export async function Results({ event }: EventModuleProps) {
  const competition = event.competition;
  if (competition.kind !== 'team') return null;
  const t = await getTranslations('eventPage');

  const stageLabel = (match: Match) =>
    [
      match.stage === 'group'
        ? t('results.group', { group: match.group ?? '' })
        : t(`results.stage.${match.stage}`),
      match.round ? t('results.round', { round: match.round }) : null,
      match.penaltyWinner ? t('results.penalties') : null,
    ]
      .filter(Boolean)
      .join(' · ');

  return (
    <EventSection module="results" tone="paper">
      <Disclosure summary={t('eyebrow.results', { count: competition.matches.length })}>
        <ul className={styles.results}>
          {competition.matches.map((match, i) => (
            <li key={i} className={styles.result}>
              <span className={styles.home}>{findTeam(competition, match.homeTeamId).name}</span>
              <span className={styles.score}>
                {match.homeGoals}–{match.awayGoals}
              </span>
              <span>{findTeam(competition, match.awayTeamId).name}</span>
              <small className={styles.stage}>{stageLabel(match)}</small>
            </li>
          ))}
        </ul>
      </Disclosure>
    </EventSection>
  );
}
