import { contactMethodToUpdateRequest, mergeUpdate } from '../utils/to-update-request';
import type { AxiosInstance } from 'axios';
import type {
  ContactMethodRecord,
  CreateContactMethodRequest,
  UpdateContactMethodRequest,
} from '../types/contact-method/contact-method';

/**
 * Virtuous CRM contact method API.
 * @see https://docs.virtuoussoftware.com/#30a0446d-9ee3-48d6-9fea-2ab496550ffa
 */
const createContactMethodClient = (client: AxiosInstance) => ({
  /**
   * Returns configured contact method types.
   * @see https://docs.virtuoussoftware.com/#30a0446d-9ee3-48d6-9fea-2ab496550ffa
   * @returns {Promise<string[]>}
   */
  listContactMethodTypes: (): Promise<string[]> => {
    return client.get<string[]>('/ContactMethod/Types').then((r) => r.data);
  },

  /**
   * Returns contact method types related to the given base type name.
   * @see https://docs.virtuoussoftware.com/#5b8dc758-4375-4513-a210-c57624a288a0
   * @param {object} params - Query parameters.
   * @returns {Promise<string[]>}
   */
  listRelatedContactMethodTypes: (params?: { name?: string }): Promise<string[]> => {
    return client.get<string[]>('/ContactMethod/RelatedTypes', { params }).then((r) => r.data);
  },

  /**
   * Returns a contact method by id.
   * @see https://docs.virtuoussoftware.com/#9dd9f0c7-69c8-4e0a-8a52-319d6368ad1c
   * @param {number} contactMethodId - Contact Method id.
   * @returns {Promise<ContactMethodRecord>}
   */
  getContactMethod: (contactMethodId: number): Promise<ContactMethodRecord> => {
    return client.get<ContactMethodRecord>(`/ContactMethod/${contactMethodId}`).then((r) => r.data);
  },

  /**
   * Adds a phone, email, or other contact method to an individual.
   * @see https://docs.virtuoussoftware.com/#7076d006-9711-41d8-b20c-6cb1b6bcbf10
   * @param {CreateContactMethodRequest} request - Request body.
   * @returns {Promise<ContactMethodRecord>}
   */
  createContactMethod: (request: CreateContactMethodRequest): Promise<ContactMethodRecord> => {
    return client.post<ContactMethodRecord>('/ContactMethod', request).then((r) => r.data);
  },

  /**
   * Replaces a contact method. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#ad06b3a2-4331-471d-8b41-91b7699d5e27
   * @param {number} contactMethodId - Contact Method id.
   * @param {UpdateContactMethodRequest} request - Request body.
   * @returns {Promise<ContactMethodRecord>}
   */
  updateContactMethod: (contactMethodId: number, request: UpdateContactMethodRequest): Promise<ContactMethodRecord> => {
    return client.put<ContactMethodRecord>(`/ContactMethod/${contactMethodId}`, request).then((r) => r.data);
  },

  /**
   * GETs the contact method, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#ad06b3a2-4331-471d-8b41-91b7699d5e27
   * @param {number} contactMethodId - Contact method id.
   * @param {Partial<UpdateContactMethodRequest>} changes - Fields to change.
   * @returns {Promise<ContactMethodRecord>} The updated contact method.
   */
  updateContactMethodSafely: async (
    contactMethodId: number,
    changes: Partial<UpdateContactMethodRequest>,
  ): Promise<ContactMethodRecord> => {
    const current = await client.get<ContactMethodRecord>(`/ContactMethod/${contactMethodId}`).then((r) => r.data);
    return client
      .put<ContactMethodRecord>(
        `/ContactMethod/${contactMethodId}`,
        mergeUpdate(contactMethodToUpdateRequest(current), changes),
      )
      .then((r) => r.data);
  },

  /**
   * Archives a contact method without deleting it.
   * @see https://docs.virtuoussoftware.com/#8bf40a3d-1cfc-4a12-b994-7c1a7f93431a
   * @param {number} contactMethodId - Contact Method id.
   * @returns {Promise<void>}
   */
  archiveContactMethod: (contactMethodId: number): Promise<void> => {
    return client.put<void>(`/ContactMethod/Archive/${contactMethodId}`, {}).then(() => undefined);
  },

  /**
   * Restores an archived contact method.
   * @see https://docs.virtuoussoftware.com/#98b4384d-46d8-4bb1-ad97-f2af4b2e045a
   * @param {number} contactMethodId - Contact Method id.
   * @returns {Promise<void>}
   */
  unarchiveContactMethod: (contactMethodId: number): Promise<void> => {
    return client.put<void>(`/ContactMethod/Unarchive/${contactMethodId}`, {}).then(() => undefined);
  },

  /**
   * Deletes a contact method.
   * @see https://docs.virtuoussoftware.com/#17fbbbc8-9e11-45f5-960c-482e35a6c87d
   * @param {number} contactMethodId - Contact Method id.
   * @returns {Promise<void>}
   */
  deleteContactMethod: (contactMethodId: number): Promise<void> => {
    return client.delete<void>(`/ContactMethod/${contactMethodId}`).then(() => undefined);
  },

});

export default createContactMethodClient;
