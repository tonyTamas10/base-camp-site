import { getTranslations } from 'next-intl/server';

import { findTeam, getTopScorers } from '@/domain/competition';

import { EventSection } from '../../EventSection';
import { Reveal } from '../../Reveal';
import type { EventModuleProps } from '../types';
import styles from './Players.module.css';

const TOP_SCORERS = 5;

export async function Players({ event }: EventModuleProps) {
  const competition = event.competition;
  if (competition.kind !== 'team') return null;
  const t = await getTranslations('eventPage');
  const scorers = getTopScorers(competition, TOP_SCORERS);
  const mostGoals = Math.max(1, scorers[0]?.goals ?? 1);

  return (
    <EventSection module="players" eyebrow={t('eyebrow.players')}>
      <Reveal className={styles.players}>
        <ol>
          {scorers.map((scorer, i) => (
            <li
              key={`${scorer.teamId}-${scorer.name}`}
              className={styles.row}
              style={{ transitionDelay: `${i * 55}ms` }}
            >
              <span className={styles.rank} aria-hidden="true">
                {i + 1}
              </span>
              <span className={styles.name}>{scorer.name}</span>
              <span className={styles.team}>{findTeam(competition, scorer.teamId).name}</span>
              <span className={styles.bar} aria-hidden="true">
                <i style={{ width: `${(scorer.goals / mostGoals) * 100}%` }} />
              </span>
              <span className={styles.goals}>{t('players.goals', { count: scorer.goals })}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </EventSection>
  );
}
