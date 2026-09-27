/**
 * PLAYWRIGHT CONCEPT: Storage state
 * What it is: Playwright can save a browser context's storage cookies/localStorage and reuse it in later tests.
 * Why Playwright does it this way: authentication state is browser state, and tests should reuse a real user session instead of replaying login flows.
 * If you're coming from Selenium/RestAssured: this is similar to reusing a logged-in session or a cookie jar, but built into the browser automation lifecycle.
 * Common mistake to avoid: logging in every test with UI steps; it is slower, flaky, and often duplicates setup logic.
 */
import { chromium, type FullConfig } from '@playwright/test';
import path from 'node:path';
import { LoginPage } from '../pages/LoginPage';

const authFile = path.resolve(__dirname, '../playwright/.auth/user.json');

async function globalSetup(_config: FullConfig): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const loginPage = new LoginPage(page);

  await page.goto('https://www.saucedemo.com');
  await loginPage.login(process.env.SAUCEDEMO_USERNAME ?? 'standard_user', process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce');

  await page.waitForURL(/\/inventory\.html$/);
  await page.context().storageState({ path: authFile });

  await browser.close();
}

export default globalSetup;

// WHY: storageState is a game-changer because it persists authenticated browser state to disk and is loaded automatically for later tests, avoiding repetitive login UI work.
// WHY: globalSetup runs once before the suite and writes the user.json file, which is more stable than intercepting login in each test case.
