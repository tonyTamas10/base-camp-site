import { describe, expect, it } from 'vitest';

import { contactSchema, registrationSchema, sponsorSchema, validate } from './schemas';

describe('validate', () => {
  it('returns trimmed values when valid', () => {
    const result = validate(contactSchema, {
      name: '  Ana  ',
      email: 'ana@example.com ',
      message: 'Hi',
    });
    expect(result).toEqual({
      ok: true,
      value: { name: 'Ana', email: 'ana@example.com', message: 'Hi' },
    });
  });

  it('reports one error code per field', () => {
    const result = validate(contactSchema, { name: ' ', email: 'not-an-email', message: '' });
    expect(result).toEqual({
      ok: false,
      errors: { name: 'required', email: 'invalidEmail', message: 'required' },
    });
  });

  it('treats a missing email as required rather than invalid', () => {
    const result = validate(registrationSchema, { event: 'x', name: 'Ana', email: '' });
    expect(result.ok || result.errors.email).toBe('required');
  });

  it('defaults optional fields and rejects unknown choices', () => {
    const valid = validate(sponsorSchema, {
      organisation: 'Club',
      email: 'a@b.ro',
      interest: 'kit',
    });
    expect(valid.ok && valid.value.message).toBe('');

    const invalid = validate(sponsorSchema, {
      organisation: 'Club',
      email: 'a@b.ro',
      interest: 'yacht',
    });
    expect(invalid.ok || invalid.errors.interest).toBe('invalidChoice');
  });

  it('limits length', () => {
    const result = validate(contactSchema, {
      name: 'x'.repeat(121),
      email: 'a@b.ro',
      message: 'm',
    });
    expect(result.ok || result.errors.name).toBe('tooLong');
  });
});
