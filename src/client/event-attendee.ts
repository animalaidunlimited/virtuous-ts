import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import type { AxiosInstance } from 'axios';
import type {
  CreateEventAttendeeRequest,
  EventAttendee,
  UpdateEventAttendeeRequest,
} from '../types/event-attendee/event-attendee';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';
import { eventAttendeeToUpdateRequest, mergeUpdate } from '../utils/to-update-request';

/**
 * Virtuous CRM event attendee API.
 * @see https://docs.virtuoussoftware.com/#1d31c8dd-0d53-491b-83c1-ad9c45a73542
 */
const createEventAttendeeClient = (client: AxiosInstance) => ({
  /**
   * Returns attendees for an event.
   * @see https://docs.virtuoussoftware.com/#1d31c8dd-0d53-491b-83c1-ad9c45a73542
   * @param {number} eventId - Event id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<EventAttendee>>}
   */
  getEventAttendees: (eventId: number, params?: SkipTakeParams): Promise<ListResponse<EventAttendee>> => {
    return client.get<ListResponse<EventAttendee>>(`/Event/${eventId}/Attendees`, { params }).then((r) => r.data);
  },

  /**
   * Returns an event attendee by id.
   * @see https://docs.virtuoussoftware.com/#72c8327c-63b5-4dcd-baca-7617b0f8ea72
   * @param {number} eventId - Event id.
   * @param {number} eventAttendeeId - Event Attendee id.
   * @returns {Promise<EventAttendee>}
   */
  getEventAttendee: (eventId: number, eventAttendeeId: number): Promise<EventAttendee> => {
    return client.get<EventAttendee>(`/Event/${eventId}/Attendees/${eventAttendeeId}`).then((r) => r.data);
  },

  /**
   * Adds an attendee to an event.
   * @see https://docs.virtuoussoftware.com/#308ce47a-f000-4e65-aa5a-47f90eeaa726
   * @param {number} eventId - Event id.
   * @param {CreateEventAttendeeRequest} request - Request body.
   * @returns {Promise<EventAttendee>}
   */
  createEventAttendee: (eventId: number, request: CreateEventAttendeeRequest): Promise<EventAttendee> => {
    return client.post<EventAttendee>(`/Event/${eventId}/Attendees`, request).then((r) => r.data);
  },

  /**
   * Replaces an event attendee. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#4e2f6241-386b-405a-b7eb-8796e2862c3b
   * @param {number} eventId - Event id.
   * @param {number} eventAttendeeId - Event Attendee id.
   * @param {UpdateEventAttendeeRequest} request - Request body.
   * @returns {Promise<EventAttendee>}
   */
  updateEventAttendee: (eventId: number, eventAttendeeId: number, request: UpdateEventAttendeeRequest): Promise<EventAttendee> => {
    return client.put<EventAttendee>(`/Event/${eventId}/Attendees/${eventAttendeeId}`, request).then((r) => r.data);
  },

  /**
   * GETs the attendee, merges `changes`, then PUTs the full update body.
   * @param {number} eventId - Event id.
   * @param {number} eventAttendeeId - Attendee id.
   * @param {Partial<UpdateEventAttendeeRequest>} changes - Fields to change.
   * @returns {Promise<EventAttendee>} The updated attendee.
   */
  updateEventAttendeeSafely: async (
    eventId: number,
    eventAttendeeId: number,
    changes: Partial<UpdateEventAttendeeRequest>,
  ): Promise<EventAttendee> => {
    const current = await client
      .get<EventAttendee>(`/Event/${eventId}/Attendees/${eventAttendeeId}`)
      .then((r) => r.data);
    return client
      .put<EventAttendee>(
        `/Event/${eventId}/Attendees/${eventAttendeeId}`,
        mergeUpdate(eventAttendeeToUpdateRequest(current), changes),
      )
      .then((r) => r.data);
  },

  /**
   * Removes an attendee from an event.
   * @see https://docs.virtuoussoftware.com/#47a6add6-5471-432f-94c1-cce4075921db
   * @param {number} eventId - Event id.
   * @param {number} eventAttendeeId - Event Attendee id.
   * @returns {Promise<void>}
   */
  deleteEventAttendee: (eventId: number, eventAttendeeId: number): Promise<void> => {
    return client.delete<void>(`/Event/${eventId}/Attendees/${eventAttendeeId}`).then(() => undefined);
  },

  /**
   * Returns enabled custom fields for event attendees.
   * @see https://docs.virtuoussoftware.com/#023f2983-6bfe-4d6a-bfd7-578fa7c2c1e2
   * @returns {Promise<CustomFieldDefinition[]>}
   */
  getEventAttendeeCustomFields: (): Promise<CustomFieldDefinition[]> => {
    return client.get<CustomFieldDefinition[]>('/EventAttendee/CustomFields').then((r) => r.data);
  },

  /**
   * Returns query fields and operators for event attendees.
   * @see https://docs.virtuoussoftware.com/#727c8aa6-14ad-40f1-a1e3-3f6a324504ea
   * @returns {Promise<QueryOptionsResponse>}
   */
  getEventAttendeeQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/EventAttendee/QueryOptions').then((r) => r.data);
  },

  /**
   * Queries event attendees. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#64df9404-677d-463d-a378-9b4a098e4e4e
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<EventAttendee>>}
   */
  queryEventAttendees: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<EventAttendee>> => {
    return client.post<ListResponse<EventAttendee>>('/EventAttendee/Query', request, { params }).then((r) => r.data);
  },

});

export default createEventAttendeeClient;
