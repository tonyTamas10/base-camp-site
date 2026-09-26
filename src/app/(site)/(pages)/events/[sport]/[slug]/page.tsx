import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { EventPage } from '@/features/events';
import {
  getEvent,
  getEventRouteParams,
  getNextOpenEvent,
  getRelatedEvents,
  getSports,
} from '@/lib/data';

export async function generateStaticParams() {
  return getEventRouteParams();
}

export async function generateMetadata({
  params,
}: PageProps<'/events/[sport]/[slug]'>): Promise<Metadata> {
  const { sport, slug } = await params;
  const event = await getEvent(sport, slug);
  if (!event) return {};
  const title = `${event.name} ${event.year}`;
  const description = `${event.story.pullQuote} ${event.story.pullQuoteEmphasis} ${event.venue}, ${event.city}.`;
  return { title, description, openGraph: { title, description, type: 'website' } };
}

export default async function EventRoute({ params }: PageProps<'/events/[sport]/[slug]'>) {
  const { sport, slug } = await params;
  const event = await getEvent(sport, slug);
  if (!event) notFound();

  const [sports, related, nextOpen] = await Promise.all([
    getSports(),
    getRelatedEvents(event),
    getNextOpenEvent(event),
  ]);

  return <EventPage event={event} sports={sports} related={related} nextOpen={nextOpen} />;
}
