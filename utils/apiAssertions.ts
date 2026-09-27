/**
 * PLAYWRIGHT CONCEPT: expect() as an assertion engine
 * What it is: Playwright extends the standard testing assertion model with browser-aware matchers for locators, pages, and network responses.
 * Why Playwright does it this way: assertions become browser-aware and automatically wait for conditions, which is the heart of resilient automation.
 * If you're coming from Selenium/RestAssured: this is where Playwright feels most different, because assertions are tied to UI state and auto-waiting rather than just checking a raw DOM snapshot.
 * Common mistake to avoid: using plain JavaScript truth checks instead of Playwright expect(); they will not wait for the UI to settle.
 */
import { expect } from '@playwright/test';

export function assertStatus(actualStatus: number, expectedStatus: number): void {
  expect(actualStatus, `Expected status ${expectedStatus} but received ${actualStatus}`).toBe(expectedStatus);
}

export function assertSchema<T>(payload: T, validator: (value: T) => boolean, message = 'Schema validation failed'): void {
  expect(validator(payload), message).toBeTruthy();
}

export function assertResponseTime(elapsedMs: number, maximumMs: number): void {
  expect(elapsedMs, `Request took ${elapsedMs}ms, which exceeds the threshold of ${maximumMs}ms`).toBeLessThanOrEqual(maximumMs);
}

// WHY: this is a thin extension of Playwright's built-in expect(); it keeps API checks consistent and adds custom rules without losing auto-wait behavior.
