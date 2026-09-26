import { getTranslations } from 'next-intl/server';

import { Crest } from '../../Crest';
import { EventSection } from '../../EventSection';
import { Reveal } from '../../Reveal';
import type { EventModuleProps } from '../types';
import styles from './Teams.module.css';

export async function Teams({ event }: EventModuleProps) {
  if (event.competition.kind !== 'team') return null;
  const t = await getTranslations('eventPage');

  return (
    <EventSection module="teams" eyebrow={t('eyebrow.teams')}>
      <Reveal className={styles.teams}>
        <ul>
          {event.competition.teams.map((team, i) => (
            <li
              key={team.id}
              className={styles.team}
              style={{ transitionDelay: `${(i % 4) * 60}ms` }}
            >
              <Crest team={team} />
              <b>{team.name}</b>
            </li>
          ))}
        </ul>
      </Reveal>
    </EventSection>
  );
}
