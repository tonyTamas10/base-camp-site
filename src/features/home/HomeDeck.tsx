'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import { IconButton } from '@/components/ui/IconButton';
import { DeckEmptyState, EventDeck, type DeckControls } from '@/features/deck';
import { useLoop, useSportLabel } from '@/features/loop';

import styles from './HomeDeck.module.css';

/** On home, activating a year on the Loop opens its events as a deck over the hero. */
export function HomeDeck() {
  const t = useTranslations('homeDeck');
  const { deckOpen, setDeckOpen, year, eventsFor, sports, dialRef, deckRef } = useLoop();
  const sportLabel = useSportLabel();
  const controls = useRef<DeckControls>(null);
  const events = eventsFor(year);

  useEffect(() => {
    if (!deckOpen) return;
    deckRef.current = { focus: () => controls.current?.focus() };
    const frame = requestAnimationFrame(() => controls.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setDeckOpen(false);
      dialRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKeyDown);
      deckRef.current = null;
    };
  }, [deckOpen, setDeckOpen, dialRef, deckRef]);

  if (!deckOpen) return null;

  const close = () => {
    setDeckOpen(false);
    dialRef.current?.focus();
  };

  return (
    <div className={styles.overlay}>
      <EventDeck
        key={year}
        events={events}
        sports={sports}
        controlsRef={controls}
        header={
          <div className={styles.header}>
            <h2 className={styles.title}>
              {year}
              <span>{t('summary', { count: events.length, sport: sportLabel })}</span>
            </h2>
            <IconButton icon="close" label={t('close')} onClick={close} />
          </div>
        }
        empty={
          <DeckEmptyState symbol="0" title={t('emptyTitle', { year })} body={t('emptyBody')} />
        }
      />
    </div>
  );
}
