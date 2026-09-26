import { getTranslations } from 'next-intl/server';

import { getTotalGoals, rankAthletes, type Competition } from '@/domain/competition';

import { CountUp } from '../../CountUp';
import { EventSection } from '../../EventSection';
import { StatGrid } from '../../StatGrid';
import type { EventModuleProps } from '../types';

interface Stat {
  label: string;
  value: number;
  decimals?: number;
  /** The one key number of the view, in signal orange. */
  highlight?: boolean;
}

async function statsFor(competition: Competition, participants: number): Promise<Stat[]> {
  const t = await getTranslations('eventPage.stats');
  if (competition.kind === 'team') {
    return [
      { label: t('teams'), value: competition.teams.length },
      { label: t('players'), value: participants },
      { label: t('matches'), value: competition.matches.length },
      { label: t('goals'), value: getTotalGoals(competition), highlight: true },
    ];
  }
  const fastest = rankAthletes(competition)[0];
  const lanes = Math.max(0, ...competition.heats.map((heat) => heat.lanes.length));
  return [
    { label: t('athletes'), value: participants },
    { label: t('heats'), value: competition.heats.length },
    { label: t('lanes'), value: lanes },
    ...(fastest
      ? [
          {
            label: t('fastest', { distance: competition.distance }),
            value: fastest.time,
            decimals: 2,
            highlight: true,
          },
        ]
      : []),
  ];
}

export async function Stats({ event }: EventModuleProps) {
  const t = await getTranslations('eventPage');
  const stats = await statsFor(event.competition, event.participants);

  return (
    <EventSection module="stats" eyebrow={t('eyebrow.stats')}>
      <StatGrid
        items={stats.map((stat) => ({
          label: stat.label,
          highlight: stat.highlight,
          value: <CountUp value={stat.value} decimals={stat.decimals} />,
        }))}
      />
    </EventSection>
  );
}
