/*
 * Geometry of the Loop: a very wide circle of which only a shallow top cap is visible.
 * Given the visible chord and cap height, everything else (radius, degrees per year, where
 * labels sit) follows. All angles are in degrees, measured clockwise from the top of the circle.
 */

/** Space above the ring for year labels, in px. */
export const LABEL_SPACE = 60;

export const MOBILE_BREAKPOINT = 900;
export const NAV_WIDTH = 236;

export type DialVariant = 'home' | 'events';

/** What the dial should look like; animated towards when the page or viewport changes. */
export interface DialTarget {
  /** Horizontal centre of the dial, in viewport px. */
  centerX: number;
  /** Viewport y of the dial's visible bottom edge. */
  baseline: number;
  /** Half the visible chord: how far the cap extends either side of the centre. */
  halfChord: number;
  /** Height of the visible cap. */
  capHeight: number;
  /** Arc length between neighbouring years, in px. */
  yearSpacing: number;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function computeDialTarget(
  viewport: { width: number; height: number },
  variant: DialVariant,
): DialTarget {
  const mobile = viewport.width < MOBILE_BREAKPOINT;
  const navWidth = mobile ? 0 : NAV_WIDTH;
  const contentHalfWidth = (viewport.width - navWidth) / 2;
  const centerX = navWidth + contentHalfWidth;
  const halfChord = contentHalfWidth + 60;

  if (variant === 'events') {
    return {
      centerX,
      baseline: mobile ? viewport.height : viewport.height - 26,
      halfChord,
      capHeight: mobile ? 70 : clamp(viewport.height * 0.12, 90, 120),
      yearSpacing: mobile ? 108 : clamp(contentHalfWidth / 3.6, 150, 200),
    };
  }
  return {
    centerX,
    baseline: viewport.height,
    halfChord,
    capHeight: mobile ? 78 : clamp(viewport.height * 0.14, 100, 140),
    yearSpacing: mobile ? 100 : clamp(contentHalfWidth / 3.8, 140, 190),
  };
}

/** Everything derived from a target that drawing and hit-testing need. */
export interface DialFrame {
  radius: number;
  /** Degrees between neighbouring years on the ring. */
  degreesPerYear: number;
  /** The canvas band the dial is drawn in, in viewport px. */
  band: { left: number; top: number; width: number; height: number };
  /** Circle centre relative to the band (far below it). */
  center: { x: number; y: number };
}

export function deriveDialFrame(target: DialTarget, viewportWidth: number): DialFrame {
  const { halfChord, capHeight } = target;
  // Circle through the chord ends and the cap top (intersecting chords theorem).
  const radius = (halfChord * halfChord + capHeight * capHeight) / (2 * capHeight);
  const left = viewportWidth < MOBILE_BREAKPOINT ? 0 : NAV_WIDTH;
  const height = capHeight + LABEL_SPACE;
  return {
    radius,
    degreesPerYear: ((target.yearSpacing / radius) * 180) / Math.PI,
    band: { left, top: target.baseline - height, width: viewportWidth - left, height },
    center: { x: target.centerX - left, y: LABEL_SPACE + radius },
  };
}

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/** Point on a circle of `radius` around the dial centre, in band coordinates. */
export function pointAt(frame: DialFrame, angle: number, radius: number): [number, number] {
  const t = toRadians(angle);
  return [frame.center.x + radius * Math.sin(t), frame.center.y - radius * Math.cos(t)];
}

/** Largest angle either side of the top that can reach `halfWidth` px sideways. */
export function visibleHalfAngle(frame: DialFrame, halfWidth: number): number {
  return toDegrees(Math.asin(Math.min(1, halfWidth / frame.radius)));
}

/** Angle of a pointer (viewport px) relative to the top of the dial. */
export function angleOfPointer(frame: DialFrame, clientX: number, clientY: number): number {
  const x = clientX - frame.band.left - frame.center.x;
  const y = frame.center.y - (clientY - frame.band.top);
  return toDegrees(Math.atan2(x, y));
}

/** Labels fade out as they approach the ends of the visible cap. */
export function labelOpacity(frame: DialFrame, target: DialTarget, angle: number): number {
  const sideways = Math.abs(frame.radius * Math.sin(toRadians(angle)));
  return clamp((1 - sideways / (target.halfChord - 40)) * 3.2, 0, 1);
}

/** Arc length in px covered by a change of angle. */
export function arcLength(frame: DialFrame, angleDelta: number): number {
  return Math.abs(toRadians(angleDelta)) * frame.radius;
}
