import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import type { EventSummary } from '@/domain/event';
import { DesignSystemPage } from '@/features/design-system';
import { getEventSummaries, getSports } from '@/lib/data';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('designSystem');
  return { title: t('titlePlain') };
}

export default async function DesignSystemRoute() {
  const [t, sports, events] = await Promise.all([
    getTranslations('designSystem'),
    getSports(),
    getEventSummaries(),
  ]);
  // The most recent past event of each sport illustrates posters and cards.
  const samples = sports
    .map((sport) => events.filter((e) => e.sportSlug === sport.slug && e.status === 'past').at(-1))
    .filter((event): event is EventSummary => event !== undefined);

  return (
    <DesignSystemPage
      samples={samples}
      sports={sports}
      labels={{
        eyebrow: t('eyebrow'),
        title: t('titlePlain'),
        lede: t('lede'),
        playMotion: t('playMotion'),
        backToLoop: t('backToLoop'),
      }}
    />
  );
}
