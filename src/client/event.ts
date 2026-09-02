import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import { eventToUpdateRequest, mergeUpdate } from '../utils/to-update-request';
import type { AxiosInstance } from 'axios';
import type {
  CreateEventRequest,
  Event,
  EventType,
  UpdateEventRequest,
} from '../types/event/event';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';

/**
 * Virtuous CRM event API.
 * @see https://docs.virtuoussoftware.com/#1bfb144e-9e85-4951-8261-b84a3a423838
 */
const createEventClient = (client: AxiosInstance) => ({
  /**
   * Returns events for the organization.
   * @see https://docs.virtuoussoftware.com/#1bfb144e-9e85-4951-8261-b84a3a423838
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Event>>}
   */
  listEvents: (params?: SkipTakeParams): Promise<ListResponse<Event>> => {
    return client.get<ListResponse<Event>>('/Event', { params }).then((r) => r.data);
  },

  /**
   * Returns an event by id.
   * @see https://docs.virtuoussoftware.com/#f86d36aa-3ab4-4c41-a588-df12cc751915
   * @param {number} eventId - Event id.
   * @returns {Promise<Event>}
   */
  getEvent: (eventId: number): Promise<Event> => {
    return client.get<Event>(`/Event/${eventId}`).then((r) => r.data);
  },

  /**
   * Finds events whose name matches a filter.
   * @see https://docs.virtuoussoftware.com/#08fa575e-d228-42ef-b1b6-79376af51fd9
   * @param {object} params - Query parameters.
   * @returns {Promise<Event[]>}
   */
  findEvents: (params?: { filter?: string }): Promise<Event[]> => {
    return client.get<Event[]>('/Event/Search', { params }).then((r) => r.data);
  },

  /**
   * Creates an event.
   * @see https://docs.virtuoussoftware.com/#cae18e3c-59ad-4e3a-9abd-9a0cd1bb3209
   * @param {CreateEventRequest} request - Request body.
   * @returns {Promise<Event>}
   */
  createEvent: (request: CreateEventRequest): Promise<Event> => {
    return client.post<Event>('/Event', request).then((r) => r.data);
  },

  /**
   * Replaces an event. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#8ae411e9-b9a4-4280-a7a8-7c7afb86a08c
   * @param {number} eventId - Event id.
   * @param {UpdateEventRequest} request - Request body.
   * @returns {Promise<Event>}
   */
  updateEvent: (eventId: number, request: UpdateEventRequest): Promise<Event> => {
    return client.put<Event>(`/Event/${eventId}`, request).then((r) => r.data);
  },

  /**
   * GETs the event, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#8ae411e9-b9a4-4280-a7a8-7c7afb86a08c
   * @param {number} eventId - Event id.
   * @param {Partial<UpdateEventRequest>} changes - Fields to change.
   * @returns {Promise<Event>} The updated event.
   */
  updateEventSafely: async (eventId: number, changes: Partial<UpdateEventRequest>): Promise<Event> => {
    const current = await client.get<Event>(`/Event/${eventId}`).then((r) => r.data);
    return client
      .put<Event>(`/Event/${eventId}`, mergeUpdate(eventToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

  /**
   * Deletes an event and its attendees. Gifts are kept.
   * @see https://docs.virtuoussoftware.com/#0c84b923-f80a-4b8f-b412-551b6edd2fc9
   * @param {number} eventId - Event id.
   * @returns {Promise<void>}
   */
  deleteEvent: (eventId: number): Promise<void> => {
    return client.delete<void>(`/Event/${eventId}`).then(() => undefined);
  },

  /**
   * Returns configured event types.
   * @see https://docs.virtuoussoftware.com/#88d059eb-14e1-4d6b-8e3d-2c2355a23f19
   * @returns {Promise<ListResponse<EventType>>}
   */
  listEventTypes: (): Promise<ListResponse<EventType>> => {
    return client.get<ListResponse<EventType>>('/Event/Types').then((r) => r.data);
  },

  /**
   * Returns enabled custom fields for events.
   * @see https://docs.virtuoussoftware.com/#67681d8d-9e38-4088-ae4f-4338e118321a
   * @returns {Promise<CustomFieldDefinition[]>}
   */
  getEventCustomFields: (): Promise<CustomFieldDefinition[]> => {
    return client.get<CustomFieldDefinition[]>('/Event/CustomFields').then((r) => r.data);
  },

  /**
   * Returns query fields and operators for events.
   * @see https://docs.virtuoussoftware.com/#ee9ab2fc-a0c4-41f3-960c-1746be4a6d1b
   * @returns {Promise<QueryOptionsResponse>}
   */
  getEventQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/Event/QueryOptions').then((r) => r.data);
  },

  /**
   * Queries events. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#cb0c11fc-f1b5-4dc3-baee-7f692e4d0e76
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Event>>}
   */
  queryEvents: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<Event>> => {
    return client.post<ListResponse<Event>>('/Event/Query', request, { params }).then((r) => r.data);
  },

});

export default createEventClient;
