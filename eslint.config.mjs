import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/** Import-direction rules from ADR 0009: app → features → components/ui → styles. */
const noDeepFeatureImports = {
  group: ['@/features/*/**'],
  message:
    "Import a feature through its public entry point ('@/features/<name>'), not its internals.",
};
const noImportsFrom = (layers, reason) =>
  layers.map((layer) => ({ group: [`@/${layer}`, `@/${layer}/**`], message: reason }));

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
    'prototype/**',
  ]),
  ...nextVitals,
  ...nextTypescript,
  {
    // eslint-config-next registers the jsx-a11y plugin but enables only a few rules.
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-restricted-imports': ['error', { patterns: [noDeepFeatureImports] }],
    },
  },
  {
    files: ['src/components/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            noDeepFeatureImports,
            ...noImportsFrom(
              ['app', 'features', 'lib/data'],
              'Shared components must stay domain-agnostic (ADR 0009).',
            ),
          ],
        },
      ],
    },
  },
  {
    files: ['src/features/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            noDeepFeatureImports,
            ...noImportsFrom(
              ['app', 'lib/data'],
              'Features receive data as props; routes fetch it (ADR 0009).',
            ),
          ],
        },
      ],
    },
  },
  {
    files: ['src/domain/**', 'src/lib/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...noImportsFrom(
              ['app', 'features', 'components'],
              'Domain and lib code must not depend on UI (ADR 0009).',
            ),
          ],
        },
      ],
    },
  },
  {
    // Tests may use the sample dataset as fixtures, wherever they live.
    files: ['**/*.test.{ts,tsx}'],
    rules: { 'no-restricted-imports': 'off' },
  },
  prettier,
]);
