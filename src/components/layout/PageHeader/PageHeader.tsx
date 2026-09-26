import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/ui/Eyebrow';
import { SectionHeading } from '@/components/ui/Heading';

import styles from './PageHeader.module.css';

export interface PageHeaderProps {
  eyebrow: string;
  /** Rich text allowed so titles can break across lines. */
  title: ReactNode;
  lede?: ReactNode;
}

export function PageHeader({ eyebrow, title, lede }: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionHeading as="h1">{title}</SectionHeading>
      {lede && <p className={styles.lede}>{lede}</p>}
    </header>
  );
}
