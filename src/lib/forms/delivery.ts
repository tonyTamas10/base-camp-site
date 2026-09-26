import 'server-only';

import type { ContactInput, RegistrationInput, SponsorInput } from './schemas';

export type Submission =
  | { kind: 'registration'; data: RegistrationInput }
  | { kind: 'sponsor'; data: SponsorInput }
  | { kind: 'contact'; data: ContactInput };

/**
 * Where validated submissions go. In the prototype phase nothing is stored or sent; the forms say
 * so honestly. Phase 3 stores submissions in Payload, phase 4 adds email notifications (ADR 0007).
 */
export async function deliverSubmission(_submission: Submission): Promise<void> {}
