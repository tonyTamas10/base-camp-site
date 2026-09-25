import type { ComponentProps } from 'react';

import { cx } from '@/lib/cx';

import styles from './Tag.module.css';

export type TagTone = 'default' | 'signal' | 'inverted';

export type TagProps = ComponentProps<'span'> & {
  /** `signal` for upcoming/active states, `inverted` for "happening now". */
  tone?: TagTone;
};

/** A small uppercase status label, e.g. "Upcoming" or "This week". */
export function Tag({ tone = 'default', className, ...spanProps }: TagProps) {
  return <span {...spanProps} className={cx(styles.tag, styles[tone], className)} />;
}
