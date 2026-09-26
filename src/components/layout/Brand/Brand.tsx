import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { cx } from '@/lib/cx';

import styles from './Brand.module.css';

/** The Base Camp mark: a running track with the signal dot. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect
        x="3"
        y="9"
        width="34"
        height="22"
        rx="11"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <rect
        x="9"
        y="15"
        width="22"
        height="10"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.6"
      />
      <circle cx="31" cy="12" r="4" fill="var(--color-signal)" />
    </svg>
  );
}

export function Brand({
  showLocation = false,
  compact = false,
}: {
  showLocation?: boolean;
  compact?: boolean;
}) {
  const t = useTranslations('brand');

  return (
    <Link
      href="/"
      className={cx(styles.brand, compact && styles.compact)}
      aria-label={t('homeLabel')}
    >
      <BrandMark className={styles.mark} />
      <span>
        <b className={styles.name}>
          {t('first')}
          <br />
          {t('second')}
        </b>
        {showLocation && <small className={styles.location}>{t('location')}</small>}
      </span>
    </Link>
  );
}
