/**
 * PLAYWRIGHT CONCEPT: Hybrid test design
 * What it is: a single test combines fast API setup with real browser validation to cover the full user journey.
 * Why Playwright does it this way: it allows you to use the fastest possible layer for setup, then verify the actual user experience in the browser without writing a lot of custom plumbing.
 * If you're coming from Selenium/RestAssured: this is a mindset shift from "API tests here, UI tests there" to a layered, realistic end-to-end test strategy.
 * Common mistake to avoid: duplicating setup in both API and UI layers; keep the API call for data creation and the browser for behavior verification.
 *
 * This pattern is powerful because:
 * - it speeds up setup by creating data through the API
 * - it keeps the browser test realistic and user-facing
 * - it reduces login flakiness using storageState
 * - it lets you test failures and edge cases with controlled route intercepts
 */
import { expect, test } from '../../fixtures/base.fixture';
import { UsersAPI } from '../../api-clients/UsersAPI';
import { uniqueName } from '../../utils/helpers';

test.describe('@hybrid user journey', () => {
  test('create via API, continue in authenticated UI, then intercept a browser API call', async ({ authenticatedPage, apiContext }) => {
    const api = new UsersAPI(apiContext);
    const createdName = uniqueName('journey-user');

    const createdUser = await api.createUser({
      name: createdName,
      job: 'Automation Engineer',
    });

    expect(createdUser.status).toBe(201);
    expect(createdUser.body.name).toBe(createdName);

    const page = authenticatedPage;
    await page.goto('/inventory.html');
    await expect(page.getByText('Products')).toBeVisible();

    const routeTarget = 'https://reqres.in/api/users/2';
    await page.route(routeTarget, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: 2,
            email: 'mocked.user@example.com',
            first_name: createdName,
            last_name: 'API',
            avatar: 'https://avatars.example.com/mock.png',
          },
        }),
      });
    });

    const responsePromise = page.waitForResponse((response) => response.url() === routeTarget && response.status() === 200);

    const firstName = await page.evaluate(async (name: string) => {
      const response = await fetch('https://reqres.in/api/users/2');
      const payload = await response.json();
      document.body.setAttribute('data-api-user', payload.data.first_name);
      return payload.data.first_name;
    }, createdName);

    const response = await responsePromise;
    expect(response.ok()).toBeTruthy();
    expect(firstName).toBe(createdName);
    await expect(page.locator('body')).toHaveAttribute('data-api-user', createdName);
    // WHY: page.waitForResponse() is used here to observe the browser's network response and assert the mock call happened exactly as expected.

    // WHY: page.route() is a browser-level network interception mechanism; it is more realistic than mocking HTTP at the library layer because it intercepts the actual request from the page itself.
    // WHY: this is more powerful than a simple Selenium-style mocked driver because the browser sees the same request flow it would in production, while still allowing deterministic test data.
  });
});
