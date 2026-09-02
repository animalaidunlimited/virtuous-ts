import type { AxiosInstance } from 'axios';
import type {
  ContactReferenceRecord,
  CreateContactReferenceRequest,
} from '../types/contact-reference/contact-reference';

/**
 * Virtuous CRM contact reference API.
 * @see https://docs.virtuoussoftware.com/#d37eeebc-1e44-4c35-a166-d0869581ae54
 */
const createContactReferenceClient = (client: AxiosInstance) => ({
  /**
   * Stores an external referenceSource/referenceId pair on a contact.
   * @see https://docs.virtuoussoftware.com/#d37eeebc-1e44-4c35-a166-d0869581ae54
   * @param {CreateContactReferenceRequest} request - Request body.
   * @returns {Promise<ContactReferenceRecord>}
   */
  createContactReference: (request: CreateContactReferenceRequest): Promise<ContactReferenceRecord> => {
    return client.post<ContactReferenceRecord>('/ContactReference', request).then((r) => r.data);
  },

  /**
   * Removes an external reference. Pass referenceId as a query parameter.
   * @see https://docs.virtuoussoftware.com/#5943f768-a7e7-49b3-a288-04a5512f373d
   * @param {string} referenceSource - Reference Source.
   * @param {object} params - Query parameters.
   * @returns {Promise<void>}
   */
  deleteContactReference: (referenceSource: string, params?: { referenceId?: string }): Promise<void> => {
    return client.delete<void>(`/ContactReference/${referenceSource}`, { params }).then(() => undefined);
  },

});

export default createContactReferenceClient;
