import type { EventSummary } from '@/domain/event';
import type { PosterGeometry } from '@/domain/sport';
import { cx } from '@/lib/cx';

import styles from './Poster.module.css';
import { designPoster } from './posterDesign';

export interface PosterProps {
  event: Pick<EventSummary, 'id' | 'name' | 'year' | 'accent'>;
  /** The sport's field motif; unknown sports get a neutral placeholder. */
  geometry: PosterGeometry | undefined;
  className?: string;
}

const displayFont = (weight: number) => ({ fontFamily: 'var(--font-display)', fontWeight: weight });

/** Procedural event poster. Decorative: the event's name is always given as text nearby. */
export function Poster({ event, geometry, className }: PosterProps) {
  const design = designPoster(event);
  const { background, ink, accent, rotation, shape } = design;

  return (
    <svg
      className={cx(styles.poster, className)}
      viewBox="0 0 300 420"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="300" height="420" fill={background} />
      <SportGeometry geometry={geometry} ink={ink} accent={accent} rotation={rotation} />
      {shape.kind === 'circle' ? (
        <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={accent} />
      ) : (
        <rect
          x="-10"
          y={shape.y}
          width="340"
          height={shape.height}
          fill={accent}
          transform={`rotate(${shape.rotation} 150 210)`}
        />
      )}
      {design.titleLines.map((line, i) => (
        <text
          key={i}
          x="20"
          y={58 + i * 40}
          fontSize="44"
          fill={ink}
          style={{ ...displayFont(900), letterSpacing: '0.01em' }}
        >
          {line}
        </text>
      ))}
      <text
        x="-6"
        y="432"
        fontSize="150"
        fill="none"
        stroke={ink}
        strokeWidth="1.6"
        style={displayFont(900)}
      >
        {event.year}
      </text>
    </svg>
  );
}

interface GeometryProps {
  geometry: PosterGeometry | undefined;
  ink: string;
  accent: string;
  rotation: number;
}

function SportGeometry({ geometry, ink, accent, rotation }: GeometryProps) {
  const line = { stroke: ink, fill: 'none' };

  switch (geometry) {
    case 'mini-pitch':
      return (
        <g transform={`rotate(${rotation} 150 210)`} {...line} strokeWidth="2" opacity="0.55">
          <rect x="20" y="30" width="260" height="380" rx="6" />
          <line x1="20" y1="220" x2="280" y2="220" />
          <circle cx="150" cy="220" r="46" />
          <rect x="85" y="30" width="130" height="60" />
          <rect x="85" y="350" width="130" height="60" />
          <circle cx="150" cy="220" r="3" fill={ink} />
        </g>
      );
    case 'pitch':
      return (
        <g
          transform={`rotate(${rotation} 150 210) scale(1.35) translate(-40 -60)`}
          {...line}
          strokeWidth="1.6"
          opacity="0.5"
        >
          <rect x="10" y="20" width="280" height="420" />
          <line x1="10" y1="230" x2="290" y2="230" />
          <circle cx="150" cy="230" r="54" />
          <rect x="60" y="20" width="180" height="80" />
          <rect x="110" y="20" width="80" height="30" />
          <path d="M110 100 A40 40 0 0 0 190 100" />
        </g>
      );
    case 'oval':
      return (
        <g transform={`rotate(${rotation} 300 200)`} {...line} strokeWidth="1.5" opacity="0.55">
          {Array.from({ length: 8 }, (_, k) => {
            const inset = k * 13;
            return (
              <rect
                key={k}
                x={120 + inset}
                y={-60 + inset}
                width={420 - inset * 2}
                height={520 - inset * 2}
                rx={200 - inset}
              />
            );
          })}
        </g>
      );
    case 'lanes':
      return (
        <>
          <g {...line} strokeWidth="1.5" opacity="0.55">
            {Array.from({ length: 9 }, (_, k) => (
              <line key={k} x1={-20 + k * 42} y1="-20" x2={40 + k * 42} y2="460" />
            ))}
            {Array.from({ length: 8 }, (_, k) => (
              <text
                key={k}
                x={6 + k * 42}
                y="400"
                fontSize="22"
                fill={ink}
                stroke="none"
                style={displayFont(800)}
              >
                {k + 1}
              </text>
            ))}
          </g>
          {/* Chequered finish line. */}
          <g opacity="0.85">
            {Array.from({ length: 14 }, (_, k) => (
              <g key={k}>
                <rect x={k * 22} y="300" width="11" height="11" fill={k % 2 ? ink : accent} />
                <rect x={k * 22 + 11} y="311" width="11" height="11" fill={k % 2 ? accent : ink} />
              </g>
            ))}
          </g>
        </>
      );
    case undefined:
      return (
        <>
          <circle
            cx="150"
            cy="200"
            r="90"
            {...line}
            strokeWidth="2"
            strokeDasharray="6 8"
            opacity="0.6"
          />
          <text
            x="150"
            y="240"
            textAnchor="middle"
            fontSize="120"
            fill={ink}
            opacity="0.6"
            style={displayFont(900)}
          >
            ?
          </text>
        </>
      );
  }
}
