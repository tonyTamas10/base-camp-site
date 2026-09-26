/*
 * Deterministic pseudo-randomness for sample data and procedural art: the same seed always gives
 * the same sequence, so generated content is stable across reloads, builds and server/client.
 * The algorithms match the prototype exactly, so ported output is identical.
 */

export type Rng = () => number;

/** FNV-1a 32-bit hash of a string. */
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Mulberry32 generator returning numbers in [0, 1). */
export function createRng(seed: string | number): Rng {
  let state = typeof seed === 'string' ? hashString(seed) : seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  const item = items[Math.floor(rng() * items.length)];
  if (item === undefined) throw new Error('Cannot pick from an empty list');
  return item;
}

/** Fisher–Yates shuffle into a new array. */
export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j] as T, result[i] as T];
  }
  return result;
}
