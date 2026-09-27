/**
 * PLAYWRIGHT CONCEPT: Browser automation with page.evaluate()
 * What it is: page.evaluate() executes JavaScript in the page context and returns a value to the test.
 * Why Playwright does it this way: some operations are easier to express as JS than as locator actions, especially DOM state and browser-side values.
 * If you're coming from Selenium/RestAssured: this is the equivalent of JavaScriptExecutor, but cleaner and more naturally integrated with Playwright's page model.
 * Common mistake to avoid: using page.evaluate() to bypass proper Playwright locators for every interaction; prefer the locator API for UI actions and reserve evaluate() for browser state.
 */
import { expect, test } from '../../fixtures/base.fixture';
import { CartPage } from '../../pages/CartPage';

test.describe('@ui cart behavior', () => {
  test('add a product and verify cart badge count', async ({ authenticatedPage }) => {
    const cartPage = new CartPage(authenticatedPage);

    await cartPage.navigate('/inventory.html');
    await cartPage.waitForLoad();

    const productNames = await cartPage.getVisibleProductNames();
    expect(productNames.length).toBeGreaterThan(0);

    await cartPage.addItemByName(productNames[0]);
    const badgeCount = await cartPage.getCartCount();

    expect(badgeCount).toBeGreaterThanOrEqual(1);
    await expect(authenticatedPage.getByTestId('shopping-cart-badge')).toBeVisible();

    const pageTitle = await authenticatedPage.evaluate(() => document.title);
    expect(pageTitle).toContain('Swag Labs');
    // WHY: page.evaluate() gives access to the browser context without a direct UI element and is often used for reading DOM or JS state that Playwright locators cannot expose elegantly.
  });
});
