import { useTranslations } from 'next-intl';

import { Tag } from '@/components/ui/Tag';

import styles from './page.module.css';

export default function HomePage() {
  const t = useTranslations('home');

  return (
    <main className={styles.page}>
      <h1 className={styles.wordmark}>
        <span className={styles.wordmarkFirst}>{t('wordmarkFirst')}</span>
        <span className={styles.wordmarkSecond}>{t('wordmarkSecond')}</span>
      </h1>
      <p className={styles.statement}>
        {t('statement')} <em>{t('statementEmphasis')}</em>
      </p>
      <Tag tone="signal">{t('status')}</Tag>
    </main>
  );
}
