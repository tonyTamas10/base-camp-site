import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { RegistrationForm } from '@/features/forms';
import { getOpenEvents, getSports, areSubmissionsStored } from '@/lib/data';
import { submitRegistration } from '@/lib/forms/actions';

import styles from '../forms.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('register');
  return { title: t('eyebrow') };
}

export default async function RegisterPage({ searchParams }: PageProps<'/register'>) {
  const { sport, event } = await searchParams;
  const [t, events, sports, submissionsStored] = await Promise.all([
    getTranslations('register'),
    getOpenEvents(),
    getSports(),
    areSubmissionsStored(),
  ]);
  const selected =
    typeof sport === 'string' && typeof event === 'string' ? `${sport}/${event}` : undefined;

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
      />
      <div className={styles.body}>
        <RegistrationForm
          events={events}
          sports={sports}
          selected={selected}
          action={submitRegistration}
          isPrototype={!submissionsStored}
        />
      </div>
      <SiteFooter />
    </>
  );
}
