// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    hookTimeout: 60000, // 60 seconds for hooks (beforeAll, etc.)
    include: ['tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules', 'dist', 'tests/**'],
    },
    // Create shared contact before all tests run
    globalSetup: './tests/global-setup.ts',
    // Run tests sequentially to ensure shared contact is created first
    fileParallelism: false,
    maxConcurrency: 1,
    sequence: {
      concurrent: false,
      shuffle: false,
      hooks: 'list',
    },
    alias: {
      'virtuous-ts': path.resolve(__dirname, './src'),
    },
  },
});
