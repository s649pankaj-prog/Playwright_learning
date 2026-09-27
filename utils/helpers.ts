/**
 * PLAYWRIGHT CONCEPT: Helpers and type guards
 * What it is: small utility methods keep tests readable and repeatable without hiding the real automation logic.
 * Why Playwright does it this way: test code stays focused on behavior while helper functions manage data generation and validation.
 * If you're coming from Selenium/RestAssured: this is similar to utility classes, but the Playwright mindset keeps helpers small and purpose-specific.
 * Common mistake to avoid: writing one giant helper that does too much; Playwright tests are easier to maintain when responsibility is split clearly.
 */
export function uniqueName(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
