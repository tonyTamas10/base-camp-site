import { useTranslations } from 'next-intl';

import styles from './SkipLink.module.css';

export const MAIN_CONTENT_ID = 'main';

/** First focusable element on every page: jumps keyboard users past the navigation. */
export function SkipLink() {
  const t = useTranslations('nav');
  return (
    <a className={styles.skip} href={`#${MAIN_CONTENT_ID}`}>
      {t('skipToContent')}
    </a>
  );
}
