import type { AxiosInstance } from 'axios';
import type {
  Campaign,
} from '../types/campaign/campaign';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';

/**
 * Virtuous CRM campaign API.
 * @see https://docs.virtuoussoftware.com/#b4d712c1-5d85-4c1c-8a24-f5dd09deb413
 */
const createCampaignClient = (client: AxiosInstance) => ({
  /**
   * Returns a campaign by id.
   * @see https://docs.virtuoussoftware.com/#b4d712c1-5d85-4c1c-8a24-f5dd09deb413
   * @param {number} campaignId - Campaign id.
   * @returns {Promise<Campaign>}
   */
  getCampaign: (campaignId: number): Promise<Campaign> => {
    return client.get<Campaign>(`/Campaign/${campaignId}`).then((r) => r.data);
  },

  /**
   * Returns campaign steps in run order.
   * @see https://docs.virtuoussoftware.com/#e968a0da-595f-48ca-ba30-d8ef1f0cdea5
   * @param {number} campaignId - Campaign id.
   * @returns {Promise<string[]>}
   */
  getCampaignSteps: (campaignId: number): Promise<string[]> => {
    return client.get<string[]>(`/Campaign/GetStepsByCampaignId/${campaignId}`).then((r) => r.data);
  },

  /**
   * Returns query fields and operators for campaigns.
   * @see https://docs.virtuoussoftware.com/#1383b2f1-d4b9-4783-a19e-e56e7f44e0c7
   * @returns {Promise<QueryOptionsResponse>}
   */
  getCampaignQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/Campaign/QueryOptions').then((r) => r.data);
  },

  /**
   * Queries campaigns. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#a27f3e03-bfbf-40fe-aaaf-1b1dbf62e4ba
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Campaign>>}
   */
  queryCampaigns: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<Campaign>> => {
    return client.post<ListResponse<Campaign>>('/Campaign/Query', request, { params }).then((r) => r.data);
  },

});

export default createCampaignClient;
