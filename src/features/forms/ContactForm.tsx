'use client';

import { useTranslations } from 'next-intl';

import { TextAreaField, TextField } from '@/components/ui/FormField';
import type { FormAction } from '@/lib/forms/formState';
import { contactSchema } from '@/lib/forms/schemas';

import { FormSent, Honeypot, SubmitButton } from './FormParts';
import styles from './Forms.module.css';
import { useValidatedForm } from './useValidatedForm';

export function ContactForm({ action, isPrototype }: { action: FormAction; isPrototype: boolean }) {
  const t = useTranslations('forms.contact');
  const tForms = useTranslations('forms');
  const form = useValidatedForm(contactSchema, action);

  if (form.state.status === 'sent') {
    return (
      <FormSent>
        {isPrototype ? tForms('prototypeNote', { outcome: t('sentPrototype') }) : t('sent')}
      </FormSent>
    );
  }

  return (
    <form className={styles.form} action={form.formAction} onSubmit={form.onSubmit} noValidate>
      <TextField
        label={t('name')}
        name="name"
        autoComplete="name"
        required
        defaultValue={form.previous('name')}
        error={form.errorFor('name')}
      />
      <TextField
        label={t('email')}
        name="email"
        type="email"
        autoComplete="email"
        required
        defaultValue={form.previous('email')}
        error={form.errorFor('email')}
      />
      <TextAreaField
        label={t('message')}
        name="message"
        required
        defaultValue={form.previous('message')}
        error={form.errorFor('message')}
      />
      <Honeypot />
      <div>
        <SubmitButton>{t('submit')}</SubmitButton>
      </div>
    </form>
  );
}
