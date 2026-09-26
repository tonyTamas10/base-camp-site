import Link from 'next/link';
import { useTranslations } from 'next-intl';

import styles from './PrototypeBadge.module.css';

export interface PrototypeBadgeProps {
  /** Path to an event that shows off the event page well. */
  showcaseHref: `/events/${string}/${string}` | null;
}

/**
 * One badge says the content is sample data, instead of labels on every element
 * (design principle "Honest content"). Shown only while the site runs on sample data.
 */
export function PrototypeBadge({ showcaseHref }: PrototypeBadgeProps) {
  const t = useTranslations('prototype');
  return (
    <details className={styles.badge}>
      <summary className={styles.summary}>{t('label')}</summary>
      <div className={styles.body}>
        <p>{t('explanation')}</p>
        {showcaseHref && <Link href={showcaseHref}>{t('showcaseEvent')}</Link>}
        <Link href="/design-system">{t('designSystem')}</Link>
      </div>
    </details>
  );
}
