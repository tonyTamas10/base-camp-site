import { cx } from '@/lib/cx';

import styles from './ParticipantCount.module.css';

export interface ParticipantCountProps {
  count: number;
  /** Full text for assistive technology, e.g. "64 participants". */
  label: string;
  className?: string;
}

/** A person icon and a number. Screen readers hear the full label instead. */
export function ParticipantCount({ count, label, className }: ParticipantCountProps) {
  return (
    <span className={cx(styles.count, className)}>
      <span aria-hidden="true">{count}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
