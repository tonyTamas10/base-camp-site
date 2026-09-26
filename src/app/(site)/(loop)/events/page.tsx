import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { EventsHub } from '@/features/events';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('events');
  return { title: t('title') };
}

export default async function EventsPage() {
  const t = await getTranslations('events');
  return <EventsHub title={t('title')} />;
}
