import { describe, expect, it } from 'vitest';

import { colors } from '@/styles/tokens';

import { contrastRatio, rateContrast } from './contrast';

describe('contrastRatio', () => {
  it('matches the WCAG extremes', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#777777')).toBe(1);
  });

  it('is symmetric', () => {
    expect(contrastRatio(colors.signal, colors.midnight)).toBe(
      contrastRatio(colors.midnight, colors.signal),
    );
  });
});

describe('design token pairs', () => {
  it('keeps body text pairings at AA', () => {
    expect(rateContrast(contrastRatio(colors.warmWhite, colors.cobalt))).toBe('AA');
    expect(rateContrast(contrastRatio(colors.ink, colors.paper))).toBe('AA');
    expect(rateContrast(contrastRatio(colors.midnight, colors.signal))).toBe('AA');
  });

  it('keeps deep signal readable as large text on paper', () => {
    expect(contrastRatio(colors.signalDeep, colors.paper)).toBeGreaterThanOrEqual(3);
  });
});
