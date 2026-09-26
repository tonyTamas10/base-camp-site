import { MAIN_CONTENT_ID } from '@/components/layout/SkipLink';

import styles from './layout.module.css';

/** Scrolling content pages: events, forms, the design system. */
export default function PagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id={MAIN_CONTENT_ID} className={styles.page}>
      {children}
    </main>
  );
}
