import { getFormatter, getTranslations } from 'next-intl/server';

import { parseIsoDate } from '@/domain/dates';
import { dateFormats } from '@/lib/format/dates';

import { EventSection } from '../../EventSection';
import { Reveal } from '../../Reveal';
import type { EventModuleProps } from '../types';
import styles from './Schedule.module.css';

export async function Schedule({ event }: EventModuleProps) {
  const [t, format] = await Promise.all([getTranslations('eventPage'), getFormatter()]);

  return (
    <EventSection module="schedule" tone="paper" eyebrow={t('eyebrow.schedule')}>
      <div className={styles.days}>
        {event.schedule.map((day) => (
          <div key={day.date}>
            <h3 className={styles.dayTitle}>
              {day.title}
              <small>{format.dateTime(parseIsoDate(day.date), dateFormats.weekday)}</small>
            </h3>
            <Reveal className={styles.slots}>
              <ol>
                {day.slots.map((slot) => (
                  <li key={`${slot.time}-${slot.title}`} className={styles.slot}>
                    <time className={styles.time}>{slot.time}</time>
                    <span className={styles.title}>{slot.title}</span>
                    <span className={styles.detail}>{slot.detail}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        ))}
      </div>
    </EventSection>
  );
}
