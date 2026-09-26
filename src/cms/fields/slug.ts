import type { TextField } from 'payload';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** URL segment. Left empty, it is filled from other fields by the collection's hooks. */
export const slugField = (
  description: string,
  { reserved = [], unique = false }: { reserved?: readonly string[]; unique?: boolean } = {},
): TextField => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique,
  admin: { position: 'sidebar', description },
  validate: (value: string | null | undefined) => {
    if (!value) return true;
    if (reserved.includes(value)) return `“${value}” is reserved.`;
    return SLUG_PATTERN.test(value)
      ? true
      : 'Use lowercase letters, numbers and single hyphens, e.g. autumn-cup-2025.';
  },
});
