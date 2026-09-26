import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';

import { PrototypeBadge } from '@/components/layout/PrototypeBadge';
import { SiteBackdrop } from '@/components/layout/SiteBackdrop';
import { SiteNavigation } from '@/components/layout/SiteNavigation';
import { SkipLink } from '@/components/layout/SkipLink';
import { getShowcaseEvent, getSports, isUsingSampleData } from '@/lib/data';
import { fontVariables } from '@/styles/fonts';
import '@/styles/globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: { default: t('siteName'), template: `%s · ${t('siteName')}` },
    description: t('description'),
  };
}

// Root layout for the public site. The Payload admin gets its own root layout in (payload) (ADR 0003).
export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const [locale, sports, usingSampleData, showcase] = await Promise.all([
    getLocale(),
    getSports(),
    isUsingSampleData(),
    getShowcaseEvent(),
  ]);

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <NextIntlClientProvider>
          <SkipLink />
          <SiteBackdrop />
          <SiteNavigation sports={sports.map(({ slug, name }) => ({ slug, name }))} />
          {children}
          {usingSampleData && (
            <PrototypeBadge
              showcaseHref={showcase ? `/events/${showcase.sportSlug}/${showcase.slug}` : null}
            />
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
