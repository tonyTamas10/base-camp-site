'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, type ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { HONEYPOT_FIELD } from '@/lib/forms/schemas';

import styles from './Forms.module.css';

export function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" withArrow isLoading={pending}>
      {children}
    </Button>
  );
}

/** A field people never see or reach; bots filling every input give themselves away. */
export function Honeypot() {
  const t = useTranslations('forms');
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label>
        {t('honeypot')}
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** Confirmation that replaces a sent form. Takes focus so screen readers announce it. */
export function FormSent({ children }: { children: ReactNode }) {
  const t = useTranslations('forms');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.focus(), []);
  return (
    <div ref={ref} className={styles.sent} role="status" tabIndex={-1}>
      <b>{t('sentTitle')}</b>
      <span>{children}</span>
    </div>
  );
}
