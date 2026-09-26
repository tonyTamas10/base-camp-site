import { useTranslations } from 'next-intl';

import { ButtonLink } from '@/components/ui/Button';
import type { EventSummary } from '@/domain/event';
import type { PosterGeometry } from '@/domain/sport';
import { Poster } from '@/features/posters';

import styles from './HomeHero.module.css';

export interface HomeHeroProps {
  /** Up to three past events whose posters drift behind the wordmark. */
  posterEvents: Array<{ event: EventSummary; geometry: PosterGeometry | undefined }>;
}

export function HomeHero({ posterEvents }: HomeHeroProps) {
  const t = useTranslations('home');

  return (
    <>
      <div className={styles.fragments} aria-hidden="true">
        {posterEvents.slice(0, 2).map(({ event, geometry }, i) => (
          <div key={event.id} className={styles.fragment} data-position={i + 1}>
            <Poster event={event} geometry={geometry} />
          </div>
        ))}
      </div>
      <div className={styles.hero}>
        <h1 className={styles.wordmark}>
          <span className={styles.wordmarkFirst}>{t('wordmarkFirst')}</span>
          <span className={styles.wordmarkSecond}>{t('wordmarkSecond')}</span>
          <span className={styles.lane} aria-hidden="true" />
        </h1>
        <div className={styles.row}>
          <p className={styles.statement}>
            {t('statement')} <em>{t('statementEmphasis')}</em>
          </p>
          <ButtonLink href="/events" variant="primary" withArrow>
            {t('enterLoop')}
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
