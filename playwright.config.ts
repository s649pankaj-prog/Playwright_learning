/**
 * PLAYWRIGHT CONCEPT: Projects and configuration
 * What it is: Playwright config centralizes runner behavior, browsers, retries, reporters, and test splitting.
 * Why Playwright does it this way: configuration is declarative and test-aware, similar to a suite file but much more flexible.
 * If you're coming from Selenium/RestAssured: this replaces suite XML, testng.xml, and test properties in one place.
 * Common mistake to avoid: mixing UI and API configuration in one project, which hides environment differences and makes debugging harder.
 */
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const authFile = path.resolve(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  globalSetup: require.resolve('./auth/storageState.setup.ts'),
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    ignoreHTTPSErrors: true,
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'setup',
      testDir: './auth',
      testMatch: '**/*.setup.ts',
      testIgnore: ['**/storageState.setup.ts'],
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'chromium',
      testDir: './tests',
      grepInvert: /@api/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
    },
    {
      name: 'firefox',
      testDir: './tests',
      grepInvert: /@api/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Firefox'],
        storageState: authFile,
      },
    },
    {
      name: 'webkit',
      testDir: './tests',
      grepInvert: /@api/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Safari'],
        storageState: authFile,
      },
    },
    {
      name: 'api',
      testDir: './tests',
      grep: /@api/,
      use: {
        baseURL: 'https://reqres.in/api',
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
  ],
});

// WHY: the "projects" array is Playwright's equivalent of a test-suite matrix; it is more flexible than TestNG suite XML because it combines browser, environment, and setup logic in one config.
// WHY: globalSetup runs once before the suite and creates a shared auth state file; this is better than logging in in every test because it cuts runtime, reduces flakiness, and centralizes the login path.
