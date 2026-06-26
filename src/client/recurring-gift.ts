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
     * 
     * @param contactId - The ID of the contact
     * @param params - Optional skip/take for sorting and pagination
     * @returns Paginated list of recurring gift objects
     * @example
     * await virtuous.recurringGift.getRecurringGiftsForContact(12345);
     */
    getRecurringGiftsForContact: (contactId: number, params?: GiftListSkipTakeParams) =>
      client.get<RecurringGiftListResponse>(`/RecurringGift/ByContact/${contactId}`, { params }).then((r) => r.data),


    /**
     * Get a recurring gift by ID
     * 
     * @param id - The ID of the recurring gift
     * @returns The recurring gift object
     * @example
     * await virtuous.recurringGift.getRecurringGiftById(12345);
     */
    getRecurringGiftById: (id: number) =>
      client.get<RecurringGift>(`/RecurringGift/${id}`).then((r) => r.data),


    /**
     * Create a recurring gift
     * 
     * @param request - The create recurring gift request object
     * @returns The created recurring gift object
     * @example
     * await virtuous.recurringGift.createRecurringGift({
     *   contactId: 12345,
     *   startDate: "2025-04-01",
     *   frequency: "Monthly",
     *   amount: 100.00,
     *   nextExpectedPaymentDate: "2025-05-01",
     *   anticipatedEndDate: null,
     *   thankYouDate: "2025-04-02",
     *   automatedPayments: true,
     *   trackPayments: true,
     *   isPrivate: false,
     *   designations: [
     *     { projectId: 901, amountDesignated: 75.00 },
     *     { projectId: 902, amountDesignated: 25.00 }
     *   ],
     *   customFields: [
     *     { name: "Source", value: "FreeWill", displayName: "Donation Source" }
     *   ]
     * });
     */
    createRecurringGift: (request: CreateRecurringGiftRequest) =>
      client.post<RecurringGift>(`/RecurringGift`, request).then((r) => r.data),


    /**
     * Update a recurring gift
     * 
     * @param id - The ID of the recurring gift to update
     * @param request - The update recurring gift request object
     * @returns The updated recurring gift object
     * @example
     * await virtuous.recurringGift.updateRecurringGift(12345, {
     *  startDate: "2025-04-01",
     *  frequency: "Monthly",
     *  amount: 100.00,
     *  nextExpectedPaymentDate: "2025-05-01",
     *  anticipatedEndDate: null,
     *  thankYouDate: "2025-04-02",
     *  automatedPayments: true,
     *  trackPayments: true,
     *  isPrivate: false,    
     *  designations: [
     *    { projectId: 901, amountDesignated: 75.00 },
     *    { projectId: 902, amountDesignated: 25.00 }
     *  ],
     *  customFields: [
     *    { name: "Source", value: "FreeWill", displayName: "Donation Source" }
     *  ]
     * });
     */
    updateRecurringGift: (id: number, request: UpdateRecurringGiftRequest) =>
      client.put<RecurringGift>(`/RecurringGift/${id}`, request).then((r) => r.data),

    /**
     * Update a recurring gift safely
     * 
     * This method is used to update a recurring gift safely. This method will request the current recurring gift object from Virtuous
     * and populate the request object with the existing values before appending the changes.
     * 
     * Only the fields that are being updated should be included in the changes object.
     *
     * @param recurringGiftId - The ID of the recurring gift to update
     * @param changes - The changes to apply to the update recurring gift request object
     * @returns The updated recurring gift object
     * @example
     * await virtuous.recurringGift.updateRecurringGiftSafely(12345, { amount: 500 });
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
     * 
     * @param recurringGiftId - The ID of the recurring gift to cancel
     * @param request - The cancel recurring gift request object
     * @returns The cancelled recurring gift object
     * @example
     * await virtuous.recurringGift.cancelRecurringGift(12345, { cancelReason: "Donor requested", categoryId: 1 });
     */
    cancelRecurringGift: (recurringGiftId: number, request: CancelRecurringGiftRequest) =>
      client.put<RecurringGift>(`/RecurringGift/Cancel/${recurringGiftId}`, request).then((r) => r.data),

    /**
     * Get recurring gift custom fields
     * 
     * @returns Recurring gift custom fields
     * @example
     * const customFields = await virtuous.recurringGift.getRecurringGiftCustomFields();
     */
    getRecurringGiftCustomFields: () => client.get<RecurringGiftCustomFieldListResponse>(`/RecurringGift/CustomFields`).then((r) => r.data),


    /**
     * Search recurring gifts and return a list of recurring gifts with abbreviated details
     * 
     * @param request - The request query object
     * @param params - Optional skip/take for pagination
     * @returns Paginated list of recurring gift objects
     * @example
     * const results = await virtuous.recurringGift.queryRecurringGiftsWithAbbreviatedDetails(request);
     */
    queryRecurringGifts: (request: QueryRequest, params?: SkipTakeParams) =>
      client.post<RecurringGiftListResponse>('/RecurringGift/Query', request, { params }).then((r) => r.data),

    /**
     * Get recurring gift query options
     * 
     * @returns Recurring gift query options
     * @example
     * const options = await virtuous.recurringGift.getRecurringGiftQueryOptions();
     */
    getRecurringGiftQueryOptions: () => client.get<QueryOptionsResponse>(`/RecurringGift/QueryOptions`).then((r) => r.data),

    /**
     * Get payments for a recurring gift
     * 
     * @param recurringGiftId - The ID of the recurring gift
     * @param params - Optional skip/take for pagination
     * @returns Paginated list of recurring gift payment objects
     * @example
     * const payments = await virtuous.recurringGift.getPaymentForRecurringGift(12345);
     */
    getPaymentForRecurringGift: (recurringGiftId: number, params?: SkipTakeParams) =>
      client.get<RecurringGiftPaymentListResponse>(`/RecurringGift/Payment/${recurringGiftId}`, { params }).then((r) => r.data),

    convertRecurringGiftToUpdateRequest,
  };
};

export default createRecurringGiftClient;
