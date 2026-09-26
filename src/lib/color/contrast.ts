/** WCAG 2.1 relative luminance of a #rrggbb colour. */
export function relativeLuminance(hex: string): number {
  const channels = hex
    .replace('#', '')
    .match(/../g)!
    .map((pair) => {
      const value = parseInt(pair, 16) / 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
  const [r = 0, g = 0, b = 0] = channels;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colours, from 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (light! + 0.05) / (dark! + 0.05);
}

export type ContrastRating = 'AA' | 'AA large / UI' | 'graphics only';

/** 4.5:1 for body text, 3:1 for large text and interface parts. */
export function rateContrast(ratio: number): ContrastRating {
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA large / UI';
  return 'graphics only';
}
