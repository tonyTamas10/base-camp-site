/*
 * Where each card sits in the deck. Depth 0 is the front card; deeper cards recede. Desktop
 * stacks cards upwards into the distance; phones stack them downwards for a vertical swipe.
 */

export type DeckForm = 'stack' | 'swipe';

export interface CardPlacement {
  transform: string;
  opacity: number;
  brightness: number;
  zIndex: number;
}

/** Cards deeper than this are hidden at the back of the deck. */
const VISIBLE_DEPTH: Record<DeckForm, number> = { stack: 3, swipe: 2 };

/** Position of the card whose depth is `depth` (0 = front). */
export function placeCard(depth: number, form: DeckForm): CardPlacement {
  const zIndex = 100 - depth;
  if (depth === 0) return { transform: 'translate3d(0, 0, 0)', opacity: 1, brightness: 1, zIndex };

  const visible = depth <= VISIBLE_DEPTH[form];
  if (form === 'swipe') {
    return visible
      ? {
          transform: `translate3d(0, ${depth * 18}px, ${-depth * 60}px)`,
          opacity: 1,
          brightness: 1 - depth * 0.2,
          zIndex,
        }
      : { transform: 'translate3d(0, 40px, -200px)', opacity: 0, brightness: 0.5, zIndex };
  }
  return visible
    ? {
        transform: `translate3d(0, ${-depth * 26}px, ${-depth * 120}px)`,
        opacity: 1 - depth * 0.08,
        brightness: 1 - depth * 0.2,
        zIndex,
      }
    : { transform: 'translate3d(0, -110px, -520px)', opacity: 0, brightness: 0.4, zIndex };
}

/** Where the front card flies to when the deck advances. */
export function exitPlacement(form: DeckForm): CardPlacement {
  return {
    transform:
      form === 'swipe'
        ? 'translate3d(0, -125%, 0) rotate(-5deg)'
        : 'translate3d(0, -62%, 180px) rotateX(22deg)',
    opacity: 0,
    brightness: 1,
    zIndex: 200,
  };
}

/** Where cards start before they rise into the deck. */
export const ENTRY_PLACEMENT: CardPlacement = {
  transform: 'translate3d(0, 70%, -260px) scale(0.85)',
  opacity: 0,
  brightness: 1,
  zIndex: 0,
};

/** Depth of card `cardIndex` when `frontIndex` is at the front of a deck of `size`. */
export function depthOf(cardIndex: number, frontIndex: number, size: number): number {
  return (((cardIndex - frontIndex) % size) + size) % size;
}
