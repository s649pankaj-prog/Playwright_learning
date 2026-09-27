# Learning roadmap for the Playwright framework

## 1. Recommended reading order (easy to hard)

1. [package.json](package.json)
   - Learn the scripts, dependency layout, and how the runner is configured.
2. [playwright.config.ts](playwright.config.ts)
   - Learn browser projects, retries, reporters, storage state setup, and test organization.
3. [fixtures/base.fixture.ts](fixtures/base.fixture.ts)
   - Learn Playwright's fixture system and how it replaces manual setup patterns.
4. [pages/BasePage.ts](pages/BasePage.ts)
   - Learn page abstraction, injection, and browser state ownership.
5. [pages/LoginPage.ts](pages/LoginPage.ts)
   - Learn accessible locators and user-centric selectors.
6. [pages/CartPage.ts](pages/CartPage.ts)
   - Learn locator collections, filtering, and dynamic element handling.
7. [auth/storageState.setup.ts](auth/storageState.setup.ts)
   - Learn why auth state reuse is a major Playwright advantage.
8. [api-clients/BaseAPI.ts](api-clients/BaseAPI.ts)
   - Learn the native APIRequestContext and typed client structure.
9. [api-clients/UsersAPI.ts](api-clients/UsersAPI.ts)
   - Learn how domain-specific clients wrap reusable transport code.
10. [utils/apiAssertions.ts](utils/apiAssertions.ts)
    - Learn how to build assertion helpers around Playwright expect().
11. [tests/ui/login.spec.ts](tests/ui/login.spec.ts)
    - Learn test structure, auto-waiting, soft assertions, and step grouping.
12. [tests/ui/cart.spec.ts](tests/ui/cart.spec.ts)
    - Learn page.evaluate() and locator-driven cart flows.
13. [tests/api/users.spec.ts](tests/api/users.spec.ts)
    - Learn API CRUD flows, schema checks, and request timing validation.
14. [tests/hybrid/userJourney.spec.ts](tests/hybrid/userJourney.spec.ts)
    - Learn the most important Playwright hybrid pattern: API setup + browser verification + route interception.

## 2. Five exercises to solidify each concept

### package.json
1. Add a script that runs only the locked-user scenario.
2. Change the default browser from chromium to firefox and re-run the UI suite.
3. Add a `test:smoke` script that targeted only tests tagged with `@smoke`.
4. Add a `typecheck` script and run it after every code change.
5. Add a custom reporter or HTML output folder and compare the output structure.

### playwright.config.ts
1. Remove the global setup and explain what breaks.
2. Run the same suite in headed mode and compare debugging behavior.
3. Toggle retries on CI and off locally, then compare failure output.
4. Split the suite into a smoke project and a full suite project.
5. Add a custom baseURL for a second environment and run one test against it.

### fixtures/base.fixture.ts
1. Add a `loggedOutPage` fixture that starts from a fresh context without storageState.
2. Create a second test using the same fixture and compare page isolation.
3. Add a custom fixture that wraps `page` with a helper method for a repeated login flow.
4. Change `authenticatedPage` to be worker-scoped and explain the trade-off.
5. Write one test that demonstrates fixture teardown by creating a temporary file during setup.

### pages/BasePage.ts and LoginPage.ts
1. Replace the placeholder-based selectors with getByLabel usage if the app exposes labels.
2. Add a method that uses `toHaveURL()` and verify the page transitions after login.
3. Add a direct negative assertion for invalid login using `locator.waitFor({ state: 'visible' })` and compare it with automatic waiting.
4. Add a helper for reading a toast message and assert it with `toContainText()`.
5. Expand the page object to handle a password-reset flow using getByRole and getByText.

### pages/CartPage.ts
1. Filter the product list by a known name and assert the filtered count is 1.
2. Use `locator.all()` to collect all product names and print them in the test output.
3. Add a method that handles an item being removed from the cart and validate the badge count goes back to 0.
4. Use `filter({ has: ... })` and compare the result with a raw `locator.all()` output.
5. Add a second item selection flow and assert the cart count changes from 1 to 2.

### auth/storageState.setup.ts
1. Run the setup once and inspect the saved storage state file.
2. Add a second user and verify the file stores both cookies and local storage data.
3. Remove the file and confirm the UI suite fails until setup runs again.
4. Change the login selector to a more fragile CSS selector and compare the reliability of storageState login.
5. Add a logout step and verify persistent state is cleared correctly.

### api-clients/BaseAPI.ts and UsersAPI.ts
1. Add a helper method for PATCH requests and use it in a new test.
2. Add request-time logging to a file instead of console output.
3. Parse a 429 rate-limit response and assert the retry header behaviour.
4. Create a `UsersAPI` method to fetch a single user by email.
5. Add response schema validation for create/update calls and fail intentionally to see the assertion message.

### utils/apiAssertions.ts
1. Add a helper `assertContainsKeys` for JSON payload verification.
2. Add `assertBetween` for numeric values and a custom error message.
3. Replace `expect.soft` assertions in a test with custom API assertion helpers and compare readability.
4. Add a function to validate a nested object structure.
5. Add an assertion that fails intentionally to observe the Playwright diff output.

### tests/ui/login.spec.ts
1. Add a visual smoke test for the login page header.
2. Add a `test.fixme` block for a known issue and explain why it is not a production blocker.
3. Convert one of the validations to `expect.soft()` and compare the failure output.
4. Split one test into `test.step()` blocks and compare trace readability.
5. Re-run in headed mode and inspect the trace viewer output.

### tests/ui/cart.spec.ts
1. Add a test for removing a product after adding it to the cart.
2. Use a custom `page.route()` to simulate an unavailable cart API and assert the UI still behaves as expected.
3. Add a helper to count all cart items across the page.
4. Replace `document.title` checks with a more meaningful page-level state assertion.
5. Compare `locator.all()` and `filter()` behavior in a failing test to understand the differences.

### tests/api/users.spec.ts
1. Add a negative test for a missing user ID and assert the 404 response.
2. Add a schema assertion for nested support fields inside the user payload.
3. Test the list endpoint pagination and assert `total_pages` is greater than or equal to 1.
4. Add a performance threshold using timed API calls and assert it at the API layer.
5. Compare request chaining with repeated independent calls and explain the trade-off.

### tests/hybrid/userJourney.spec.ts
1. Replace the mocked `reqres` call with a mocked onboarding request from the app under test.
2. Add a full end-to-end login flow with a UI logout and then a new login using storageState.
3. Create a route that fails a request with a 500 and verify the page handles the error state.
4. Add a second `page.route()` after the first one and compare how the call order affects the mock behavior.
5. Convert the hybrid test to a full user journey with a cart item added after login and then validated in the DOM.

## 3. Three common Playwright mistakes from Selenium developers

1. Using CSS or XPath as the default selector strategy instead of accessibly named locators such as `getByRole`, `getByLabel`, `getByPlaceholder`, and `getByTestId`.
   - Playwright is built around user-centric selectors and auto-waiting, not raw DOM traversal.

2. Adding manual waits like `Thread.sleep`, `WebDriverWait`, or arbitrary `setTimeout` loops.
   - Playwright usually waits automatically; explicit waits should be the exception, not the default.

3. Mixing test setup in a global class or reusing the same browser context across tests.
   - In Playwright, state is isolated per test by design; reusing a page or context across tests creates hidden dependency and race problems.

## 4. Exact Playwright docs for the major concepts used here

- Locator API: https://playwright.dev/docs/locators
- Assertions: https://playwright.dev/docs/test-assertions
- Auto-waiting: https://playwright.dev/docs/actionability
- Fixtures: https://playwright.dev/docs/test-fixtures
- `test.describe.configure`: https://playwright.dev/docs/test-parallelism
- `page.route()`: https://playwright.dev/docs/api/class-page#page-route
- `page.waitForResponse()`: https://playwright.dev/docs/api/class-page#page-wait-for-response
- `page.evaluate()`: https://playwright.dev/docs/api/class-page#page-evaluate
- Storage state: https://playwright.dev/docs/auth
- API testing: https://playwright.dev/docs/api-testing
- Configuration: https://playwright.dev/docs/configuration
- Trace viewer: https://playwright.dev/docs/trace-viewer
- HTML reporter: https://playwright.dev/docs/test-reporters
- Codegen: https://playwright.dev/docs/codegen

## Final tip

Read the framework in the order above and deliberately practice each concept in a small, failing test before reusing it in larger flows. Playwright rewards a pattern of "locate, act, assert" and auto-waiting; once those habits are internalized, the browser and API layers feel much more cohesive than Selenium-first stacks.
