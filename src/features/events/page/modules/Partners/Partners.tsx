import { getTranslations } from 'next-intl/server';

import { PartnerMark } from '@/features/sponsors';
import { colors } from '@/styles/tokens';

import { EventSection } from '../../EventSection';
import type { EventModuleProps } from '../types';
import styles from './Partners.module.css';

export async function Partners({ event }: EventModuleProps) {
  if (event.partners.length === 0) return null;
  const t = await getTranslations('eventPage');
  return (
    <EventSection module="partners" tone="paper" eyebrow={t('eyebrow.partners')}>
      <ul className={styles.partners}>
        {event.partners.map((partner) => (
          <li key={partner.id}>
            <PartnerMark partner={partner} color={colors.ink} baseHeight={40} />
          </li>
        ))}
      </ul>
    </EventSection>
  );
}
