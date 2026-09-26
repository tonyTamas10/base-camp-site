import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Poster } from './Poster';
import { designPoster, wrapTitle } from './posterDesign';

const event = { id: 'mf-2025-1', name: 'Autumn Student Cup', year: 2025, accent: 'mint' as const };

describe('wrapTitle', () => {
  it('uppercases and wraps at word boundaries', () => {
    expect(wrapTitle('Autumn Student Cup')).toEqual(['AUTUMN', 'STUDENT CUP']);
  });

  it('keeps a long single word on its own line', () => {
    expect(wrapTitle('Supercalifragilistic Cup')).toEqual(['SUPERCALIFRAGILISTIC', 'CUP']);
  });
});

describe('designPoster', () => {
  it('is deterministic for an event', () => {
    expect(designPoster(event)).toEqual(designPoster(event));
  });

  it('never prints the accent in the background colour', () => {
    for (let i = 0; i < 200; i++) {
      const design = designPoster({ ...event, id: `event-${i}` });
      expect(design.accent).not.toBe(design.background);
    }
  });
});

describe('Poster', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<Poster event={event} geometry="mini-pitch" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('prints the title and the year', () => {
    const { container } = render(<Poster event={event} geometry="lanes" />);
    const texts = [...container.querySelectorAll('text')].map((t) => t.textContent);
    expect(texts).toEqual(expect.arrayContaining(['AUTUMN', 'STUDENT CUP', '2025']));
  });

  it('draws a placeholder motif for sports without geometry', () => {
    const { container } = render(<Poster event={event} geometry={undefined} />);
    expect(container.textContent).toContain('?');
  });
});
