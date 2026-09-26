'use client';

import { useEffect, useRef } from 'react';

import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

import { drawAmbientScene } from './ambientScene';
import styles from './SiteBackdrop.module.css';

const FRAME_INTERVAL_MS = 33; // ~30fps is plenty for slow ambient motion.
const MAX_PIXEL_RATIO = 1.5;

/** Animated background. Pauses while the tab is hidden; one still frame under reduced motion. */
export function AmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const startedAt = performance.now();
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastDrawnAt = 0;

    const draw = (now: number) => drawAmbientScene(ctx, width, height, (now - startedAt) / 1000);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(performance.now());
    };

    const tick = (now: number) => {
      frame = 0;
      if (document.hidden) return;
      if (now - lastDrawnAt > FRAME_INTERVAL_MS) {
        lastDrawnAt = now;
        draw(now);
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!reducedMotion && !frame && !document.hidden) frame = requestAnimationFrame(tick);
    };

    resize();
    start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', start);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', start);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
