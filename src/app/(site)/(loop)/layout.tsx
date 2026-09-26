import { MAIN_CONTENT_ID } from '@/components/layout/SkipLink';

import styles from './layout.module.css';

/**
 * Home and the events hub share this layout, so the Loop dial and the deck stay mounted while
 * moving between them: "one evolving space" (ADR 0010).
 */
export default function LoopLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id={MAIN_CONTENT_ID} className={styles.stage}>
      {children}
    </main>
  );
}
