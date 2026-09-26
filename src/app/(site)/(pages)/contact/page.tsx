import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { ContactForm, CopyEmail } from '@/features/forms';
import { getContactEmail, areSubmissionsStored } from '@/lib/data';
import { submitContactMessage } from '@/lib/forms/actions';

import styles from '../forms.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('contact');
  return { title: t('eyebrow') };
}

export default async function ContactPage() {
  const [t, submissionsStored, contactEmail] = await Promise.all([
    getTranslations('contact'),
    areSubmissionsStored(),
    getContactEmail(),
  ]);

  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} />
      <div className={`${styles.body} ${styles.twoColumns}`}>
        <div className={styles.aside}>
          <span className={styles.asideLabel}>{t('emailLabel')}</span>
          <CopyEmail address={contactEmail} />
        </div>
        <ContactForm action={submitContactMessage} isPrototype={!submissionsStored} />
      </div>
      <SiteFooter />
    </>
  );
}
