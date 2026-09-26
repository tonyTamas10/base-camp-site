import Link from 'next/link';
import { useTranslations } from 'next-intl';

import styles from './SiteFooter.module.css';

export function SiteFooter() {
  const t = useTranslations('footer');
  return (
    <footer className={styles.footer}>
      <span>{t('club')}</span>
      <span className={styles.links}>
        <Link href="/contact">{t('contact')}</Link>
        <Link href="/design-system">{t('designSystem')}</Link>
      </span>
    </footer>
  );
}
