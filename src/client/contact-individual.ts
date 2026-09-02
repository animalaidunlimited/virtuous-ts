import type { AxiosInstance } from 'axios';
import type { ContactIndividual, ContactListResponse } from '../types/contact/contact';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type {
  CreateIndividualRequest,
  UpdateIndividualRequest,
} from '../types/contact-individual/contact-individual-write';
import type {
  CustomCollectionDefinition,
  CustomCollectionInstance,
  CreateCustomCollectionInstanceRequest,
} from '../types/contact/contact-transaction';
import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import { individualToUpdateRequest, mergeUpdate } from '../utils/to-update-request';

/**
 * Virtuous CRM Contact Individual API.
 * @see https://docs.virtuoussoftware.com/#ba6fb21c-071d-4993-85b0-4777a23d14dd
 */
const createContactIndividualClient = (client: AxiosInstance) => ({
  /**
   * Find an individual by email address (`GET /ContactIndividual/Find`).
   * @see https://docs.virtuoussoftware.com/#ba6fb21c-071d-4993-85b0-4777a23d14dd
   * @param {string} email - Email address to look up.
   * @returns {Promise<ContactIndividual>} The matching individual (includes `contactId`).
   * @throws VirtuousApiError with 404 when not found.
   * @example
   * const individual = await virtuous.contactIndividual.findIndividualByEmail('sarah@example.com');
   */
  findIndividualByEmail: (email: string) =>
    client
      .get<ContactIndividual>('/ContactIndividual/Find', { params: { email } })
      .then((r) => r.data),

  /**
   * Query individuals (`POST /ContactIndividual/Query`).
   * Use `queryIndividualOptions` for valid parameter names. Max `take` is 1,000.
   * The Add-Individuals-to-Email-List docs recommend this for resolving ids.
   * @see https://docs.virtuoussoftware.com/#6f7c7ebb-aa2e-4a22-82c8-0bd07476673a
   * @param {QueryRequest} request - Query body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactListResponse<ContactIndividual>>} Matching individuals.
   * @example
   * const result = await virtuous.contactIndividual.queryIndividuals(
   *   { groups: [{ conditions: [] }] },
   *   { skip: 0, take: 50 },
   * );
   */
  queryIndividuals: (request: QueryRequest, params?: SkipTakeParams) =>
    client
      .post<ContactListResponse<ContactIndividual>>('/ContactIndividual/Query', request, {
        params,
      })
      .then((r) => r.data),

  /**
   * Get individual query options (`GET /ContactIndividual/QueryOptions`).
   * @see https://docs.virtuoussoftware.com/#1adfce43-e6bd-43c6-9be9-783e48134950
   * @returns {Promise<QueryOptionsResponse>} Fields and operators for Query Individuals.
   * @example
   * const options = await virtuous.contactIndividual.queryIndividualOptions();
   */
  queryIndividualOptions: () =>
    client.get<QueryOptionsResponse>('/ContactIndividual/QueryOptions').then((r) => r.data),

  /**
   * Returns individuals on a contact.
   * @see https://docs.virtuoussoftware.com/#adfa974c-6135-4203-b456-84ffd66b2ccf
   * @param {number} contactId - Contact id.
   * @returns {Promise<ContactIndividual[]>} Individuals on the contact.
   */
  getIndividualsForContact: (contactId: number) =>
    client.get<ContactIndividual[]>(`/ContactIndividual/ByContact/${contactId}`).then((r) => r.data),

  /**
   * Returns an individual by id.
   * @see https://docs.virtuoussoftware.com/#18393359-fb21-49ba-aa6c-cd3421d2a01c
   * @param {number} contactIndividualId - Individual id.
   * @returns {Promise<ContactIndividual>} The individual record.
   */
  getIndividual: (contactIndividualId: number) =>
    client.get<ContactIndividual>(`/ContactIndividual/${contactIndividualId}`).then((r) => r.data),

  /**
   * Returns the individual including avatarUrl.
   * @see https://docs.virtuoussoftware.com/#718cb2fa-efef-4ebe-82ce-00cd3d37e167
   * @param {number} contactIndividualId - Individual id.
   * @returns {Promise<ContactIndividual>} The individual record.
   */
  getIndividualAvatar: (contactIndividualId: number) =>
    client.get<ContactIndividual>(`/ContactIndividual/${contactIndividualId}/Avatar`).then((r) => r.data),

  /**
   * Uploads an avatar image as multipart form data.
   * @see https://docs.virtuoussoftware.com/#1f66acce-d78d-480d-a64f-e3b0ddef0251
   * @param {number} contactIndividualId - Individual id.
   * @param {unknown} formData - Multipart body containing the image.
   * @returns {Promise<ContactIndividual>} The updated individual.
   */
  uploadIndividualAvatar: (contactIndividualId: number, formData: unknown) =>
    client
      .post<ContactIndividual>(`/ContactIndividual/${contactIndividualId}/Avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  /**
   * Adds an individual to an existing contact.
   * @see https://docs.virtuoussoftware.com/#3a075b76-2810-48ad-b2ab-57aff197ade2
   * @param {CreateIndividualRequest} request - Create body.
   * @returns {Promise<ContactIndividual>} The created individual.
   */
  createIndividual: (request: CreateIndividualRequest) =>
    client.post<ContactIndividual>('/ContactIndividual', request).then((r) => r.data),

  /**
   * Replaces an individual. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#c4a12913-651e-4f6c-a5f4-860679ef33c3
   * @param {number} contactIndividualId - Individual id.
   * @param {UpdateIndividualRequest} request - Full update body.
   * @returns {Promise<ContactIndividual>} The updated individual.
   */
  updateIndividual: (contactIndividualId: number, request: UpdateIndividualRequest) =>
    client.put<ContactIndividual>(`/ContactIndividual/${contactIndividualId}`, request).then((r) => r.data),

  /**
   * GETs the individual, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#c4a12913-651e-4f6c-a5f4-860679ef33c3
   * @param {number} contactIndividualId - Individual id.
   * @param {Partial<UpdateIndividualRequest>} changes - Fields to change.
   * @returns {Promise<ContactIndividual>} The updated individual.
   */
  updateIndividualSafely: async (
    contactIndividualId: number,
    changes: Partial<UpdateIndividualRequest>,
  ) => {
    const current = await client
      .get<ContactIndividual>(`/ContactIndividual/${contactIndividualId}`)
      .then((r) => r.data);
    return client
      .put<ContactIndividual>(
        `/ContactIndividual/${contactIndividualId}`,
        mergeUpdate(individualToUpdateRequest(current), changes),
      )
      .then((r) => r.data);
  },

  /**
   * Deletes an individual from its contact.
   * @see https://docs.virtuoussoftware.com/#416e190e-a0a2-4fe6-98ab-505dfc0c6fb8
   * @param {number} contactIndividualId - Individual id.
   * @returns {Promise<void>} Resolves when deleted.
   */
  deleteIndividual: (contactIndividualId: number) =>
    client.delete<void>(`/ContactIndividual/${contactIndividualId}`).then(() => undefined),

  /**
   * Returns custom collection definitions for individuals.
   * @see https://docs.virtuoussoftware.com/#494e2a6b-50bb-486c-84b4-cc4690a5b18e
   * @returns {Promise<CustomCollectionDefinition[]>} Collection definitions.
   */
  listIndividualCustomCollections: () =>
    client.get<CustomCollectionDefinition[]>('/ContactIndividual/CustomCollections').then((r) => r.data),

  /**
   * Adds a custom collection instance to an individual.
   * @see https://docs.virtuoussoftware.com/#7a72740b-e1ae-4107-b04b-9d14cd8a8f49
   * @param {number} contactIndividualId - Individual id.
   * @param {number} customCollectionId - Collection definition id.
   * @param {CreateCustomCollectionInstanceRequest} request - Field values.
   * @returns {Promise<CustomCollectionInstance>} The created instance.
   */
  createIndividualCollection: (
    contactIndividualId: number,
    customCollectionId: number,
    request: CreateCustomCollectionInstanceRequest,
  ) =>
    client
      .post<CustomCollectionInstance>(
        `/ContactIndividual/${contactIndividualId}/Collection/${customCollectionId}`,
        request,
      )
      .then((r) => r.data),

  /**
   * Replaces a custom collection instance on an individual.
   * @see https://docs.virtuoussoftware.com/#7a767d99-2c37-4eec-9ee8-bf340d220f07
   * @param {number} contactIndividualId - Individual id.
   * @param {number} collectionInstanceId - Instance id.
   * @param {CreateCustomCollectionInstanceRequest} request - Field values.
   * @returns {Promise<CustomCollectionInstance>} The updated instance.
   */
  updateIndividualCollection: (
    contactIndividualId: number,
    collectionInstanceId: number,
    request: CreateCustomCollectionInstanceRequest,
  ) =>
    client
      .put<CustomCollectionInstance>(
        `/ContactIndividual/${contactIndividualId}/Collection/${collectionInstanceId}`,
        request,
      )
      .then((r) => r.data),

  /**
   * Deletes a custom collection instance from an individual.
   * @see https://docs.virtuoussoftware.com/#c837c5b1-5bb8-40e0-a8b5-840c0c1c2032
   * @param {number} contactIndividualId - Individual id.
   * @param {number} collectionId - Collection definition id.
   * @param {number} collectionInstanceId - Instance id (query parameter).
   * @returns {Promise<void>} Resolves when deleted.
   */
  deleteIndividualCollection: (
    contactIndividualId: number,
    collectionId: number,
    collectionInstanceId: number,
  ) =>
    client
      .delete<void>(`/ContactIndividual/${contactIndividualId}/Collection/${collectionId}`, {
        params: { collectionInstanceId },
      })
      .then(() => undefined),

  /**
   * Returns enabled custom fields for individuals.
   * @see https://docs.virtuoussoftware.com/#8eb4af1d-92e9-4620-ad51-2c5f17e96765
   * @returns {Promise<CustomFieldDefinition[]>} Custom field catalog.
   */
  getIndividualCustomFields: () =>
    client.get<CustomFieldDefinition[]>('/ContactIndividual/CustomFields').then((r) => r.data),
});

export default createContactIndividualClient;
