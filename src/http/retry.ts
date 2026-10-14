import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { isIdempotentReadRequest } from './request-path';

/**
 * Opt-in retry policy for transient Virtuous failures.
 *
 * Writes are not retried unless `retryNonIdempotent` is true. A retried
 * `POST /Gift` can create a second gift if the first request actually landed.
 */
export interface RetryOptions {
  /** How many extra attempts after the first failure. Default 3. */
  retries?: number;
  /** Base of the exponential backoff, in milliseconds. Default 500. */
  baseDelayMs?: number;
  /** Cap on the backoff window, in milliseconds. Default 30,000. */
  maxDelayMs?: number;
  /** HTTP statuses worth retrying. Default 429, 502, 503, 504. */
  retryOn?: number[];
  /**
   * Also retry PUT, PATCH, DELETE, and write POSTs.
   * Default false. Leave this off unless the call is safe to repeat.
   */
  retryNonIdempotent?: boolean;
}

/** Defaults used when retry is enabled with `{}` or `true`. */
export const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  retries: 3,
  baseDelayMs: 500,
  maxDelayMs: 30_000,
  retryOn: [429, 502, 503, 504],
  retryNonIdempotent: false,
};

const NETWORK_CODES = new Set(['ECONNRESET', 'ETIMEDOUT', 'ECONNABORTED']);

/** Axios config plus the attempt counter the interceptor stores between tries. */
export type RetryableRequestConfig = InternalAxiosRequestConfig & {
  __retryCount?: number;
};

/**
 * Full-jitter delay: a random value in `[0, min(maxDelay, base * 2^attempt)]`.
 * `attempt` is zero on the first retry.
 *
 * @param attempt - Zero-based retry index.
 * @param baseDelayMs - Starting window.
 * @param maxDelayMs - Window cap.
 * @param random - Source of randomness, default `Math.random`. Injectable for tests.
 * @returns Milliseconds to wait before the next attempt.
 */
export function fullJitterDelayMs(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number,
  random: () => number = Math.random,
): number {
  const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
  const sample = random();
  return Math.max(0, sample * ceiling);
}

/**
 * Reads `Retry-After` as delta-seconds or an HTTP date.
 *
 * @param header - Raw `Retry-After` value.
 * @param now - Clock in milliseconds, injectable for tests.
 * @returns Milliseconds to wait, or null when the header is absent or invalid.
 */
export function retryAfterDelayMs(header: string | undefined, now = Date.now()): number | null {
  if (header == null || header.trim() === '') {
    return null;
  }
  const trimmed = header.trim();
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const seconds = Number(trimmed);
    return Number.isFinite(seconds) ? Math.max(0, seconds * 1000) : null;
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return Math.max(0, date.getTime() - now);
}

/** Default sleep. Tests pass a fake so retries do not wait on the clock. */
export function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function headerOf(response: AxiosResponse | undefined, name: string): string | undefined {
  const headers = response?.headers as { get?: (key: string) => unknown } | undefined;
  if (!headers) {
    return undefined;
  }
  const raw = typeof headers.get === 'function' ? headers.get(name) : (headers as Record<string, unknown>)[name];
  const fallback = raw ?? (headers as Record<string, unknown>)[name.toLowerCase()];
  return fallback == null ? undefined : String(fallback);
}

function shouldRetryStatus(status: number | undefined, retryOn: number[]): boolean {
  return status != null && retryOn.includes(status);
}

function shouldRetryNetwork(error: AxiosError): boolean {
  const code = error.code ?? '';
  return NETWORK_CODES.has(code);
}

/**
 * Registers a response-error interceptor that retries transient failures.
 *
 * Register this before the `VirtuousApiError` wrapper. Axios runs response
 * error interceptors in reverse registration order, so the wrapper (registered
 * later) sees only the final failure and can record `attempts`.
 *
 * @param ax - Axios instance to patch.
 * @param opts - Partial policy. Missing fields use {@link DEFAULT_RETRY_OPTIONS}.
 * @param sleep - Wait function. Tests inject a recorder.
 */
export function attachRetry(
  ax: AxiosInstance,
  opts: RetryOptions = {},
  sleep: (ms: number) => Promise<void> = defaultSleep,
): void {
  const policy: Required<RetryOptions> = {
    retries: opts.retries ?? DEFAULT_RETRY_OPTIONS.retries,
    baseDelayMs: opts.baseDelayMs ?? DEFAULT_RETRY_OPTIONS.baseDelayMs,
    maxDelayMs: opts.maxDelayMs ?? DEFAULT_RETRY_OPTIONS.maxDelayMs,
    retryOn: opts.retryOn ?? DEFAULT_RETRY_OPTIONS.retryOn,
    retryNonIdempotent: opts.retryNonIdempotent ?? DEFAULT_RETRY_OPTIONS.retryNonIdempotent,
  };

  ax.interceptors.response.use(undefined, async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;
    if (!config) {
      return Promise.reject(error);
    }

    const attempt = config.__retryCount ?? 0;
    if (attempt >= policy.retries) {
      return Promise.reject(error);
    }

    const method = config.method ?? 'get';
    const url = config.url ?? '';
    const safeToRepeat =
      policy.retryNonIdempotent || isIdempotentReadRequest(method, url, config.baseURL);
    if (!safeToRepeat) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const transient = shouldRetryStatus(status, policy.retryOn) || shouldRetryNetwork(error);
    if (!transient) {
      return Promise.reject(error);
    }

    const retryAfter = retryAfterDelayMs(headerOf(error.response, 'Retry-After'));
    const delay = retryAfter ?? fullJitterDelayMs(attempt, policy.baseDelayMs, policy.maxDelayMs);
    config.__retryCount = attempt + 1;
    await sleep(delay);
    return ax.request(config);
  });
}

/**
 * Turns a config value into a concrete policy, or null when retries are off.
 *
 * `undefined` and `false` disable retries so existing `{ baseURL, apiKey }`
 * apps keep the old single-attempt behaviour. `true` and `{}` enable defaults.
 *
 * @param retry - Value from `VirtuousConfig.retry`.
 * @returns A policy to pass to {@link attachRetry}, or null to skip it.
 */
export function resolveRetryOptions(retry: RetryOptions | boolean | undefined): RetryOptions | null {
  if (retry == null || retry === false) {
    return null;
  }
  if (retry === true) {
    return { ...DEFAULT_RETRY_OPTIONS };
  }
  return retry;
}
