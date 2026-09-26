import { getTranslations } from 'next-intl/server';

import { getHeatWinningTime, rankAthletes, type Heat } from '@/domain/competition';
import { cx } from '@/lib/cx';

import { Disclosure } from '../../Disclosure';
import { EventSection } from '../../EventSection';
import { Reveal } from '../../Reveal';
import type { EventModuleProps } from '../types';
import styles from './Heats.module.css';

async function HeatLanes({ heat, fastest }: { heat: Heat; fastest: number }) {
  const t = await getTranslations('eventPage.heats');
  const winningTime = getHeatWinningTime(heat);

  return (
    <Reveal className={styles.heat}>
      <h3 className={styles.heatTitle}>{t('heat', { number: heat.number })}</h3>
      <table className={styles.lanes}>
        <thead className="sr-only">
          <tr>
            <th scope="col">{t('lane')}</th>
            <th scope="col">{t('athlete')}</th>
            <th scope="col">{t('time')}</th>
          </tr>
        </thead>
        <tbody>
          {heat.lanes.map((lane) => (
            <tr
              key={lane.lane}
              className={cx(
                styles.lane,
                lane.athlete === null && styles.empty,
                lane.time !== null && lane.time === winningTime && styles.winner,
              )}
            >
              <td className={styles.laneNumber}>{lane.lane}</td>
              <td>{lane.athlete?.name ?? t('emptyLane')}</td>
              <td className={styles.track} aria-hidden="true">
                {lane.time !== null && (
                  <span
                    className={styles.runner}
                    style={{ width: `${(fastest / lane.time) * 96}%` }}
                  />
                )}
              </td>
              <td className={styles.time}>{lane.time?.toFixed(2) ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}

export async function Heats({ event }: EventModuleProps) {
  const competition = event.competition;
  if (competition.kind !== 'track') return null;
  const t = await getTranslations('eventPage');
  const fastest = rankAthletes(competition)[0]?.time ?? 1;
  const [first, ...rest] = competition.heats;
  if (!first) return null;

  return (
    <EventSection module="heats" eyebrow={t('eyebrow.heats', { distance: competition.distance })}>
      <div className={styles.heats}>
        <HeatLanes heat={first} fastest={fastest} />
        {rest.length > 0 && (
          <Disclosure summary={t('heats.more', { count: rest.length })}>
            <div className={styles.heats}>
              {rest.map((heat) => (
                <HeatLanes key={heat.number} heat={heat} fastest={fastest} />
              ))}
            </div>
          </Disclosure>
        )}
      </div>
    </EventSection>
  );
}
