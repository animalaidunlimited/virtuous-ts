import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Snapshot of Virtuous rate-limit headers plus a local request counter.
 *
 * Virtuous sends `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and
 * `X-RateLimit-Reset` on responses. The org-wide cap is 5,000 requests per
 * hour, shared by every app using the same organization.
 */
export interface RateLimitStatus {
  /** `X-RateLimit-Limit`, or null before the first response. */
  limit: number | null;
  /** `X-RateLimit-Remaining`, or null before the first response. */
  remaining: number | null;
  /** When the window resets, or null if the header was missing or unparseable. */
  resetAt: Date | null;
  /** When this tracker last saw a response. */
  lastUpdated: Date | null;
  /** Requests this process has sent through the guarded client. */
  requestsThisProcess: number;
}

/**
 * Thrown before a request is sent when remaining quota is at or below the
 * configured reserve. This is local headroom, not a Virtuous 429.
 */
export class VirtuousRateLimitError extends Error {
  /** Quota snapshot that triggered the guard. */
  public readonly status: RateLimitStatus;
  /** Remaining count the caller asked us to keep unused. */
  public readonly reserve: number;

  constructor(status: RateLimitStatus, reserve: number) {
    const remaining = status.remaining ?? 0;
    super(
      `Virtuous rate-limit reserve reached: ${remaining} remaining, reserve is ${reserve}. Request was not sent.`,
    );
    this.name = 'VirtuousRateLimitError';
    this.status = status;
    this.reserve = reserve;
  }
}

function headerValue(headers: unknown, name: string): string | undefined {
  if (!headers || typeof headers !== 'object') {
    return undefined;
  }
  const bag = headers as {
    get?: (key: string) => unknown;
    [key: string]: unknown;
  };
  const fromGetter = typeof bag.get === 'function' ? bag.get(name) : undefined;
  const raw = fromGetter ?? bag[name] ?? bag[name.toLowerCase()];
  if (raw == null) {
    return undefined;
  }
  return String(raw);
}

function parseCount(raw: string | undefined): number | null {
  if (raw == null || raw.trim() === '') {
    return null;
  }
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

/**
 * `X-RateLimit-Reset` is either epoch seconds or an HTTP date.
 * A numeric value below 1e12 is treated as seconds, not milliseconds.
 *
 * @param raw - Header value.
 * @returns Parsed date, or null when the header is missing or invalid.
 */
export function parseResetAt(raw: string | undefined): Date | null {
  if (raw == null || raw.trim() === '') {
    return null;
  }
  const trimmed = raw.trim();
  if (/^\d+(\.\d+)?$/.test(trimmed)) {
    const numeric = Number(trimmed);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    const millis = numeric < 1e12 ? numeric * 1000 : numeric;
    const date = new Date(millis);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Remembers the latest rate-limit headers seen by this process.
 * Tracking is passive: it never sends a request of its own.
 */
export class RateLimitTracker {
  private current: RateLimitStatus = {
    limit: null,
    remaining: null,
    resetAt: null,
    lastUpdated: null,
    requestsThisProcess: 0,
  };

  /**
   * Reads rate-limit headers from a response or an error response.
   * Missing headers leave the previous numbers in place.
   *
   * @param headers - Axios response headers, or a plain object in tests.
   * @param at - Clock value stored as `lastUpdated`. Defaults to now.
   */
  update(headers: unknown, at = new Date()): void {
    const limit = parseCount(headerValue(headers, 'X-RateLimit-Limit'));
    const remaining = parseCount(headerValue(headers, 'X-RateLimit-Remaining'));
    const resetRaw = headerValue(headers, 'X-RateLimit-Reset');
    const resetAt = resetRaw == null ? this.current.resetAt : parseResetAt(resetRaw);

    this.current = {
      limit: limit ?? this.current.limit,
      remaining: remaining ?? this.current.remaining,
      resetAt,
      lastUpdated: at,
      requestsThisProcess: this.current.requestsThisProcess,
    };
  }

  /** Counts one outbound request. The reserve guard calls this before send. */
  recordRequest(): void {
    this.current = {
      ...this.current,
      requestsThisProcess: this.current.requestsThisProcess + 1,
    };
  }

  /** Latest snapshot. Fields stay null until a response includes the headers. */
  status(): RateLimitStatus {
    return { ...this.current };
  }
}

/** Options for {@link attachRateLimitTracker}. */
export interface AttachRateLimitOptions {
  /**
   * When set, reject the request if `remaining` is known and `<= reserve`.
   * Omit this to track headers without blocking any request.
   */
  reserve?: number;
  /** Called after each response updates the tracker. */
  onUpdate?: (status: RateLimitStatus) => void;
}

/**
 * Attaches passive header tracking, and an optional pre-request reserve guard.
 *
 * The response interceptor runs for successes and errors, so a 429 still
 * updates `remaining`. The request interceptor only rejects when `reserve`
 * is set and Virtuous has already told us the remaining count.
 *
 * @param ax - Axios instance owned by `VirtuousClient`.
 * @param tracker - Tracker shared with `getRateLimitStatus()`.
 * @param options - Reserve threshold and optional update hook.
 */
export function attachRateLimitTracker(
  ax: AxiosInstance,
  tracker: RateLimitTracker,
  options: AttachRateLimitOptions = {},
): void {
  const { reserve, onUpdate } = options;

  const note = (response: AxiosResponse | undefined): void => {
    if (!response) {
      return;
    }
    tracker.update(response.headers);
    onUpdate?.(tracker.status());
  };

  ax.interceptors.response.use(
    (response) => {
      note(response);
      return response;
    },
    (error: { response?: AxiosResponse }) => {
      note(error?.response);
      return Promise.reject(error);
    },
  );

  ax.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const snapshot = tracker.status();
    if (reserve != null && snapshot.remaining != null && snapshot.remaining <= reserve) {
      throw new VirtuousRateLimitError(snapshot, reserve);
    }
    tracker.recordRequest();
    return config;
  });
}
