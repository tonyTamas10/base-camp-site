import { useFormatter, useTranslations } from 'next-intl';
import type { CSSProperties, Ref } from 'react';

import { ParticipantCount } from '@/components/ui/ParticipantCount';
import { parseIsoDate } from '@/domain/dates';
import type { EventSummary } from '@/domain/event';
import type { PosterGeometry } from '@/domain/sport';
import { Poster } from '@/features/posters';
import { cx } from '@/lib/cx';
import { dateFormats } from '@/lib/format/dates';
import { accentColors } from '@/styles/tokens';

import styles from './EventCard.module.css';
import { EventStatusTag } from './EventStatusTag';

export interface EventCardProps {
  event: EventSummary;
  geometry: PosterGeometry | undefined;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLElement>;
  'aria-hidden'?: boolean;
  'data-index'?: number;
}

/** A poster card: the event's poster, name, date, venue and participant count. */
export function EventCard({ event, geometry, className, style, ...rest }: EventCardProps) {
  const t = useTranslations('eventCard');
  const format = useFormatter();
  const date = format.dateTime(parseIsoDate(event.date), dateFormats.dayMonth);

  return (
    <article
      {...rest}
      className={cx(styles.card, className)}
      style={{ ...style, '--accent': accentColors[event.accent] } as CSSProperties}
      aria-label={t('label', {
        name: event.name,
        year: event.year,
        venue: event.venue,
        count: event.participants,
      })}
    >
      {event.status !== 'past' && (
        <div className={styles.tags}>
          <EventStatusTag status={event.status} />
        </div>
      )}
      <div className={styles.poster}>
        <Poster event={event} geometry={geometry} />
      </div>
      <div className={styles.meta}>
        <h3 className={styles.name}>{event.name}</h3>
        <div className={styles.row}>
          <span>
            {date} · {event.venue}
          </span>
          <ParticipantCount
            count={event.participants}
            label={t('participants', { count: event.participants })}
            className={styles.participants}
          />
        </div>
      </div>
    </article>
  );
}
