import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import type { AxiosInstance } from 'axios';
import type {
  CreatePremiumRequest,
  Premium,
  UpdatePremiumRequest,
} from '../types/premium/premium';
import type { SearchRequest } from '../types/shared/search-request';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';
import { mergeUpdate, premiumToUpdateRequest } from '../utils/to-update-request';

/**
 * Virtuous CRM premium API.
 * @see https://docs.virtuoussoftware.com/#bc783f7e-9ea8-4720-8923-23f9dcc5e6a0
 */
const createPremiumClient = (client: AxiosInstance) => ({
  /**
   * Returns a premium by id.
   * @see https://docs.virtuoussoftware.com/#bc783f7e-9ea8-4720-8923-23f9dcc5e6a0
   * @param {number} premiumId - Premium id.
   * @returns {Promise<Premium>}
   */
  getPremium: (premiumId: number): Promise<Premium> => {
    return client.get<Premium>(`/Premium/${premiumId}`).then((r) => r.data);
  },

  /**
   * Returns a premium by unique code.
   * @see https://docs.virtuoussoftware.com/#ec2606f2-1c4b-49f4-8f52-814a8506ce0b
   * @param {string} premiumCode - Premium Code.
   * @returns {Promise<Premium>}
   */
  getPremiumByCode: (premiumCode: string): Promise<Premium> => {
    return client.get<Premium>(`/Premium/Code/${encodeURIComponent(premiumCode)}`).then((r) => r.data);
  },

  /**
   * Searches premiums by name or code.
   * @see https://docs.virtuoussoftware.com/#f7b47741-d64e-4e45-8628-eedab2c0f856
   * @param {SearchRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Premium>>}
   */
  searchPremiums: (request: SearchRequest, params?: SkipTakeParams): Promise<ListResponse<Premium>> => {
    return client.post<ListResponse<Premium>>('/Premium/Search', request, { params }).then((r) => r.data);
  },

  /**
   * Creates a premium that can be sent to donors.
   * @see https://docs.virtuoussoftware.com/#ab56b975-cc4d-4056-8a12-e6115272c713
   * @param {CreatePremiumRequest} request - Request body.
   * @returns {Promise<Premium>}
   */
  createPremium: (request: CreatePremiumRequest): Promise<Premium> => {
    return client.post<Premium>('/Premium', request).then((r) => r.data);
  },

  /**
   * Replaces a premium. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#e9a45026-1112-46db-94d2-6ca05c8229da
   * @param {number} premiumId - Premium id.
   * @param {UpdatePremiumRequest} request - Request body.
   * @returns {Promise<Premium>}
   */
  updatePremium: (premiumId: number, request: UpdatePremiumRequest): Promise<Premium> => {
    return client.put<Premium>(`/Premium/${premiumId}`, request).then((r) => r.data);
  },

  /**
   * GETs the premium, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#e9a45026-1112-46db-94d2-6ca05c8229da
   * @param {number} premiumId - Premium id.
   * @param {Partial<UpdatePremiumRequest>} changes - Fields to change.
   * @returns {Promise<Premium>} The updated premium.
   */
  updatePremiumSafely: async (
    premiumId: number,
    changes: Partial<UpdatePremiumRequest>,
  ): Promise<Premium> => {
    const current = await client.get<Premium>(`/Premium/${premiumId}`).then((r) => r.data);
    return client
      .put<Premium>(`/Premium/${premiumId}`, mergeUpdate(premiumToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

  /**
   * Increments premium inventory. The incrementor must be a positive number.
   * @see https://docs.virtuoussoftware.com/#8426f179-9dfd-468e-857d-ffdc52a375c7
   * @param {number} premiumId - Premium id.
   * @param {object} params - Query parameters.
   * @returns {Promise<Premium>}
   */
  incrementPremiumInventory: (premiumId: number, params?: { incrementor?: number }): Promise<Premium> => {
    return client.put<Premium>(`/Premium/Increment/${premiumId}`, {}, { params }).then((r) => r.data);
  },

  /**
   * Decrements premium inventory. The decrementor must be a negative number.
   * @see https://docs.virtuoussoftware.com/#fb9e8a00-090d-4a2a-84f0-b6a82eb0b3ee
   * @param {number} premiumId - Premium id.
   * @param {object} params - Query parameters.
   * @returns {Promise<Premium>}
   */
  decrementPremiumInventory: (premiumId: number, params?: { decrementor?: number }): Promise<Premium> => {
    return client.put<Premium>(`/Premium/Decrement/${premiumId}`, {}, { params }).then((r) => r.data);
  },

  /**
   * Returns enabled custom fields for premiums.
   * @see https://docs.virtuoussoftware.com/#dce43fac-4148-4509-9b70-addc3f590b3d
   * @returns {Promise<CustomFieldDefinition[]>}
   */
  getPremiumCustomFields: (): Promise<CustomFieldDefinition[]> => {
    return client.get<CustomFieldDefinition[]>('/Premium/CustomFields').then((r) => r.data);
  },

  /**
   * Queries premiums. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#348b084f-f64b-434e-8b20-cc1e24ad29df
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Premium>>}
   */
  queryPremiums: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<Premium>> => {
    return client.post<ListResponse<Premium>>('/Premium/Query', request, { params }).then((r) => r.data);
  },

  /**
   * Returns query fields and operators for premiums.
   * @see https://docs.virtuoussoftware.com/#47663995-fd46-47ca-8584-c527be5d0ac4
   * @returns {Promise<QueryOptionsResponse>}
   */
  getPremiumQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/Premium/QueryOptions').then((r) => r.data);
  },

});

export default createPremiumClient;
