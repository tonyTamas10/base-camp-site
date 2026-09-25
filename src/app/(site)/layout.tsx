import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';

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
  const locale = await getLocale();

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
