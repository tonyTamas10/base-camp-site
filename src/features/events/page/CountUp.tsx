'use client';

import { useEffect, useRef, useState } from 'react';

import { useReveal } from './useReveal';

const DURATION_MS = 1100;
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/** A number that counts up once when it first scrolls into view; renders the final value otherwise. */
export function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reveal = useReveal(ref);
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    if (reveal !== 'shown') return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      setShown(value * easeOutQuart(progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [reveal, value]);

  const current = reveal === 'pending' ? 0 : reveal === 'shown' ? (shown ?? 0) : value;
  return (
    <span ref={ref}>
      <span aria-hidden="true">{current.toFixed(decimals)}</span>
      <span className="sr-only">{value.toFixed(decimals)}</span>
    </span>
  );
}
