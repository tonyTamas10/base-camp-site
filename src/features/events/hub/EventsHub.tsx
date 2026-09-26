'use client';

import Link from 'next/link';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import { Button, ButtonLink } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/Heading';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { parseIsoDate } from '@/domain/dates';
import type { EventTimeFilter } from '@/domain/event';
import { FUTURE_SPORTS_SLUG } from '@/domain/sport';
import { DeckEmptyState, EventDeck, eventHref, type DeckControls } from '@/features/deck';
import { useLoop, useSportLabel } from '@/features/loop';
import { dateFormats } from '@/lib/format/dates';

import styles from './EventsHub.module.css';

const TIME_FILTERS: readonly EventTimeFilter[] = ['all', 'past', 'this-week', 'upcoming'];

/** The events hub: a year's events for a sport, as a deck (or a list on phones), driven by the Loop. */
export function EventsHub({ title }: { title: string }) {
  const t = useTranslations('events');
  const tStatus = useTranslations('eventStatus');
  const format = useFormatter();
  const { year, sport, eventsFor, sports, timeFilter, setTimeFilter, ready, dialRef, deckRef } =
    useLoop();
  const sportLabel = useSportLabel();
  const [view, setView] = useState<'deck' | 'list'>('deck');
  const controls = useRef<DeckControls>(null);
  const events = eventsFor(year);

  useEffect(() => {
    deckRef.current = { focus: () => controls.current?.focus() };
    return () => {
      deckRef.current = null;
    };
  }, [deckRef]);

  const goToNearestYear = () => {
    const nearest = dialRef.current?.nearestYearWithEvents();
    if (nearest !== undefined && nearest !== null) dialRef.current?.goToYear(nearest);
  };

  const empty =
    sport === FUTURE_SPORTS_SLUG ? (
      <DeckEmptyState
        symbol="+"
        title={t('futureTitle')}
        body={t('futureBody')}
        actions={
          <ButtonLink href="/contact" variant="primary" withArrow>
            {t('suggestSport')}
          </ButtonLink>
        }
      />
    ) : (
      <DeckEmptyState
        symbol="0"
        title={t('emptyTitle', {
          year,
          sport: sport === 'all' ? 'all' : sportLabel.toLowerCase(),
          status: timeFilter === 'all' ? 'none' : tStatus(timeFilter).toLowerCase(),
        })}
        body={t('emptyBody')}
        actions={
          <>
            <Button variant="primary" onClick={goToNearestYear}>
              {t('nearestYear')}
            </Button>
            {timeFilter !== 'all' && (
              <Button variant="ghost" onClick={() => setTimeFilter('all')}>
                {t('allDates')}
              </Button>
            )}
          </>
        }
      />
    );

  return (
    <div className={styles.hub} data-view={view}>
      <div className={styles.top}>
        <SectionHeading as="h1" className={styles.title}>
          {title}
        </SectionHeading>
        <div className={styles.filters}>
          <SegmentedControl
            label={t('whenLabel')}
            value={timeFilter}
            onChange={setTimeFilter}
            options={TIME_FILTERS.map((value) => ({ value, label: t(`when.${value}`) }))}
          />
          <SegmentedControl
            className={styles.viewToggle}
            label={t('viewLabel')}
            value={view}
            onChange={setView}
            options={[
              { value: 'deck', label: t('view.deck') },
              { value: 'list', label: t('view.list') },
            ]}
          />
        </div>
      </div>

      <div className={styles.body}>
        {ready && view === 'deck' && (
          <EventDeck
            key={`${sport}|${timeFilter}|${year}`}
            events={events}
            sports={sports}
            empty={empty}
            controlsRef={controls}
          />
        )}
        {ready && view === 'list' && (
          <div className={styles.list}>
            {events.length === 0 ? (
              empty
            ) : (
              <ol aria-label={t('listLabel', { year })}>
                {events.map((event) => (
                  <li key={event.id}>
                    <Link href={eventHref(event)} className={styles.listItem}>
                      <span>{event.name}</span>
                      <span className={styles.listDate}>
                        {format.dateTime(parseIsoDate(event.date), dateFormats.dayMonth)}
                        {event.status !== 'past' && ` · ${tStatus(event.status)}`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
