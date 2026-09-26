'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  Suspense,
  type ReactNode,
} from 'react';

import { filterEvents, type EventSummary, type EventTimeFilter } from '@/domain/event';
import { FUTURE_SPORTS_SLUG, type Sport } from '@/domain/sport';

import type { DialVariant } from './dialGeometry';

/** Imperative controls the dial registers so other components can turn it. */
export interface DialHandle {
  goToYear: (year: number, instant?: boolean) => void;
  nearestYearWithEvents: () => number | null;
  focus: () => void;
}

/** Imperative controls the deck registers so the dial can hand focus to it. */
export interface DeckHandle {
  focus: () => void;
}

/** "all", a sport slug, or the reserved "future" entry. */
export type SportSelection = string;

interface LoopContextValue {
  years: number[];
  sports: Sport[];
  variant: DialVariant;
  sport: SportSelection;
  timeFilter: EventTimeFilter;
  setTimeFilter: (filter: EventTimeFilter) => void;
  /** The year the dial has settled on. */
  year: number;
  setYear: (year: number) => void;
  /** False until the URL has been read after hydration; year-dependent UI waits for it. */
  ready: boolean;
  /** Events for a year under the current sport and time filters. */
  eventsFor: (year: number) => EventSummary[];
  /** Event count per year, in `years` order, under the current filters. */
  counts: number[];
  deckOpen: boolean;
  setDeckOpen: (open: boolean) => void;
  dialRef: React.RefObject<DialHandle | null>;
  deckRef: React.RefObject<DeckHandle | null>;
}

const LoopContext = createContext<LoopContextValue | null>(null);

export function useLoop(): LoopContextValue {
  const context = useContext(LoopContext);
  if (!context) throw new Error('useLoop must be used inside <LoopProvider>');
  return context;
}

const TIME_FILTERS: readonly EventTimeFilter[] = ['all', 'past', 'this-week', 'upcoming'];
const isTimeFilter = (value: string | null): value is EventTimeFilter =>
  TIME_FILTERS.includes(value as EventTimeFilter);

export interface LoopProviderProps {
  years: number[];
  sports: Sport[];
  events: EventSummary[];
  defaultYear: number;
  children: ReactNode;
}

export function LoopProvider({ years, sports, events, defaultYear, children }: LoopProviderProps) {
  const pathname = usePathname();
  const variant: DialVariant = pathname.startsWith('/events') ? 'events' : 'home';
  const sport = variant === 'events' ? (pathname.split('/')[2] ?? 'all') : 'all';

  const [year, setYear] = useState(defaultYear);
  const [timeFilter, setTimeFilterState] = useState<EventTimeFilter>('all');
  const [ready, setReady] = useState(false);
  const [deckOpen, setDeckOpen] = useState(false);
  const dialRef = useRef<DialHandle | null>(null);
  const deckRef = useRef<DeckHandle | null>(null);

  const activeTimeFilter = variant === 'events' ? timeFilter : 'all';

  const eventsFor = useCallback(
    (forYear: number) =>
      sport === FUTURE_SPORTS_SLUG
        ? []
        : filterEvents(events, {
            year: forYear,
            sportSlug: sport === 'all' ? undefined : sport,
            status: activeTimeFilter,
          }),
    [events, sport, activeTimeFilter],
  );

  const counts = useMemo(() => years.map((y) => eventsFor(y).length), [years, eventsFor]);

  // Keep the events hub URL in step with the selection, without a navigation.
  useEffect(() => {
    if (!ready || variant !== 'events') return;
    const params = new URLSearchParams(window.location.search);
    params.set('year', String(year));
    if (timeFilter === 'all') params.delete('when');
    else params.set('when', timeFilter);
    const query = `?${params.toString()}`;
    if (query !== window.location.search) {
      window.history.replaceState(window.history.state, '', `${pathname}${query}`);
    }
  }, [ready, variant, pathname, year, timeFilter]);

  // Leaving home closes its deck.
  const [lastVariant, setLastVariant] = useState(variant);
  if (variant !== lastVariant) {
    setLastVariant(variant);
    if (variant !== 'home') setDeckOpen(false);
  }

  useEffect(() => {
    const root = document.documentElement;
    if (deckOpen) root.setAttribute('data-deck-open', '');
    else root.removeAttribute('data-deck-open');
    return () => root.removeAttribute('data-deck-open');
  }, [deckOpen]);

  const value = useMemo<LoopContextValue>(
    () => ({
      years,
      sports,
      variant,
      sport,
      timeFilter: activeTimeFilter,
      setTimeFilter: setTimeFilterState,
      year,
      setYear,
      ready,
      eventsFor,
      counts,
      deckOpen,
      setDeckOpen,
      dialRef,
      deckRef,
    }),
    [years, sports, variant, sport, activeTimeFilter, year, ready, eventsFor, counts, deckOpen],
  );

  return (
    <LoopContext.Provider value={value}>
      {children}
      <UrlStateReader
        years={years}
        onRead={(state) => {
          if (state.year !== undefined) {
            setYear(state.year);
            dialRef.current?.goToYear(state.year, !ready);
          }
          if (state.timeFilter) setTimeFilterState(state.timeFilter);
          setReady(true);
        }}
      />
    </LoopContext.Provider>
  );
}

/**
 * Reads `?year=` and `?when=` after hydration. Isolated so that useSearchParams doesn't force the
 * whole layout into client-side rendering; it renders nothing.
 */
function UrlStateReader({
  years,
  onRead,
}: {
  years: number[];
  onRead: (state: { year?: number; timeFilter?: EventTimeFilter }) => void;
}) {
  return (
    <Suspense fallback={null}>
      <UrlStateEffect years={years} onRead={onRead} />
    </Suspense>
  );
}

function UrlStateEffect({
  years,
  onRead,
}: {
  years: number[];
  onRead: (state: { year?: number; timeFilter?: EventTimeFilter }) => void;
}) {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get('year');
  const whenParam = searchParams.get('when');
  const read = useEffectEvent(onRead);

  useEffect(() => {
    const parsedYear = Number(yearParam);
    read({
      year: years.includes(parsedYear) ? parsedYear : undefined,
      timeFilter: isTimeFilter(whenParam) ? whenParam : undefined,
    });
  }, [yearParam, whenParam, years]);

  return null;
}
