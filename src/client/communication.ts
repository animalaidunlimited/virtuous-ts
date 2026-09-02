import type { AxiosInstance } from 'axios';
import type {
  Communication,
  CreateCommunicationRequest,
} from '../types/communication/communication';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';

/**
 * Virtuous CRM communication API.
 * @see https://docs.virtuoussoftware.com/#958f4586-696f-4a67-9874-06e6356bb608
 */
const createCommunicationClient = (client: AxiosInstance) => ({
  /**
   * Returns communications that belong to a campaign.
   * @see https://docs.virtuoussoftware.com/#958f4586-696f-4a67-9874-06e6356bb608
   * @param {number} campaignId - Campaign id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Communication>>}
   */
  getCommunicationsForCampaign: (campaignId: number, params?: SkipTakeParams & { filter?: string; sortBy?: string; descending?: boolean }): Promise<ListResponse<Communication>> => {
    return client.get<ListResponse<Communication>>(`/Communication/ByCampaign/${campaignId}`, { params }).then((r) => r.data);
  },

  /**
   * Returns a communication by id.
   * @see https://docs.virtuoussoftware.com/#8cf8ea36-1315-405f-9be6-563fa1d44d69
   * @param {number} communicationId - Communication id.
   * @returns {Promise<Communication>}
   */
  getCommunication: (communicationId: number): Promise<Communication> => {
    return client.get<Communication>(`/Communication/${communicationId}`).then((r) => r.data);
  },

  /**
   * Returns communication channel types.
   * @see https://docs.virtuoussoftware.com/#be03b900-005c-4fcd-918b-e8286caaee57
   * @returns {Promise<string[]>}
   */
  listChannelTypes: (): Promise<string[]> => {
    return client.get<string[]>('/Communication/ChannelTypes').then((r) => r.data);
  },

  /**
   * Returns communication types.
   * @see https://docs.virtuoussoftware.com/#c6ef1857-9be2-44ff-8c4c-f3b91bf2f624
   * @returns {Promise<string[]>}
   */
  listCommunicationTypes: (): Promise<string[]> => {
    return client.get<string[]>('/Communication/CommunicationTypes').then((r) => r.data);
  },

  /**
   * Creates a communication within a campaign.
   * @see https://docs.virtuoussoftware.com/#1370ce2c-2fd8-43a9-bdf2-80af93d41b72
   * @param {CreateCommunicationRequest} request - Request body.
   * @returns {Promise<Communication>}
   */
  createCommunication: (request: CreateCommunicationRequest): Promise<Communication> => {
    return client.post<Communication>('/Communication', request).then((r) => r.data);
  },

  /**
   * Queries communications. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#b5c56ac4-b846-4bcb-95bd-dc34b31c26d9
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Communication>>}
   */
  queryCommunications: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<Communication>> => {
    return client.post<ListResponse<Communication>>('/Communication/Query', request, { params }).then((r) => r.data);
  },

  /**
   * Returns query fields and operators for communications.
   * @see https://docs.virtuoussoftware.com/#ec64315c-7fc3-49b4-9e5f-22e9a277514b
   * @returns {Promise<QueryOptionsResponse>}
   */
  getCommunicationQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/Communication/QueryOptions').then((r) => r.data);
  },

});

export default createCommunicationClient;
