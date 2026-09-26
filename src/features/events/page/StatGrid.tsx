import type { ReactNode } from 'react';

import { cx } from '@/lib/cx';

import styles from './StatGrid.module.css';

export interface StatItem {
  label: string;
  value: ReactNode;
  /** The one key number of the view, in signal orange. */
  highlight?: boolean;
}

/** A row of big numbers with small labels: "By the numbers", "Records". */
export function StatGrid({ items }: { items: StatItem[] }) {
  return (
    <dl className={styles.stats}>
      {items.map((item) => (
        <div key={item.label} className={cx(styles.stat, item.highlight && styles.highlight)}>
          <dt className={styles.label}>{item.label}</dt>
          <dd className={styles.value}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
