'use client';

import { useEffect, useState } from 'react';

import { cx } from '@/lib/cx';

import styles from './ProgressRail.module.css';

export interface RailSection {
  id: string;
  label: string;
}

/** Share of the viewport height a section's top must pass to count as the current one. */
const ACTIVE_LINE = 0.45;

/**
 * The Loop marks where you are in the event's story: a rail of section markers on wide screens,
 * a thin progress line at the top on narrower ones. Uses native scrolling only.
 */
export function ProgressRail({ sections, label }: { sections: RailSection[]; label: string }) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [onPaper, setOnPaper] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);

      let current: string | null = null;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top < window.innerHeight * ACTIVE_LINE) {
          current = section.id;
        }
      }
      setActive(current);

      // The rail switches to ink when it sits over a light "paper" section.
      const behind = document
        .elementsFromPoint(window.innerWidth - 30, window.innerHeight / 2)
        .find((element) => element instanceof HTMLElement && element.dataset.tone);
      setOnPaper(behind instanceof HTMLElement && behind.dataset.tone === 'paper');
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sections]);

  const percent = `${(progress * 100).toFixed(1)}%`;

  return (
    <>
      <div className={styles.topProgress} style={{ width: percent }} aria-hidden="true" />
      <nav className={cx(styles.rail, onPaper && styles.onPaper)} aria-label={label}>
        <span className={styles.line} aria-hidden="true" />
        <span className={styles.fill} style={{ height: percent }} aria-hidden="true" />
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={cx(styles.marker, active === section.id && styles.active)}
            aria-current={active === section.id ? 'location' : undefined}
          >
            <span>{section.label}</span>
            <i aria-hidden="true" />
          </a>
        ))}
      </nav>
    </>
  );
}
