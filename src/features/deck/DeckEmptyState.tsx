import type { ReactNode } from 'react';

import styles from './DeckEmptyState.module.css';

export interface DeckEmptyStateProps {
  /** Short mark inside the dashed ring, e.g. "0" or "+". */
  symbol: string;
  title: string;
  body: string;
  actions?: ReactNode;
}

export function DeckEmptyState({ symbol, title, body, actions }: DeckEmptyStateProps) {
  return (
    <div className={styles.empty}>
      <div className={styles.ring} aria-hidden="true">
        {symbol}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.body}>{body}</p>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
