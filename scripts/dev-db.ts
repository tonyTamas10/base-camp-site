/*
 * Local development database: a real Postgres 17 run from npm, no Docker or system install
 * needed (ADR 0011). Keep it running in its own terminal while you work: `pnpm db`.
 */
import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';

const DATA_DIR = '.postgres/data';
const PORT = 5433;
/** The development database, and a separate one that tests and production rehearsals can reset. */
const DATABASES = ['basecamp', 'basecamp_test'];

const postgres = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: 'basecamp',
  password: 'basecamp',
  port: PORT,
  persistent: true,
  onLog: () => {},
});

if (!existsSync(`${DATA_DIR}/PG_VERSION`)) await postgres.initialise();
await postgres.start();
for (const database of DATABASES) {
  try {
    await postgres.createDatabase(database);
  } catch {
    // Already exists.
  }
}

for (const database of DATABASES) {
  console.log(`Postgres is running: postgres://basecamp:basecamp@localhost:${PORT}/${database}`);
}
console.log('Press Ctrl+C to stop.');

const stop = async () => {
  await postgres.stop();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
