import { describe, expect, it } from 'vitest';

import {
  advance,
  applyWheel,
  createMotion,
  MAX_VELOCITY,
  nearestIndexOf,
  restingIndex,
  yearAt,
} from './dialPhysics';

function runUntilRest(motion: ReturnType<typeof createMotion>, maxFrames = 10_000) {
  let frames = 0;
  while (advance(motion, 1) && frames < maxFrames) frames++;
  return frames;
}

describe('advance', () => {
  it('eases to a target and stops exactly on it', () => {
    const motion = { ...createMotion(0), target: 3 };
    runUntilRest(motion);
    expect(motion).toEqual({ position: 3, velocity: 0, target: null });
  });

  it('coasts, slows down and settles on a whole year', () => {
    const motion = { ...createMotion(0), velocity: 0.3 };
    const frames = runUntilRest(motion);
    expect(frames).toBeGreaterThan(10);
    expect(Number.isInteger(motion.position)).toBe(true);
    expect(motion.position).toBeGreaterThan(0);
  });

  it('behaves the same at 30fps as at 60fps', () => {
    const at60 = { ...createMotion(0), velocity: 0.13 };
    const at30 = { ...createMotion(0), velocity: 0.13 };
    runUntilRest(at60);
    while (advance(at30, 2));
    expect(at30.position).toBe(at60.position);
  });

  it('reports rest when already on a year', () => {
    expect(advance(createMotion(4), 1)).toBe(false);
  });
});

describe('applyWheel', () => {
  it('adds momentum in the scroll direction and cancels any target', () => {
    const motion = { ...createMotion(0), target: 5 };
    applyWheel(motion, 100);
    expect(motion.velocity).toBeGreaterThan(0);
    expect(motion.target).toBeNull();
  });

  it('caps the speed', () => {
    const motion = createMotion(0);
    applyWheel(motion, 1_000_000);
    expect(motion.velocity).toBe(MAX_VELOCITY);
  });
});

describe('year indexing', () => {
  const years = [2017, 2018, 2019, 2020];

  it('wraps in both directions', () => {
    expect(yearAt(years, 4)).toBe(2017);
    expect(yearAt(years, -1)).toBe(2020);
  });

  it('finds the nearest index for a year, going the short way round', () => {
    expect(nearestIndexOf(years, 2017, 3)).toBe(4);
    expect(nearestIndexOf(years, 2020, 0)).toBe(-1);
    expect(nearestIndexOf(years, 2019, 6)).toBe(6);
    expect(nearestIndexOf(years, 1999, 0)).toBeNull();
  });

  it('rests on the target when easing, otherwise on the nearest year', () => {
    expect(restingIndex({ position: 1.2, velocity: 0, target: 3 })).toBe(3);
    expect(restingIndex({ position: 1.6, velocity: 0, target: null })).toBe(2);
  });
});
