/*
 * Who can do what in the admin (ADR 0003).
 * - admin: everything, including people, roles, sports and site settings.
 * - editor: events, partners, media, and reading form submissions.
 * - the public: read published content only.
 */
import type { Access, FieldAccess } from 'payload';

export const ROLES = ['admin', 'editor'] as const;
export type Role = (typeof ROLES)[number];

const roleOf = (user: unknown): Role | undefined => (user as { role?: Role } | null)?.role;

export const anyone: Access = () => true;

export const isAdmin: Access = ({ req }) => roleOf(req.user) === 'admin';

/** Any signed-in member of the club team. */
export const isStaff: Access = ({ req }) => Boolean(req.user);

export const isAdminOrSelf: Access = ({ req }) => {
  if (roleOf(req.user) === 'admin') return true;
  return req.user ? { id: { equals: req.user.id } } : false;
};

/** Visitors see published documents; staff also see drafts. */
export const publishedOrStaff: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } };

export const nobody: Access = () => false;

export const fieldAdminOnly: FieldAccess = ({ req }) => roleOf(req.user) === 'admin';
