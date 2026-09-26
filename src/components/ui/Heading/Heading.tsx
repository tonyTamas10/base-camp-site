import type { ComponentProps } from 'react';

import { cx } from '@/lib/cx';

import styles from './Heading.module.css';

type HeadingLevel = 'h1' | 'h2' | 'h3';

export type SectionHeadingProps = ComponentProps<'h2'> & { as?: HeadingLevel };

/** The big condensed uppercase heading used for page and section titles. */
export function SectionHeading({ as: Tag = 'h2', className, ...props }: SectionHeadingProps) {
  return <Tag {...props} className={cx(styles.section, className)} />;
}
