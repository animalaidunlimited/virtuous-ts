import type { AxiosError, AxiosInstance, AxiosRequestHeaders } from 'axios';
import type { VirtuousClient } from '../../src/index';
import { VirtuousApiError } from '../../src/index';

/** Hard cap so the live suite cannot wander into a full GET sweep. */
export const READ_ONLY_MAX_CALLS = 40;

const WRITE_POST =
  /\/(Transaction|Transactions|Batch|Import|ToggleFollow)(\/|$)|\/Email\/Send$|\/Token$/i;
const READ_POST = /\/(Query(\/Full[^/]*)?|Search|Proximity)$/i;

/**
 * Resolves the API path axios will hit, with or without a `/api` prefix.
 */
export function requestPath(url: string, baseURL?: string): string {
  const combined = /https?:\/\//i.test(url)
    ? url
    : `${(baseURL ?? '').replace(/\/+$/, '')}/${(url ?? '').replace(/^\/+/, '')}`;
  const withoutQuery = combined.split('?')[0] ?? '';
  let pathname = withoutQuery;
  try {
    pathname = new URL(withoutQuery).pathname;
  } catch {
    const slash = withoutQuery.indexOf('/');
    pathname = slash >= 0 ? withoutQuery.slice(slash) : withoutQuery;
  }
  return pathname.replace(/\/{2,}/g, '/').replace(/^\/api(?=\/)/i, '') || '/';
}

/**
 * Allowlist: GET (and HEAD/OPTIONS), plus POST to Query, Query/Full*, Search, or Proximity.
 * PUT/PATCH/DELETE and write POSTs (Transaction, Batch, Email/Send, Import) are rejected.
 */
export function isReadOnlyHttpRequest(method: string, url: string, baseURL?: string): boolean {
  const verb = (method || 'get').toUpperCase();
  const path = requestPath(url, baseURL);

  if (verb === 'GET' || verb === 'HEAD' || verb === 'OPTIONS') {
    return true;
  }
  if (verb !== 'POST') {
    return false;
  }
  if (WRITE_POST.test(path)) {
    return false;
  }
  return READ_POST.test(path);
}

export function assertReadOnlyHttpRequest(method: string, url: string, baseURL?: string): void {
  if (isReadOnlyHttpRequest(method, url, baseURL)) {
    return;
  }
  const verb = (method || 'get').toUpperCase();
  const path = requestPath(url, baseURL);
  throw new Error(`read-only suite blocked ${verb} ${path}`);
}

export function axiosInstanceFromClient(client: VirtuousClient): AxiosInstance {
  const instance = (client as unknown as { client: AxiosInstance }).client;
  if (!instance?.interceptors?.request) {
    throw new Error('Could not attach the read-only HTTP guard to VirtuousClient');
  }
  return instance;
}

export function attachReadOnlyGuard(instance: AxiosInstance): { getCallCount: () => number } {
  let calls = 0;
  instance.interceptors.request.use((config) => {
    calls += 1;
    if (calls > READ_ONLY_MAX_CALLS) {
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

/** Drop bearer tokens from Axios errors so a failure cannot print the API key. */
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

/** Permission-group 403 and missing-row 404 are not suite failures. 401 is (bad key). */
export function isSkippableLiveError(error: unknown): boolean {
  const status = liveStatus(error);
  return status === 403 || status === 404;
}
