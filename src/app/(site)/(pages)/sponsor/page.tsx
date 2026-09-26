import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('sponsor');
  return { title: t('title') };
}

export default async function SponsorPage() {
  const t = await getTranslations('sponsor');
  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} />
      <SiteFooter />
    </>
  );
}
