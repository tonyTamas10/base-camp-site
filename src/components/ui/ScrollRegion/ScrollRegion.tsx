import type { ReactNode } from 'react';

import { cx } from '@/lib/cx';

import styles from './ScrollRegion.module.css';

/**
 * A horizontally scrollable area (e.g. a wide table on phones). Content that scrolls must be
 * reachable by keyboard, so the region is focusable and labelled (WCAG 2.1.1).
 */
export function ScrollRegion({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div role="region" aria-label={label} tabIndex={0} className={cx(styles.region, className)}>
      {children}
    </div>
  );
}
