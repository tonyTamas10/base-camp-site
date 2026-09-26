/*
 * Form submissions from the public site. Created only by the site's server actions (through the
 * Local API), never through the public API; readable by staff.
 */
import type { CollectionConfig } from 'payload';

import { SPONSOR_INTERESTS } from '@/lib/forms/schemas';

import { isAdmin, isStaff, nobody } from '../access';

const submissionAccess = { read: isStaff, create: nobody, update: isStaff, delete: isAdmin };

const handled = {
  name: 'handled',
  type: 'checkbox',
  defaultValue: false,
  admin: { position: 'sidebar', description: 'Tick once someone has followed up.' },
} as const;

export const Registrations: CollectionConfig = {
  slug: 'registrations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'event', 'email', 'createdAt', 'handled'],
    group: 'Inbox',
  },
  access: submissionAccess,
  fields: [
    { name: 'event', type: 'relationship', relationTo: 'events', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'team', type: 'text' },
    handled,
  ],
};

export const SponsorEnquiries: CollectionConfig = {
  slug: 'sponsor-enquiries',
  admin: {
    useAsTitle: 'organisation',
    defaultColumns: ['organisation', 'interest', 'email', 'createdAt', 'handled'],
    group: 'Inbox',
  },
  access: submissionAccess,
  fields: [
    { name: 'organisation', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'interest', type: 'select', required: true, options: [...SPONSOR_INTERESTS] },
    { name: 'message', type: 'textarea' },
    handled,
  ],
};

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt', 'handled'],
    group: 'Inbox',
  },
  access: submissionAccess,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea', required: true },
    handled,
  ],
};
