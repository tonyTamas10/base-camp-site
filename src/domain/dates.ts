/**
 * Calendar dates are ISO strings ("2025-10-18") so they serialise cleanly between server and
 * client. They are interpreted in UTC to avoid off-by-one days across time zones.
 */
export type IsoDate = string;

const MS_PER_DAY = 86_400_000;

export function parseIsoDate(date: IsoDate): Date {
  return new Date(`${date}T00:00:00Z`);
}

export function toIsoDate(date: Date): IsoDate {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return toIsoDate(new Date(parseIsoDate(date).getTime() + days * MS_PER_DAY));
}

/** Whole days from `from` to `to`; negative when `to` is earlier. */
export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round((parseIsoDate(to).getTime() - parseIsoDate(from).getTime()) / MS_PER_DAY);
}

export function yearOf(date: IsoDate): number {
  return parseIsoDate(date).getUTCFullYear();
}
