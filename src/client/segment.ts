import type { AxiosInstance } from 'axios';
import type {
  CreateSegmentRequest,
  Segment,
  UpdateSegmentRequest,
} from '../types/segment/segment';
import type { SearchRequest } from '../types/shared/search-request';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { ListResponse } from '../types/shared/list-response';
import { mergeUpdate, segmentToUpdateRequest } from '../utils/to-update-request';

/**
 * Virtuous CRM segment API.
 * @see https://docs.virtuoussoftware.com/#9de10a3f-c669-4203-be8b-d74bb69177bd
 */
const createSegmentClient = (client: AxiosInstance) => ({
  /**
   * Returns segments a contact belongs to.
   * @see https://docs.virtuoussoftware.com/#9de10a3f-c669-4203-be8b-d74bb69177bd
   * @param {number} contactId - Contact id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Segment>>}
   */
  getSegmentsForContact: (contactId: number, params?: SkipTakeParams): Promise<ListResponse<Segment>> => {
    return client.get<ListResponse<Segment>>(`/Segment/ByContact/${contactId}`, { params }).then((r) => r.data);
  },

  /**
   * Returns a segment by id.
   * @see https://docs.virtuoussoftware.com/#67d28be5-8e4c-4afd-a896-b255919f6ada
   * @param {number} segmentId - Segment id.
   * @returns {Promise<Segment>}
   */
  getSegment: (segmentId: number): Promise<Segment> => {
    return client.get<Segment>(`/Segment/${segmentId}`).then((r) => r.data);
  },

  /**
   * Returns a segment by unique code.
   * @see https://docs.virtuoussoftware.com/#d7df75ab-a08a-4e12-ad06-e7809baa38bd
   * @param {string} segmentCode - Segment Code.
   * @returns {Promise<Segment>}
   */
  getSegmentByCode: (segmentCode: string): Promise<Segment> => {
    return client.get<Segment>(`/Segment/Code/${encodeURIComponent(segmentCode)}`).then((r) => r.data);
  },

  /**
   * Searches segments by name or code.
   * @see https://docs.virtuoussoftware.com/#0041ef6c-9cc9-415d-a5b8-7765636d6529
   * @param {SearchRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Segment>>}
   */
  searchSegments: (request: SearchRequest, params?: SkipTakeParams): Promise<ListResponse<Segment>> => {
    return client.post<ListResponse<Segment>>('/Segment/Search', request, { params }).then((r) => r.data);
  },

  /**
   * Creates a segment within a communication.
   * @see https://docs.virtuoussoftware.com/#7a3c8a1d-6649-4c2c-8f2f-3fda3d889485
   * @param {CreateSegmentRequest} request - Request body.
   * @returns {Promise<Segment>}
   */
  createSegment: (request: CreateSegmentRequest): Promise<Segment> => {
    return client.post<Segment>('/Segment', request).then((r) => r.data);
  },

  /**
   * Replaces a segment. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#d376626f-7fab-4707-92ba-c542082cc038
   * @param {number} segmentId - Segment id.
   * @param {UpdateSegmentRequest} request - Request body.
   * @returns {Promise<Segment>}
   */
  updateSegment: (segmentId: number, request: UpdateSegmentRequest): Promise<Segment> => {
    return client.put<Segment>(`/Segment/${segmentId}`, request).then((r) => r.data);
  },

  /**
   * GETs the segment, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#d376626f-7fab-4707-92ba-c542082cc038
   * @param {number} segmentId - Segment id.
   * @param {Partial<UpdateSegmentRequest>} changes - Fields to change.
   * @returns {Promise<Segment>} The updated segment.
   */
  updateSegmentSafely: async (
    segmentId: number,
    changes: Partial<UpdateSegmentRequest>,
  ): Promise<Segment> => {
    const current = await client.get<Segment>(`/Segment/${segmentId}`).then((r) => r.data);
    return client
      .put<Segment>(`/Segment/${segmentId}`, mergeUpdate(segmentToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

});

export default createSegmentClient;
