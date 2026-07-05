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
const createRecurringGiftClient = (client: AxiosInstance) => {
  return {


    /**
     * Get recurring gifts for a contact
     * @see https://docs.virtuous.org/api-reference/recurring-gift/gets-the-recurring-gifts-for-the-specified-contact
     * @param {number} contactId - Contact id.
     * @param {GiftListSkipTakeParams} [params] - Pagination.
     * @returns {Promise<RecurringGiftListResponse>} Resolved API payload.
     */
    getRecurringGiftsForContact: (contactId: number, params?: GiftListSkipTakeParams) =>
      client.get<RecurringGiftListResponse>(`/RecurringGift/ByContact/${contactId}`, { params }).then((r) => r.data),


    /**
     * Get recurring gift by id
     * @see https://docs.virtuous.org/api-reference/recurring-gift/gets-the-specified-recurring-gift
     * @param {number} id - Recurring gift id.
     * @returns {Promise<RecurringGift>} Resolved API payload.
     */
    getRecurringGiftById: (id: number) =>
      client.get<RecurringGift>(`/RecurringGift/${id}`).then((r) => r.data),


    /**
     * Create a recurring gift
     * @see https://docs.virtuous.org/api-reference/recurring-gift/created-a-new-recurring-gift
     * @param {CreateRecurringGiftRequest} request - Create body.
     * @returns {Promise<RecurringGift>} Resolved API payload.
     */
    createRecurringGift: (request: CreateRecurringGiftRequest) =>
      client.post<RecurringGift>(`/RecurringGift`, request).then((r) => r.data),


    /**
     * Update a recurring gift
     * @see https://docs.virtuous.org/api-reference/recurring-gift/update-an-existing-recurring-gift
     * @param {number} id - Recurring gift id.
     * @param {UpdateRecurringGiftRequest} request - Full update body.
     * @returns {Promise<RecurringGift>} Resolved API payload.
     */
    updateRecurringGift: (id: number, request: UpdateRecurringGiftRequest) =>
      client.put<RecurringGift>(`/RecurringGift/${id}`, request).then((r) => r.data),

    /**
     * Update a recurring gift (merge changes)
     * @see https://docs.virtuous.org/api-reference/recurring-gift/update-an-existing-recurring-gift
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
     * @see https://docs.virtuous.org/api-reference/recurring-gift/cancels-the-specified-recurring-gift
     * @param {number} recurringGiftId - Recurring gift id.
     * @param {CancelRecurringGiftRequest} request - Cancel body.
     * @returns {Promise<RecurringGift>} Resolved API payload.
     */
    cancelRecurringGift: (recurringGiftId: number, request: CancelRecurringGiftRequest) =>
      client.put<RecurringGift>(`/RecurringGift/Cancel/${recurringGiftId}`, request).then((r) => r.data),

    /**
     * Get recurring gift custom fields
     * @see https://docs.virtuous.org/api-reference/recurring-gift/get-the-custom-fields-available-for-recurring-gifts
     * @returns {Promise<RecurringGiftCustomFieldListResponse>} Resolved API payload.
     */
    getRecurringGiftCustomFields: () => client.get<RecurringGiftCustomFieldListResponse>(`/RecurringGift/CustomFields`).then((r) => r.data),


    /**
     * Query recurring gifts
     * @see https://docs.virtuous.org/api-reference/recurring-gift/request-recurring-gifts-with-a-custom-query
     * @param {QueryRequest} request - Query body.
     * @param {SkipTakeParams} [params] - Pagination.
     * @returns {Promise<RecurringGiftListResponse>} Resolved API payload.
     */
    queryRecurringGifts: (request: QueryRequest, params?: SkipTakeParams) =>
      client.post<RecurringGiftListResponse>('/RecurringGift/Query', request, { params }).then((r) => r.data),

    /**
     * Get recurring gift query options
     * @see https://docs.virtuous.org/api-reference/recurring-gift/request-query-options-to-build-a-query-for-recurring-gifts
     * @returns {Promise<QueryOptionsResponse>} Resolved API payload.
     */
    getRecurringGiftQueryOptions: () => client.get<QueryOptionsResponse>(`/RecurringGift/QueryOptions`).then((r) => r.data),

    /**
     * Get payments for a recurring gift
     * @see https://docs.virtuous.org/api-reference/recurring-gift/gets-recurring-gift-payments-for-the-specified-recurring-gift-identifier
     * @param {number} recurringGiftId - Recurring gift id.
     * @param {SkipTakeParams} [params] - Pagination.
     * @returns {Promise<RecurringGiftPaymentListResponse>} Resolved API payload.
     */
    getPaymentForRecurringGift: (recurringGiftId: number, params?: SkipTakeParams) =>
      client.get<RecurringGiftPaymentListResponse>(`/RecurringGift/Payment/${recurringGiftId}`, { params }).then((r) => r.data),

    convertRecurringGiftToUpdateRequest,
  };
};

export default createRecurringGiftClient;
