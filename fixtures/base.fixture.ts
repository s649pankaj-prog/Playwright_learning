/**
 * PLAYWRIGHT CONCEPT: test.extend() and fixtures
 * What it is: Playwright fixtures are dependency-injected setup objects that are provided to each test automatically.
 * Why Playwright does it this way: fixtures remove the need for manual @BeforeEach and @AfterEach wiring while keeping setup scoping and lifecycle management explicit.
 * If you're coming from Selenium/RestAssured: this is the Playwright equivalent of a test harness or test setup layer, but much more flexible and built into the runner.
 * Common mistake to avoid: creating global state in the file or reusing the same page object across tests; Playwright fixtures are designed to isolate browser state per test.
 *
 * Scope behavior:
 * - test-scoped fixtures run once per test and are great for page objects, new browser contexts, or per-test data.
 * - worker-scoped fixtures share state across tests in the same worker and are ideal for expensive setup that does not mutate test-specific state.
 * - Playwright uses fixture dependency graphs and clean teardown automatically, which is stronger than a Selenium @BeforeEach hook because it is data-aware and runs with parallel execution in mind.
 */
import { test as base, expect, type APIRequestContext, type Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type AppFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
  apiContext: APIRequestContext;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'playwright/.auth/user.json' });
    const page = await context.newPage();

    try {
      await use(page);
    } finally {
      await context.close();
    }
  },
  apiContext: async ({ request }, use) => {
    await use(request);
  },
});

export { expect };

// WHY: test.extend() is Playwright's dependency-injection system; it makes setup reusable, readable, and scoped without relying on @BeforeEach boilerplate.
// WHY: using authenticatedPage with storageState means a browser context loads saved cookies and local storage directly, which is much faster and less flaky than repetitive UI login flows.
