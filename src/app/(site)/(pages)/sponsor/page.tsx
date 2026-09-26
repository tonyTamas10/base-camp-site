import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SponsorForm } from '@/features/forms';
import { areSubmissionsStored } from '@/lib/data';
import { submitSponsorEnquiry } from '@/lib/forms/actions';

import styles from '../forms.module.css';

const WAYS = ['event', 'season', 'kit', 'venue'] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sponsor');
  return { title: t('eyebrow') };
}

export default async function SponsorPage() {
  const [t, submissionsStored] = await Promise.all([
    getTranslations('sponsor'),
    areSubmissionsStored(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={t('eyebrow')}
        title={
          <>
            {t('titleFirst')}
            <br />
            {t('titleSecond')}
          </>
        }
        lede={t('lede')}
      />
      <div className={`${styles.body} ${styles.twoColumns}`}>
        <ul className={styles.ways}>
          {WAYS.map((way) => (
            <li key={way}>
              <b>{t(`ways.${way}`)}</b>
            </li>
          ))}
        </ul>
        <SponsorForm action={submitSponsorEnquiry} isPrototype={!submissionsStored} />
      </div>
      <SiteFooter />
    </>
  );
}
