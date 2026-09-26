'use client';

import { useEffect, useState, type RefObject } from 'react';

import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

/**
 * - `static`: never animated (server render, above the fold, reduced motion, no observer).
 * - `pending`: below the fold, waiting to enter view.
 * - `shown`: entered view; the reveal animation runs.
 */
export type RevealState = 'static' | 'pending' | 'shown';

/** Elements starting further down than this share of the viewport are armed for reveal. */
const ARM_BELOW = 0.9;

/**
 * Content is visible by default and only below-the-fold elements are hidden for a reveal, so
 * nothing is lost without JavaScript or with reduced motion (design principle "Nothing hidden").
 */
export function useReveal(ref: RefObject<HTMLElement | null>): RevealState {
  const reducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<RevealState>('static');

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion || !('IntersectionObserver' in window)) return;
    if (element.getBoundingClientRect().top <= window.innerHeight * ARM_BELOW) return;

    setState('pending');
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setState('shown');
        observer.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, reducedMotion]);

  // Reduced motion can switch on after hydration (the server can't know it): never leave content hidden.
  return reducedMotion ? 'static' : state;
}
