import { getTranslations } from 'next-intl/server';

import { computeGroupStandings, findTeam, type GroupId } from '@/domain/competition';

import { EventSection } from '../../EventSection';
import { Reveal } from '../../Reveal';
import type { EventModuleProps } from '../types';
import styles from './Groups.module.css';

const GROUPS: readonly GroupId[] = ['A', 'B'];
/** The top two of each group go through to the semi-finals. */
const QUALIFIERS = 2;

export async function Groups({ event }: EventModuleProps) {
  const competition = event.competition;
  if (competition.kind !== 'team') return null;
  const t = await getTranslations('eventPage');

  return (
    <EventSection module="groups" tone="paper" eyebrow={t('eyebrow.groups')}>
      <div className={styles.tables}>
        {GROUPS.map((group) => (
          <Reveal key={group} className={styles.wrap}>
            <table className={styles.table}>
              <caption>{t('groups.caption', { group })}</caption>
              <thead>
                <tr>
                  <th scope="col">{t('groups.rank')}</th>
                  <th scope="col">{t('groups.team')}</th>
                  <th scope="col">
                    <abbr title={t('groups.goalDifferenceFull')}>{t('groups.goalDifference')}</abbr>
                  </th>
                  <th scope="col">
                    <abbr title={t('groups.pointsFull')}>{t('groups.points')}</abbr>
                  </th>
                </tr>
              </thead>
              <tbody>
                {computeGroupStandings(competition, group).map((row, i) => (
                  <tr
                    key={row.teamId}
                    className={i < QUALIFIERS ? styles.qualified : undefined}
                    style={{ transitionDelay: `${i * 55}ms` }}
                  >
                    <td>{i + 1}</td>
                    <th scope="row">{findTeam(competition, row.teamId).name}</th>
                    <td>
                      {row.goalDifference > 0 ? '+' : ''}
                      {row.goalDifference}
                    </td>
                    <td className={styles.points}>{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        ))}
      </div>
    </EventSection>
  );
}
