import * as migration_20260926_200035_initial from './20260926_200035_initial';

export const migrations = [
  {
    up: migration_20260926_200035_initial.up,
    down: migration_20260926_200035_initial.down,
    name: '20260926_200035_initial'
  },
];
