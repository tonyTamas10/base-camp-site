/*
 * Payload generates migrations that import TypeScript types as values, which fails under this
 * project's `verbatimModuleSyntax` and at runtime. Run after `payload migrate:create`
 * (the `pnpm migrate:create` script does this) to mark them as type-only imports.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const DIR = 'src/migrations';
const TYPE_NAMES = ['MigrateUpArgs', 'MigrateDownArgs'];

for (const file of readdirSync(DIR).filter((name) => /^\d.*\.ts$/.test(name))) {
  const path = `${DIR}/${file}`;
  const source = readFileSync(path, 'utf8');
  const fixed = source.replace(
    /import \{([^}]*)\} from '@payloadcms\/db-postgres'/,
    (_, names: string) => {
      const specifiers = names
        .split(',')
        .map((name) => name.trim())
        .filter(Boolean)
        .map((name) => (TYPE_NAMES.includes(name) ? `type ${name}` : name));
      return `import { ${specifiers.join(', ')} } from '@payloadcms/db-postgres'`;
    },
  );
  if (fixed !== source) {
    writeFileSync(path, fixed);
    console.log(`Fixed type imports in ${path}`);
  }
}
