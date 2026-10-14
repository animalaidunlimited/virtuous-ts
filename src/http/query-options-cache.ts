import type { QueryOptionsResponse } from '../types/shared/query-options';

const HOUR_MS = 60 * 60 * 1000;

interface CacheEntry {
  value: QueryOptionsResponse;
  storedAt: number;
}

/**
 * In-memory cache of `GET .../QueryOptions` responses.
 *
 * Validation needs the parameter catalog, but that catalog changes rarely.
 * One request per resource per hour keeps `validateQueries` from adding a
 * QueryOptions call to every query.
 */
export class QueryOptionsCache {
  private readonly entries = new Map<string, CacheEntry>();

  /**
   * @param ttlMs - How long a stored catalog stays fresh. Default one hour.
   * @param now - Clock, injectable so tests can expire entries without waiting.
   */
  constructor(
    private readonly ttlMs = HOUR_MS,
    private readonly now: () => number = () => Date.now(),
  ) {}

  /**
   * Returns a cached catalog, or loads it and stores the result.
   *
   * @param key - Resource key, usually the QueryOptions path.
   * @param load - Fetches a fresh catalog. Called only on a miss or expiry.
   * @returns The cached or freshly loaded catalog.
   */
  async get(key: string, load: () => Promise<QueryOptionsResponse>): Promise<QueryOptionsResponse> {
    const hit = this.entries.get(key);
    if (hit && this.now() - hit.storedAt < this.ttlMs) {
      return hit.value;
    }
    const value = await load();
    this.entries.set(key, { value, storedAt: this.now() });
    return value;
  }

  /**
   * Drops one key, or the whole cache when `key` is omitted.
   *
   * @param key - Cache key to drop. Omit to clear everything.
   */
  clear(key?: string): void {
    if (key == null) {
      this.entries.clear();
      return;
    }
    this.entries.delete(key);
  }
}
