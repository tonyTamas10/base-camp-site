import type { Partner } from '@/domain/partner';
import { colors } from '@/styles/tokens';

import { PartnerMark } from './PartnerMark';
import styles from './SponsorRibbon.module.css';

export interface SponsorRibbonProps {
  partners: Partner[];
  label: string;
}

/**
 * A slow, endless band of partner marks. The set is rendered twice so the loop is seamless;
 * the copy is hidden from assistive technology. Pauses on hover and focus, and stops under
 * reduced motion.
 */
export function SponsorRibbon({ partners, label }: SponsorRibbonProps) {
  const marks = partners.map((partner) => (
    <PartnerMark key={partner.id} partner={partner} color={colors.warmWhite} />
  ));

  return (
    <section className={styles.ribbon} aria-label={label}>
      <div className={styles.track}>
        <div className={styles.set}>{marks}</div>
        <div className={styles.set} aria-hidden="true">
          {marks}
        </div>
      </div>
    </section>
  );
}
