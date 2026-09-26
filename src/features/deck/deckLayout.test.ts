import { describe, expect, it } from 'vitest';

import { depthOf, exitPlacement, placeCard } from './deckLayout';

describe('depthOf', () => {
  it('puts the front card at depth 0 and wraps the rest behind it', () => {
    expect([0, 1, 2, 3].map((card) => depthOf(card, 2, 4))).toEqual([2, 3, 0, 1]);
  });
});

describe('placeCard', () => {
  it('shows the front card fully', () => {
    expect(placeCard(0, 'stack')).toMatchObject({ opacity: 1, brightness: 1 });
  });

  it('keeps nearer cards on top', () => {
    expect(placeCard(1, 'stack').zIndex).toBeGreaterThan(placeCard(2, 'stack').zIndex);
  });

  it('recedes upwards on desktop and downwards on phones', () => {
    expect(placeCard(1, 'stack').transform).toContain('-26px');
    expect(placeCard(1, 'swipe').transform).toContain('18px');
  });

  it('hides cards beyond the visible depth', () => {
    expect(placeCard(3, 'stack').opacity).toBeGreaterThan(0);
    expect(placeCard(4, 'stack').opacity).toBe(0);
    expect(placeCard(3, 'swipe').opacity).toBe(0);
  });
});

describe('exitPlacement', () => {
  it('lifts the leaving card above the whole deck', () => {
    expect(exitPlacement('stack').zIndex).toBeGreaterThan(placeCard(0, 'stack').zIndex);
  });
});
