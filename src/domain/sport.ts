/** How a sport is contested. Decides the default event modules and how results are shown. */
export type SportKind = 'team' | 'track';

/** The line motif drawn from the sport's field, used on posters (see the design system, "Imagery"). */
export type PosterGeometry = 'mini-pitch' | 'pitch' | 'oval' | 'lanes';

export interface Sport {
  slug: string;
  name: string;
  kind: SportKind;
  geometry: PosterGeometry;
  /** Players per team; only meaningful for team sports. */
  squadSize?: number;
}
