import { AxiosInstance } from 'axios';
import { CreatePlannedGiftRequest } from '../types/planned-gift/planned-gift-create';
import { PlannedGift, PlannedGiftListResponse } from '../types/planned-gift/planned-gift';
import { SkipTakeParams } from '../types/shared/skip-take-params';
import { UpdatePlannedGiftRequest } from '../types/planned-gift/planned-gift-update';
import { GiftsAppliedToPlannedGiftResponse } from '../types/planned-gift/planned-gift-applied-gifts';
import { QueryOptionsResponse } from '../types/shared/query-options';
import { QueryRequest } from '../types/shared/query';

/**
 * Planned Gift API client
 *
 * All planned gift-related operations: create, search, update, query, etc.
 *
 * All Planned Gift Update requests must be sent with a fully populated UpdatePlannedGiftRequest object.
 * Single field updates are not supported. Any unset properties will be deleted.
 *
 * Please use virtuous.plannedGift.updatePlannedGiftSafely() for single field updates.
 * This method will request the current planned gift object from Virtuous
 * and populate the UpdatePlannedGiftRequest object with the existing values before appending the changes.
 *
 * Only the fields that are being updated should be included in the changes object.
 *
 * @example
 * await virtuous.plannedGift.updatePlannedGiftSafely(1, { anticipatedAmount: 500 });
 */
const createPlannedGiftClient = (client: AxiosInstance) => {
  const convertPlannedGiftToUpdateRequest = (plannedGift: PlannedGift): UpdatePlannedGiftRequest => {
    const {
      id: _id,
      plannedGiftUrl: _url,
      giftsAppliedUrl: _giftsUrl,
      contactId: _contactId,
      contactUrl: _contactUrl,
      createDateTimeUtc: _created,
      createdByUser: _creator,
      modifiedDateTimeUtc: _modified,
      modifiedByUser: _modifier,
      fulfilled: _fulfilled,
      project: _projectName,
      projectUrl: _projectUrl,
      segment: _segmentName,
      segmentUrl: _segmentUrl,
      anticipatedAmount: _anticipatedAmount,
      currentValue: _currentValue,
      ...restOfPlannedGiftObject
    } = plannedGift;

    return {
      ...restOfPlannedGiftObject,
      anticipatedAmount: parseInt(_anticipatedAmount ?? ''),
      currentValue: parseInt(_currentValue ?? ''),
      plannedGiftType: plannedGift.pkannedGiftType, // fix the typo
      customFields: plannedGift.customFields.map((cf) => ({
        name: cf.name ?? '',
        value: cf.value,
        displayName: cf.displayName ?? '',
      })),
    };
  };
  return {
    // ── Create ─────────────────────────────────────────────────────────────
    /**
     * Create a planned gift
     * @see https://docs.virtuous.org/api-reference/planned-gift/created-a-new-planned-gift
     * @param {CreatePlannedGiftRequest} request - Create body.
     * @returns {Promise<PlannedGift>} Resolved API payload.
     * @example
     * await virtuous.plannedGift.createPlannedGift({
     *   contactId: 1,
     *   plannedGiftDate: '2026-01-01',
     *   plannedGiftType: 'Cash',
     *   frequency: 'Monthly',
     *   anticipatedAmount: 100,
     * });
     */
    createPlannedGift: (request: CreatePlannedGiftRequest): Promise<PlannedGift> =>
      client.post<PlannedGift>('/PlannedGift', request).then((r) => r.data),

    // ── Read ─────────────────────────────────────────────────────────────
    /**
     * Get planned gifts for a contact
     * @see https://docs.virtuous.org/api-reference/planned-gift/gets-the-planned-gifts-for-the-specified-contact
     * @param {number} contactId - Contact id.
     * @param {SkipTakeParams} [params] - Pagination.
     * @returns {Promise<PlannedGiftListResponse>} Resolved API payload.
     * @example
     * await virtuous.plannedGift.getPlannedGiftsForContact(1, { skip: 0, take: 10 });
     */
    getPlannedGiftsForContact: (
      contactId: number,
      params?: SkipTakeParams,
    ): Promise<PlannedGiftListResponse> =>
      client
        .get<PlannedGiftListResponse>(`/PlannedGift/ByContact/${contactId}`, { params })
        .then((r) => r.data),


    /**
     * Get planned gift by id
     * @see https://docs.virtuous.org/api-reference/planned-gift/gets-the-specified-planned-gift
     * @param {number} id - Planned gift id.
     * @returns {Promise<PlannedGift>} Resolved API payload.
     * @example
     * await virtuous.plannedGift.getPlannedGiftById(1);
     */
    getPlannedGiftById: (id: number): Promise<PlannedGift> =>
      client.get<PlannedGift>(`/PlannedGift/${id}`).then((r) => r.data),


    /**
     * Get gifts applied to a planned gift
     * @see https://docs.virtuous.org/api-reference/planned-gift/gets-the-gifts-applied-to-the-specified-planned-gift
     * @param {number} plannedGiftId - Planned gift id.
     * @param {SkipTakeParams} [params] - Pagination.
     * @returns {Promise<GiftsAppliedToPlannedGiftResponse>} Resolved API payload.
     * @example
     * await virtuous.plannedGift.getGiftsAppliedToPlannedGift(1);
     */
    getGiftsAppliedToPlannedGift: (
      plannedGiftId: number,
      params?: SkipTakeParams,
    ): Promise<GiftsAppliedToPlannedGiftResponse> =>
      client
        .get<GiftsAppliedToPlannedGiftResponse>(`/PlannedGift/GiftsApplied/${plannedGiftId}`, { params })
        .then((r) => r.data),


    // ── Update ─────────────────────────────────────────────────────────────
    /**
     * Update a planned gift
     * @see https://docs.virtuous.org/api-reference/planned-gift/updates-a-planned-gift
     * @param {number} id - Planned gift id.
     * @param {UpdatePlannedGiftRequest} request - Full update body.
     * @returns {Promise<PlannedGift>} Resolved API payload.
     * @example
     * await virtuous.plannedGift.updatePlannedGift(1, fullUpdateRequest);
     *
     * Prefer {@link updatePlannedGiftSafely} for partial updates — Virtuous expects a fully populated body on PUT.
     */
    updatePlannedGift: (id: number, request: UpdatePlannedGiftRequest): Promise<PlannedGift> =>
      client.put<PlannedGift>(`/PlannedGift/${id}`, request).then((r) => r.data),

    /**
     * Update a planned gift (merge changes)
     * @see https://docs.virtuous.org/api-reference/planned-gift/updates-a-planned-gift
     * @param {number} plannedGiftId - Planned gift id.
     * @param {Partial<UpdatePlannedGiftRequest>} changes - Fields to merge.
     * @returns {Promise<PlannedGift>} Resolved API payload.
     * @example
     * await virtuous.plannedGift.updatePlannedGiftSafely(1, { anticipatedAmount: 500 });
     */
    updatePlannedGiftSafely: async (
      plannedGiftId: number,
      changes: Partial<UpdatePlannedGiftRequest>,
    ): Promise<PlannedGift> => {
      const current = await client.get<PlannedGift>(`/PlannedGift/${plannedGiftId}`).then((r) => r.data);
      const base = convertPlannedGiftToUpdateRequest(current);

      const updated: UpdatePlannedGiftRequest = {
        ...base,
        ...changes,
        customFields: changes.customFields ?? base.customFields,
      };
      return client.put<PlannedGift>(`/PlannedGift/${plannedGiftId}`, updated).then((r) => r.data);
    },


    // ── Query ─────────────────────────────────────────────────────────────
    /**
     * Get planned gift query options
     * @see https://docs.virtuous.org/api-reference/planned-gift/request-query-options-to-build-a-query-for-planned-gifts
     * @returns {Promise<QueryOptionsResponse>} Resolved API payload.
     * @example
     * await virtuous.plannedGift.getPlannedGiftQueryOptions();
     */
    getPlannedGiftQueryOptions: (): Promise<QueryOptionsResponse> =>
      client.get<QueryOptionsResponse>('/PlannedGift/QueryOptions').then((r) => r.data),


    /**
     * Query planned gifts
     * @see https://docs.virtuous.org/api-reference/planned-gift/request-planned-gifts-with-a-custom-query
     * @param {QueryRequest} request - Query body.
     * @param {SkipTakeParams} [params] - Pagination.
     * @returns {Promise<PlannedGiftListResponse>} Resolved API payload.
     * @example
     * import { buildPlannedGiftQuery } from 'virtuous-ts';
     * const query = buildPlannedGiftQuery({ anticipatedAmount: 100 });
     * await virtuous.plannedGift.queryPlannedGifts(query, { skip: 0, take: 10 });
     */
    queryPlannedGifts: (request: QueryRequest, params?: SkipTakeParams): Promise<PlannedGiftListResponse> =>
      client.post<PlannedGiftListResponse>('/PlannedGift/Query', request, { params }).then((r) => r.data),

    convertPlannedGiftToUpdateRequest,
  };
};

export default createPlannedGiftClient;
