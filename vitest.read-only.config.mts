import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

/**
 * Live GET / Query / Search suite. Must not load tests/global-setup.ts
 * (that setup creates a contact unless VITEST_UNIT_ONLY=1).
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    hookTimeout: 60_000,
    testTimeout: 30_000,
    include: ['tests/read-only/**/*.test.ts'],
    env: {
      VITEST_UNIT_ONLY: '1',
    },
    fileParallelism: false,
    maxConcurrency: 1,
    sequence: {
      concurrent: false,
      shuffle: false,
      hooks: 'list',
    },
    alias: {
      'virtuous-ts': path.resolve(root, './src'),
    },
  },
});
