/**
 * PLAYWRIGHT CONCEPT: Accessible locators
 * What it is: Playwright encourages queries tied to the accessibility tree instead of DOM structure or CSS selectors.
 * Why Playwright does it this way: accessible locators are less fragile, more semantic, and align better with modern UI testing.
 * If you're coming from Selenium/RestAssured: this is a shift from CSS/XPath-first automation to user-facing selectors, which improves resilience and readability.
 * Common mistake to avoid: using CSS selectors for every element because they are tightly coupled to the DOM and break when structure changes.
 */
import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator = this.page.getByPlaceholder('Username');
  // WHY: placeholder is chosen over CSS because it matches the real user-facing field name and is resilient to markup refactors.

  readonly passwordInput: Locator = this.page.getByPlaceholder('Password');
  // WHY: getByPlaceholder is preferred because it is easier to read and tied to user-visible labeling, not implementation details.

  readonly loginButton: Locator = this.page.getByRole('button', { name: /login/i });
  // WHY: getByRole is preferred over CSS or XPath because it targets the accessibility tree and matches how real users interact with the page.

  readonly errorMessage: Locator = this.page.getByText(/Username and password do not match|Sorry, this user has been locked out/i);
  // WHY: matching the visible error text is more resilient than relying on a class name or a CSS selector for the alert container.

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout(): Promise<void> {
    await this.page.getByRole('button', { name: /open menu/i }).click();
    await this.page.getByRole('link', { name: /logout/i }).click();
    await expect(this.page).toHaveURL(/\/login\.html$/);
  }
}
