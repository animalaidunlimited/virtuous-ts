import type { ListResponse } from '../types/shared/list-response';
import type { SkipTakeParams } from '../types/shared/skip-take-params';

/** Virtuous rejects `take` above 1,000 on Query endpoints. */
export const QUERY_PAGE_SIZE_MAX = 1000;

/**
 * Hard stop so a forgotten filter cannot page the whole organization.
 * Pass a larger `maxRecords` only when you mean to.
 */
export const QUERY_ALL_DEFAULT_CAP = 10_000;

/**
 * Options for {@link queryAll}.
 * Every field is optional. Defaults page at the Virtuous maximum and stop at 10,000 rows.
 */
export interface QueryAllOptions {
  /** Rows per request. Clamped to 1..1000. Default 1000. */
  pageSize?: number;
  /**
   * Stop after this many collected rows. Default 10,000.
   * A larger number is an explicit override of the safety cap.
   */
  maxRecords?: number;
  /** Called after each page, with the page index (starting at 1) and the server `total`. */
  onPage?: (pageNumber: number, total: number) => void;
  /** Abort between pages. The in-flight page is not cancelled. */
  signal?: AbortSignal;
}

/** Concatenated pages from {@link queryAll}. */
export interface QueryAllResult<T> {
  /** Rows collected, in page order, never more than `maxRecords`. */
  list: T[];
  /** `total` from the last page. This is the server count, not `list.length`. */
  total: number;
  /** True when the cap stopped paging before the server was exhausted. */
  truncated: boolean;
}

function clampPageSize(pageSize: number | undefined): number {
  if (pageSize == null || !Number.isFinite(pageSize)) {
    return QUERY_PAGE_SIZE_MAX;
  }
  return Math.min(QUERY_PAGE_SIZE_MAX, Math.max(1, Math.floor(pageSize)));
}

/**
 * Pages a `skip`/`take` list until it ends, or until `maxRecords`.
 *
 * Stops when a page is shorter than `take`, when `skip` has reached `total`,
 * or when the cap is hit. A cap returns `truncated: true` instead of throwing,
 * so callers can decide whether a partial export is usable.
 *
 * Works for any method that returns `{ list, total }`:
 *
 * ```ts
 * const all = await queryAll((page) =>
 *   virtuous.gift.queryGiftsWithAbbreviatedDetails(query, page),
 * );
 * ```
 *
 * @param fetchPage - One page. Receives `{ skip, take }`.
 * @param opts - Page size, cap, progress callback, and abort signal.
 * @returns Concatenated rows, the server total, and whether the cap stopped early.
 */
export async function queryAll<T>(
  fetchPage: (params: SkipTakeParams) => Promise<ListResponse<T>>,
  opts: QueryAllOptions = {},
): Promise<QueryAllResult<T>> {
  const take = clampPageSize(opts.pageSize);
  const maxRecords = opts.maxRecords ?? QUERY_ALL_DEFAULT_CAP;
  const list: T[] = [];
  let skip = 0;
  let total = 0;
  let pageNumber = 0;
  let truncated = false;

  while (list.length < maxRecords) {
    if (opts.signal?.aborted) {
      throw new Error('queryAll aborted');
    }
    const remaining = maxRecords - list.length;
    const pageTake = Math.min(take, remaining);
    const page = await fetchPage({ skip, take: pageTake });
    const rows = page.list ?? [];
    total = page.total ?? total;
    pageNumber += 1;
    opts.onPage?.(pageNumber, total);
    list.push(...rows);
    skip += pageTake;

    if (rows.length < pageTake || skip >= total || rows.length === 0) {
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
  } else if (list.length >= maxRecords && skip < total) {
    truncated = true;
  }

  return { list, total, truncated };
}
