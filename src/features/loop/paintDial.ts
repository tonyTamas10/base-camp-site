import { colors } from '@/styles/tokens';

import { pointAt, visibleHalfAngle, type DialFrame } from './dialGeometry';

export interface DialPaintState {
  position: number;
  /** Event count for each year of the cycle, in cycle order. */
  counts: readonly number[];
  focused: boolean;
}

const white = (alpha: number) => `rgb(247 247 242 / ${Math.round(alpha * 100)}%)`;

/** The main ring plus three fainter track lanes inside it: [inset, alpha, alpha when focused]. */
const LANES = [
  [0, 0.5, 0.85, 1.5],
  [13, 0.2, 0.2, 1],
  [26, 0.13, 0.13, 1],
  [39, 0.08, 0.08, 1],
] as const;

const MINOR_TICKS_PER_YEAR = 5;
const MAX_TICK_EXTRA_LENGTH = 30;

/** Paints the ring, one tick per year (longer for busier years), minor ticks and the loop seam. */
export function paintDial(
  ctx: CanvasRenderingContext2D,
  frame: DialFrame,
  pixelRatio: number,
  state: DialPaintState,
) {
  const { width, height } = frame.band;
  const { radius, degreesPerYear, center } = frame;
  const { position, counts, focused } = state;
  const cycle = counts.length;
  const maxCount = Math.max(1, ...counts);

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const halfAngle = visibleHalfAngle(frame, width) + 2;
  const arcStart = ((-90 - halfAngle) * Math.PI) / 180;
  const arcEnd = ((-90 + halfAngle) * Math.PI) / 180;

  for (const [inset, alpha, focusedAlpha, lineWidth] of LANES) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius - inset, arcStart, arcEnd);
    ctx.strokeStyle = white(focused ? focusedAlpha : alpha);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  const line = (angle: number, outer: number, inner: number) => {
    const [x1, y1] = pointAt(frame, angle, outer);
    const [x2, y2] = pointAt(frame, angle, inner);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
  };

  const selected = Math.round(position);
  const span = Math.ceil(halfAngle / degreesPerYear) + 1;
  ctx.lineCap = 'round';

  for (let index = Math.floor(position) - span; index <= Math.ceil(position) + span; index++) {
    const angle = (index - position) * degreesPerYear;
    if (Math.abs(angle) > halfAngle) continue;
    const cycleIndex = ((index % cycle) + cycle) % cycle;
    const count = counts[cycleIndex] ?? 0;
    const isSelected = index === selected;

    ctx.beginPath();
    line(angle, radius, radius - 4 - (count / maxCount) * MAX_TICK_EXTRA_LENGTH);
    ctx.strokeStyle = isSelected ? colors.signal : white(focused ? 0.85 : 0.6);
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();

    ctx.beginPath();
    for (let k = 1; k < MINOR_TICKS_PER_YEAR; k++) {
      line(angle + (k * degreesPerYear) / MINOR_TICKS_PER_YEAR, radius, radius - 8);
    }
    ctx.strokeStyle = white(focused ? 0.6 : 0.35);
    ctx.lineWidth = 1;
    ctx.stroke();

    // The seam where the last year wraps back to the first keeps chronology legible.
    if (cycleIndex === 0) {
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      line(angle - degreesPerYear / 2, radius + 14, radius - 34);
      ctx.strokeStyle = white(0.6);
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  // Fade both ends of the band.
  const fade = Math.min(0.16, 120 / width);
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, 'rgb(0 0 0 / 0%)');
  gradient.addColorStop(fade, '#000');
  gradient.addColorStop(1 - fade, '#000');
  gradient.addColorStop(1, 'rgb(0 0 0 / 0%)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}
