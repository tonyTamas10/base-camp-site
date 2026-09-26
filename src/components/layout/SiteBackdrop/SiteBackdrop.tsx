import { AmbientCanvas } from './AmbientCanvas';
import styles from './SiteBackdrop.module.css';

/** The environment every page lives in: cobalt field, ambient track, film grain. */
export function SiteBackdrop() {
  return (
    <>
      <div className={styles.environment} aria-hidden="true" />
      <AmbientCanvas />
      <div className={styles.grain} aria-hidden="true" />
    </>
  );
}
