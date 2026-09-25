import { Big_Shoulders, Hanken_Grotesk, Martian_Mono } from 'next/font/google';

// Self-hosted at build time by next/font: no runtime requests to Google.
// latin-ext covers Romanian diacritics (ș ț ă â î).

// Google merged "Big Shoulders Display" into Big Shoulders; the opsz axis selects the display cut at large sizes.
const display = Big_Shoulders({
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
  variable: '--font-display-face',
  display: 'swap',
});

const body = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  variable: '--font-body-face',
  display: 'swap',
});

const mono = Martian_Mono({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-mono-face',
  display: 'swap',
});

export const fontVariables = [display.variable, body.variable, mono.variable].join(' ');
