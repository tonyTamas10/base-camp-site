import type { ComponentProps } from 'react';

import { cx } from '@/lib/cx';

import styles from './Eyebrow.module.css';

/** Small mono label above a heading, led by a short signal-orange rule. */
export function Eyebrow({ className, ...props }: ComponentProps<'p'>) {
  return <p {...props} className={cx(styles.eyebrow, className)} />;
}
