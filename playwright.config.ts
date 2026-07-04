import { defineConfig, devices } from '@playwright/test';

/** Smoke-test config: builds the static site once, serves it, and drives it headless.
    Uses the pre-installed Chromium (see CLAUDE.md / CI) instead of downloading a fresh one. */
export default defineConfig({
  testDir: './tests/e2e',
  // Each test drives a full real registration+auth flow (canvas captcha, multi-step forms) —
  // give it real headroom instead of the 30s default, especially under CI/sandbox CPU contention.
  timeout: 45_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // This repo's pinned @playwright/test version expects a newer bundled Chromium build
        // than what's pre-installed in this environment — point at the pre-installed binary
        // instead of downloading a fresh one. CI installs its own via `playwright install`.
        launchOptions: process.env.CI ? {} : { executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' },
      },
    },
  ],
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
