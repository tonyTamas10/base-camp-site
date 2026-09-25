import { defineConfig, devices } from '@playwright/test';

const PORT = 3000;
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  // Desktop and phone layouts differ substantially (dial, deck, navigation), so both are tested.
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // CI tests the production build; locally the dev server is reused if already running.
    // Runs `next` directly: pnpm doesn't forward the stop signal, which leaves teardown hanging.
    command: isCI ? 'next start' : 'next dev',
    port: PORT,
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
});
