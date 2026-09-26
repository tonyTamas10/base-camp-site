import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Events } from './cms/collections/Events';
import { Media } from './cms/collections/Media';
import { Partners } from './cms/collections/Partners';
import { Sports } from './cms/collections/Sports';
import { ContactMessages, Registrations, SponsorEnquiries } from './cms/collections/Submissions';
import { Users } from './cms/collections/Users';
import { SiteSettings } from './cms/globals/SiteSettings';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · Base Camp admin' },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections: [
    Events,
    Sports,
    Partners,
    Media,
    Registrations,
    SponsorEnquiries,
    ContactMessages,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI ?? '' },
    // Schema changes go through migrations (src/migrations) so production is never altered
    // implicitly; local development pushes changes directly for speed (ADR 0011).
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  plugins: [
    // Uploads go to Vercel Blob when a token is configured (production and previews, ADR 0004);
    // otherwise to the local media/ folder.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? '',
    }),
  ],
  telemetry: false,
});
