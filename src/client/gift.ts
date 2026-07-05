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
     * @see https://docs.virtuous.org/api-reference/gift/get-a-gift-by-the-identifier
     *
     * @param {number} id - Virtuous gift id.
     * @returns {Promise<Gift>} The gift record.
     * @example
     * await virtuous.gift.getGift(12345);
     */
    getGift: (id: number) => client.get<Gift>(`/Gift/${id}`).then((r) => r.data),

    /**
     * Get gifts for a contact
     * @see https://docs.virtuous.org/api-reference/gift/get-gifts-with-the-specified-contact-identifier
     *
     * @param {number} contactId - Virtuous contact id.
     * @param {GiftListSkipTakeParams} [params] - Skip/take pagination.
     * @returns {Promise<GiftListResponse<GiftSummary>>} Gift summaries for the contact.
     * @example
     * await virtuous.gift.getGiftsByContact(12345);
     * */
    getGiftsByContact: (contactId: number, params?: GiftListSkipTakeParams) =>
      client
        .get<GiftListResponse<GiftSummary>>(`/Gift/ByContact/${contactId}`, { params })
        .then((r) => r.data),

    /**
     * Get gifts for a contact by reference ID
     * @see https://docs.virtuous.org/api-reference/gift/get-gifts-by-a-contact-reference-identifier
     *
     * @param {string} referenceId - Contact reference id.
     * @param {GiftsForContactByReferenceIdSkipTakeParams} [params] - Skip/take pagination.
     * @returns {Promise<GiftListResponse<GiftSummaryWithDesignations>>} Gifts for that reference.
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
     * @see https://docs.virtuous.org/api-reference/gift/get-passthrough-gifts-with-the-specified-contact-identifier
     *
     * @param {number} contactId - Virtuous contact id.
     * @param {GiftListSkipTakeParams} [params] - Skip/take pagination.
     * @returns {Promise<GiftListResponse<GiftSummary>>} Passthrough gifts for the contact.
     * @example
     * await virtuous.gift.getPassthroughGiftsForContact(12345);
     */
    getPassthroughGiftsForContact: (contactId: number, params?: GiftListSkipTakeParams) =>
      client
        .get<GiftListResponse<GiftSummary>>(`/Gift/Passthrough/ByContact/${contactId}`, { params })
        .then((r) => r.data),

    /**
     * Get a gift by transaction source and ID
     * @see https://docs.virtuous.org/api-reference/gift/get-a-gift-by-the-transaction-source-and-identifier
     *
     * @param {string} transactionSource - Transaction source name.
     * @param {string} transactionId - Transaction id within that source.
     * @returns {Promise<Gift>} The matching gift.
     * @example
     * await virtuous.gift.getGiftByTransactionSourceAndId("Face to Face 012025", "12345");
     */
    getGiftByTransactionSourceAndId: (transactionSource: string, transactionId: string) =>
      client.get<Gift>(`/Gift/${transactionSource}/${transactionId}`).then((r) => r.data),

    // ── Update & Delete ───────────────────────────────────────────────────
    /**
     * Update a gift
     * @see https://docs.virtuous.org/api-reference/gift/update-a-gift-with-the-specified-identifier
     *
     * Not recommended to use this method directly. Use updateGiftSafely() instead.
     *
     * Virtuous will not accept a gift update request with only the fields that are being updated.
     * The request object must be fully populated with all fields, even if only one field is being updated.
     *
     * Use updateGiftSafely() to safely update a gift with a single field update.
     *
     * @param {number} id - Virtuous gift id.
     * @param {UpdateGiftRequest} request - Fully populated update body (see updateGiftSafely).
     * @returns {Promise<Gift>} The updated gift.
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
     * @param {number} giftId - Virtuous gift id.
     * @param {Partial<UpdateGiftRequest>} changes - Fields to merge onto the current gift.
     * @returns {Promise<Gift>} The updated gift.
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
     * @see https://docs.virtuous.org/api-reference/gift/delete-a-gift-with-the-specified-identifier
     *
     * @param {number} id - Virtuous gift id.
     * @returns {Promise<void>} Resolves when the gift is deleted.
     * @example
     * await virtuous.gift.deleteGift(12345);
     */
    deleteGift: (id: number) => client.delete<void>(`/Gift/${id}`).then(() => undefined),

    // ── Create Gift (preferred method) ────────────────────────────────────
    /**
     * Create a gift using Virtuous's "preferred" transaction method
     * @see https://docs.virtuous.org/api-reference/gift/create-a-gift-transaction
     *
     * This is the recommended way to create gifts — it supports smart contact matching,
     * reference IDs, custom fields, and all gift types.
     *
     * @param {CreateGiftTransactionRequest} request - v2 transaction create body.
     * @returns {Promise<Gift>} The created gift.
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
     * Create a gift (legacy `POST /Gift` — prefer {@link createGiftTransaction})
     * @see https://docs.virtuous.org/api-reference/gift/create-gift-not-recommended
     *
     * @param {CreateGiftRequest} request - Legacy create body (prefer createGiftTransaction).
     * @returns {Promise<Gift>} The created gift.
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
     * @see https://docs.virtuous.org/api-reference/gift/get-non-cash-gift-types-available
     *
     * @param {GiftListSkipTakeParams} params - Skip/take pagination.
     * @returns {Promise<GiftListResponse<NonCashGiftTypes>>} Non-cash gift type catalog.
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
     * @see https://docs.virtuous.org/api-reference/gift/get-gift-query-options
     *
     * @returns {Promise<QueryOptionsResponse>} Query builder metadata.
     * @example
     * const options = await virtuous.gift.getGiftQueryOptions();
     */
    getGiftQueryOptions: () => client.get<QueryOptionsResponse>('/Gift/QueryOptions').then((r) => r.data),

    /**
     * Search gifts and return a list of gifts with abbreviated details
     * @see https://docs.virtuous.org/api-reference/gift/get-gifts-matching-the-query-criteria-provided
     *
     * @param {QueryRequest} request - Virtuous query payload.
     * @param {SkipTakeParams} [params] - Skip/take pagination.
     * @returns {Promise<GiftQueryResponse>} Abbreviated gift query results.
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
     * @see https://docs.virtuous.org/api-reference/gift/get-gifts-matching-the-query-criteria-provided-with-all-gift-info
     *
     * @param {QueryRequest} request - Virtuous query payload.
     * @param {SkipTakeParams} [params] - Skip/take pagination.
     * @returns {Promise<GiftListResponse<Gift>>} Full gift query results.
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
     * @param {Gift} gift - Full gift from getGift() or query.
     * @returns {UpdateGiftRequest} Body safe for PUT /Gift/{id}.
     * @example
     * const current = await virtuous.gift.getGift(12345);
     * const base = virtuous.gift.convertGiftToUpdateGiftRequest(current);
     * await virtuous.gift.updateGift(12345, { ...base, amount: 500 });
     */
    convertGiftToUpdateGiftRequest,
  };
};

export default createGiftClient;
