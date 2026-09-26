import type { ReactNode } from 'react';

import { Eyebrow } from '@/components/ui/Eyebrow';
import type { EventModuleType } from '@/domain/event';
import { cx } from '@/lib/cx';

import styles from './EventSection.module.css';

/** Section backgrounds alternate to pace the story: cobalt, light paper, deep midnight. */
export type SectionTone = 'cobalt' | 'paper' | 'midnight';

export interface EventSectionProps {
  module: EventModuleType;
  tone?: SectionTone;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

/** One module of the event page. Its id is the module name, so `#schedule` links to it. */
export function EventSection({
  module,
  tone = 'cobalt',
  eyebrow,
  children,
  className,
}: EventSectionProps) {
  return (
    <section
      id={module}
      className={cx(styles.section, styles[tone])}
      data-event-module={module}
      data-tone={tone}
    >
      <div className={cx(styles.inner, className)}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {children}
      </div>
    </section>
  );
}
