import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SectionHeading } from '@/components/ui/Heading';

import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('events');
  return { title: t('title') };
}

export default async function EventsPage() {
  const t = await getTranslations('events');
  return (
    <div className={styles.hub}>
      <SectionHeading as="h1">{t('title')}</SectionHeading>
    </div>
  );
}
