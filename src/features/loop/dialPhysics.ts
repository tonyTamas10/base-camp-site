/*
 * Motion of the Loop. `position` is a continuous year index (2.5 = halfway between the third and
 * fourth year of the cycle); it is unbounded because the loop wraps forever. Time is measured in
 * frames of 1/60 s so behaviour is the same at any refresh rate.
 */

export interface DialMotion {
  position: number;
  /** Year indexes per frame. */
  velocity: number;
  /** When set, the dial eases to this index instead of coasting. */
  target: number | null;
}

/** Fraction of the remaining distance covered per frame when easing to a target. */
const EASE_PER_FRAME = 0.16;
/** Velocity kept per frame while coasting. */
const FRICTION = 0.92;
const REST_VELOCITY = 0.0015;
const REST_DISTANCE = 0.001;
export const MAX_VELOCITY = 0.35;
/** Velocity added per pixel of wheel scroll. */
const WHEEL_SENSITIVITY = 0.0007;

export const FRAME_MS = 1000 / 60;

export function createMotion(position: number): DialMotion {
  return { position, velocity: 0, target: null };
}

/** Advances free motion by `frames`. Returns whether the dial is still moving. */
export function advance(motion: DialMotion, frames: number): boolean {
  if (motion.target !== null) {
    motion.position += (motion.target - motion.position) * Math.min(1, EASE_PER_FRAME * frames);
    if (Math.abs(motion.target - motion.position) < REST_DISTANCE) {
      motion.position = motion.target;
      motion.target = null;
      return false;
    }
    return true;
  }

  if (Math.abs(motion.velocity) > REST_VELOCITY) {
    // Exact sum of the per-frame geometric decay, so distance is independent of frame rate.
    const decay = Math.pow(FRICTION, frames);
    motion.position += (motion.velocity * (1 - decay)) / (1 - FRICTION);
    motion.velocity *= decay;
    return true;
  }

  // Coasting has ended between years: snap to the nearest one.
  const nearest = Math.round(motion.position);
  if (Math.abs(motion.position - nearest) > REST_DISTANCE) {
    motion.target = nearest;
    motion.velocity = 0;
    return true;
  }
  motion.position = nearest;
  return false;
}

export function clampVelocity(velocity: number): number {
  return Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
}

/** Converts a wheel event's dominant delta into added momentum. */
export function applyWheel(motion: DialMotion, deltaPixels: number) {
  motion.target = null;
  motion.velocity = clampVelocity(motion.velocity + deltaPixels * WHEEL_SENSITIVITY);
}

/** The index the dial is at, or heading to. */
export function restingIndex(motion: DialMotion): number {
  return Math.round(motion.target ?? motion.position);
}

/** Year for an unbounded index, wrapping around the cycle. */
export function yearAt<T>(years: readonly T[], index: number): T {
  const year = years[((index % years.length) + years.length) % years.length];
  if (year === undefined) throw new Error('The Loop needs at least one year');
  return year;
}

/** The index closest to `from` that shows `year`, so the dial takes the short way round. */
export function nearestIndexOf<T>(years: readonly T[], year: T, from: number): number | null {
  const offset = years.indexOf(year);
  if (offset === -1) return null;
  const cycle = years.length;
  const base = Math.floor(from / cycle) * cycle + offset;
  return [base - cycle, base, base + cycle].reduce((best, candidate) =>
    Math.abs(candidate - from) < Math.abs(best - from) ? candidate : best,
  );
}
