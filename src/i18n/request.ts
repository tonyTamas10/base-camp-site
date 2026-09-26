import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, timeZone } from './config';

// Single locale for now (ADR 0006). When Romanian is added, the locale comes from the route segment.
export default getRequestConfig(async () => {
  const locale = defaultLocale;
  const messages = (await import(`./messages/${locale}.json`)).default;
  return { locale, messages, timeZone };
});
