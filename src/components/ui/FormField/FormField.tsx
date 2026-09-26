import { useId, type ComponentProps, type ReactNode } from 'react';

import { cx } from '@/lib/cx';

import styles from './FormField.module.css';

interface FieldFrameProps {
  label: string;
  /** Already-translated error message; when set, the control is marked invalid. */
  error?: string;
  hint?: string;
  className?: string;
}

/** Wires a label, hint and error to one control so assistive technology announces them together. */
function Field({
  label,
  error,
  hint,
  className,
  children,
}: FieldFrameProps & {
  children: (ids: { id: string; describedBy: string | undefined }) => ReactNode;
}) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {children({ id, describedBy })}
      <span id={errorId} className={styles.error} aria-live="polite">
        {error}
      </span>
    </div>
  );
}

export type TextFieldProps = FieldFrameProps & Omit<ComponentProps<'input'>, 'id' | 'className'>;

export function TextField({ label, error, hint, className, ...inputProps }: TextFieldProps) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {({ id, describedBy }) => (
        <input
          {...inputProps}
          id={id}
          className={styles.control}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      )}
    </Field>
  );
}

export type TextAreaFieldProps = FieldFrameProps &
  Omit<ComponentProps<'textarea'>, 'id' | 'className'>;

export function TextAreaField({ label, error, hint, className, ...props }: TextAreaFieldProps) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {({ id, describedBy }) => (
        <textarea
          {...props}
          id={id}
          className={cx(styles.control, styles.textarea)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
      )}
    </Field>
  );
}

export type SelectFieldProps = FieldFrameProps &
  Omit<ComponentProps<'select'>, 'id' | 'className'> & {
    options: ReadonlyArray<{ value: string; label: string }>;
  };

export function SelectField({
  label,
  error,
  hint,
  className,
  options,
  ...props
}: SelectFieldProps) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      {({ id, describedBy }) => (
        <select
          {...props}
          id={id}
          className={styles.control}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
