/*
 * Event page sections as Payload blocks: one block per module type in the domain. Editors add,
 * remove and reorder them; the public site renders each with its matching component (ADR 0003).
 * Most sections show results automatically and need no fields.
 */
import type { Block, Field } from 'payload';

import { EVENT_MODULE_TYPES, type EventModuleType } from '@/domain/event';

const LABELS: Record<EventModuleType, string> = {
  story: 'Story',
  stats: 'Numbers',
  schedule: 'Schedule',
  teams: 'Teams',
  groups: 'Group tables',
  bracket: 'Knockout bracket',
  results: 'All results',
  players: 'Top scorers',
  heats: 'Heats & lanes',
  rankings: 'Rankings',
  records: 'Records',
  venue: 'Venue',
  gallery: 'Photos',
  partners: 'Partners',
  registration: 'Registration',
  related: 'Next on the Loop',
};

/** Fields for the sections editors write; the rest are filled from the event's results. */
const FIELDS: Partial<Record<EventModuleType, Field[]>> = {
  story: [
    {
      name: 'pullQuote',
      type: 'text',
      required: true,
      admin: { description: 'Big headline, e.g. “Eight teams. Two days.”' },
    },
    {
      name: 'pullQuoteEmphasis',
      type: 'text',
      admin: { description: 'Highlighted ending, e.g. “One final.”' },
    },
    { name: 'body', type: 'textarea' },
  ],
  venue: [{ name: 'surface', type: 'text', admin: { description: 'e.g. Artificial turf' } }],
  gallery: [
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 6,
      admin: { description: 'Up to six photos, shown as a mosaic.' },
    },
  ],
  partners: [{ name: 'partners', type: 'relationship', relationTo: 'partners', hasMany: true }],
};

export const EVENT_MODULE_BLOCKS: Block[] = EVENT_MODULE_TYPES.map((type) => ({
  slug: type,
  labels: { singular: LABELS[type], plural: LABELS[type] },
  fields: FIELDS[type] ?? [],
}));
