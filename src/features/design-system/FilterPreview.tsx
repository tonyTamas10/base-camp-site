'use client';

import { useState } from 'react';

import { SegmentedControl } from '@/components/ui/SegmentedControl';

const OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'past', label: 'Past' },
  { value: 'now', label: 'Now' },
  { value: 'next', label: 'Next' },
] as const;

/** A working segmented control, so reviewers can try its states. */
export function FilterPreview() {
  const [value, setValue] = useState<(typeof OPTIONS)[number]['value']>('all');
  return (
    <SegmentedControl label="Example filter" options={OPTIONS} value={value} onChange={setValue} />
  );
}
