import 'server-only';

import { contentSourceName } from '@/lib/data';

import type { ContactInput, RegistrationInput, SponsorInput } from './schemas';

export type Submission =
  | { kind: 'registration'; data: RegistrationInput; eventId: string }
  | { kind: 'sponsor'; data: SponsorInput }
  | { kind: 'contact'; data: ContactInput };

/**
 * Stores a validated submission in the admin's Inbox. Without a database (sample content),
 * nothing is stored, and the forms say so. Email notifications follow in phase 4 (ADR 0007).
 */
export async function deliverSubmission(submission: Submission): Promise<void> {
  if (contentSourceName() !== 'payload') return;

  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ]);
  const payload = await getPayload({ config });

  switch (submission.kind) {
    case 'registration': {
      const { name, email, team } = submission.data;
      await payload.create({
        collection: 'registrations',
        data: { event: Number(submission.eventId), name, email, team },
      });
      return;
    }
    case 'sponsor':
      await payload.create({ collection: 'sponsor-enquiries', data: submission.data });
      return;
    case 'contact':
      await payload.create({ collection: 'contact-messages', data: submission.data });
      return;
  }
}
