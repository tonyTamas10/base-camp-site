import { describe, expect, it } from 'vitest';

import { generateSampleDataset } from '@/lib/data/sample/generate';

import { applicableModules } from './registry';

const { events } = generateSampleDataset();
const teamEvent = events.find((event) => event.competition.kind === 'team')!;
const trackEvent = events.find((event) => event.competition.kind === 'track')!;

describe('applicableModules', () => {
  it('keeps the editor’s order', () => {
    expect(applicableModules(teamEvent)).toEqual(teamEvent.modules);
  });

  it('skips result modules that belong to the other kind of competition', () => {
    const mixed = { ...trackEvent, modules: ['story', 'bracket', 'heats', 'groups'] as const };
    expect(applicableModules({ ...mixed, modules: [...mixed.modules] })).toEqual([
      'story',
      'heats',
    ]);
  });
});
