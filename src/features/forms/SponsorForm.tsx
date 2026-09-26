'use client';

import { useTranslations } from 'next-intl';

import { SelectField, TextAreaField, TextField } from '@/components/ui/FormField';
import type { FormAction } from '@/lib/forms/formState';
import { SPONSOR_INTERESTS, sponsorSchema } from '@/lib/forms/schemas';

import { FormSent, Honeypot, SubmitButton } from './FormParts';
import styles from './Forms.module.css';
import { useValidatedForm } from './useValidatedForm';

export function SponsorForm({ action, isPrototype }: { action: FormAction; isPrototype: boolean }) {
  const t = useTranslations('forms.sponsor');
  const tForms = useTranslations('forms');
  const form = useValidatedForm(sponsorSchema, action);

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
        label={t('organisation')}
        name="organisation"
        autoComplete="organization"
        required
        defaultValue={form.previous('organisation')}
        error={form.errorFor('organisation')}
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
      <SelectField
        label={t('interest')}
        name="interest"
        defaultValue={form.previous('interest') ?? SPONSOR_INTERESTS[0]}
        error={form.errorFor('interest')}
        options={SPONSOR_INTERESTS.map((value) => ({ value, label: t(`interests.${value}`) }))}
      />
      <TextAreaField
        label={t('message')}
        name="message"
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
