/*
 * Loads the sample dataset into the database, so a fresh environment looks like the prototype.
 *
 *   pnpm seed         seed an empty database (does nothing if events already exist)
 *   pnpm seed:reset   delete events, partners and sports first, then seed
 *
 * If SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are set and there are no users yet, an admin
 * account is created with them. Never reset production.
 */
import config from '@payload-config';
import { getPayload } from 'payload';

import { generateSampleDataset } from '@/lib/data/sample/generate';
import {
  HERO_POSTER_EVENT_IDS,
  SAMPLE_DEFAULT_YEAR,
  SHOWCASE_EVENT_ID,
} from '@/lib/data/sample/content';

const context = { disableRevalidate: true };
const noon = (date: string) => `${date}T12:00:00.000Z`;

const payload = await getPayload({ config });
// `payload run` replaces process.argv, so options come from the environment.
const reset = process.env.SEED_RESET === '1';

const { totalDocs: existingEvents } = await payload.count({ collection: 'events' });
if (existingEvents > 0 && !reset) {
  payload.logger.info('The database already has events. Run `pnpm seed:reset` to replace them.');
  process.exit(0);
}

if (reset) {
  for (const collection of ['events', 'partners', 'sports'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } }, context });
  }
}

const dataset = generateSampleDataset();

const sportIds = new Map<string, number>();
for (const [order, sport] of dataset.sports.entries()) {
  const doc = await payload.create({
    collection: 'sports',
    data: { ...sport, order },
    context,
  });
  sportIds.set(sport.slug, doc.id);
}

const partnerIds = new Map<string, number>();
for (const [order, partner] of dataset.partners.entries()) {
  const doc = await payload.create({
    collection: 'partners',
    data: {
      name: partner.name,
      order,
      placeholderMark: partner.logo.kind === 'placeholder' ? partner.logo.variant : null,
    },
    context,
  });
  partnerIds.set(partner.id, doc.id);
}

const eventIds = new Map<string, number>();
for (const event of dataset.events) {
  const competition = event.competition;
  const codeOf = (teamId: string) =>
    competition.kind === 'team'
      ? (competition.teams.find((t) => t.id === teamId)?.code ?? teamId)
      : teamId;

  const doc = await payload.create({
    collection: 'events',
    context,
    data: {
      _status: 'published',
      name: event.name,
      slug: event.slug,
      sport: sportIds.get(event.sportSlug)!,
      date: noon(event.date),
      venue: event.venue,
      city: event.city,
      accent: event.accent,
      schedule: event.schedule.map((day) => ({
        date: noon(day.date),
        title: day.title,
        slots: day.slots,
      })),
      ...(competition.kind === 'team'
        ? {
            teams: competition.teams.map((team) => ({
              name: team.name,
              code: team.code,
              group: team.group,
              crestFill: team.crest[0],
              crestInk: team.crest[1],
              players: team.players,
            })),
            matches: competition.matches.map((match) => ({
              stage: match.stage,
              group: match.group ?? null,
              round: match.round ?? null,
              homeTeam: codeOf(match.homeTeamId),
              awayTeam: codeOf(match.awayTeamId),
              homeGoals: match.homeGoals,
              awayGoals: match.awayGoals,
              penaltyWinner: match.penaltyWinner ?? null,
            })),
          }
        : {
            distance: competition.distance,
            heats: competition.heats.map((heat) => ({
              number: heat.number,
              startTime: heat.startTime,
              lanes: heat.lanes.map((lane) => ({
                lane: lane.lane,
                athlete: lane.athlete?.name ?? null,
                club: lane.athlete?.club ?? null,
                time: lane.time,
              })),
            })),
          }),
      modules: event.modules.map((blockType) => {
        switch (blockType) {
          case 'story':
            return { blockType, ...event.story };
          case 'venue':
            return { blockType, surface: event.venueSurface };
          case 'partners':
            return { blockType, partners: event.partners.map((p) => partnerIds.get(p.id)!) };
          default:
            return { blockType };
        }
      }),
    },
  });
  eventIds.set(event.id, doc.id);
}

await payload.updateGlobal({
  slug: 'site-settings',
  context,
  data: {
    defaultSeasonYear: SAMPLE_DEFAULT_YEAR,
    showPrototypeBadge: true,
    showcaseEvent: eventIds.get(SHOWCASE_EVENT_ID) ?? null,
    heroPosterEvents: HERO_POSTER_EVENT_IDS.flatMap((id) => {
      const dbId = eventIds.get(id);
      return dbId ? [dbId] : [];
    }).slice(0, 2),
  },
});

const { SEED_ADMIN_EMAIL: email, SEED_ADMIN_PASSWORD: password } = process.env;
const { totalDocs: users } = await payload.count({ collection: 'users' });
if (email && password && users === 0) {
  await payload.create({
    collection: 'users',
    data: { email, password, name: 'Base Camp admin', role: 'admin' },
    context,
  });
  payload.logger.info(`Created admin account ${email}.`);
}

payload.logger.info(
  `Seeded ${sportIds.size} sports, ${partnerIds.size} partners and ${eventIds.size} events.`,
);
process.exit(0);
