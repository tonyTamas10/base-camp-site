import type { ReactNode } from 'react';

import styles from './Disclosure.module.css';

/** Extra detail kept behind a click, so no screen feels full (design principle "Show, don't tell"). */
export function Disclosure({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <details className={styles.disclosure}>
      <summary className={styles.summary}>{summary}</summary>
      {children}
    </details>
  );
}
