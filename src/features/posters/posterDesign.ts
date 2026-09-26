/*
 * Poster composition rules, kept separate from rendering so they can be tested.
 * A poster combines its sport's geometry, one accent shape, the event name and an outlined year.
 */
import type { EventAccent } from '@/domain/event';
import { createRng, pick } from '@/lib/random';
import { accentColors, colors } from '@/styles/tokens';

/** Background and ink pairs a poster can be printed on. */
const GROUNDS = [
  [colors.midnight, colors.warmWhite],
  [colors.signal, colors.midnight],
  [colors.warmWhite, colors.midnight],
  [colors.cobaltDeep, colors.warmWhite],
  [colors.paleBlue, colors.midnight],
] as const;

export type AccentShape =
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'band'; y: number; height: number; rotation: number };

export interface PosterDesign {
  background: string;
  ink: string;
  accent: string;
  /** Tilt of the sport geometry, in degrees. */
  rotation: number;
  shape: AccentShape;
  titleLines: string[];
}

/** Deterministic per event id: the same event always gets the same poster. */
export function designPoster(event: {
  id: string;
  name: string;
  accent: EventAccent;
}): PosterDesign {
  const rng = createRng(`p${event.id}`);
  const [background, ink] = pick(rng, GROUNDS);
  const accent = legibleAccent(accentColors[event.accent], background);
  const rotation = Number((rng() * 16 - 8).toFixed(1));
  const shape: AccentShape =
    rng() < 0.5
      ? { kind: 'circle', cx: 230 + rng() * 40, cy: 90 + rng() * 60, r: 38 + rng() * 30 }
      : { kind: 'band', y: 150 + rng() * 80, height: 18 + rng() * 18, rotation: -rotation * 1.5 };

  return { background, ink, accent, rotation, shape, titleLines: wrapTitle(event.name) };
}

/** Swaps an accent that would vanish into, or clash with, the poster's background. */
function legibleAccent(accent: string, background: string): string {
  const sameAsGround = accent === background;
  const roseOnOrange = background === colors.signal && accent === colors.accentRose;
  if (sameAsGround || roseOnOrange) {
    return background === colors.signal ? colors.warmWhite : colors.signal;
  }
  const paleOnWhite =
    background === colors.warmWhite && (accent === colors.paleBlue || accent === colors.accentMint);
  return paleOnWhite ? colors.signal : accent;
}

const TITLE_LINE_LENGTH = 11;

/** Breaks the uppercase title into lines of at most ~11 characters, never splitting words. */
export function wrapTitle(name: string, maxLength = TITLE_LINE_LENGTH): string[] {
  const lines: string[] = [];
  let current = '';
  for (const word of name.toUpperCase().split(' ')) {
    const candidate = `${current} ${word}`.trim();
    if (candidate.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}
