'use client';

import { useEffect, useRef } from 'react';

import { useReveal } from '../../useReveal';
import styles from './Gallery.module.css';
import { paintPlaceholderPhoto } from './paintPlaceholderPhoto';

const MAX_PIXEL_RATIO = 1.5;

/** A placeholder photo tile, painted only when it comes near the viewport. */
export function GalleryTile({
  seed,
  className,
  children,
}: {
  seed: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const tileRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reveal = useReveal(tileRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const paint = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
      const width = canvas.clientWidth || 300;
      const height = canvas.clientHeight || 200;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.scale(ratio, ratio);
      paintPlaceholderPhoto(ctx, width, height, seed);
    };
    if (!('IntersectionObserver' in window)) return paint();
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        paint();
        observer.disconnect();
      },
      { rootMargin: '300px' },
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [seed]);

  return (
    <figure
      ref={tileRef}
      className={`${styles.tile} ${className ?? ''}`}
      data-reveal={reveal === 'static' ? undefined : reveal}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      {children}
    </figure>
  );
}
