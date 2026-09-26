import { describe, expect, it } from 'vitest';

import { slugify } from './slugify';

describe('slugify', () => {
  it('lowercases and joins words with hyphens', () => {
    expect(slugify('Autumn Student Cup 2025')).toBe('autumn-student-cup-2025');
  });

  it('strips Romanian diacritics', () => {
    expect(slugify('Mărăști Țintă Șase Încă Âdânc')).toBe('marasti-tinta-sase-inca-adanc');
  });

  it('collapses punctuation and trims separators', () => {
    expect(slugify('  Field & Track -- Meet!  ')).toBe('field-track-meet');
  });
});
