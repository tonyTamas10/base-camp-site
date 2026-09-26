import type { Team } from '@/domain/competition';

import styles from './Crest.module.css';

/** A team's two-colour crest with its code. Decorative: the team name is always shown beside it. */
export function Crest({ team }: { team: Pick<Team, 'code' | 'crest'> }) {
  const [fill, ink] = team.crest;
  return (
    <span
      className={styles.crest}
      style={{ background: `linear-gradient(135deg, ${fill} 0 62%, ${ink} 62%)`, color: ink }}
      aria-hidden="true"
    >
      {team.code}
    </span>
  );
}
