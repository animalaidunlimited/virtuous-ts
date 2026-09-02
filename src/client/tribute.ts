import type { AxiosInstance } from 'axios';
import type {
  CreateTributeRequest,
  Tribute,
  TributeSearchRequest,
  UpdateTributeRequest,
} from '../types/tribute/tribute';
import type { SkipTakeParams } from '../types/shared/skip-take-params';

/**
 * Virtuous CRM tribute API.
 * @see https://docs.virtuoussoftware.com/#040b1619-d9b9-4109-8835-109a9ded8a25
 */
const createTributeClient = (client: AxiosInstance) => ({
  /**
   * Searches tributes by honoree fields.
   * @see https://docs.virtuoussoftware.com/#040b1619-d9b9-4109-8835-109a9ded8a25
   * @param {TributeSearchRequest} request - Honoree search fields.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<Tribute[]>} Matching tributes.
   */
  searchTributes: (request: TributeSearchRequest, params?: SkipTakeParams): Promise<Tribute[]> => {
    return client
      .get<Tribute[]>('/Tribute/Search', { params: { ...request, ...params } })
      .then((r) => r.data);
  },

  /**
   * Creates a tribute a gift can be given in honor or memory of.
   * @see https://docs.virtuoussoftware.com/#e111e6ba-d7c3-4ee9-aecc-acc673665405
   * @param {CreateTributeRequest} request - Request body.
   * @returns {Promise<Tribute>}
   */
  createTribute: (request: CreateTributeRequest): Promise<Tribute> => {
    return client.post<Tribute>('/Tribute', request).then((r) => r.data);
  },

  /**
   * Replaces a tribute. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#83bbf315-eb5e-423c-a6cb-c4efc553c65c
   * @param {number} tributeId - Tribute id.
   * @param {UpdateTributeRequest} request - Request body.
   * @returns {Promise<Tribute>}
   */
  updateTribute: (tributeId: number, request: UpdateTributeRequest): Promise<Tribute> => {
    return client.put<Tribute>(`/Tribute/${tributeId}`, request).then((r) => r.data);
  },

});

export default createTributeClient;
