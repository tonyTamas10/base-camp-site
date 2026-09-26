'use server';

import { getOpenEvents } from '@/lib/data';

import { deliverSubmission } from './delivery';
import type { FormState } from './formState';
import {
  contactSchema,
  formDataToObject,
  HONEYPOT_FIELD,
  registrationSchema,
  sponsorSchema,
  validate,
} from './schemas';

/** Bots fill every field; people never see this one. Pretend success so bots don't adapt. */
function isBot(values: Record<string, string>) {
  return Boolean(values[HONEYPOT_FIELD]);
}

export async function submitRegistration(_: FormState, formData: FormData): Promise<FormState> {
  const values = formDataToObject(formData);
  if (isBot(values)) return { status: 'sent' };

  const result = validate(registrationSchema, values);
  if (!result.ok) return { status: 'invalid', errors: result.errors, values };

  // The event field is "<sport>/<slug>"; only events still open can be chosen.
  const event = (await getOpenEvents()).find(
    (open) => `${open.sportSlug}/${open.slug}` === result.value.event,
  );
  if (!event) return { status: 'invalid', errors: { event: 'invalidChoice' }, values };

  await deliverSubmission({ kind: 'registration', data: result.value, eventId: event.id });
  return { status: 'sent', details: { name: result.value.name, event: event.name } };
}

export async function submitSponsorEnquiry(_: FormState, formData: FormData): Promise<FormState> {
  const values = formDataToObject(formData);
  if (isBot(values)) return { status: 'sent' };

  const result = validate(sponsorSchema, values);
  if (!result.ok) return { status: 'invalid', errors: result.errors, values };

  await deliverSubmission({ kind: 'sponsor', data: result.value });
  return { status: 'sent' };
}

export async function submitContactMessage(_: FormState, formData: FormData): Promise<FormState> {
  const values = formDataToObject(formData);
  if (isBot(values)) return { status: 'sent' };

  const result = validate(contactSchema, values);
  if (!result.ok) return { status: 'invalid', errors: result.errors, values };

  await deliverSubmission({ kind: 'contact', data: result.value });
  return { status: 'sent' };
}
