'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TextField } from '@/components/ui/FormField';
import { parseIsoDate } from '@/domain/dates';
import type { EventSummary } from '@/domain/event';
import type { Sport } from '@/domain/sport';
import { EventStatusTag } from '@/features/deck';
import { dateFormats } from '@/lib/format/dates';
import type { FormAction } from '@/lib/forms/formState';
import { registrationSchema } from '@/lib/forms/schemas';

import { FormSent, Honeypot, SubmitButton } from './FormParts';
import styles from './Forms.module.css';
import { useValidatedForm } from './useValidatedForm';

export interface RegistrationFormProps {
  /** Events still open for registration, soonest first. */
  events: EventSummary[];
  sports: Sport[];
  /** "<sport>/<slug>" of the event to preselect. */
  selected?: string;
  action: FormAction;
  /** While on sample data, the confirmation says nothing was really sent. */
  isPrototype: boolean;
}

const eventKey = (event: EventSummary) => `${event.sportSlug}/${event.slug}`;

export function RegistrationForm({
  events,
  sports,
  selected,
  action,
  isPrototype,
}: RegistrationFormProps) {
  const t = useTranslations('forms.registration');
  const tForms = useTranslations('forms');
  const format = useFormatter();
  const form = useValidatedForm(registrationSchema, action);

  if (form.state.status === 'sent') {
    const details = form.state.details ?? {};
    return (
      <FormSent>
        {isPrototype
          ? tForms('prototypeNote', {
              outcome: t('sentPrototype', { name: details.name ?? '', event: details.event ?? '' }),
            })
          : t('sent', { name: details.name ?? '', event: details.event ?? '' })}
      </FormSent>
    );
  }

  if (events.length === 0) return <p className={styles.empty}>{t('noOpenEvents')}</p>;

  const chosen = form.previous('event') ?? selected ?? eventKey(events[0]!);
  const sportName = (slug: string) => sports.find((sport) => sport.slug === slug)?.name ?? slug;
  const eventError = form.errorFor('event');

  return (
    <form className={styles.form} action={form.formAction} onSubmit={form.onSubmit} noValidate>
      <fieldset
        className={styles.fieldset}
        aria-describedby={eventError ? 'event-error' : undefined}
      >
        <legend className={styles.legend}>{t('event')}</legend>
        {events.map((event) => (
          <label key={event.id} className={styles.option}>
            <input
              type="radio"
              name="event"
              value={eventKey(event)}
              defaultChecked={eventKey(event) === chosen}
            />
            <span>
              <b>{event.name}</b>
              <small>
                {sportName(event.sportSlug)} ·{' '}
                {format.dateTime(parseIsoDate(event.date), dateFormats.full)} · {event.venue}
              </small>
            </span>
            {event.status === 'this-week' && <EventStatusTag status={event.status} />}
          </label>
        ))}
        {eventError && (
          <span id="event-error" className={styles.fieldError}>
            {eventError}
          </span>
        )}
      </fieldset>
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
      <TextField
        label={t('team')}
        name="team"
        defaultValue={form.previous('team')}
        error={form.errorFor('team')}
      />
      <Honeypot />
      <div>
        <SubmitButton>{t('submit')}</SubmitButton>
      </div>
    </form>
  );
}
