import { getTranslations } from 'next-intl/server';

import { EventSection } from '../../EventSection';
import type { EventModuleProps } from '../types';
import styles from './Story.module.css';

export async function Story({ event }: EventModuleProps) {
  const t = await getTranslations('eventPage');
  return (
    <EventSection module="story" tone="paper" eyebrow={t('eyebrow.story')}>
      <div className={styles.grid}>
        <p className={styles.pull}>
          {event.story.pullQuote} <span>{event.story.pullQuoteEmphasis}</span>
        </p>
        <p className={styles.body}>{event.story.body}</p>
      </div>
    </EventSection>
  );
}
