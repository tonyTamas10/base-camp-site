import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { SectionHeading } from '@/components/ui/Heading';
import { FUTURE_SPORTS_SLUG } from '@/domain/sport';
import { getSport, getSports } from '@/lib/data';

import styles from '../page.module.css';

export async function generateStaticParams() {
  const sports = await getSports();
  return [...sports.map((sport) => ({ sport: sport.slug })), { sport: FUTURE_SPORTS_SLUG }];
}

async function resolveTitle(sportSlug: string): Promise<string | null> {
  if (sportSlug === FUTURE_SPORTS_SLUG) return (await getTranslations('nav'))('futureSports');
  return (await getSport(sportSlug))?.name ?? null;
}

export async function generateMetadata({
  params,
}: PageProps<'/events/[sport]'>): Promise<Metadata> {
  const title = await resolveTitle((await params).sport);
  return title ? { title } : {};
}

export default async function SportEventsPage({ params }: PageProps<'/events/[sport]'>) {
  const title = await resolveTitle((await params).sport);
  if (!title) notFound();

  return (
    <div className={styles.hub}>
      <SectionHeading as="h1">{title}</SectionHeading>
    </div>
  );
}
