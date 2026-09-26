import type { EventDetail, EventSummary } from '@/domain/event';
import type { Sport } from '@/domain/sport';

/** Every event module receives the same props; each renders only what applies to the event. */
export interface EventModuleProps {
  event: EventDetail;
  sports: Sport[];
  /** "Next on the Loop": the following event in the sport, then other years. */
  related: EventSummary[];
  /** The next event in this sport still open for registration. */
  nextOpen: EventSummary | null;
}
