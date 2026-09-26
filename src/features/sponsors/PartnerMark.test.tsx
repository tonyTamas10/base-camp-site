import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { opticalSize, PartnerMark } from './PartnerMark';

describe('opticalSize', () => {
  it('keeps square marks at the base height', () => {
    expect(opticalSize(40, 40, 34)).toEqual({ width: 34, height: 34 });
  });

  it('makes wide marks shorter but wider', () => {
    const size = opticalSize(210, 40, 34);
    expect(size.height).toBeLessThan(34);
    expect(size.width).toBeGreaterThan(34);
  });
});

describe('PartnerMark', () => {
  it('labels placeholder marks with the partner name', () => {
    render(
      <PartnerMark
        partner={{
          id: 'p',
          name: 'Placeholder partner A',
          logo: { kind: 'placeholder', variant: 0 },
        }}
        color="#fff"
      />,
    );
    expect(screen.getByRole('img', { name: 'Placeholder partner A' })).toBeInTheDocument();
  });
});
