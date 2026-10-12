import type { AxiosInstance } from 'axios';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import { QueryOptionsCache } from './query-options-cache';
import { assertValidQuery } from '../utils/validate-query';

/**
 * Loads QueryOptions once per path per hour, then checks the body.
 * Used by query methods when `validateQueries` is true.
 *
 * @param client - Axios instance.
 * @param cache - Shared cache on the Virtuous client.
 * @param optionsPath - `GET` path such as `/Gift/QueryOptions`.
 * @param request - Query body about to be posted.
 */
export async function validateQueryWithCache(
  client: AxiosInstance,
  cache: QueryOptionsCache,
  optionsPath: string,
  request: QueryRequest,
): Promise<void> {
  const options = await cache.get(optionsPath, () =>
    client.get<QueryOptionsResponse>(optionsPath).then((response) => response.data),
  );
  assertValidQuery(request, options);
}
