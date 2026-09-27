/**
 * PLAYWRIGHT CONCEPT: UI assertions and auto-waiting
 * What it is: Playwright locators and expectations automatically wait for conditions to become true.
 * Why Playwright does it this way: waiting is a first-class behavior in the runner and is designed to reduce flaky tests.
 * If you're coming from Selenium/RestAssured: Selenium often requires explicit waits; Playwright's expect() and locators implicitly poll until the page is ready.
 * Common mistake to avoid: writing assertions against stale DOM nodes without giving Playwright a chance to retry them.
 */
import { expect, test } from '../../fixtures/base.fixture';

test.describe('@ui SauceDemo login', () => {
  test.describe.configure({ mode: 'parallel' });
  // WHY: test.describe.configure({ mode: 'parallel' }) controls concurrency at the suite level, which is clearer than sprinkling thread settings across the codebase.

  test('valid login', async ({ loginPage, page }) => {
    await test.step('Navigate and sign in with valid user', async () => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');
    });

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByText('Products')).toBeVisible();
    // WHY: expect(locator).toBeVisible() is a browser-aware assertion that waits until the element is visible, which is the Playwright equivalent of a stable, self-healing check.

    await expect.soft(page.getByText('Products')).toBeVisible();
    // WHY: expect.soft() is useful when you want to collect several UI failures in one test run instead of stopping at the first failure.
  });

  test('invalid login shows an error', async ({ loginPage, page }) => {
    await test.step('Submit invalid credentials', async () => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'wrong_password');
    });

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(page.getByText(/Username and password do not match/i)).toBeVisible();
  });

  test('locked user shows locked-out message', async ({ loginPage, page }) => {
    await test.step('Submit locked-user credentials', async () => {
      await loginPage.goto();
      await loginPage.login('locked_out_user', 'secret_sauce');
    });

    await expect(page.getByText(/Sorry, this user has been locked out/i)).toBeVisible();
  });
});
