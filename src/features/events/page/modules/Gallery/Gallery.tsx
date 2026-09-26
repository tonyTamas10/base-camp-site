import { getTranslations } from 'next-intl/server';

import { EventSection } from '../../EventSection';
import type { EventModuleProps } from '../types';
import styles from './Gallery.module.css';
import { GalleryTile } from './GalleryTile';

/** Mosaic spans for the six tiles, in order. */
const LAYOUT = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'] as const;
const VIDEO_TILE = 1;

export async function Gallery({ event }: EventModuleProps) {
  if (event.gallerySeeds.length === 0) return null;
  const t = await getTranslations('eventPage');

  return (
    <EventSection module="gallery" tone="midnight" eyebrow={t('eyebrow.gallery')}>
      <div className={styles.gallery}>
        {event.gallerySeeds.slice(0, LAYOUT.length).map((seed, i) => (
          <GalleryTile key={seed} seed={seed} className={styles[LAYOUT[i]!]}>
            {i === VIDEO_TILE && (
              <button
                type="button"
                className={styles.play}
                aria-label={t('gallery.playVideo')}
                disabled
              >
                <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M4 2l10 6-10 6z" fill="currentColor" />
                </svg>
              </button>
            )}
          </GalleryTile>
        ))}
      </div>
    </EventSection>
  );
}
