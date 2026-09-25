import Link, { type LinkProps } from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { cx } from '@/lib/cx';

import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonStyleProps {
  /** `primary` is signal orange: use it for the one main action in a view. */
  variant?: ButtonVariant;
  /** Adds a trailing arrow that nudges forward on hover. */
  withArrow?: boolean;
  className?: string;
  children: ReactNode;
}

function ButtonContent({ withArrow, children }: Pick<ButtonStyleProps, 'withArrow' | 'children'>) {
  return (
    <>
      {children}
      {withArrow && (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      )}
    </>
  );
}

export type ButtonProps = ButtonStyleProps &
  Omit<ComponentProps<'button'>, keyof ButtonStyleProps> & {
    /** Disables the button and shows a spinner while an action is in progress. */
    isLoading?: boolean;
  };

export function Button({
  variant = 'secondary',
  withArrow = false,
  isLoading = false,
  className,
  children,
  disabled,
  type = 'button',
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      data-loading={isLoading || undefined}
      className={cx(styles.button, styles[variant], className)}
    >
      <ButtonContent withArrow={withArrow}>{children}</ButtonContent>
    </button>
  );
}

export type ButtonLinkProps<Href extends string> = ButtonStyleProps &
  LinkProps<Href> &
  Omit<ComponentProps<'a'>, keyof LinkProps<Href> | keyof ButtonStyleProps>;

/** A link that looks like a button. Use it for navigation; use `Button` for actions. */
export function ButtonLink<Href extends string>({
  variant = 'secondary',
  withArrow = false,
  className,
  children,
  ...linkProps
}: ButtonLinkProps<Href>) {
  return (
    <Link {...linkProps} className={cx(styles.button, styles[variant], className)}>
      <ButtonContent withArrow={withArrow}>{children}</ButtonContent>
    </Link>
  );
}
