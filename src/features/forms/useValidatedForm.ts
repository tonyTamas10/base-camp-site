'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useState, type FormEvent } from 'react';
import type { z } from 'zod';

import { IDLE, type FormAction } from '@/lib/forms/formState';
import { formDataToObject, validate, type FieldErrors } from '@/lib/forms/schemas';

/**
 * Validates in the browser for instant feedback, then submits to the server action, which
 * validates again as the authority. Without JavaScript, the form posts straight to the server.
 */
export function useValidatedForm(schema: z.ZodType, action: FormAction) {
  const t = useTranslations('forms.errors');
  const [state, formAction, pending] = useActionState(action, IDLE);
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);

  const errors: FieldErrors = clientErrors ?? (state.status === 'invalid' ? state.errors : {});

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const result = validate(schema, formDataToObject(new FormData(form)));
    if (result.ok) {
      setClientErrors(null);
      return;
    }
    event.preventDefault();
    setClientErrors(result.errors);
    const firstInvalid = Object.keys(result.errors)[0];
    if (firstInvalid) form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
  };

  return {
    state,
    formAction,
    pending,
    onSubmit,
    /** Translated error for a field, if any. */
    errorFor: (field: string) => {
      const code = errors[field];
      return code ? t(code) : undefined;
    },
    /** The value submitted last time, so a server-side rejection doesn't clear the form. */
    previous: (field: string) => (state.status === 'invalid' ? state.values[field] : undefined),
  };
}
