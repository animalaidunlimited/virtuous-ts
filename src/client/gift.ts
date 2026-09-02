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
import type { QueuedImportResponse } from '../types/shared/queued-import';
import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import type {
  BulkGiftPatch,
  CreateGiftTransactionsRequest,
  CreateReversingTransactionRequest,
  GiftDesignationQueryRow,
} from '../types/gift/gift-bulk';
import type { ListResponse } from '../types/shared/list-response';




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
     * @see https://docs.virtuoussoftware.com/#1c36793d-84b9-4599-951e-fe8b281f80a2
     *
     * @param {number} id - Virtuous gift id.
     * @returns {Promise<Gift>} The gift record.
     * @example
     * await virtuous.gift.getGift(12345);
     */
    getGift: (id: number) => client.get<Gift>(`/Gift/${id}`).then((r) => r.data),

    /**
     * Get gifts for a contact
     * @see https://docs.virtuoussoftware.com/
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
     * Returns gifts for a contact reference id. HMAC authentication only; API keys may receive 403.
     * @see https://docs.virtuoussoftware.com/
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
     * @see https://docs.virtuoussoftware.com/
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
     * @see https://docs.virtuoussoftware.com/#08d16b40-0c34-43c6-a9a9-a4b7c3d7d453
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
     * @see https://docs.virtuoussoftware.com/#b094fc10-fdec-4085-a178-354dece28423
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
     * @see https://docs.virtuoussoftware.com/#64fc1392-e1ed-4ccd-a00b-8f66dc0e0de1
     *
     * @param {number} id - Virtuous gift id.
     * @returns {Promise<void>} Resolves when the gift is deleted.
     * @example
     * await virtuous.gift.deleteGift(12345);
     */
    deleteGift: (id: number) => client.delete<void>(`/Gift/${id}`).then(() => undefined),

    // ── Create Gift (preferred method) ────────────────────────────────────
    /**
     * Queues a gift through the import process (recommended). Matching runs later; the response is not a Gift record.
     * @see https://docs.virtuoussoftware.com/#e4a6a1e3-71a4-44f9-bd7c-9466996befac
     *
     * @param {CreateGiftTransactionRequest} request - v2 transaction create body.
     * @returns {Promise<QueuedImportResponse>} Empty queued-import acknowledgement.
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
    createGiftTransaction: (request: CreateGiftTransactionRequest) =>
      client
        .post<QueuedImportResponse>('/v2/Gift/Transaction', request)
        .then((r) => (r.data ?? {}) as QueuedImportResponse),

    /**
     * Create a gift (legacy `POST /Gift` — prefer {@link createGiftTransaction})
     * @see https://docs.virtuoussoftware.com/#b4c773db-88d0-4f07-ad06-d8ca32cbc236
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
     * @see https://docs.virtuoussoftware.com/
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
     * @see https://docs.virtuoussoftware.com/#a9cb583f-aa5b-41bc-907d-e442a923dad3
     *
     * @returns {Promise<QueryOptionsResponse>} Query builder metadata.
     * @example
     * const options = await virtuous.gift.getGiftQueryOptions();
     */
    getGiftQueryOptions: () => client.get<QueryOptionsResponse>('/Gift/QueryOptions').then((r) => r.data),

    /**
     * Search gifts and return a list of gifts with abbreviated details
     * @see https://docs.virtuoussoftware.com/#af19412c-7a8e-484f-9966-cc7e27b26b69
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
     * @see https://docs.virtuoussoftware.com/
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

    /**
     * Submits a batch of gift transactions through the import process.
     * @see https://docs.virtuoussoftware.com/#784d2096-10db-42be-83e5-83632936032f
     * @param {CreateGiftTransactionsRequest} request - Batch transaction source and items.
     * @returns {Promise<QueuedImportResponse>} Queued-import acknowledgement.
     */
    createGiftTransactions: (request: CreateGiftTransactionsRequest) =>
      client
        .post<QueuedImportResponse>('/v2/Gift/Transactions', request)
        .then((r) => (r.data ?? {}) as QueuedImportResponse),

    /**
     * Creates a reversing transaction that negates the specified gift.
     * @see https://docs.virtuoussoftware.com/#97c562eb-c771-4495-9469-487cc0ed1420
     * @param {CreateReversingTransactionRequest} request - Reversed gift id and date.
     * @returns {Promise<Gift>} The reversing gift.
     */
    createReversingTransaction: (request: CreateReversingTransactionRequest) =>
      client.post<Gift>('/Gift/ReversingTransaction', request).then((r) => r.data),

    /**
     * Bulk-patches gifts. Send only fields being changed, including each gift `id`.
     * @see https://docs.virtuoussoftware.com/#d34fe045-7d1d-4929-86f0-dd321ebb960d
     * @param {BulkGiftPatch[]} request - Partial gift patches.
     * @returns {Promise<unknown>} Bulk update result.
     */
    bulkUpdateGifts: (request: BulkGiftPatch[]) =>
      client.patch<unknown>('/Gift', request).then((r) => r.data),

    /**
     * Returns enabled custom fields for gifts.
     * @see https://docs.virtuoussoftware.com/#de71d723-902b-4357-af1c-20e35518aa74
     * @returns {Promise<CustomFieldDefinition[]>} Custom field catalog.
     */
    getGiftCustomFields: () =>
      client.get<CustomFieldDefinition[]>('/Gift/CustomFields').then((r) => r.data),

    /**
     * Returns query fields and operators for gift designations.
     * @see https://docs.virtuoussoftware.com/#fb900551-850c-432f-a986-17a3c6b5969f
     * @returns {Promise<QueryOptionsResponse>} Query builder metadata.
     */
    getGiftDesignationQueryOptions: () =>
      client.get<QueryOptionsResponse>('/GiftDesignation/QueryOptions').then((r) => r.data),

    /**
     * Queries gifts broken out by designation. Max take is 1,000.
     * @see https://docs.virtuoussoftware.com/#1147aa16-24e0-46d4-ae98-24731b90a93b
     * @param {QueryRequest} request - Query body.
     * @param {SkipTakeParams} [params] - Pagination.
     * @returns {Promise<ListResponse<GiftDesignationQueryRow>>} Designation rows.
     */
    queryGiftDesignations: (request: QueryRequest, params?: SkipTakeParams) =>
      client
        .post<ListResponse<GiftDesignationQueryRow>>('/GiftDesignation/Query', request, { params })
        .then((r) => r.data),
  };
};

export default createGiftClient;
