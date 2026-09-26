/*
 * Colour tokens for code that draws (SVG posters, canvas). Mirrors src/styles/tokens.css:
 * change both together. Everything else should use the CSS variables.
 */
import type { EventAccent } from '@/domain/event';

export const colors = {
  cobalt: '#1C2E9E',
  cobaltDeep: '#16248A',
  fieldLow: '#121F6E',
  midnight: '#050A2C',
  ink: '#0B1233',
  warmWhite: '#F7F7F2',
  paper: '#F2F3F7',
  paleBlue: '#C3CFFF',
  slate: '#4A5480',
  signal: '#FF5B1A',
  signalHover: '#FF7A45',
  signalDeep: '#D1450F',
  accentAmber: '#FFB23F',
  accentMint: '#7FE3C4',
  accentRose: '#FF6F91',
} as const;

export const accentColors: Record<EventAccent, string> = {
  signal: colors.signal,
  amber: colors.accentAmber,
  'pale-blue': colors.paleBlue,
  mint: colors.accentMint,
  rose: colors.accentRose,
};
