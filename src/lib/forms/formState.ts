import type { FieldErrors } from './schemas';

/** Result of a form submission, returned by server actions and read by the form components. */
export type FormState =
  | { status: 'idle' }
  | { status: 'invalid'; errors: FieldErrors; values: Record<string, string> }
  | { status: 'sent'; details?: Record<string, string> };

export const IDLE: FormState = { status: 'idle' };

export type FormAction = (previous: FormState, formData: FormData) => Promise<FormState>;
