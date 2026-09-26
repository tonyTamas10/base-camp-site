'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';

import styles from './DesignSystem.module.css';

/** Replays each motion curve side by side. */
export function MotionDemo({
  curves,
  label,
}: {
  curves: ReadonlyArray<readonly [name: string, body: string, spec: string, easing: string]>;
  label: string;
}) {
  const [run, setRun] = useState(0);
  return (
    <>
      <div className={styles.motionGrid}>
        {curves.map(([name, body, spec, easing]) => (
          <div key={name} className={styles.motionCard}>
            <b>{name}</b>
            <p>{body}</p>
            <code>{spec}</code>
            <div className={styles.track} aria-hidden="true">
              <i
                key={run}
                className={run > 0 ? styles.running : undefined}
                style={{ animationTimingFunction: easing }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className={styles.motionAction}>
        <Button variant="ghost" onClick={() => setRun((n) => n + 1)}>
          {label}
        </Button>
      </p>
    </>
  );
}
