import { describe, expect, it } from 'vitest';

import { createRng, hashString, pick, shuffle } from './random';

describe('createRng', () => {
  it('produces the same sequence for the same seed', () => {
    const a = createRng('mf-2025-1');
    const b = createRng('mf-2025-1');
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it('produces different sequences for different seeds', () => {
    expect(createRng('a')()).not.toBe(createRng('b')());
  });

  it('stays within [0, 1)', () => {
    const rng = createRng(42);
    for (let i = 0; i < 1000; i++) {
      const value = rng();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});

describe('hashString', () => {
  it('matches the FNV-1a reference value', () => {
    expect(hashString('')).toBe(2166136261);
    expect(hashString('a')).toBe(0xe40c292c);
  });
});

describe('pick and shuffle', () => {
  it('picks deterministically', () => {
    const items = ['x', 'y', 'z'];
    expect(pick(createRng('s'), items)).toBe(pick(createRng('s'), items));
  });

  it('throws on an empty list', () => {
    expect(() => pick(createRng('s'), [])).toThrow();
  });

  it('shuffles into a new array with the same items', () => {
    const items = [1, 2, 3, 4, 5, 6];
    const shuffled = shuffle(createRng('s'), items);
    expect(shuffled).not.toBe(items);
    expect([...shuffled].sort()).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
