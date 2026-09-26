import type { CollectionConfig } from 'payload';

import { anyone, isStaff } from '../access';
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidateSite';

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'order'], group: 'Content' },
  defaultSort: 'order',
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'A single-colour logo on a transparent background works best.' },
    },
    { name: 'website', type: 'text' },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers come first in the sponsor ribbon.',
      },
    },
    {
      name: 'placeholderMark',
      type: 'number',
      admin: {
        hidden: true,
        description: 'Sample content only: which placeholder mark to draw when there is no logo.',
      },
    },
  ],
};
