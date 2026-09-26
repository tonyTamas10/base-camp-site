import Image from 'next/image';
import type { ReactNode } from 'react';

import type { Partner } from '@/domain/partner';
import { colors } from '@/styles/tokens';

import styles from './PartnerMark.module.css';

export interface PartnerMarkProps {
  partner: Partner;
  /** Mark colour; placeholder marks are drawn in it. */
  color: string;
  /** Height a square mark would have; wider marks get shorter so they carry the same visual weight. */
  baseHeight?: number;
}

/** Scales marks by aspect ratio so a wordmark and a square icon look equally prominent. */
export function opticalSize(width: number, height: number, baseHeight: number) {
  const aspect = width / height;
  const scaledHeight = Math.round(baseHeight * Math.pow(aspect, -0.32));
  return { width: Math.round(scaledHeight * aspect), height: scaledHeight };
}

export function PartnerMark({ partner, color, baseHeight = 34 }: PartnerMarkProps) {
  if (partner.logo.kind === 'image') {
    const size = opticalSize(partner.logo.width, partner.logo.height, baseHeight);
    return (
      <span className={styles.mark}>
        <Image src={partner.logo.url} alt={partner.name} {...size} />
      </span>
    );
  }

  const placeholder = PLACEHOLDER_MARKS[partner.logo.variant % PLACEHOLDER_MARKS.length]!;
  const size = opticalSize(placeholder.width, placeholder.height, baseHeight);
  return (
    <span className={styles.mark} role="img" aria-label={partner.name}>
      <svg
        {...size}
        viewBox={`0 0 ${placeholder.width} ${placeholder.height}`}
        aria-hidden="true"
        focusable="false"
      >
        {placeholder.draw(color)}
      </svg>
    </span>
  );
}

const font = (family: 'display' | 'body' | 'mono', weight: number, italic = false) => ({
  fontFamily: `var(--font-${family})`,
  fontWeight: weight,
  fontStyle: italic ? 'italic' : 'normal',
});

/** Fictional marks for the sample data. Never shown once real partners are in the CMS. */
const PLACEHOLDER_MARKS: Array<{ width: number; height: number; draw: (c: string) => ReactNode }> =
  [
    {
      width: 40,
      height: 40,
      draw: (c) => (
        <>
          <circle cx="20" cy="20" r="18" fill="none" stroke={c} strokeWidth="3" />
          <text
            x="20"
            y="28"
            textAnchor="middle"
            fontSize="22"
            fill={c}
            style={font('display', 900)}
          >
            A
          </text>
        </>
      ),
    },
    {
      width: 210,
      height: 40,
      draw: (c) => (
        <text
          x="0"
          y="31"
          fontSize="32"
          textLength="205"
          lengthAdjust="spacingAndGlyphs"
          fill={c}
          style={{ ...font('display', 800), letterSpacing: '0.06em' }}
        >
          PARTNER B
        </text>
      ),
    },
    {
      width: 130,
      height: 40,
      draw: (c) => (
        <>
          <rect x="0" y="4" width="32" height="32" fill={c} />
          <text
            x="40"
            y="28"
            fontSize="20"
            textLength="88"
            lengthAdjust="spacingAndGlyphs"
            fill={c}
            style={font('body', 700)}
          >
            Partner C
          </text>
        </>
      ),
    },
    {
      width: 60,
      height: 40,
      draw: (c) => <path d="M4 36 L22 4 L30 4 L12 36Z M26 36 L44 4 L52 4 L34 36Z" fill={c} />,
    },
    {
      width: 170,
      height: 40,
      draw: (c) => (
        <>
          <path d="M2 34 L18 6 L34 34Z" fill="none" stroke={c} strokeWidth="3" />
          <text x="44" y="29" fontSize="22" fill={c} style={font('mono', 500)}>
            partner_e
          </text>
        </>
      ),
    },
    {
      width: 40,
      height: 40,
      draw: (c) => (
        <>
          <path d="M20 2 L37 11 L37 29 L20 38 L3 29 L3 11Z" fill={c} />
          <text
            x="20"
            y="27"
            textAnchor="middle"
            fontSize="18"
            fill={colors.cobalt}
            style={font('display', 900)}
          >
            F
          </text>
        </>
      ),
    },
    {
      width: 180,
      height: 40,
      draw: (c) => (
        <text x="0" y="30" fontSize="30" fill={c} style={font('body', 400, true)}>
          partner g
        </text>
      ),
    },
    {
      width: 90,
      height: 40,
      draw: (c) => (
        <>
          <rect x="0" y="6" width="6" height="28" fill={c} />
          <rect x="10" y="12" width="6" height="22" fill={c} />
          <rect x="20" y="2" width="6" height="32" fill={c} />
          <text x="34" y="30" fontSize="24" fill={c} style={font('display', 800)}>
            H/Q
          </text>
        </>
      ),
    },
  ];
