import { AxiosInstance } from 'axios';
import type { RecurringGift, RecurringGiftListResponse } from '../types/recurring-gift/recurring-gift';
import { GiftListSkipTakeParams, SkipTakeParams } from '../types/shared/skip-take-params';
import { CreateRecurringGiftRequest } from '../types/recurring-gift/recurring-gift-create';
import { UpdateRecurringGiftRequest } from '../types/recurring-gift/recurring-gift-update';
import { CancelRecurringGiftRequest } from '../types/recurring-gift/recurring-gift-cancel';
import { RecurringGiftCustomFieldListResponse } from '../types/recurring-gift/recurring-gift-custom-field';
import { QueryOptionsResponse } from '../types/shared/query-options';
import { QueryRequest } from '../types/shared/query';
import { RecurringGiftPaymentListResponse } from '../types/recurring-gift/recurring-gift-payment';
import { convertRecurringGiftToUpdateRequest } from '../utils/convert-recurring-gift-to-update-request';
import { validateQueryWithCache } from '../http/query-validation';
import type { QueryOptionsCache } from '../http/query-options-cache';


/**
 * Recurring Gift API client
 * 
 * All recurring gift-related operations: create, search, update, query, etc.
 * 
 * All Recurring Gift Update requests must be sent with a fully populated UpdateRecurringGiftRequest object. 
 * Single field updates are not supported. Any unset properties will be deleted.
 * 
 * Please use virtuous.recurringGift.updateRecurringGiftSafely() for single field  updates. 
 * This method will request the current recurring gift object from Virtuous
 * and populate the UpdateRecurringGiftRequest object with the existing values before appending the changes.
 * 
 * Only the fields that are being updated should be included in the changes object.
 * 
 * 
 * @example
 * await virtuous.recurringGift.updateRecurringGiftSafely(12345, { amount: 500 });
 * @example
 * await virtuous.recurringGift.cancelRecurringGift(12345, { cancelReason: "Donor requested", categoryId: 1 }); 
 * @example
 * const recurringGift = await virtuous.recurringGift.getRecurringGiftById(12345);
 */
const createRecurringGiftClient = (
  client: AxiosInstance,
  options: { validateQueries?: boolean; queryOptionsCache?: QueryOptionsCache } = {},
) => {
  return {


    /**
     * Get recurring gifts for a contact
     * @see https://docs.virtuoussoftware.com/#0997a754-f41b-41f4-9810-af8ae2b047c5
     * @param {number} contactId - Contact id.
     * @param {GiftListSkipTakeParams} [params] - Pagination.
     * @returns {Promise<RecurringGiftListResponse>} Resolved API payload.
     */
    getRecurringGiftsForContact: (contactId: number, params?: GiftListSkipTakeParams) =>
      client.get<RecurringGiftListResponse>(`/RecurringGift/ByContact/${contactId}`, { params }).then((r) => r.data),


    /**
     * Get recurring gift by id
     * @see https://docs.virtuoussoftware.com/#e1db1cb8-8751-40d6-b274-e6f62a0bbc77
     * @param {number} id - Recurring gift id.
     * @returns {Promise<RecurringGift>} Resolved API payload.
     */
    getRecurringGiftById: (id: number) =>
      client.get<RecurringGift>(`/RecurringGift/${id}`).then((r) => r.data),


    /**
     * Create a recurring gift
     * @see https://docs.virtuoussoftware.com/#8f231d38-f045-4091-a79f-fef8adc3bc11
     * @param {CreateRecurringGiftRequest} request - Create body.
     * @returns {Promise<RecurringGift>} Resolved API payload.
     */
    createRecurringGift: (request: CreateRecurringGiftRequest) =>
      client.post<RecurringGift>(`/RecurringGift`, request).then((r) => r.data),


    /**
     * Update a recurring gift
     * @see https://docs.virtuoussoftware.com/#13511372-eb0a-4f52-b097-744507cffb45
     * @param {number} id - Recurring gift id.
     * @param {UpdateRecurringGiftRequest} request - Full update body.
     * @returns {Promise<RecurringGift>} Resolved API payload.
     */
    updateRecurringGift: (id: number, request: UpdateRecurringGiftRequest) =>
      client.put<RecurringGift>(`/RecurringGift/${id}`, request).then((r) => r.data),

    /**
     * Update a recurring gift (merge changes)
     * @see https://docs.virtuoussoftware.com/#e1db1cb8-8751-40d6-b274-e6f62a0bbc77
     * @param {number} recurringGiftId - Recurring gift id.
     * @param {Partial<UpdateRecurringGiftRequest>} changes - Fields to merge.
     * @returns {Promise<RecurringGift>} Resolved API payload.
     */
    updateRecurringGiftSafely: async (
        recurringGiftId: number,
        changes: Partial<UpdateRecurringGiftRequest>
      ): Promise<RecurringGift> => {
        const current = await client.get<RecurringGift>(`/RecurringGift/${recurringGiftId}`).then((r) => r.data)
        const base = convertRecurringGiftToUpdateRequest(current);
      
        const updated: UpdateRecurringGiftRequest = {
          ...base,
          ...changes,
          designations: changes.designations ?? base.designations,
          customFields: changes.customFields ?? base.customFields,
        };
      
        return client
          .put<RecurringGift>(`/RecurringGift/${recurringGiftId}`, updated)
          .then(r => r.data);
      },

    /**
     * Cancel a recurring gift
     * @see https://docs.virtuoussoftware.com/#69ad2ef2-6dde-447e-badb-0f25e15449bd
     * @param {number} recurringGiftId - Recurring gift id.
     * @param {CancelRecurringGiftRequest} request - Cancel body.
     * @returns {Promise<RecurringGift>} Resolved API payload.
     */
    cancelRecurringGift: (recurringGiftId: number, request: CancelRecurringGiftRequest) =>
      client.put<RecurringGift>(`/RecurringGift/Cancel/${recurringGiftId}`, request).then((r) => r.data),

    /**
     * Get recurring gift custom fields.
     *
     * Plain array or short catalog, no `skip`/`take`. Virtuous may return only
     * the first 10 definitions.
     *
     * @see https://docs.virtuoussoftware.com/#269c5843-7478-43a2-a04a-1588bb4bafad
     * @returns {Promise<RecurringGiftCustomFieldListResponse>} Resolved API payload. May be truncated at 10.
     */
    getRecurringGiftCustomFields: () => client.get<RecurringGiftCustomFieldListResponse>(`/RecurringGift/CustomFields`).then((r) => r.data),


    /**
     * Query recurring gifts
     * @see https://docs.virtuoussoftware.com/#2d44defa-aa9a-4627-815e-c2b08ea25e23
     * @param {QueryRequest} request - Query body.
     * @param {SkipTakeParams} [params] - Pagination.
     * @returns {Promise<RecurringGiftListResponse>} Resolved API payload.
     */
    queryRecurringGifts: async (request: QueryRequest, params?: SkipTakeParams) => {
      if (options.validateQueries && options.queryOptionsCache) {
        await validateQueryWithCache(client, options.queryOptionsCache, '/RecurringGift/QueryOptions', request);
      }
      return client.post<RecurringGiftListResponse>('/RecurringGift/Query', request, { params }).then((r) => r.data);
    },

    /**
     * Get recurring gift query options
     * @see https://docs.virtuoussoftware.com/#08fae1f5-eb9e-41b8-8ec5-7cade8df70f1
     * @returns {Promise<QueryOptionsResponse>} Resolved API payload.
     */
    getRecurringGiftQueryOptions: () => client.get<QueryOptionsResponse>(`/RecurringGift/QueryOptions`).then((r) => r.data),

    /**
     * Get payments for a recurring gift
     * @see https://docs.virtuoussoftware.com/#deace063-7387-47ee-bc89-9eb47161fd8f
     * @param {number} recurringGiftId - Recurring gift id.
     * @param {SkipTakeParams} [params] - Pagination.
     * @returns {Promise<RecurringGiftPaymentListResponse>} Resolved API payload.
     */
    getPaymentForRecurringGift: (recurringGiftId: number, params?: SkipTakeParams) =>
      client.get<RecurringGiftPaymentListResponse>(`/RecurringGiftPayment/${recurringGiftId}`, { params }).then((r) => r.data),

    convertRecurringGiftToUpdateRequest,
  };
};

export default createRecurringGiftClient;
