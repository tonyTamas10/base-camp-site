import Link from 'next/link';
import { getFormatter, getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { ParticipantCount } from '@/components/ui/ParticipantCount';
import { parseIsoDate } from '@/domain/dates';
import type { EventDetail } from '@/domain/event';
import type { Sport } from '@/domain/sport';
import { EventStatusTag } from '@/features/deck';
import { eventHref, registerHref } from '@/lib/routes';
import { Poster } from '@/features/posters';
import { dateFormats } from '@/lib/format/dates';
import { accentColors } from '@/styles/tokens';

import styles from './EventHero.module.css';

/** Four horizontal slices of the poster that fly in and settle into one image. */
const POSTER_SLICES = 4;

export async function EventHero({
  event,
  sport,
}: {
  event: EventDetail;
  sport: Sport | undefined;
}) {
  const [t, format] = await Promise.all([getTranslations('eventPage'), getFormatter()]);
  const words = event.name.split(' ');
  const lastWord = words.pop();
  const resultsAnchor = event.competition.kind === 'team' ? 'bracket' : 'rankings';

  return (
    <section
      className={styles.hero}
      style={{ '--accent': accentColors[event.accent] } as CSSProperties}
    >
      <div className={styles.grid}>
        <div>
          <Link href={`/events/${event.sportSlug}?year=${event.year}`} className={styles.back}>
            <span aria-hidden="true">←</span> {sport?.name ?? event.sportSlug} / {event.year}
          </Link>
          <h1 className={styles.title}>
            {words.join(' ')} <span className={styles.accent}>{lastWord}</span>
          </h1>
          <p className={styles.meta}>
            <time dateTime={event.date}>
              {format.dateTime(parseIsoDate(event.date), dateFormats.full)}
            </time>
            <span className={styles.venue}>{event.venue}</span>
            <ParticipantCount
              count={event.participants}
              label={t('participants', { count: event.participants })}
            />
          </p>
          {event.status !== 'past' && <EventStatusTag status={event.status} />}
          <div className={styles.actions}>
            {event.status === 'past' ? (
              <ButtonLink href={`${eventHref(event)}#${resultsAnchor}`} variant="primary" withArrow>
                {t('seeResults')}
              </ButtonLink>
            ) : (
              <ButtonLink href={registerHref(event)} variant="primary" withArrow>
                {t('register')}
              </ButtonLink>
            )}
          </div>
        </div>
        <div className={styles.poster} aria-hidden="true">
          {Array.from({ length: POSTER_SLICES }, (_, i) => (
            <div key={i} className={styles.slice} data-slice={i + 1}>
              <Poster event={event} geometry={sport?.geometry} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
