import type { ListResponse } from '../types/shared/list-response';
import type { SkipTakeParams } from '../types/shared/skip-take-params';

/**
 * Default page size for reference lists.
 * Smaller than the Query maximum because catalog endpoints are not documented at 1,000.
 */
export const LIST_PAGE_SIZE_DEFAULT = 500;

/** Safety cap for {@link listAll}. Override with `maxRecords` when you need more. */
export const LIST_ALL_DEFAULT_CAP = 5_000;

/** Options for {@link listAll}. */
export interface ListAllOptions {
  /** Rows per request. Default 500. */
  pageSize?: number;
  /** Stop after this many rows. Default 5,000. */
  maxRecords?: number;
  /** Called after each page. `pageNumber` starts at 1. */
  onPage?: (pageNumber: number, total: number) => void;
  /** Abort between pages. */
  signal?: AbortSignal;
}

/** Concatenated pages from {@link listAll}. */
export interface ListAllResult<T> {
  list: T[];
  total: number;
  /** True when `maxRecords` stopped paging before `total` was reached. */
  truncated: boolean;
}

/**
 * Pages a list endpoint that accepts `skip` and `take`.
 *
 * Several Virtuous list endpoints return only 10 rows when `take` is omitted
 * (tags, contact types, custom fields, prefixes). Pass this helper a method
 * that forwards `params` so the caller sets `take` explicitly.
 *
 * Endpoints that return a plain array and ignore `skip`/`take` cannot be
 * paged here. Those methods document the 10-row default on the client instead.
 *
 * @param fetchPage - One page. Receives `{ skip, take }`.
 * @param opts - Page size (default 500) and cap (default 5,000).
 * @returns Concatenated rows, the server total, and whether the cap stopped early.
 */
export async function listAll<T>(
  fetchPage: (params: SkipTakeParams) => Promise<ListResponse<T>>,
  opts: ListAllOptions = {},
): Promise<ListAllResult<T>> {
  const take = Math.max(1, Math.floor(opts.pageSize ?? LIST_PAGE_SIZE_DEFAULT));
  const maxRecords = opts.maxRecords ?? LIST_ALL_DEFAULT_CAP;
  const list: T[] = [];
  let skip = 0;
  let total = 0;
  let pageNumber = 0;
  let truncated = false;

  while (list.length < maxRecords) {
    if (opts.signal?.aborted) {
      throw new Error('listAll aborted');
    }
    const pageTake = Math.min(take, maxRecords - list.length);
    const page = await fetchPage({ skip, take: pageTake });
    const rows = page.list ?? [];
    total = page.total ?? total;
    pageNumber += 1;
    opts.onPage?.(pageNumber, total);
    list.push(...rows);
    skip += pageTake;

    if (rows.length < pageTake || rows.length === 0 || skip >= total) {
      break;
    }
    if (list.length >= maxRecords && skip < total) {
      truncated = true;
      break;
    }
  }

  if (list.length > maxRecords) {
    list.length = maxRecords;
    truncated = true;
  }

  return { list, total, truncated };
}
