import type { GlobalConfig } from 'payload';

import { anyone, isAdmin } from '../access';
import { revalidateGlobalAfterChange } from '../hooks/revalidateSite';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isAdmin },
  hooks: { afterChange: [revalidateGlobalAfterChange] },
  fields: [
    {
      name: 'defaultSeasonYear',
      type: 'number',
      admin: { description: 'The year the Loop opens on. Leave empty to use the current year.' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: { description: 'Shown on the contact page.' },
    },
    {
      name: 'heroPosterEvents',
      type: 'relationship',
      relationTo: 'events',
      hasMany: true,
      maxRows: 2,
      admin: { description: 'Past events whose posters drift behind the home page title.' },
    },
    {
      name: 'showPrototypeBadge',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Show the “Prototype” badge saying the content is sample data.' },
    },
    {
      name: 'showcaseEvent',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        condition: (data) => Boolean(data?.showPrototypeBadge),
        description: 'Linked from the prototype badge.',
      },
    },
  ],
};
