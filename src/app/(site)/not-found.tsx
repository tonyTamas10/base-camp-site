import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { MAIN_CONTENT_ID } from '@/components/layout/SkipLink';
import { ButtonLink } from '@/components/ui/Button';

import styles from './not-found.module.css';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  return (
    <main id={MAIN_CONTENT_ID} className={styles.page}>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} lede={t('body')} />
      <div className={styles.actions}>
        <ButtonLink href="/" variant="primary" withArrow>
          {t('backHome')}
        </ButtonLink>
      </div>
    </main>
  );
}
