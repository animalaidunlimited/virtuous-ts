import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import type { AxiosInstance } from 'axios';
import type {
  CreateGiftAskRequest,
  GiftAsk,
  UpdateGiftAskRequest,
} from '../types/gift-ask/gift-ask';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';
import type { Gift } from '../types/gift/gift';
import { giftAskToUpdateRequest, mergeUpdate } from '../utils/to-update-request';

/**
 * Virtuous CRM gift ask API.
 * @see https://docs.virtuoussoftware.com/#1f643d73-62bb-4dc7-917c-0b86ef5a35cb
 */
const createGiftAskClient = (client: AxiosInstance) => ({
  /**
   * Returns gift asks for a contact.
   * @see https://docs.virtuoussoftware.com/#1f643d73-62bb-4dc7-917c-0b86ef5a35cb
   * @param {number} contactId - Contact id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<GiftAsk>>}
   */
  getGiftAsksForContact: (contactId: number, params?: SkipTakeParams): Promise<ListResponse<GiftAsk>> => {
    return client.get<ListResponse<GiftAsk>>(`/GiftAsk/ByContact/${contactId}`, { params }).then((r) => r.data);
  },

  /**
   * Returns gifts applied to a gift ask.
   * @see https://docs.virtuoussoftware.com/#79c48679-3e66-47f1-bd53-c5fe4bab067b
   * @param {number} giftAskId - Gift Ask id.
   * @returns {Promise<Gift[]>}
   */
  getGiftsForGiftAsk: (giftAskId: number): Promise<Gift[]> => {
    return client.get<Gift[]>(`/GiftAsk/${giftAskId}/Gifts`).then((r) => r.data);
  },

  /**
   * Returns a gift ask by id.
   * @see https://docs.virtuoussoftware.com/#3afdf19c-2761-4d87-ad31-bdf34dbab686
   * @param {number} giftAskId - Gift Ask id.
   * @returns {Promise<GiftAsk>}
   */
  getGiftAsk: (giftAskId: number): Promise<GiftAsk> => {
    return client.get<GiftAsk>(`/GiftAsk/${giftAskId}`).then((r) => r.data);
  },

  /**
   * Records a gift ask on a contact.
   * @see https://docs.virtuoussoftware.com/#05f5e76a-d82d-4701-96f1-5a0139553654
   * @param {CreateGiftAskRequest} request - Request body.
   * @returns {Promise<GiftAsk>}
   */
  createGiftAsk: (request: CreateGiftAskRequest): Promise<GiftAsk> => {
    return client.post<GiftAsk>('/GiftAsk', request).then((r) => r.data);
  },

  /**
   * Replaces a gift ask. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#43c315cd-6717-4f05-985a-f5b85c489b8f
   * @param {number} giftAskId - Gift Ask id.
   * @param {UpdateGiftAskRequest} request - Request body.
   * @returns {Promise<GiftAsk>}
   */
  updateGiftAsk: (giftAskId: number, request: UpdateGiftAskRequest): Promise<GiftAsk> => {
    return client.put<GiftAsk>(`/GiftAsk/${giftAskId}`, request).then((r) => r.data);
  },

  /**
   * GETs the gift ask, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#43c315cd-6717-4f05-985a-f5b85c489b8f
   * @param {number} giftAskId - Gift ask id.
   * @param {Partial<UpdateGiftAskRequest>} changes - Fields to change.
   * @returns {Promise<GiftAsk>} The updated gift ask.
   */
  updateGiftAskSafely: async (
    giftAskId: number,
    changes: Partial<UpdateGiftAskRequest>,
  ): Promise<GiftAsk> => {
    const current = await client.get<GiftAsk>(`/GiftAsk/${giftAskId}`).then((r) => r.data);
    return client
      .put<GiftAsk>(`/GiftAsk/${giftAskId}`, mergeUpdate(giftAskToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

  /**
   * Returns enabled custom fields for gift asks.
   * @see https://docs.virtuoussoftware.com/#5a5f1e40-ac23-4739-89f5-c469451ed692
   * @returns {Promise<CustomFieldDefinition[]>}
   */
  getGiftAskCustomFields: (): Promise<CustomFieldDefinition[]> => {
    return client.get<CustomFieldDefinition[]>('/GiftAsk/CustomFields').then((r) => r.data);
  },

  /**
   * Returns query fields and operators for gift asks.
   * @see https://docs.virtuoussoftware.com/#f56f8c64-828c-42b8-b5aa-650f093bee47
   * @returns {Promise<QueryOptionsResponse>}
   */
  getGiftAskQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/GiftAsk/QueryOptions').then((r) => r.data);
  },

  /**
   * Queries gift asks. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#d3446150-75b5-4bfc-a9b2-7a964d45dfd9
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<GiftAsk>>}
   */
  queryGiftAsks: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<GiftAsk>> => {
    return client.post<ListResponse<GiftAsk>>('/GiftAsk/Query', request, { params }).then((r) => r.data);
  },

});

export default createGiftAskClient;
