/**
 * Path helpers shared by retry and the read-only guard.
 *
 * Axios may hand us a relative URL (`Gift/Query`), an absolute URL, or a path
 * that still includes the `/api` prefix. Callers need one normalized path so
 * allowlists can match `/Query`, `/Search`, and `/Proximity` the same way.
 */

const WRITE_POST =
  /\/(Transaction|Transactions|Batch|Import|ToggleFollow)(\/|$)|\/Email\/Send$|\/Token$/i;

/** POST paths that only read: Query, Query/Full*, Search, Proximity. */
const READ_POST = /\/(Query(\/Full[^/]*)?|Search|Proximity)$/i;

/**
 * Resolves the API path axios will hit, with or without a `/api` prefix.
 *
 * @param url - Request URL, relative or absolute.
 * @param baseURL - Axios `baseURL`, used when `url` is relative.
 * @returns Pathname such as `/Gift/Query`, never including the query string.
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
 * True when repeating the request cannot create a second record.
 *
 * GET, HEAD, and OPTIONS are always safe. POST is safe only for the read
 * allowlist (`/Query`, `/Search`, `/Proximity`). PUT, PATCH, and DELETE are
 * not retried: a dropped response may already have applied the write.
 *
 * @param method - HTTP method from the axios config.
 * @param url - Request URL.
 * @param baseURL - Axios base URL.
 */
export function isIdempotentReadRequest(method: string, url: string, baseURL?: string): boolean {
  const verb = (method || 'get').toUpperCase();
  if (verb === 'GET' || verb === 'HEAD' || verb === 'OPTIONS') {
    return true;
  }
  if (verb !== 'POST') {
    return false;
  }
  const path = requestPath(url, baseURL);
  if (WRITE_POST.test(path)) {
    return false;
  }
  return READ_POST.test(path);
}
