import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TextField } from './FormField';

describe('TextField', () => {
  it('labels the input', () => {
    render(<TextField label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('name', 'email');
  });

  it('marks the input invalid and describes it with the error', () => {
    render(<TextField label="Email" name="email" error="Use an email like name@example.com." />);
    const input = screen.getByLabelText('Email');
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription('Use an email like name@example.com.');
  });

  it('is not marked invalid without an error', () => {
    render(<TextField label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).not.toHaveAttribute('aria-invalid');
  });
});
