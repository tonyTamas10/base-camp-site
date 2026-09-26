'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

import { DialController } from './DialController';
import {
  computeDialTarget,
  LABEL_SPACE,
  MOBILE_BREAKPOINT,
  type DialVariant,
} from './dialGeometry';
import { useLoop } from './LoopProvider';
import { useSportLabel } from './useSportLabel';
import styles from './YearDial.module.css';

const viewport = () => ({ width: window.innerWidth, height: window.innerHeight });

/**
 * Computes the dial's shape for the current viewport and publishes `--loop-clearance`: the
 * vertical space the dial occupies, which the deck and hub keep clear of.
 */
function targetFor(variant: DialVariant) {
  const size = viewport();
  const target = computeDialTarget(size, variant);
  const gap = size.width < MOBILE_BREAKPOINT ? 6 : 10;
  const clearance = size.height - target.baseline + target.capHeight + LABEL_SPACE + gap;
  document.documentElement.style.setProperty('--loop-clearance', `${Math.round(clearance)}px`);
  return target;
}

/** How far (in years) the dial spins in from when arriving on the events hub. */
const ARRIVAL_GLIDE = -1.4;

/**
 * The Base Camp Loop: years on a very wide dial. Drag, scroll, tap a year or use the arrow keys.
 * Exposed to assistive technology as a slider whose value is the year and its event count.
 */
export function YearDial() {
  const t = useTranslations('loop');
  const loop = useLoop();
  const { years, counts, variant, year, setYear, setDeckOpen, dialRef, deckRef, ready } = loop;
  const sportLabel = useSportLabel();
  const reducedMotion = usePrefersReducedMotion();

  const sliderRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const hitAreaRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<DialController | null>(null);

  const [focusedYear, setFocusedYear] = useState(year);
  const [announcement, setAnnouncement] = useState('');

  const countFor = (forYear: number) => counts[years.indexOf(forYear)] ?? 0;

  const variantRef = useRef(variant);

  // Effect events always see the latest props and state, so the controller is created only once.
  const onSettle = useEffectEvent((settledYear: number) => {
    setYear(settledYear);
    setAnnouncement(t('announcement', { year: settledYear, count: countFor(settledYear) }));
  });
  const onSelectionChange = useEffectEvent((selected: number) => setFocusedYear(selected));
  const onActivate = useEffectEvent(() => {
    if (variant === 'events') deckRef.current?.focus();
    else if (countFor(controllerRef.current?.year ?? year) > 0) setDeckOpen(true);
  });
  const onFocusModeChange = useEffectEvent((active: boolean) => {
    if (active) document.documentElement.setAttribute('data-loop-focus', '');
    else document.documentElement.removeAttribute('data-loop-focus');
  });

  useEffect(() => {
    const controller = new DialController(
      {
        slider: sliderRef.current!,
        band: bandRef.current!,
        canvas: canvasRef.current!,
        labels: labelsRef.current!,
        hitArea: hitAreaRef.current!,
      },
      {
        label: styles.label!,
        year: styles.year!,
        count: styles.count!,
        empty: styles.empty!,
        selected: styles.selected!,
        dragging: styles.dragging!,
      },
      {
        onSettle: (y) => onSettle(y),
        onSelectionChange: (y) => onSelectionChange(y),
        onActivate: () => onActivate(),
        onFocusModeChange: (active) => onFocusModeChange(active),
      },
      { target: targetFor(variant), index: Math.max(0, years.indexOf(year)) },
    );
    controllerRef.current = controller;
    dialRef.current = {
      goToYear: (y, instant) => controller.goToYear(y, instant),
      nearestYearWithEvents: () => controller.nearestYearWithEvents(),
      focus: () => sliderRef.current?.focus(),
    };

    const onResize = () => controller.setTarget(targetFor(variantRef.current), true);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      controller.destroy();
      controllerRef.current = null;
      dialRef.current = null;
    };
    // Created once per mount; later changes flow in through the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const previous = variantRef.current;
    variantRef.current = variant;
    const controller = controllerRef.current;
    if (!controller || previous === variant) return;
    controller.setTarget(targetFor(variant));
    if (variant === 'events') controller.glide(ARRIVAL_GLIDE);
  }, [variant]);

  useEffect(() => {
    controllerRef.current?.setData(years, counts, (count) => t('eventCount', { count }));
  }, [years, counts, t]);

  useEffect(() => {
    controllerRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  return (
    <div
      ref={sliderRef}
      className={styles.loop}
      role="slider"
      tabIndex={0}
      aria-label={t('label')}
      aria-valuemin={years[0]}
      aria-valuemax={years.at(-1)}
      aria-valuenow={focusedYear}
      aria-valuetext={t('valueText', {
        year: focusedYear,
        count: countFor(focusedYear),
        sport: sportLabel,
      })}
      data-ready={ready || undefined}
    >
      <div ref={bandRef} className={styles.band}>
        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
        <div ref={labelsRef} className={styles.labels} aria-hidden="true" />
        <div ref={hitAreaRef} className={styles.hitArea} />
      </div>
      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
