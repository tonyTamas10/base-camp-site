import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

import { EventSection } from '../../EventSection';
import type { EventModuleProps } from '../types';
import styles from './Gallery.module.css';
import { GalleryTile } from './GalleryTile';

/** Mosaic spans for the six tiles, in order. */
const LAYOUT = ['g1', 'g2', 'g3', 'g4', 'g5', 'g6'] as const;

export async function Gallery({ event }: EventModuleProps) {
  if (event.gallery.length === 0) return null;
  const t = await getTranslations('eventPage');

  return (
    <EventSection module="gallery" tone="midnight" eyebrow={t('eyebrow.gallery')}>
      <div className={styles.gallery}>
        {event.gallery.slice(0, LAYOUT.length).map((item, i) => {
          const span = styles[LAYOUT[i]!];
          return item.kind === 'image' ? (
            <figure key={item.url} className={`${styles.tile} ${span}`}>
              <Image
                src={item.url}
                alt={item.alt}
                fill
                sizes="(width < 900px) 100vw, 50vw"
                className={styles.photo}
              />
            </figure>
          ) : (
            <GalleryTile key={item.seed} seed={item.seed} className={span} />
          );
        })}
      </div>
    </EventSection>
  );
}
