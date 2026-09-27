# CI setup for Playwright

This project can run in GitHub Actions with a minimal workflow.

## Example workflow

Create a file at `.github/workflows/playwright.yml`:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  playwright:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run UI tests
        run: npm run test:ui

      - name: Run API tests
        run: npm run test:api

      - name: Run hybrid tests
        run: npm run test:hybrid

      - name: Upload Playwright HTML report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          if-no-files-found: ignore
```

## Notes

- This runs the browser suite in CI using the same Playwright config as local execution.
- The report is uploaded even if a test fails.
- You can split the jobs further if you want separate UI/API pipelines.
