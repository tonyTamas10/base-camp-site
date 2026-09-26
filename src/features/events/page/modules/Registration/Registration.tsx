import { getFormatter, getTranslations } from 'next-intl/server';

import { ButtonLink } from '@/components/ui/Button';
import { parseIsoDate } from '@/domain/dates';
import { isOpenForRegistration } from '@/domain/event';
import { dateFormats } from '@/lib/format/dates';

import { EventSection } from '../../EventSection';
import { registerHref } from '@/lib/routes';
import type { EventModuleProps } from '../types';
import styles from './Registration.module.css';

export async function Registration({ event, nextOpen }: EventModuleProps) {
  const [t, format] = await Promise.all([
    getTranslations('eventPage.registration'),
    getFormatter(),
  ]);
  const open = isOpenForRegistration(event);
  const target = open ? event : nextOpen;

  return (
    <EventSection module="registration">
      <div className={styles.band}>
        <div>
          <h2 className={styles.title}>{open ? t('open') : t('finished')}</h2>
          {!open && (
            <p className={styles.next}>
              {nextOpen
                ? t('next', {
                    name: nextOpen.name,
                    date: format.dateTime(parseIsoDate(nextOpen.date), dateFormats.full),
                  })
                : t('nextToBeAnnounced')}
            </p>
          )}
        </div>
        {target && (
          <ButtonLink href={registerHref(target)} variant="primary" withArrow>
            {t('register')}
          </ButtonLink>
        )}
      </div>
    </EventSection>
  );
}
