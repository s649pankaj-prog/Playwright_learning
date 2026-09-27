/**
 * PLAYWRIGHT CONCEPT: Locator collections and dynamic UI
 * What it is: a Playwright locator can represent a collection of elements and be filtered dynamically without turning it into a raw list immediately.
 * Why Playwright does it this way: the locator API is built for asynchronous, browser-aware element discovery and automatic retries.
 * If you're coming from Selenium/RestAssured: this replaces repeated findElements() + loops with a single locator-driven workflow and richer filtering.
 * Common mistake to avoid: calling .all() too early and working with stale or detached elements instead of filtering the live locator.
 */
import { type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly items: Locator = this.page.getByTestId('inventory-item');
  // WHY: getByTestId is stable when data-testid is intentionally added by the app, which is more resilient than CSS selectors on a generated container.

  readonly cartBadge: Locator = this.page.getByTestId('shopping-cart-badge');
  // WHY: using the test id makes the cart counter explicit and less brittle than parsing the DOM structure.

  async addItemByName(productName: string): Promise<void> {
    const product = this.items.filter({
      has: this.page.getByText(productName, { exact: true }),
    });

    await product.getByRole('button', { name: /add to cart/i }).click();
  }

  async getVisibleProductNames(): Promise<string[]> {
    const itemList = await this.items.all();
    const names: string[] = [];

    for (const item of itemList) {
      const name = await item.getByRole('heading').textContent();
      if (name) {
        names.push(name.trim());
      }
    }

    return names;
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge;
    const countText = await badge.textContent();
    return countText ? Number.parseInt(countText.trim(), 10) : 0;
  }
}

// WHY: this is the Playwright way to handle dynamic list elements: a locator is lazy, filtered, and retried automatically instead of Selenium's imperative findElements loops.
// WHY: locator.all() is useful when you truly need the actual elements as a list, but filter() is preferred when you can reduce the set before acting.
