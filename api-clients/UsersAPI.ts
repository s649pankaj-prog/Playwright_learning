/**
 * PLAYWRIGHT CONCEPT: API client layering
 * What it is: domain-specific clients extend a reusable base client to keep request logic organized and typed.
 * Why Playwright does it this way: it encourages clean separation between transport code and test code, just like page objects separate UI logic.
 * If you're coming from Selenium/RestAssured: this is the Playwright version of a request helper layer, but it stays close to the API semantics and uses typing for safety.
 * Common mistake to avoid: placing every API call directly in the spec file; the result becomes hard to maintain and harder to reuse.
 */
import type { APIRequestContext } from '@playwright/test';
import { BaseAPI, type ApiEnvelope } from './BaseAPI';

export interface ReqresUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

export interface UserListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: ReqresUser[];
  support: {
    url: string;
    text: string;
  };
}

export interface UserByIdResponse {
  data: ReqresUser;
  support: {
    url: string;
    text: string;
  };
}

export interface CreateUserPayload {
  name: string;
  job: string;
}

export interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

export interface UpdateUserPayload {
  name: string;
  job: string;
}

export interface DeleteUserResponse {
  deleted: boolean;
}

export class UsersAPI extends BaseAPI {
  constructor(request: APIRequestContext) {
    super(request, 'https://reqres.in/api/');
  }

  async getAllUsers(): Promise<ApiEnvelope<UserListResponse>> {
    return this.get<UserListResponse>('/users');
  }

  async getUserById(userId: number): Promise<ApiEnvelope<UserByIdResponse>> {
    return this.get<UserByIdResponse>(`/users/${userId}`);
  }

  async createUser(data: CreateUserPayload): Promise<ApiEnvelope<CreateUserResponse>> {
    return this.post<CreateUserResponse>('/users', data);
  }

  async updateUser(userId: number, data: UpdateUserPayload): Promise<ApiEnvelope<UpdateUserPayload>> {
    return this.put<UpdateUserPayload>(`/users/${userId}`, data);
  }

  async deleteUser(userId: number): Promise<ApiEnvelope<DeleteUserResponse | null>> {
    return this.delete<DeleteUserResponse | null>(`/users/${userId}`);
  }
}
