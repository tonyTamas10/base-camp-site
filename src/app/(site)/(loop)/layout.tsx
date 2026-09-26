import { MAIN_CONTENT_ID } from '@/components/layout/SkipLink';
import { LoopProvider, YearDial } from '@/features/loop';
import { getDefaultSeasonYear, getEventSummaries, getSeasonYears, getSports } from '@/lib/data';

import styles from './layout.module.css';

/**
 * Home and the events hub share this layout, so the Loop dial stays mounted while moving between
 * them: "one evolving space" (ADR 0010).
 */
export default async function LoopLayout({ children }: { children: React.ReactNode }) {
  const [years, sports, events, defaultYear] = await Promise.all([
    getSeasonYears(),
    getSports(),
    getEventSummaries(),
    getDefaultSeasonYear(),
  ]);

  return (
    <LoopProvider years={years} sports={sports} events={events} defaultYear={defaultYear}>
      <main id={MAIN_CONTENT_ID} className={styles.stage}>
        {children}
      </main>
      <YearDial />
    </LoopProvider>
  );
}
