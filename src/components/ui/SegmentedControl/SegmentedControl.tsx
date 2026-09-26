'use client';

import { cx } from '@/lib/cx';

import styles from './SegmentedControl.module.css';

export interface SegmentedControlProps<Value extends string> {
  label: string;
  options: ReadonlyArray<{ value: Value; label: string }>;
  value: Value;
  onChange: (value: Value) => void;
  className?: string;
}

/** A row of mutually exclusive toggle buttons, e.g. a filter. The selected one is signal orange. */
export function SegmentedControl<Value extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<Value>) {
  return (
    <div role="group" aria-label={label} className={cx(styles.group, className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={styles.option}
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
