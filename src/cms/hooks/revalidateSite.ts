import { revalidatePath } from 'next/cache';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload';

/**
 * Public pages are pre-rendered. When editors change content, the site regenerates on the next
 * visit. The whole site is revalidated: it is small, and events appear on many pages at once.
 * Scripts outside Next.js (e.g. seeding) set `context.disableRevalidate`.
 */
function revalidateSite(context: Record<string, unknown>) {
  if (context.disableRevalidate) return;
  revalidatePath('/', 'layout');
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidateSite(req.context);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidateSite(req.context);
  return doc;
};

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ doc, req }) => {
  revalidateSite(req.context);
  return doc;
};
