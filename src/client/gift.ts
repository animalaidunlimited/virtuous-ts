import type { AxiosInstance } from 'axios';
import type {
  Gift,
  GiftListResponse,
  GiftSummary,
  GiftSummaryWithDesignations,
  NonCashGiftTypes,
} from '../types/gift/gift';
import type {
  GiftsForContactByReferenceIdSkipTakeParams,
} from '../types/gift/gift-params';
import type { UpdateGiftRequest } from '../types/gift/gift-update';
import type { CreateGiftTransactionRequest } from '../types/gift/gift-transaction-create';
import type { GiftQueryResponse } from '../types/gift/gift-query';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { GiftListSkipTakeParams, SkipTakeParams } from '../types/shared/skip-take-params';
import { CreateGiftRequest } from '../types/gift/gift-create';
import { convertGiftToUpdateGiftRequest } from '../utils/convert-gift-to-update-request';




/**
 * Gift API client
 *
 * All gift-related operations: create, search, update, query, etc.
 *
 * All Gift Update requests must be sent with a fully populated UpdateGiftRequest object. 
 * Single field updates are not supported. Any unset properties will be deleted.
 * 
 * Please use virtuous.gift.updateGiftSafely() for single field  updates. 
 * This method will request the current gift object from Virtuous
 * and populate the UpdateGiftRequest object with the existing values before appending the changes.
 * 
 * Only the fields that are being updated should be included in the changes object.
 * 
 * @example
 * await virtuous.gift.updateGiftSafely(12345, { amount: 500 });
 */
const createGiftClient = (client: AxiosInstance) => {
  return {
    // ── Basic Gift Operations ─────────────────────────────────────────────
    /**
     * Get a gift by ID
     *
     * @param id - The ID of the gift
     * @returns The gift object
     * @example
     * await virtuous.gift.getGift(12345);
     */
    getGift: (id: number) => client.get<Gift>(`/Gift/${id}`).then((r) => r.data),

    /**
     * Get gifts for a contact
     *
     * @param contactId - The ID of the contact
     * @param params - Optional skip/take for pagination
     * @returns Paginated list of gift objects
     * @example
     * await virtuous.gift.getGiftsByContact(12345);
     * */
    getGiftsByContact: (contactId: number, params?: GiftListSkipTakeParams) =>
      client
        .get<GiftListResponse<GiftSummary>>(`/Gift/ByContact/${contactId}`, { params })
        .then((r) => r.data),

    /**
     * Get gifts for a contact by reference ID
     *
     * @param referenceId - The reference ID
     * @param params - Optional skip/take for pagination
     * @returns Paginated list of gift objects
     * @example
     * await virtuous.gift.getGiftsForContactByReferenceId("12345");
     */
    getGiftsForContactByReferenceId: (
      referenceId: string,
      params?: GiftsForContactByReferenceIdSkipTakeParams,
    ) =>
      client
        .get<GiftListResponse<GiftSummaryWithDesignations>>(`/Gift/ByReference/${referenceId}`, { params })
        .then((r) => r.data),

    /**
     * Get passthrough gifts for a contact
     *
     * @param contactId - The ID of the contact
     * @param params - Optional skip/take for pagination
     * @returns Paginated list of passthrough gift objects
     * @example
     * await virtuous.gift.getPassthroughGiftsForContact(12345);
     */
    getPassthroughGiftsForContact: (contactId: number, params?: GiftListSkipTakeParams) =>
      client
        .get<GiftListResponse<GiftSummary>>(`/Gift/Passthrough/ByContact/${contactId}`, { params })
        .then((r) => r.data),

    /**
     * Get a gift by transaction source and ID
     *
     * @param transactionSource - The transaction source
     * @param transactionId - The transaction ID
     * @returns The gift object
     * @example
     * await virtuous.gift.getGiftByTransactionSourceAndId("Face to Face 012025", "12345");
     */
    getGiftByTransactionSourceAndId: (transactionSource: string, transactionId: string) =>
      client.get<Gift>(`/Gift/${transactionSource}/${transactionId}`).then((r) => r.data),

    // ── Update & Delete ───────────────────────────────────────────────────
    /**
     * Update a gift
     * 
     * Not recommended to use this method directly. Use updateGiftSafely() instead.
     *
     * Virtuous will not accept a gift update request with only the fields that are being updated.
     * The request object must be fully populated with all fields, even if only one field is being updated.
     *
     * Use updateGiftSafely() to safely update a gift with a single field update.
     *
     * @param id - The ID of the gift to update
     * @param request - The update gift request object
     * @returns The updated gift object
     * @example
     * await virtuous.gift.updateGift(12345, { amount: 500 });
     */
    updateGift: (id: number, request: UpdateGiftRequest) =>
      client.put<Gift>(`/Gift/${id}`, request).then((r) => r.data),

    /**
     * Update a gift safely
     * 
     * This method is used to update a gift safely. This method will request the current gift object from Virtuous
     * and populate the request object with the existing values before appending the changes.
     * 
     * Only the fields that are being updated should be included in the changes object.
     *
     * @param giftId - The ID of the gift to update
     * @param changes - The changes to apply to the update gift request object
     * @returns The updated gift object
     * @example
     * await virtuous.gift.updateGiftSafely(12345, { amount: 500 });
     */
    updateGiftSafely: async (giftId: number, changes: Partial<UpdateGiftRequest>): Promise<Gift> => {
      const current = await client.get<Gift>(`/Gift/${giftId}`).then((r) => r.data);
      const base = convertGiftToUpdateGiftRequest(current);

      const updated: UpdateGiftRequest = {
        ...base,
        ...changes,
        giftDesignations: changes.giftDesignations ?? base.giftDesignations,
        giftPremiums: changes.giftPremiums ?? base.giftPremiums,
        pledgePayments: changes.pledgePayments ?? base.pledgePayments,
        recurringGiftPayments: changes.recurringGiftPayments ?? base.recurringGiftPayments,
        customFields: changes.customFields ?? base.customFields,
      };

      return client.put<Gift>(`/Gift/${giftId}`, updated).then((r) => r.data);
    },

    /**
     * Delete a gift
     *
     * @param id - The ID of the gift to delete
     * @returns void
     * @example
     * await virtuous.gift.deleteGift(12345);
     */
    deleteGift: (id: number) => client.delete<void>(`/Gift/${id}`).then(() => undefined),

    // ── Create Gift (preferred method) ────────────────────────────────────
    /**
     * Create a gift using Virtuous's "preferred" transaction method
     *
     * This is the recommended way to create gifts — it supports smart contact matching,
     * reference IDs, custom fields, and all gift types.
     *
     * @param request - The create gift transaction request object
     * @returns The created gift object
     * @example
     * await virtuous.gift.createGiftTransaction({
     *   transactionSource: "Face to Face 012025",
     *   transactionId: "12345",
     *   frequency: "OneTime",
     *   contact: { email: "sarah@example.com", firstname: "Sarah", lastname: "Johnson" },
     *   giftType: "Cash",
     *   amount: 100.00,
     *   giftDate: "2025-04-05",
     *   currencyCode: "USD",
     *   notes: "This is a note",
     *   segment: "Face to Face 012025",
     *   mediaOutlet: "Facebook",
     * });
     */
    createGiftTransaction: (request: CreateGiftTransactionRequest) => client.post<Gift>('/v2/Gift/Transaction', request).then((r) => r.data),

    /**
     * Create a gift
     *
     * @param request - The create gift request object
     * @returns The created gift object
     * @example
     * await virtuous.gift.createGift({
     *   transactionSource: "API Test",
     *   transactionId: "12345",
     *   contactId: 12345,
     *   contactIndividualId: 12345,
     *   giftType: "Cash",
     *   amount: 10.00,
     *   giftDate: "2025-11-28",
     *   notes: "This is a note",
     * });
     */
    createGift: (request: CreateGiftRequest) => client.post<Gift>('/Gift', request).then((r) => r.data),

    // ── Reference Data ────────────────────────────────────────────────────
    /**
     * Get non-cash gift types
     *
     * @param params - Optional skip/take for pagination
     * @returns Paginated list of non-cash gift types
     * @example
     * const options = await virtuous.gift.getNonCashGiftTypes();
     */
    getNonCashGiftTypes: (params: GiftListSkipTakeParams) =>
      client
        .get<GiftListResponse<NonCashGiftTypes>>('/Gift/NonCashGiftTypes', { params })
        .then((r) => r.data),

    // ── Advanced Query ────────────────────────────────────────────────────
    /**
     * Get gift query options
     *
     * @returns Gift query options
     * @example
     * const options = await virtuous.gift.getGiftQueryOptions();
     */
    getGiftQueryOptions: () => client.get<QueryOptionsResponse>('/Gift/QueryOptions').then((r) => r.data),

    /**
     * Search gifts and return a list of gifts with abbreviated details
     *
     * @param request - The request query object
     * @param params - Optional skip/take for pagination
     * @returns Paginated list of abbreviated gift objects
     * 
     * Use buildGiftQuery() simple helper function to build the request query object.
     * 
     * @example
     * const results = await virtuous.gift.queryGiftsWithAbbreviatedDetails(
     *   buildGiftQuery({ amountMin: 10000, giftDateYear: 2025 })
     * );
     */
    queryGiftsWithAbbreviatedDetails: (request: QueryRequest, params?: SkipTakeParams) =>
      client.post<GiftQueryResponse>('/Gift/Query', request, { params }).then((r) => r.data),

    /**
     * Search gifts and return a list of gifts with full details
     *
     * @param request - The request query object
     * @param params - Optional skip/take for pagination
     * @returns Paginated list of full gift objects
     * 
     * Use buildGiftQuery() simple helper function to build the request query object.
     * 
     * @example
     * const results = await virtuous.gift.queryGiftsWithFullDetails(
     *   buildGiftQuery({ amountMin: 10000, giftDateYear: 2025 })
     * );
     */
    queryGiftsWithFullDetails: (request: QueryRequest, params?: SkipTakeParams) => {
      return client.post<GiftListResponse<Gift>>('/Gift/Query/FullGift', request, { params }).then((r) => r.data);
    },

    // ── Expose converter function ─────────────────────────────────────────
    /**
     * Converts a full Gift object into a safe UpdateGiftRequest object.
     *
     * Strips all fields not required for an update request and remaps collections 
     * (giftDesignations, giftPremiums, etc.) to the exact shape Virtuous expects on PUT /Gift/{id}.
     *
     * Use this inside updateGiftSafely() or when you need to create an update gift request object manually
     * without accidentally wiping data.
     *
     * @param gift - Full gift object from getGift() or query
     * @returns Update gift request object
     * @example
     * const current = await virtuous.gift.getGift(12345);
     * const base = virtuous.gift.convertGiftToUpdateGiftRequest(current);
     * await virtuous.gift.updateGift(12345, { ...base, amount: 500 });
     */
    convertGiftToUpdateGiftRequest,
  };
};

export default createGiftClient;
