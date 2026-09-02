import type { AxiosInstance } from 'axios';
import type {
  EntitySearchRequest,
  SearchResponse,
} from '../types/search/search';
import type { SkipTakeParams } from '../types/shared/skip-take-params';

/**
 * Virtuous CRM search API.
 * @see https://docs.virtuoussoftware.com/#b1c7f34b-fa4b-4b51-8656-d86cabe150d8
 */
const createSearchClient = (client: AxiosInstance) => ({
  /**
   * Searches contacts, individuals, or entities. `query` and `filterTypes` are required.
   * @see https://docs.virtuoussoftware.com/#b1c7f34b-fa4b-4b51-8656-d86cabe150d8
   * @param {EntitySearchRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<SearchResponse>}
   */
  search: (request: EntitySearchRequest, params?: SkipTakeParams): Promise<SearchResponse> => {
    return client.post<SearchResponse>('/Search', request, { params }).then((r) => r.data);
  },

});

export default createSearchClient;
