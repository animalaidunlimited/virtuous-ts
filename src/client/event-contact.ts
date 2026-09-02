import type { AxiosInstance } from 'axios';
import type {
  CreateEventContactRequest,
  EventContact,
} from '../types/event-contact/event-contact';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { ListResponse } from '../types/shared/list-response';

/**
 * Virtuous CRM event contact API.
 * @see https://docs.virtuoussoftware.com/#56416a96-d258-4529-a850-a7caf897de9e
 */
const createEventContactClient = (client: AxiosInstance) => ({
  /**
   * Returns event contacts for an event.
   * @see https://docs.virtuoussoftware.com/#56416a96-d258-4529-a850-a7caf897de9e
   * @param {number} eventId - Event id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<EventContact>>}
   */
  getEventContacts: (eventId: number, params?: SkipTakeParams): Promise<ListResponse<EventContact>> => {
    return client.get<ListResponse<EventContact>>(`/Event/${eventId}/Contacts`, { params }).then((r) => r.data);
  },

  /**
   * Returns an event contact by id.
   * @see https://docs.virtuoussoftware.com/#ce95dd61-6278-47db-b1f1-99c780bb1d21
   * @param {number} eventId - Event id.
   * @param {number} eventContactId - Event Contact id.
   * @returns {Promise<EventContact>}
   */
  getEventContact: (eventId: number, eventContactId: number): Promise<EventContact> => {
    return client.get<EventContact>(`/Event/${eventId}/Contacts/${eventContactId}`).then((r) => r.data);
  },

  /**
   * Adds a contact role on an event.
   * @see https://docs.virtuoussoftware.com/#2c152929-0a56-4ff9-9540-2a4f5104eb93
   * @param {number} eventId - Event id.
   * @param {CreateEventContactRequest} request - Request body.
   * @returns {Promise<EventContact>}
   */
  createEventContact: (eventId: number, request: CreateEventContactRequest): Promise<EventContact> => {
    return client.post<EventContact>(`/Event/${eventId}/Contacts`, request).then((r) => r.data);
  },

  /**
   * Removes an event contact.
   * @see https://docs.virtuoussoftware.com/#353ed10e-3264-41dd-bbc5-854169c7cfa4
   * @param {number} eventId - Event id.
   * @param {number} eventContactId - Event Contact id.
   * @returns {Promise<void>}
   */
  deleteEventContact: (eventId: number, eventContactId: number): Promise<void> => {
    return client.delete<void>(`/Event/${eventId}/Contacts/${eventContactId}`).then(() => undefined);
  },

});

export default createEventContactClient;
