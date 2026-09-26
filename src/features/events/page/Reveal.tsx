'use client';

import { useRef, type ComponentProps } from 'react';

import { useReveal } from './useReveal';

/**
 * Marks its element with `data-reveal="pending" | "shown"` as it scrolls into view. Styling is up
 * to the caller, e.g. `.table[data-reveal='pending'] tr { opacity: 0 }`.
 */
export function Reveal(props: ComponentProps<'div'>) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useReveal(ref);
  return <div {...props} ref={ref} data-reveal={state === 'static' ? undefined : state} />;
}
