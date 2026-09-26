import { colors } from '@/styles/tokens';

const white = (alpha: number) => `rgb(247 247 242 / ${Math.round(alpha * 100)}%)`;

/** One storyboard frame of the Home → Events transition, drawn as a tiny wireframe. */
export function KeyFrameSketch({ step }: { step: number }) {
  const radius = [24, 24, 30, 36, 36, 36, 36][step] ?? 36;
  const centerY = [100, 100, 100, 84, 84, 84, 84][step] ?? 84;
  const rotation = step === 4 ? -14 : 0;
  const centerX = 80;

  const ticks = [-3, -2, -1, 0, 1, 2, 3].flatMap((i) => {
    const degrees = i * 36 + rotation;
    if (Math.abs(degrees) > 95) return [];
    const a = (degrees * Math.PI) / 180;
    const selected = i === 0 && !rotation;
    return [
      <line
        key={i}
        x1={centerX + Math.sin(a) * radius}
        y1={centerY - Math.cos(a) * radius}
        x2={centerX + Math.sin(a) * (radius - 5)}
        y2={centerY - Math.cos(a) * (radius - 5)}
        stroke={selected ? colors.signal : white(0.8)}
        strokeWidth={selected ? 2 : 1}
      />,
    ];
  });

  return (
    <svg viewBox="0 0 160 100" width="100%" height="100%" aria-hidden="true">
      <line x1="5" y1="10" x2="5" y2="90" stroke={white(0.3)} />
      {step < 2 && (
        <>
          <rect x="18" y="22" width="60" height="16" fill={white(step ? 0.3 : 0.9)} />
          <rect x="18" y="42" width="40" height="4" fill={white(step ? 0.2 : 0.5)} />
        </>
      )}
      <path
        d={`M${centerX - radius} ${centerY} A${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
        fill="none"
        stroke={white(step === 1 ? 1 : 0.7)}
        strokeWidth="1.5"
      />
      <path
        d={`M${centerX - radius + 6} ${centerY} A${radius - 6} ${radius - 6} 0 0 1 ${centerX + radius - 6} ${centerY}`}
        fill="none"
        stroke={white(0.2)}
      />
      {ticks}
      {step >= 5 &&
        [0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={34 + i * 19}
            y="89"
            width="15"
            height="6"
            rx="3"
            fill={i === 0 ? colors.warmWhite : white(0.3)}
          />
        ))}
      {step >= 6 &&
        [2, 1, 0].map((depth) => (
          <rect
            key={depth}
            x={70 + depth}
            y={16 - depth * 3}
            width={20 - depth * 2}
            height="30"
            rx="2"
            fill={depth ? colors.fieldLow : colors.midnight}
            stroke={depth ? 'none' : colors.signal}
          />
        ))}
    </svg>
  );
}
