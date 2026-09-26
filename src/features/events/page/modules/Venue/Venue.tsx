import { getTranslations } from 'next-intl/server';

import { SectionHeading } from '@/components/ui/Heading';

import { EventSection } from '../../EventSection';
import type { EventModuleProps } from '../types';
import styles from './Venue.module.css';
import { VenueMap } from './VenueMap';

export async function Venue({ event }: EventModuleProps) {
  const t = await getTranslations('eventPage');
  return (
    <EventSection module="venue" tone="paper" eyebrow={t('eyebrow.venue')}>
      <div className={styles.venue}>
        <div className={styles.map}>
          <VenueMap
            seed={event.id}
            kind={event.competition.kind}
            label={t('venue.mapLabel', { venue: event.venue })}
            note={t('venue.mapNote')}
          />
        </div>
        <div>
          <SectionHeading className={styles.name}>{event.venue}</SectionHeading>
          <dl className={styles.facts}>
            <div>
              <dt>{t('venue.city')}</dt>
              <dd>{event.city}</dd>
            </div>
            <div>
              <dt>{t('venue.surface')}</dt>
              <dd>{event.venueSurface}</dd>
            </div>
          </dl>
        </div>
      </div>
    </EventSection>
  );
}
