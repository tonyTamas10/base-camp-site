import { getTranslations } from 'next-intl/server';

import { HomeHero } from '@/features/home';
import { SponsorRibbon } from '@/features/sponsors';
import { getHeroPosterEvents, getPartners, getSports } from '@/lib/data';

export default async function HomePage() {
  const [t, partners, posterEvents, sports] = await Promise.all([
    getTranslations('home'),
    getPartners(),
    getHeroPosterEvents(),
    getSports(),
  ]);
  const geometryOf = (sportSlug: string) => sports.find((s) => s.slug === sportSlug)?.geometry;

  return (
    <>
      <SponsorRibbon partners={partners} label={t('partnersLabel')} />
      <HomeHero
        posterEvents={posterEvents.map((event) => ({
          event,
          geometry: geometryOf(event.sportSlug),
        }))}
      />
    </>
  );
}
