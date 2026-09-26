/*
 * Deployment-specific settings, read from environment variables (see .env.example).
 * Defaults are safe placeholders for local development.
 */
export const siteConfig = {
  /** Public address of the site, used for canonical URLs, sitemaps and link previews. */
  url: process.env.SITE_URL ?? 'http://localhost:3000',
  /** Where people can write to the club. */
  contactEmail: process.env.CONTACT_EMAIL ?? 'hello@basecamp.example',
} as const;
