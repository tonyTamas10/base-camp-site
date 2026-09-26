import type { CollectionConfig, FieldHook } from 'payload';
import { APIError } from 'payload';

import { DEFAULT_EVENT_MODULES } from '@/domain/event';
import { slugify } from '@/lib/slugify';

import { isStaff, publishedOrStaff } from '../access';
import { EVENT_MODULE_BLOCKS } from '../blocks/eventModules';
import { slugField } from '../fields/slug';
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidateSite';

const hex = (value: string | null | undefined) =>
  !value || /^#[0-9a-fA-F]{6}$/.test(value) ? true : 'Use a hex colour like #FF5B1A.';

const isTeam = (data: Record<string, unknown> | undefined) => data?.kind === 'team';
const isTrack = (data: Record<string, unknown> | undefined) => data?.kind === 'track';

/** Matches must name teams entered above, by their code. */
const validateTeamCode = (
  value: string | null | undefined,
  { data }: { data: Record<string, unknown> },
) => {
  const codes = ((data.teams as Array<{ code?: string }> | undefined) ?? []).map(
    (team) => team.code,
  );
  return value && codes.includes(value) ? true : 'Use the code of one of the teams above.';
};

const yearOf = (date: unknown) => (typeof date === 'string' ? date.slice(0, 4) : '');

const fillSlug: FieldHook = ({ value, data }) =>
  value || (data?.name ? slugify(`${data.name} ${yearOf(data.date)}`) : value);

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sport', 'date', '_status'],
    group: 'Content',
    listSearchableFields: ['name', 'venue'],
  },
  defaultSort: '-date',
  versions: { drafts: { autosave: false }, maxPerDoc: 25 },
  access: { read: publishedOrStaff, create: isStaff, update: isStaff, delete: isStaff },
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // The kind of results an event records follows its sport.
        const sportId = typeof data.sport === 'object' ? data.sport?.id : data.sport;
        if (sportId) {
          const sport = await req.payload.findByID({
            collection: 'sports',
            id: sportId,
            req,
            depth: 0,
          });
          data.kind = sport.kind;

          // Slugs are unique within a sport.
          const clash = await req.payload.find({
            collection: 'events',
            where: {
              and: [
                { sport: { equals: sportId } },
                { slug: { equals: data.slug } },
                ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
              ],
            },
            limit: 1,
            depth: 0,
            req,
            draft: true,
          });
          if (clash.totalDocs > 0) {
            throw new APIError(
              `Another ${sport.name} event already uses the slug “${data.slug}”.`,
              400,
            );
          }
        }
        // Stored so listings never need to load full rosters.
        data.participants =
          data.kind === 'track'
            ? (data.heats ?? []).reduce(
                (sum: number, heat: { lanes?: Array<{ athlete?: string | null }> }) =>
                  sum + (heat.lanes ?? []).filter((lane) => lane.athlete).length,
                0,
              )
            : (data.teams ?? []).reduce(
                (sum: number, team: { players?: unknown[] }) => sum + (team.players ?? []).length,
                0,
              );

        // New events start with their sport's default page sections.
        if (operation === 'create' && (!data.modules || data.modules.length === 0) && data.kind) {
          data.modules = DEFAULT_EVENT_MODULES[data.kind as 'team' | 'track'].map((blockType) =>
            blockType === 'story' ? { blockType, pullQuote: data.name ?? '' } : { blockType },
          );
        }
        return data;
      },
    ],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Event',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              type: 'row',
              fields: [
                { name: 'sport', type: 'relationship', relationTo: 'sports', required: true },
                {
                  name: 'date',
                  type: 'date',
                  required: true,
                  admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'venue', type: 'text', required: true },
                { name: 'city', type: 'text', required: true, defaultValue: 'Cluj-Napoca' },
              ],
            },
            {
              name: 'accent',
              type: 'select',
              required: true,
              defaultValue: 'amber',
              options: [
                { label: 'Signal orange', value: 'signal' },
                { label: 'Amber', value: 'amber' },
                { label: 'Pale blue', value: 'pale-blue' },
                { label: 'Mint', value: 'mint' },
                { label: 'Rose', value: 'rose' },
              ],
              admin: { description: 'Colour used inside the poster and on the card rule.' },
            },
            {
              name: 'schedule',
              type: 'array',
              labels: { singular: 'Day', plural: 'Days' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'date',
                      type: 'date',
                      required: true,
                      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMM yyyy' } },
                    },
                    { name: 'title', type: 'text', required: true },
                  ],
                },
                {
                  name: 'slots',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'time', type: 'text', required: true, admin: { width: '20%' } },
                        { name: 'title', type: 'text', required: true },
                        { name: 'detail', type: 'text' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Results',
          description:
            'Standings, the bracket, rankings and records are calculated from these results. Save after choosing the sport to see the right fields.',
          fields: [
            {
              name: 'teams',
              type: 'array',
              admin: { condition: isTeam },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', required: true },
                    {
                      name: 'code',
                      type: 'text',
                      required: true,
                      maxLength: 3,
                      admin: { width: '15%', description: 'e.g. NS' },
                    },
                    {
                      name: 'group',
                      type: 'select',
                      required: true,
                      options: ['A', 'B'],
                      admin: { width: '15%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'crestFill',
                      type: 'text',
                      required: true,
                      defaultValue: '#FF5B1A',
                      validate: hex,
                    },
                    {
                      name: 'crestInk',
                      type: 'text',
                      required: true,
                      defaultValue: '#050A2C',
                      validate: hex,
                    },
                  ],
                },
                {
                  name: 'players',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'name', type: 'text', required: true },
                        {
                          name: 'goals',
                          type: 'number',
                          min: 0,
                          defaultValue: 0,
                          admin: { width: '20%' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              name: 'matches',
              type: 'array',
              admin: { condition: isTeam },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'stage',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Group', value: 'group' },
                        { label: 'Semi-final', value: 'semi-final' },
                        { label: '3rd place', value: 'third-place' },
                        { label: 'Final', value: 'final' },
                      ],
                    },
                    {
                      name: 'group',
                      type: 'select',
                      options: ['A', 'B'],
                      admin: { condition: (_, sibling) => sibling?.stage === 'group' },
                    },
                    {
                      name: 'round',
                      type: 'number',
                      min: 1,
                      admin: { condition: (_, sibling) => sibling?.stage === 'group' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'homeTeam', type: 'text', required: true, validate: validateTeamCode },
                    { name: 'homeGoals', type: 'number', required: true, min: 0 },
                    { name: 'awayGoals', type: 'number', required: true, min: 0 },
                    { name: 'awayTeam', type: 'text', required: true, validate: validateTeamCode },
                  ],
                },
                {
                  name: 'penaltyWinner',
                  type: 'select',
                  options: [
                    { label: 'Home won on penalties', value: 'home' },
                    { label: 'Away won on penalties', value: 'away' },
                  ],
                  admin: { condition: (_, sibling) => sibling?.stage !== 'group' },
                },
              ],
            },
            {
              name: 'distance',
              type: 'text',
              admin: { condition: isTrack, description: 'e.g. 100m' },
            },
            {
              name: 'heats',
              type: 'array',
              admin: { condition: isTrack },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'number', type: 'number', required: true, min: 1 },
                    {
                      name: 'startTime',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g. 10:20' },
                    },
                  ],
                },
                {
                  name: 'lanes',
                  type: 'array',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'lane',
                          type: 'number',
                          required: true,
                          min: 1,
                          admin: { width: '15%' },
                        },
                        {
                          name: 'athlete',
                          type: 'text',
                          admin: { description: 'Leave empty for an empty lane.' },
                        },
                        { name: 'club', type: 'text' },
                        {
                          name: 'time',
                          type: 'number',
                          min: 0,
                          admin: { width: '20%', step: 0.01 },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Page',
          fields: [
            {
              name: 'modules',
              label: 'Page sections',
              type: 'blocks',
              blocks: EVENT_MODULE_BLOCKS,
              admin: {
                description:
                  'The sections of the event page, in order. Result sections only appear when the event has matching results.',
              },
            },
          ],
        },
      ],
    },
    {
      ...slugField(
        'Used in URLs: /events/<sport>/<slug>. Filled from the name and year if left empty.',
      ),
      hooks: { beforeValidate: [fillSlug] },
    },
    {
      name: 'kind',
      type: 'select',
      options: ['team', 'track'],
      admin: { position: 'sidebar', readOnly: true, description: 'Set from the sport.' },
    },
    {
      name: 'participants',
      type: 'number',
      admin: { position: 'sidebar', readOnly: true, description: 'Counted from the results.' },
    },
  ],
};
