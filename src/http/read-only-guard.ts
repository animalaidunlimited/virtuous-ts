import type { AxiosError, AxiosInstance, AxiosRequestHeaders } from 'axios';
import type { VirtuousClient } from '../virtuous-client';
import { VirtuousApiError } from '../errors/virtuous-api-error';
import { isIdempotentReadRequest, requestPath } from './request-path';

/** Hard cap so the live suite cannot wander into a full GET sweep. */
export const READ_ONLY_MAX_CALLS = 40;

export { requestPath };

/**
 * Allowlist: GET (and HEAD/OPTIONS), plus POST to Query, Query/Full*, Search, or Proximity.
 * PUT/PATCH/DELETE and write POSTs (Transaction, Batch, Email/Send, Import) are rejected.
 *
 * @param method - HTTP method.
 * @param url - Request URL.
 * @param baseURL - Axios base URL, used to resolve relative paths.
 * @returns True when the request is on the read allowlist.
 */
export function isReadOnlyHttpRequest(method: string, url: string, baseURL?: string): boolean {
  return isIdempotentReadRequest(method, url, baseURL);
}

/**
 * Throws when the request is not on the read allowlist.
 *
 * @param method - HTTP method.
 * @param url - Request URL.
 * @param baseURL - Axios base URL.
 */
export function assertReadOnlyHttpRequest(method: string, url: string, baseURL?: string): void {
  if (isReadOnlyHttpRequest(method, url, baseURL)) {
    return;
  }
  const verb = (method || 'get').toUpperCase();
  const path = requestPath(url, baseURL);
  throw new Error(`read-only suite blocked ${verb} ${path}`);
}

/**
 * Reads the private axios instance from a `VirtuousClient`.
 * Used by the live suite, which attaches the guard after construction.
 *
 * @param client - Constructed Virtuous client.
 * @returns The axios instance the client sends with.
 */
export function axiosInstanceFromClient(client: VirtuousClient): AxiosInstance {
  const instance = (client as unknown as { client: AxiosInstance }).client;
  if (!instance?.interceptors?.request) {
    throw new Error('Could not attach the read-only HTTP guard to VirtuousClient');
  }
  return instance;
}

/** Options for {@link attachReadOnlyGuard}. */
export interface ReadOnlyGuardOptions {
  /**
   * When true, stop after {@link READ_ONLY_MAX_CALLS}.
   * The live test suite sets this. `readOnly: true` on the client does not,
   * so a long-running read-only app is not capped at 40 calls.
   */
  enforceCallCap?: boolean;
}

/**
 * Rejects write methods before axios sends them.
 *
 * Wire this with `new VirtuousClient({ readOnly: true })`, or call it on an
 * existing instance. The MCP server uses it as a second safety layer.
 *
 * @param instance - Axios instance to guard.
 * @param options - Optional call cap for the live suite.
 * @returns A counter of requests that passed the guard.
 */
export function attachReadOnlyGuard(
  instance: AxiosInstance,
  options: ReadOnlyGuardOptions = {},
): { getCallCount: () => number } {
  let calls = 0;
  const enforceCallCap = options.enforceCallCap ?? true;
  instance.interceptors.request.use((config) => {
    calls += 1;
    if (enforceCallCap && calls > READ_ONLY_MAX_CALLS) {
      throw new Error(`read-only suite exceeded ${READ_ONLY_MAX_CALLS} HTTP calls`);
    }
    assertReadOnlyHttpRequest(config.method ?? 'get', config.url ?? '', config.baseURL);
    return config;
  });
  return { getCallCount: () => calls };
}

function stripAuthHeader(headers: AxiosRequestHeaders | undefined): void {
  if (!headers) {
    return;
  }
  const withDelete = headers as AxiosRequestHeaders & { delete?: (name: string) => void };
  if (typeof withDelete.delete === 'function') {
    withDelete.delete('Authorization');
    withDelete.delete('authorization');
    return;
  }
  delete (headers as Record<string, unknown>).Authorization;
  delete (headers as Record<string, unknown>).authorization;
}

/**
 * Drop bearer tokens from Axios errors so a failure cannot print the API key.
 *
 * @param error - Caught error from a live call.
 * @returns The same error, with Authorization stripped when present.
 */
export function sanitizeLiveError(error: unknown): unknown {
  const axiosError: AxiosError | undefined =
    error instanceof VirtuousApiError
      ? error.cause
      : error && typeof error === 'object' && 'config' in error
        ? (error as AxiosError)
        : undefined;
  if (axiosError?.config) {
    stripAuthHeader(axiosError.config.headers);
  }
  const responseHeaders = axiosError?.response?.config?.headers;
  stripAuthHeader(responseHeaders);
  return error;
}

/**
 * HTTP status from a `VirtuousApiError` or a plain error-like object.
 *
 * @param error - Caught error.
 * @returns Status code, or undefined when the error has none.
 */
export function liveStatus(error: unknown): number | undefined {
  if (error instanceof VirtuousApiError) {
    return error.status;
  }
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === 'number') {
      return status;
    }
  }
  return undefined;
}

/**
 * Permission-group 403 and missing-row 404 are not suite failures. 401 is (bad key).
 *
 * @param error - Caught error.
 * @returns True when the live suite should skip instead of fail.
 */
export function isSkippableLiveError(error: unknown): boolean {
  const status = liveStatus(error);
  return status === 403 || status === 404;
}
