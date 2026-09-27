/**
 * PLAYWRIGHT CONCEPT: API testing in Playwright
 * What it is: Playwright's request API provides a first-class way to test HTTP endpoints and keep all protocol assertions in the same framework as UI tests.
 * Why Playwright does it this way: the API layer is designed to work with the same runner, same traces, and same error reporting as browser tests.
 * If you're coming from Selenium/RestAssured: this is the point where Playwright becomes a complete test framework instead of just browser automation.
 * Common mistake to avoid: mixing raw fetch calls and custom assertions everywhere; use a typed client and shared assertion utilities to keep the API suite readable.
 */
import { expect, test } from '../../fixtures/base.fixture';
import { UsersAPI } from '../../api-clients/UsersAPI';
import { assertResponseTime, assertSchema, assertStatus } from '../../utils/apiAssertions';
import { uniqueName } from '../../utils/helpers';

test.describe('@api ReqRes users', () => {
  test('create, read, update and delete a user end-to-end', async ({ apiContext }) => {
    const api = new UsersAPI(apiContext);
    const userName = uniqueName('playwright-user');

    const startedAt = Date.now();
    const listResponse = await api.getAllUsers();
    const elapsedListMs = Date.now() - startedAt;

    assertStatus(listResponse.status, 200);
    assertSchema(listResponse.body, (payload) => Array.isArray(payload.data) && payload.data.length > 0, 'List response must contain users');
    assertResponseTime(elapsedListMs, 2000);

    const createPayload = { name: userName, job: 'QA Engineer' };
    const created = await api.createUser(createPayload);
    assertStatus(created.status, 201);
    expect(created.body.name).toBe(userName);
    expect(created.body.job).toBe(createPayload.job);

    const existingUserId = listResponse.body.data[0]?.id ?? 2;

    const fetched = await api.getUserById(existingUserId);
    assertStatus(fetched.status, 200);
    expect(fetched.body.data.id).toBe(existingUserId);

    const updatedPayload = { name: `${userName}-updated`, job: 'Senior QA Engineer' };
    const updated = await api.updateUser(existingUserId, updatedPayload);
    assertStatus(updated.status, 200);
    expect(updated.body.name).toBe(updatedPayload.name);

    const deleted = await api.deleteUser(existingUserId);
    assertStatus(deleted.status, 204);
    expect(deleted.body).toBeNull();
  });
});
