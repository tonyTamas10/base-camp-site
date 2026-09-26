/*
 * Validation for the public forms, shared by the browser (instant feedback) and the server (the
 * authority). Errors are codes, not sentences, so the interface can translate them.
 */
import { z } from 'zod';

export type FieldErrorCode = 'required' | 'invalidEmail' | 'tooLong' | 'invalidChoice';

const requiredText = (max: number) => z.string().trim().min(1, 'required').max(max, 'tooLong');

const email = z
  .string()
  .trim()
  .min(1, 'required')
  .max(254, 'tooLong')
  .pipe(z.email('invalidEmail'));

const optionalText = (max: number) => z.string().trim().max(max, 'tooLong').optional().default('');

export const registrationSchema = z.object({
  event: z.string().min(1, 'required'),
  name: requiredText(120),
  email,
  team: optionalText(120),
});

export const SPONSOR_INTERESTS = ['event', 'season', 'kit', 'venue', 'unsure'] as const;

export const sponsorSchema = z.object({
  organisation: requiredText(160),
  email,
  interest: z.enum(SPONSOR_INTERESTS, 'invalidChoice'),
  message: optionalText(4000),
});

export const contactSchema = z.object({
  name: requiredText(120),
  email,
  message: requiredText(4000),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type SponsorInput = z.infer<typeof sponsorSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export type FieldErrors = Partial<Record<string, FieldErrorCode>>;

/** Validates form data, returning the parsed values or the first error code per field. */
export function validate<Schema extends z.ZodType>(
  schema: Schema,
  data: Record<string, unknown>,
): { ok: true; value: z.infer<Schema> } | { ok: false; errors: FieldErrors } {
  const result = schema.safeParse(data);
  if (result.success) return { ok: true, value: result.data };
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? 'form');
    errors[field] ??= issue.message as FieldErrorCode;
  }
  return { ok: false, errors };
}

/** Plain object of a form's string fields (files are ignored). */
export function formDataToObject(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === 'string') values[key] = value;
  });
  return values;
}

/** Name of the hidden field that only bots fill in. */
export const HONEYPOT_FIELD = 'website';
