import { getTranslations } from 'next-intl/server';

import { getClosestFinish, rankAthletes } from '@/domain/competition';

import { EventSection } from '../../EventSection';
import { StatGrid, type StatItem } from '../../StatGrid';
import type { EventModuleProps } from '../types';

export async function Records({ event }: EventModuleProps) {
  const competition = event.competition;
  if (competition.kind !== 'track') return null;
  const t = await getTranslations('eventPage');
  const fastest = rankAthletes(competition)[0];
  const closest = getClosestFinish(competition);

  const records: StatItem[] = [];
  if (fastest) {
    records.push({
      value: fastest.time.toFixed(2),
      label: t('records.editionBest', { name: fastest.athlete.name }),
      highlight: true,
    });
  }
  if (closest) {
    records.push({
      value: closest.gap.toFixed(2),
      label: t('records.closestFinish', { heat: closest.heat }),
    });
  }
  records.push(
    { value: '—', label: t('records.clubRecord') },
    { value: competition.distance, label: t('records.distance') },
  );

  return (
    <EventSection module="records" tone="midnight" eyebrow={t('eyebrow.records')}>
      <StatGrid items={records} />
    </EventSection>
  );
}
