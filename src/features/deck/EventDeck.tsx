'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react';

import { ButtonLink } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import type { EventSummary } from '@/domain/event';
import type { Sport } from '@/domain/sport';
import { cx } from '@/lib/cx';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

import {
  depthOf,
  ENTRY_PLACEMENT,
  exitPlacement,
  placeCard,
  type CardPlacement,
  type DeckForm,
} from './deckLayout';
import styles from './EventDeck.module.css';
import { EventCard } from './EventCard';

export interface DeckControls {
  focus: () => void;
}

export interface EventDeckProps {
  events: EventSummary[];
  sports: Sport[];
  /** Shown instead of cards when `events` is empty. */
  empty: ReactNode;
  /** Optional heading row above the cards. */
  header?: ReactNode;
  onFrontChange?: (event: EventSummary | undefined) => void;
  controlsRef?: Ref<DeckControls>;
  className?: string;
}

/** Duration of the front card's exit before it slips to the back of the deck. */
const EXIT_MS = 340;
const ENTRY_STAGGER_MS = 50;
const ENTRY_SETTLE_MS = 700;
const SWIPE_THRESHOLD = 60;
const TAP_TOLERANCE = 6;
const WHEEL_THRESHOLD = 40;
/** A wheel gesture ends after this long without events; one gesture advances one card. */
const WHEEL_GESTURE_GAP_MS = 160;

export const eventHref = (event: EventSummary) =>
  `/events/${event.sportSlug}/${event.slug}` as const;

type Phase = 'entering' | 'arriving' | 'idle';

/**
 * The events of a year as a deck of posters: a 3D stack on desktop, a vertical swipe stack on
 * phones. Mount a new deck (change its `key`) when the list changes to replay the entrance.
 */
export function EventDeck({
  events,
  sports,
  empty,
  header,
  onFrontChange,
  controlsRef,
  className,
}: EventDeckProps) {
  const t = useTranslations('deck');
  const router = useRouter();
  const reducedMotion = usePrefersReducedMotion();
  const form: DeckForm = useMediaQuery('(width < 900px)') ? 'swipe' : 'stack';

  const [front, setFront] = useState(0);
  const [phase, setPhase] = useState<Phase>(reducedMotion ? 'idle' : 'entering');
  /** The card flying out after "next", and the card flying in after "previous". */
  const [exiting, setExiting] = useState<number | null>(null);
  const [arriving, setArriving] = useState<number | null>(null);
  /** Cards that move to their new place without animating (e.g. slipping to the back). */
  const [instant, setInstant] = useState<ReadonlySet<number>>(new Set());
  const [dragOffset, setDragOffset] = useState<number | null>(null);

  const cardsRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const size = events.length;
  const current = events[front];

  useImperativeHandle(controlsRef, () => ({ focus: () => cardsRef.current?.focus() }), []);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const nextFrame = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  useEffect(() => onFrontChange?.(current), [current, onFrontChange]);

  // Cards rise into the deck one after another: place them at the entry point, let the browser
  // paint that, then release them (staggered); drop the stagger once they've landed.
  useEffect(() => {
    if (phase === 'entering') nextFrame(() => setPhase('arriving'));
    if (phase === 'arriving') later(() => setPhase('idle'), ENTRY_SETTLE_MS);
  }, [phase, later]);

  const open = useCallback(() => {
    if (current) router.push(eventHref(current));
  }, [current, router]);

  const advance = useCallback(
    (direction: 1 | -1) => {
      if (size < 2 || exiting !== null) return;
      const target = (front + direction + size) % size;
      if (reducedMotion) {
        setFront(target);
        return;
      }
      if (direction === 1) {
        // The front card flies out, then slips to the back without animating.
        const leaving = front;
        setExiting(leaving);
        setFront(target);
        later(() => {
          setInstant(new Set([leaving]));
          setExiting(null);
          nextFrame(() => setInstant(new Set()));
        }, EXIT_MS);
      } else {
        // The previous card appears where cards exit, then comes down to the front.
        setInstant(new Set([target]));
        setArriving(target);
        setFront(target);
        nextFrame(() => {
          setInstant(new Set());
          setArriving(null);
        });
      }
    },
    [size, exiting, front, reducedMotion, later],
  );

  // Wheel: one continuous gesture (a flick or a spin) advances exactly one card.
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards) return;
    let accumulated = 0;
    let locked = false;
    let gestureEnd = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      window.clearTimeout(gestureEnd);
      gestureEnd = window.setTimeout(() => {
        locked = false;
        accumulated = 0;
      }, WHEEL_GESTURE_GAP_MS);
      if (locked) return;
      accumulated += Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(accumulated) > WHEEL_THRESHOLD) {
        advance(accumulated > 0 ? 1 : -1);
        accumulated = 0;
        locked = true;
      }
    };
    cards.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      cards.removeEventListener('wheel', onWheel);
      window.clearTimeout(gestureEnd);
    };
  }, [advance]);

  // Swipe, drag and tap on the front card; tapping a card behind brings it forward.
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const card = (event.target as HTMLElement).closest<HTMLElement>('[data-index]');
    if (!card) return;
    const index = Number(card.dataset.index);
    if (index !== front) {
      setFront(index);
      return;
    }
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current?.id !== event.pointerId) return;
    const dy = event.clientY - pointer.current.y;
    if (Math.abs(dy) > TAP_TOLERANCE) setDragOffset(dy);
  };
  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    if (start?.id !== event.pointerId) return;
    pointer.current = null;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    setDragOffset(null);
    if (event.type === 'pointercancel') return;
    if (Math.abs(dx) < TAP_TOLERANCE && Math.abs(dy) < TAP_TOLERANCE) open();
    else if (dy < -SWIPE_THRESHOLD) advance(1);
    else if (dy > SWIPE_THRESHOLD) advance(-1);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key)) advance(1);
    else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key)) advance(-1);
    else if (event.key === 'Enter') open();
    else return;
    event.preventDefault();
  };

  const placementOf = (index: number): CardPlacement => {
    if (phase === 'entering') return ENTRY_PLACEMENT;
    if (index === exiting || index === arriving) return exitPlacement(form);
    const placement = placeCard(depthOf(index, front, size), form);
    if (index === front && dragOffset !== null) {
      return {
        ...placement,
        transform: `translate3d(0, ${dragOffset * 0.9}px, 0) rotate(${dragOffset * -0.01}deg)`,
      };
    }
    return placement;
  };

  const geometryOf = (sportSlug: string) => sports.find((s) => s.slug === sportSlug)?.geometry;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      className={cx(styles.deck, className)}
      aria-roledescription={t('roleDescription')}
      aria-label={t('label')}
    >
      {header}
      {size === 0 ? (
        <div className={styles.empty}>{empty}</div>
      ) : (
        // Arrow-key shortcut layer over the cards; the buttons below remain the accessible controls.
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          ref={cardsRef}
          className={styles.cards}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
          aria-label={t('keyboardHint')}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          data-reduced-motion={reducedMotion || undefined}
        >
          {events.map((event, index) => {
            const placement = placementOf(index);
            const isFront = index === front && phase !== 'entering';
            return (
              <EventCard
                key={event.id}
                event={event}
                geometry={geometryOf(event.sportSlug)}
                data-index={index}
                aria-hidden={!isFront}
                className={cx(
                  styles.card,
                  isFront && styles.front,
                  (phase === 'entering' ||
                    instant.has(index) ||
                    (isFront && dragOffset !== null)) &&
                    styles.instant,
                )}
                style={
                  {
                    '--card-transform': placement.transform,
                    '--card-opacity': placement.opacity,
                    '--card-brightness': placement.brightness,
                    zIndex: placement.zIndex,
                    transitionDelay:
                      phase === 'arriving'
                        ? `${Math.min(index, 5) * ENTRY_STAGGER_MS}ms`
                        : undefined,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>
      )}
      {current && (
        <div className={styles.controls}>
          <IconButton
            icon="up"
            label={t('previous')}
            disabled={size < 2}
            onClick={() => advance(-1)}
          />
          <span className={styles.counter} aria-live="polite">
            <b>{pad(front + 1)}</b> / {pad(size)}
          </span>
          <IconButton
            icon="down"
            label={t('next')}
            disabled={size < 2}
            onClick={() => advance(1)}
          />
          <ButtonLink
            href={eventHref(current)}
            variant="primary"
            withArrow
            aria-label={t('openLabel', { name: current.name, year: current.year })}
          >
            {t('open')}
          </ButtonLink>
        </div>
      )}
    </section>
  );
}
