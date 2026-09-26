import { getTranslations } from 'next-intl/server';

import { rankAthletes } from '@/domain/competition';

import { EventSection } from '../../EventSection';
import { Reveal } from '../../Reveal';
import type { EventModuleProps } from '../types';
import styles from './Rankings.module.css';

const SHOWN = 5;
const PODIUM = 3;

export async function Rankings({ event }: EventModuleProps) {
  const competition = event.competition;
  if (competition.kind !== 'track') return null;
  const t = await getTranslations('eventPage');
  const ranking = rankAthletes(competition).slice(0, SHOWN);

  return (
    <EventSection module="rankings" tone="paper" eyebrow={t('eyebrow.rankings')}>
      {/* Scrolls sideways on phones, so it must be reachable by keyboard. */}
      <Reveal className={styles.wrap} role="region" aria-label={t('eyebrow.rankings')} tabIndex={0}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{t('rankings.rank')}</th>
              <th scope="col">{t('rankings.athlete')}</th>
              <th scope="col">{t('rankings.club')}</th>
              <th scope="col">{t('rankings.heat')}</th>
              <th scope="col">{t('rankings.lane')}</th>
              <th scope="col">{t('rankings.time')}</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((result, i) => (
              <tr
                key={`${result.heat}-${result.lane}`}
                className={i < PODIUM ? styles.podium : undefined}
                style={{ transitionDelay: `${i * 55}ms` }}
              >
                <td>{i + 1}</td>
                <th scope="row">{result.athlete.name}</th>
                <td>{result.athlete.club}</td>
                <td>{result.heat}</td>
                <td>{result.lane}</td>
                <td className={styles.time}>{result.time.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </EventSection>
  );
}
