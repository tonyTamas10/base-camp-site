/*
 * Date formats for next-intl's `format.dateTime`. Event dates are calendar dates stored as UTC
 * midnight (see domain/dates), so they're formatted in UTC to never shift a day.
 */
export const dateFormats = {
  /** "18 Oct" */
  dayMonth: { day: 'numeric', month: 'short', timeZone: 'UTC' },
  /** "18 Oct 2025" */
  full: { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' },
  /** "Sat 18 Oct" */
  weekday: { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' },
} satisfies Record<string, Intl.DateTimeFormatOptions>;
