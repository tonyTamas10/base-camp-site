import { describe, expect, it } from 'vitest';

import {
  angleOfPointer,
  arcLength,
  computeDialTarget,
  deriveDialFrame,
  labelOpacity,
  pointAt,
  LABEL_SPACE,
  NAV_WIDTH,
} from './dialGeometry';

const desktop = { width: 1440, height: 900 };
const phone = { width: 375, height: 812 };

describe('computeDialTarget', () => {
  it('centres the dial on the content area, right of the navigation', () => {
    const target = computeDialTarget(desktop, 'home');
    expect(target.centerX).toBe(NAV_WIDTH + (1440 - NAV_WIDTH) / 2);
  });

  it('uses the full width on phones', () => {
    expect(computeDialTarget(phone, 'home').centerX).toBe(375 / 2);
  });

  it('is shallower on the events hub than on home', () => {
    expect(computeDialTarget(desktop, 'events').capHeight).toBeLessThan(
      computeDialTarget(desktop, 'home').capHeight,
    );
  });

  it('clamps cap height and year spacing on desktop', () => {
    const target = computeDialTarget({ width: 4000, height: 3000 }, 'home');
    expect(target.capHeight).toBe(140);
    expect(target.yearSpacing).toBe(190);
  });
});

describe('deriveDialFrame', () => {
  const target = computeDialTarget(desktop, 'home');
  const frame = deriveDialFrame(target, desktop.width);

  it('makes a circle whose cap has the requested height across the chord', () => {
    const [, chordEndY] = pointAt(
      frame,
      (Math.asin(target.halfChord / frame.radius) * 180) / Math.PI,
      frame.radius,
    );
    const [, topY] = pointAt(frame, 0, frame.radius);
    expect(chordEndY - topY).toBeCloseTo(target.capHeight, 6);
  });

  it('puts the top of the ring just below the label space', () => {
    expect(pointAt(frame, 0, frame.radius)[1]).toBeCloseTo(LABEL_SPACE, 6);
  });

  it('spaces neighbouring years by the requested arc length', () => {
    expect(arcLength(frame, frame.degreesPerYear)).toBeCloseTo(target.yearSpacing, 6);
  });

  it('sits the band on the baseline', () => {
    expect(frame.band.top + frame.band.height).toBe(target.baseline);
  });
});

describe('pointer and label helpers', () => {
  const target = computeDialTarget(desktop, 'home');
  const frame = deriveDialFrame(target, desktop.width);

  it('reports zero degrees for a pointer straight above the centre', () => {
    const x = frame.band.left + frame.center.x;
    expect(angleOfPointer(frame, x, frame.band.top)).toBeCloseTo(0, 6);
  });

  it('reports positive angles to the right', () => {
    const x = frame.band.left + frame.center.x + 100;
    expect(angleOfPointer(frame, x, frame.band.top)).toBeGreaterThan(0);
  });

  it('shows labels fully at the centre and hides them at the chord ends', () => {
    expect(labelOpacity(frame, target, 0)).toBe(1);
    const edge = (Math.asin(target.halfChord / frame.radius) * 180) / Math.PI;
    expect(labelOpacity(frame, target, edge)).toBe(0);
  });
});
