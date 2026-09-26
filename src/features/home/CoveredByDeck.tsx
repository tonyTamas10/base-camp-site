'use client';

import type { ReactNode } from 'react';

import { useLoop } from '@/features/loop';

import styles from './CoveredByDeck.module.css';

/**
 * Home content that sits behind the deck. While the deck is open it is only a dimmed backdrop,
 * so it becomes inert: not focusable and hidden from assistive technology.
 */
export function CoveredByDeck({ children }: { children: ReactNode }) {
  const { deckOpen } = useLoop();
  return (
    <div className={styles.contents} inert={deckOpen}>
      {children}
    </div>
  );
}
