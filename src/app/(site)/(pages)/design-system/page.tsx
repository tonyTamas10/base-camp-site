import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/layout/PageHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('designSystem');
  return { title: t('title') };
}

export default async function DesignSystemPage() {
  const t = await getTranslations('designSystem');
  return (
    <>
      <PageHeader eyebrow={t('eyebrow')} title={t('title')} />
      <SiteFooter />
    </>
  );
}
