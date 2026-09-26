import type { EventDetail, EventSummary } from '@/domain/event';
import type { Partner } from '@/domain/partner';
import type { Sport } from '@/domain/sport';

export interface ContentSettings {
  defaultSeasonYear: number | null;
  contactEmail: string | null;
  /** Ids of past events whose posters decorate the home hero. */
  heroPosterEventIds: string[];
  showPrototypeBadge: boolean;
  showcaseEventId: string | null;
}

/**
 * Where content comes from. Implementations return plain domain objects; `status` is
 * recalculated by the data layer from the date, so sources needn't be accurate about it.
 */
export interface ContentSource {
  getSports(): Promise<Sport[]>;
  /** Published events in their lightweight form, oldest first. */
  getEventSummaries(): Promise<EventSummary[]>;
  /** One published event with everything its page needs. */
  getEvent(sportSlug: string, slug: string): Promise<EventDetail | null>;
  getPartners(): Promise<Partner[]>;
  getSettings(): Promise<ContentSettings>;
}
