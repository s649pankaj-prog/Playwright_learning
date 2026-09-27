/**
 * PLAYWRIGHT CONCEPT: Page object model with injected Page
 * What it is: a reusable page wrapper that owns a Playwright Page instance instead of creating a new one from scratch.
 * Why Playwright does it this way: the browser page is a runtime object that is created per test and should be passed explicitly to maintain isolation and parallel safety.
 * If you're coming from Selenium/RestAssured: Selenium traditionally stores a WebDriver in a class field or base class; Playwright prefers passing the Page into page objects for cleaner dependency injection and test scoping.
 * Common mistake to avoid: extending a page class with a global driver or storing browser state in static fields; that breaks isolation.
 */
import { Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
  }
}

// WHY: Playwright Page is passed in rather than inherited because each test gets a fresh browser context and page, so state stays isolated and parallel-safe.
