import type { CollectionConfig } from 'payload';

import { FUTURE_SPORTS_SLUG } from '@/domain/sport';
import { slugify } from '@/lib/slugify';

import { anyone, isAdmin } from '../access';
import { slugField } from '../fields/slug';
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidateSite';

export const Sports: CollectionConfig = {
  slug: 'sports',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'order'],
    group: 'Content',
    description: 'Adding a sport adds it to the navigation and the Loop automatically.',
  },
  defaultSort: 'order',
  access: { read: anyone, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: {
    beforeValidate: [
      ({ data }) =>
        data && !data.slug && data.name ? { ...data, slug: slugify(data.name) } : data,
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField('Used in URLs: /events/<slug>. Filled from the name if left empty.', {
      unique: true,
      reserved: [FUTURE_SPORTS_SLUG],
    }),
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'team',
      options: [
        { label: 'Team sport (groups, bracket)', value: 'team' },
        { label: 'Track (heats, times)', value: 'track' },
      ],
      admin: {
        description: 'Decides which results an event records and its default page sections.',
      },
    },
    {
      name: 'geometry',
      type: 'select',
      required: true,
      options: [
        { label: 'Mini pitch', value: 'mini-pitch' },
        { label: 'Full pitch', value: 'pitch' },
        { label: 'Running oval', value: 'oval' },
        { label: 'Straight lanes', value: 'lanes' },
      ],
      admin: { description: 'The line motif drawn on this sport’s posters.' },
    },
    {
      name: 'squadSize',
      type: 'number',
      min: 1,
      admin: { condition: (data) => data?.kind === 'team' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers come first in the navigation.' },
    },
  ],
};
