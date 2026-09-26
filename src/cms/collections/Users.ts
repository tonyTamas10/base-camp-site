import type { CollectionConfig } from 'payload';

import { fieldAdminOnly, isAdmin, isAdminOrSelf, ROLES } from '../access';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Settings',
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // The very first account becomes an admin, so a fresh install can be set up.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data;
        const { totalDocs } = await req.payload.count({ collection: 'users', req });
        return totalDocs === 0 ? { ...data, role: 'admin' } : data;
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: ROLES.map((role) => ({
        label: role[0]!.toUpperCase() + role.slice(1),
        value: role,
      })),
      access: { create: fieldAdminOnly, update: fieldAdminOnly },
      admin: {
        description:
          'Editors manage events, partners and media. Admins also manage people and settings.',
      },
    },
  ],
};
