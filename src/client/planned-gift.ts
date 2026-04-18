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
 * await virtuous.plannedGift.updatePlannedGiftSafely(12345, { anticipatedAmount: 1000 });
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
     *
     * @param request - The create planned gift request object
     * @returns The created planned gift object
     * @example
     * await virtuous.plannedGift.createPlannedGift(
     *   { 
     *     contactId: 12345, 
     *     plannedGiftDate: '2025-11-28', 
     *     plannedGiftType: 'Cash', 
     *     frequency: 'Monthly', 
     *     anticipatedAmount: 1000 
     *   }
     * );
     */
    createPlannedGift: (request: CreatePlannedGiftRequest): Promise<PlannedGift> =>
      client.post<PlannedGift>('/PlannedGift', request).then((r) => r.data),

    // ── Read ─────────────────────────────────────────────────────────────
    /**
     * Get planned gifts for a contact
     *
     * @param contactId - The ID of the contact to get planned gifts for
     * @param params - Optional skip/take for pagination
     * @returns The planned gift list response object
     * @example
     * await virtuous.plannedGift.getPlannedGiftsForContact(12345);
     */
    getPlannedGiftsForContact: (
      contactId: number,
      params?: SkipTakeParams,
    ): Promise<PlannedGiftListResponse> =>
      client
        .get<PlannedGiftListResponse>(`/PlannedGift/ByContact/${contactId}`, { params })
        .then((r) => r.data),


    /**
     * Get a planned gift by ID
     *
     * @param id - The ID of the planned gift
     * @returns The planned gift object
     * @example
     * await virtuous.plannedGift.getPlannedGiftById(12345);
     */
    getPlannedGiftById: (id: number): Promise<PlannedGift> =>
      client.get<PlannedGift>(`/PlannedGift/${id}`).then((r) => r.data),


    /**
     * Get gifts applied to a planned gift
     *
     * @param plannedGiftId - The ID of the planned gift to get gifts applied to
     * @param params - Optional skip/take for pagination
     * @returns The gifts applied to the planned gift response object
     * @example
     * await virtuous.plannedGift.getGiftsAppliedToPlannedGift(12345);
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
     *
     * @param id - The ID of the planned gift to update
     * @param request - The update planned gift request object
     * @returns The updated planned gift object
     * @example
     * await virtuous.plannedGift.updatePlannedGift(12345, { anticipatedAmount: 1000 });
     * 
     * Not recommended to use this method directly. Use updatePlannedGiftSafely() instead.
     *
     * Virtuous will not accept a planned gift update request with only the fields that are being updated.
     * The request object must be fully populated with all fields, even if only one field is being updated.
     * And any unset properties will be deleted.
     *
     * Use updatePlannedGiftSafely() to safely update a planned gift with a single field update.
     *
     */
    updatePlannedGift: (id: number, request: UpdatePlannedGiftRequest): Promise<PlannedGift> =>
      client.put<PlannedGift>(`/PlannedGift/${id}`, request).then((r) => r.data),

    /**
     * Update a planned gift safely
     *
     * @param plannedGiftId - The ID of the planned gift to update
     * @param changes - The changes to apply to the update planned gift request object
     * @returns The updated planned gift object
     * @example
     * await virtuous.plannedGift.updatePlannedGiftSafely(12345, { anticipatedAmount: 1000 });
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
     * Get query options for planned gifts
     *
     * @returns The query options response object
     * @example
     * await virtuous.plannedGift.getPlannedGiftQueryOptions();
     */
    getPlannedGiftQueryOptions: (): Promise<QueryOptionsResponse> =>
      client.get<QueryOptionsResponse>('/PlannedGift/QueryOptions').then((r) => r.data),


    /**
     * Query planned gifts
     *
     * @param request - The query request object
     * @param params - Optional skip/take for pagination
     * @returns The planned gift list response object
     * @example
     * await virtuous.plannedGift.queryPlannedGifts(buildPlannedGiftQuery({ anticipatedAmount: 1000 }));
     * 
     * Use buildPlannedGiftQuery() simple helper function to build the request query object.
     * 
     * @example
     * const query = buildPlannedGiftQuery({ anticipatedAmount: 1000 });
     * await virtuous.plannedGift.queryPlannedGifts(query, { skip: 0, take: 10 });
     */
    queryPlannedGifts: (request: QueryRequest, params?: SkipTakeParams): Promise<PlannedGiftListResponse> =>
      client.post<PlannedGiftListResponse>('/PlannedGift/Query', request, { params }).then((r) => r.data),

    convertPlannedGiftToUpdateRequest,
  };
};

export default createPlannedGiftClient;
