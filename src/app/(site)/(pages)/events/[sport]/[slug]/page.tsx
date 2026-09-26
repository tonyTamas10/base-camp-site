import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageHeader } from '@/components/layout/PageHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { getEvent, getEventRouteParams } from '@/lib/data';

export async function generateStaticParams() {
  return getEventRouteParams();
}

export async function generateMetadata({
  params,
}: PageProps<'/events/[sport]/[slug]'>): Promise<Metadata> {
  const { sport, slug } = await params;
  const event = await getEvent(sport, slug);
  return event ? { title: `${event.name} ${event.year}` } : {};
}

export default async function EventPage({ params }: PageProps<'/events/[sport]/[slug]'>) {
  const { sport, slug } = await params;
  const event = await getEvent(sport, slug);
  if (!event) notFound();

  return (
    <>
      <PageHeader eyebrow={`${event.year} · ${event.venue}`} title={event.name} />
      <SiteFooter />
    </>
  );
}
