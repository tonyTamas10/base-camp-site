import type { SVGProps } from 'react';

const PATHS = {
  left: 'M10 3 5 8l5 5',
  right: 'm6 3 5 5-5 5',
  up: 'M3 10l5-5 5 5',
  down: 'M3 6l5 5 5-5',
  close: 'M3 3l10 10M13 3 3 13',
  menu: 'M1 5h14M1 11h9',
} as const;

export type IconName = keyof typeof PATHS;

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  name: IconName;
  size?: number;
};

/** Decorative line icon. Give the surrounding control an accessible name. */
export function Icon({ name, size = 16, ...svgProps }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
      {...svgProps}
    >
      <path
        d={PATHS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
