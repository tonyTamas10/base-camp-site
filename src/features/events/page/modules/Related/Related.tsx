import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { CSSProperties } from 'react';

import { Tag } from '@/components/ui/Tag';
import { eventHref } from '@/lib/routes';
import { Poster } from '@/features/posters';
import { cx } from '@/lib/cx';
import { accentColors } from '@/styles/tokens';

import { EventSection } from '../../EventSection';
import { Reveal } from '../../Reveal';
import type { EventModuleProps } from '../types';
import styles from './Related.module.css';

/** "Next on the Loop": the progress line bends out of this event into the next ones. */
export async function Related({ related, sports }: EventModuleProps) {
  if (related.length === 0) return null;
  const t = await getTranslations('eventPage');
  const geometryOf = (slug: string) => sports.find((sport) => sport.slug === slug)?.geometry;

  return (
    <EventSection module="related" eyebrow={t('eyebrow.related')}>
      <Reveal className={styles.continuation}>
        <svg
          className={styles.line}
          viewBox="0 0 1000 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            pathLength={1}
            vectorEffect="non-scaling-stroke"
            d="M1000 -40 C 1000 120, 640 60, 420 120 S 60 150, 60 220"
          />
        </svg>
        <ul className={styles.related}>
          {related.map((event, i) => (
            <li key={event.id}>
              <Link
                href={eventHref(event)}
                className={cx(styles.card, i === 0 && styles.next)}
                style={{ '--accent': accentColors[event.accent] } as CSSProperties}
              >
                {i === 0 && (
                  <Tag tone="signal" className={styles.nextTag}>
                    {t('related.next')}
                  </Tag>
                )}
                <div className={styles.poster}>
                  <Poster event={event} geometry={geometryOf(event.sportSlug)} />
                </div>
                <div className={styles.meta}>
                  <b>{event.name}</b>
                  <span>
                    {event.year} · {event.city} · {event.venue}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </EventSection>
  );
}
