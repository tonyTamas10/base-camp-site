/*
 * The event module registry: one entry per module type an event page can contain.
 *
 * To add a module:
 *   1. Add its type to `EventModuleType` in src/domain/event.ts.
 *   2. Create modules/<Name>/<Name>.tsx taking `EventModuleProps`.
 *   3. Register it below (and, in phase 3, add the matching Payload block).
 * The page renders whatever modules an event lists, in order, skipping ones that don't apply.
 */
import type { ReactNode } from 'react';

import type { EventDetail, EventModuleType } from '@/domain/event';
import type { SportKind } from '@/domain/sport';

import { Bracket } from './Bracket/Bracket';
import { Gallery } from './Gallery/Gallery';
import { Groups } from './Groups/Groups';
import { Heats } from './Heats/Heats';
import { Partners } from './Partners/Partners';
import { Players } from './Players/Players';
import { Rankings } from './Rankings/Rankings';
import { Records } from './Records/Records';
import { Registration } from './Registration/Registration';
import { Related } from './Related/Related';
import { Results } from './Results/Results';
import { Schedule } from './Schedule/Schedule';
import { Stats } from './Stats/Stats';
import { Story } from './Story/Story';
import { Teams } from './Teams/Teams';
import type { EventModuleProps } from './types';
import { Venue } from './Venue/Venue';

interface ModuleDefinition {
  component: (props: EventModuleProps) => Promise<ReactNode> | ReactNode;
  /** Modules that read results only make sense for one kind of competition. */
  onlyFor?: SportKind;
}

export const EVENT_MODULES: Record<EventModuleType, ModuleDefinition> = {
  story: { component: Story },
  stats: { component: Stats },
  schedule: { component: Schedule },
  teams: { component: Teams, onlyFor: 'team' },
  groups: { component: Groups, onlyFor: 'team' },
  bracket: { component: Bracket, onlyFor: 'team' },
  results: { component: Results, onlyFor: 'team' },
  players: { component: Players, onlyFor: 'team' },
  heats: { component: Heats, onlyFor: 'track' },
  rankings: { component: Rankings, onlyFor: 'track' },
  records: { component: Records, onlyFor: 'track' },
  venue: { component: Venue },
  gallery: { component: Gallery },
  partners: { component: Partners },
  registration: { component: Registration },
  related: { component: Related },
};

/** The event's modules that can actually render, in the order the editor chose. */
export function applicableModules(event: EventDetail): EventModuleType[] {
  return event.modules.filter((type) => {
    const definition = EVENT_MODULES[type];
    return !definition.onlyFor || definition.onlyFor === event.competition.kind;
  });
}
