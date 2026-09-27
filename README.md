# Playwright TypeScript Framework

This project is a Playwright-based automation framework for:
- UI testing on SauceDemo
- API testing on ReqRes
- Hybrid scenarios that combine API setup + browser validation

It is designed to help a Selenium/API automation engineer learn Playwright's testing model and conventions while still being production-friendly.

## Project structure

```text
playwright-framework/
├── README.md
├── LEARNING-ROADMAP.md
├── .env
├── package.json
├── tsconfig.json
├── playwright.config.ts
├── auth/
│   └── storageState.setup.ts
├── pages/
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   └── CartPage.ts
├── api-clients/
│   ├── BaseAPI.ts
│   └── UsersAPI.ts
├── fixtures/
│   └── base.fixture.ts
├── utils/
│   ├── apiAssertions.ts
│   └── helpers.ts
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts
│   │   └── cart.spec.ts
│   ├── api/
│   │   └── users.spec.ts
│   └── hybrid/
│       └── userJourney.spec.ts
└── playwright/
    └── .auth/
        └── user.json
```

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
npm install
npx playwright install
```

## Environment

The project reads secrets and config from `.env`:

```env
SAUCEDEMO_USERNAME=standard_user
SAUCEDEMO_PASSWORD=secret_sauce
REQRES_BASE_URL=https://reqres.in/api
```

## First-time run (beginner-friendly)

From the project root:

```bash
npm install
npx playwright install
npx playwright test --project=api --reporter=line
npx playwright test tests/ui/login.spec.ts --reporter=line
```

These commands validate that the framework is working before you run the full suite.

## Commands

```bash
npm run test:ui
npm run test:api
npm run test:hybrid
npm run test:all
npm run test:headed
npm run test:debug
npm run report
npm run codegen
npm run typecheck
```

## What this framework demonstrates

- Playwright config with multiple browser projects
- Storage-state authentication reuse
- Page object model using Playwright locators
- APIRequestContext for ReqRes tests
- Fixtures via `test.extend()`
- `expect.soft()` for non-blocking assertions
- `test.step()` for readable traces
- `page.route()` for request interception
- `page.evaluate()` for browser-side JS execution
- Hybrid API + UI flows

## Playwright learning mindset

This project intentionally follows Playwright's recommended patterns:

- Prefer `getByRole`, `getByLabel`, `getByPlaceholder`, `getByTestId` over CSS/XPath
- Let Playwright auto-wait instead of using manual sleeps
- Keep browser state isolated per test
- Use fixtures for setup instead of Selenium-style hooks
- Separate page logic from test logic

## Running specific tests

```bash
npx playwright test tests/ui/login.spec.ts
npx playwright test tests/api/users.spec.ts
npx playwright test tests/hybrid/userJourney.spec.ts
npx playwright test --project=chromium
```

## HTML report

```bash
npm run report
```

## Trace and debugging

```bash
npm run test:debug
```

This runs Playwright in debug mode so you can inspect interactions step-by-step.

## Learning roadmap

See [LEARNING-ROADMAP.md](LEARNING-ROADMAP.md) for the recommended reading order and practice exercises.

## CI / pipeline note

A sample GitHub Actions workflow is available in [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md).

## Notes

This project is intentionally built as a learning-first framework, but the patterns are suitable for real automation work when extended with CI, test tagging, and richer reporting.
