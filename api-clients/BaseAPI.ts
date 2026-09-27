/**
 * PLAYWRIGHT CONCEPT: APIRequestContext
 * What it is: Playwright exposes a built-in request API that is wired for browser-like network behavior and can share cookies or session information with browser contexts.
 * Why Playwright does it this way: the same framework handles both UI and API testing with one network layer and consistent tracing.
 * If you're coming from Selenium/RestAssured: this replaces a separate HTTP client setup with a native Playwright request client and makes cross-layer testing easier.
 * Common mistake to avoid: using a third-party library for API calls when Playwright already provides a request context; it misses the benefit of a unified test platform.
 */
import type { APIRequestContext, APIResponse } from '@playwright/test';

export type ApiEnvelope<T> = {
  status: number;
  body: T;
  response: APIResponse;
};

export class BaseAPI {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly baseURL: string,
  ) {}

  protected async execute<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, data?: unknown): Promise<ApiEnvelope<T>> {
    const normalizedBaseUrl = this.baseURL.endsWith('/') ? this.baseURL : `${this.baseURL}/`;
    const normalizedPath = path.replace(/^\/+/, '');
    const url = new URL(normalizedPath, normalizedBaseUrl).toString();
    const start = Date.now();

    const response = await this.request.fetch(url, {
      method,
      data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const elapsedMs = Date.now() - start;
    const body = (await response.json().catch(() => null)) as T;

    console.log(`[${method}] ${url} -> ${response.status()} (${elapsedMs}ms)`);

    return {
      status: response.status(),
      body,
      response,
    };
  }

  async get<T>(path: string): Promise<ApiEnvelope<T>> {
    return this.execute<T>('GET', path);
  }

  async post<T>(path: string, data: unknown): Promise<ApiEnvelope<T>> {
    return this.execute<T>('POST', path, data);
  }

  async put<T>(path: string, data: unknown): Promise<ApiEnvelope<T>> {
    return this.execute<T>('PUT', path, data);
  }

  async delete<T>(path: string): Promise<ApiEnvelope<T>> {
    return this.execute<T>('DELETE', path);
  }
}

// WHY: Playwright's APIRequestContext is built-in and avoids full dependency setup; it also makes API and UI tests easier to coordinate in one framework.
