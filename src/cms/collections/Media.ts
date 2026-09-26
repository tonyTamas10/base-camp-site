import type { CollectionConfig } from 'payload';

import { anyone, isStaff } from '../access';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Content' },
  access: { read: anyone, create: isStaff, update: isStaff, delete: isStaff },
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 640 },
      { name: 'wide', width: 1600 },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for people who can’t see it.' },
    },
  ],
};
