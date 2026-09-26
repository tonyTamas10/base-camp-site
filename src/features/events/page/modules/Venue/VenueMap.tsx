import type { SportKind } from '@/domain/sport';
import { createRng } from '@/lib/random';
import { colors } from '@/styles/tokens';

/** Street-grid placeholder map with the venue marked. Illustrative only, never to scale. */
export function VenueMap({
  seed,
  kind,
  label,
  note,
}: {
  seed: string;
  kind: SportKind;
  label: string;
  note: string;
}) {
  const rng = createRng(`m${seed}`);
  const streets = [
    ...Array.from({ length: 14 }, () => {
      const y = rng() * 300;
      return {
        d: `M-10 ${y.toFixed(0)} L410 ${(y + (rng() - 0.5) * 80).toFixed(0)}`,
        w: 2 + rng() * 6,
      };
    }),
    ...Array.from({ length: 10 }, () => {
      const x = rng() * 400;
      return {
        d: `M${x.toFixed(0)} -10 L${(x + (rng() - 0.5) * 90).toFixed(0)} 310`,
        w: 2 + rng() * 5,
      };
    }),
  ];

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label}>
      <rect width="400" height="300" fill="#E6E9F3" />
      {streets.map((street, i) => (
        <path key={i} d={street.d} stroke="#fff" strokeWidth={street.w} />
      ))}
      <path
        d="M-10 250 C 90 210, 160 280, 260 230 S 380 200, 420 215"
        fill="none"
        stroke="#B8C6F5"
        strokeWidth="16"
      />
      <g transform="translate(210 140) rotate(-12)">
        {kind === 'team' ? (
          <>
            <rect x="-34" y="-22" width="68" height="44" rx="3" fill={colors.cobalt} />
            <line x1="0" y1="-22" x2="0" y2="22" stroke="#fff" strokeWidth="1.5" />
            <circle r="8" fill="none" stroke="#fff" strokeWidth="1.5" />
          </>
        ) : (
          <>
            <rect x="-44" y="-26" width="88" height="52" rx="26" fill={colors.cobalt} />
            <rect
              x="-30"
              y="-12"
              width="60"
              height="24"
              rx="12"
              fill={colors.accentMint}
              opacity="0.6"
            />
          </>
        )}
      </g>
      <circle
        cx="210"
        cy="140"
        r="60"
        fill="none"
        stroke={colors.signal}
        strokeWidth="1.5"
        strokeDasharray="4 5"
      />
      <text
        x="16"
        y="286"
        fontSize="10"
        fill={colors.slate}
        style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
      >
        {note}
      </text>
    </svg>
  );
}
