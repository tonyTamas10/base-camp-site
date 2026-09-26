export const locales = ['en-GB'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en-GB';

/** The club's time zone, used whenever a time of day is shown. */
export const timeZone = 'Europe/Bucharest';
