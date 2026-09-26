import type { IsoDate } from '@/domain/dates';
import { timeZone } from '@/i18n/config';

/** The calendar date of an instant in the club's time zone. */
export function toClubDate(instant: Date | string): IsoDate {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date(instant));
}

/**
 * Today's date in Cluj-Napoca. `SITE_TODAY` pins it (e.g. "2026-09-24") so tests and previews
 * don't drift as the real calendar moves on.
 */
export function today(): IsoDate {
  return process.env.SITE_TODAY ?? toClubDate(new Date());
}
