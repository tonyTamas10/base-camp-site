import type { ComponentProps } from 'react';

import { cx } from '@/lib/cx';

import { Icon, type IconName } from '../Icon';
import styles from './IconButton.module.css';

export type IconButtonProps = Omit<ComponentProps<'button'>, 'children'> & {
  icon: IconName;
  /** Required: icon-only buttons need an accessible name. */
  label: string;
  size?: 'regular' | 'small';
};

export function IconButton({
  icon,
  label,
  size = 'regular',
  className,
  type = 'button',
  ...buttonProps
}: IconButtonProps) {
  return (
    <button
      {...buttonProps}
      type={type}
      aria-label={label}
      className={cx(styles.button, styles[size], className)}
    >
      <Icon name={icon} size={size === 'small' ? 14 : 18} />
    </button>
  );
}
