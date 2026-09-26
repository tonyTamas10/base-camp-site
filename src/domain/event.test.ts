import { describe, expect, it } from 'vitest';

import {
  filterEvents,
  getEventStatus,
  getNextOpenEvent,
  getRelatedEvents,
  type EventSummary,
} from './event';

const summary = (overrides: Partial<EventSummary>): EventSummary => ({
  id: 'x',
  slug: 'x',
  sportSlug: 'sprints',
  name: 'X',
  year: 2025,
  date: '2025-05-01',
  venue: 'Iris',
  city: 'Cluj-Napoca',
  accent: 'amber',
  participants: 10,
  status: 'past',
  ...overrides,
});

describe('getEventStatus', () => {
  const today = '2026-09-24';

  it('marks earlier dates as past', () => {
    expect(getEventStatus('2026-09-23', today)).toBe('past');
  });

  it('marks today and the next seven days as this week', () => {
    expect(getEventStatus('2026-09-24', today)).toBe('this-week');
    expect(getEventStatus('2026-10-01', today)).toBe('this-week');
  });

  it('marks anything later as upcoming', () => {
    expect(getEventStatus('2026-10-02', today)).toBe('upcoming');
  });
});

describe('filterEvents', () => {
  const event = summary;
  const events = [
    event({ id: '1' }),
    event({ id: '2', year: 2026, status: 'upcoming' }),
    event({ id: '3', sportSlug: 'football' }),
  ];

  const ids = (list: EventSummary[]) => list.map((e) => e.id);

  it('returns everything for an empty filter', () => {
    expect(ids(filterEvents(events, {}))).toEqual(['1', '2', '3']);
  });

  it('combines year, sport and status', () => {
    expect(ids(filterEvents(events, { year: 2025, sportSlug: 'sprints' }))).toEqual(['1']);
    expect(ids(filterEvents(events, { status: 'upcoming' }))).toEqual(['2']);
    expect(ids(filterEvents(events, { status: 'all', year: 2025 }))).toEqual(['1', '3']);
  });
});

describe('related events', () => {
  const events = [
    summary({ id: 'a-2023', year: 2023, date: '2023-05-01' }),
    summary({ id: 'other-sport', sportSlug: 'football', year: 2024, date: '2024-01-01' }),
    summary({ id: 'a-2024', year: 2024, date: '2024-05-01' }),
    summary({ id: 'a-2025', year: 2025, date: '2025-05-01' }),
    summary({ id: 'a-2026', year: 2026, date: '2026-10-01', status: 'upcoming' }),
    summary({ id: 'a-2026b', year: 2026, date: '2026-11-01', status: 'upcoming' }),
  ];
  const ids = (list: EventSummary[]) => list.map((e) => e.id);

  it('finds the soonest open event in the same sport', () => {
    expect(getNextOpenEvent(events, events[2]!)?.id).toBe('a-2026');
    expect(getNextOpenEvent(events, events[4]!)?.id).toBe('a-2026b');
  });

  it('leads with the next event in the same sport, then the latest other years', () => {
    expect(ids(getRelatedEvents(events, events[2]!))).toEqual(['a-2025', 'a-2026', 'a-2026b']);
  });

  it('falls back to the next open event after the last one', () => {
    expect(ids(getRelatedEvents(events, events[5]!))[0]).toBe('a-2026');
  });
});
