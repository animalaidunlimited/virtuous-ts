import type { AxiosInstance } from 'axios';
import type {
  Contact,
  ContactListResponse,
  ContactLookup,
  ContactType,
} from '../types/contact/contact';
import type {
  ContactListParams,
  EmailAddressOrReferenceSourceAndIdParams as EmailOrReferenceParams,
  SearchParams as ContactSearchBody,
  GeoCoordinateSearchParams,
  ArchiveContactParams,
  EmailSkipTakeParams,
} from '../types/contact/contact-params';
import type { CreateContactRequest } from '../types/contact/contact-create';
import type { UpdateContactRequest } from '../types/contact/contact-update';
import { contactToUpdateRequest, mergeUpdate } from '../utils/to-update-request';
import type { ReceiptFileResponse, ReceiptListResponse } from '../types/contact/contact-receipts';
import type { FollowedContactActivity } from '../types/contact/contact-activity';
import type {
  CreateContactImportRequest,
  CreateContactTransactionRequest,
  CreateCustomCollectionInstanceRequest,
  CustomCollectionDefinition,
  CustomCollectionInstance,
} from '../types/contact/contact-transaction';
import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import type { QueuedImportResponse } from '../types/shared/queued-import';
import type { ListResponse } from '../types/shared/list-response';
import type { ContactQueryGeolocationRequest } from '../types/contact/contact-geo-location-query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ContactListItem } from '../types/contact/contact';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { ContactGeoResult } from '../types/contact/contact-geo-location-query';
import type { QueryRequest } from '../types/shared/query';
import { queryAll, type QueryAllOptions, type QueryAllResult } from '../utils/query-all';
import { listAll, type ListAllOptions, type ListAllResult } from '../utils/list-all';
import { validateQueryWithCache } from '../http/query-validation';
import type { QueryOptionsCache } from '../http/query-options-cache';

/**
 * Contact API client
 *
 * All contact-related operations: create, search, update, query, etc.
 *
 * @example
 * const contact = await virtuous.contact.getContactById(12345);
 *
 * @example
 * const contact = await virtuous.contact.getContactByReferenceSourceAndId("Face to Face Campaign 01", "sarah@example.com");
 *
 * @example
 * const contact = await virtuous.contact.getContactByReferenceId("12345");
 */
const createContactClient = (
  client: AxiosInstance,
  options: { validateQueries?: boolean; queryOptionsCache?: QueryOptionsCache } = {},
) => {
  const checkQuery = async (request: QueryRequest): Promise<void> => {
    if (!options.validateQueries || !options.queryOptionsCache) {
      return;
    }
    await validateQueryWithCache(client, options.queryOptionsCache, '/Contact/QueryOptions', request);
  };

  const contact = {
  // ── Single Contact Lookups ─────────────────────────────────────────────
  /**
   * Get a contact by ID
   * @see https://docs.virtuoussoftware.com/#118355eb-8028-4751-b5ab-151ff0aa2b22
   * @param {number} contactId - Virtuous contact id.
   * @returns {Promise<Contact>} Resolved API payload.
   * @example
   * const contact = await virtuous.contact.getContactById(12345);
   */
  getContactById: (contactId: number) =>
    client.get<Contact>(`/Contact/${contactId}`).then((r) => r.data),

  /**
   * Get a contact by reference source and ID
   * @see https://docs.virtuoussoftware.com/#0188f30c-9404-4767-a1db-8851250cf6d9
   * @param {string} referenceSource - Reference source.
   * @param {string} referenceId - Reference id.
   * @returns {Promise<Contact>} Resolved API payload.
   */
  getContactByReferenceSourceAndId: (referenceSource: string, referenceId: string) =>
    client.get<Contact>(`/Contact/${referenceSource}/${referenceId}`).then((r) => r.data),

  /**
   * Get a contact by reference ID. HMAC authentication only; API keys may receive 403.
   * @see https://docs.virtuoussoftware.com/#1b9d2d8a-5b0d-4615-899b-257c07454b78
   * @param {string} referenceId - Reference id.
   * @returns {Promise<ContactLookup>} Resolved API payload.
   */
  getContactByReferenceId: (referenceId: string) =>
    client.get<ContactLookup>(`/Contact/ByReference/${referenceId}`).then((r) => r.data),

  // ── List & Search ─────────────────────────────────────────────────────
  /**
   * Get contacts by tag ID
   * @see https://docs.virtuoussoftware.com/
   * @param {number} tagId - Tag id.
   * @param {ContactListParams} [params] - Pagination/sort.
   * @returns {Promise<ContactListResponse<ContactListItem>>} Resolved API payload.
   */
  getContactsByTagId: (tagId: number, params?: ContactListParams) =>
    client.get<ContactListResponse<ContactListItem>>(`/Contact/ByTag/${tagId}`, { params }).then((r) => r.data),

  /**
   * Get contact types.
   *
   * Virtuous returns at most 10 rows when `take` is omitted, and this endpoint
   * does not accept `skip`/`take`. If the organization has more than 10 types,
   * the API will not page them through this method.
   *
   * @see https://docs.virtuoussoftware.com/#a55a9047-cda1-4a9d-8c79-0b62e2246597
   * @returns {Promise<ContactType[]>} Resolved API payload. May be truncated at 10.
   */
  getContactTypes: () =>
    client.get<ContactType[]>('/Contact/Types').then((r) => r.data),

  /**
   * Same as `getContactTypes`. The Types endpoint returns a plain array and
   * ignores pagination, so this cannot page past the 10-row default.
   *
   * @returns {Promise<ContactType[]>} Contact types, possibly truncated at 10.
   */
  getContactTypesAll: () =>
    client.get<ContactType[]>('/Contact/Types').then((r) => r.data),

  /**
   * Find a contact by email or reference
   * @see https://docs.virtuoussoftware.com/#d4fb962c-c02b-4128-aa62-8f2822dd2e6c
   * @param {EmailOrReferenceParams} params - Lookup query params.
   * @returns {Promise<Contact>} Resolved API payload.
   */
  findContactByEmailOrReference: (params: EmailOrReferenceParams) =>
    client.get<Contact>('/Contact/Find', { params }).then((r) => r.data),

  /**
   * Search contacts
   * @see https://docs.virtuoussoftware.com/
   * @param {ContactSearchBody} searchBody - Search body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactListResponse<ContactListItem>>} Resolved API payload.
   */
  searchContacts: (searchBody: ContactSearchBody, params?: SkipTakeParams) =>
    client.post<ContactListResponse<ContactListItem>>('/Contact/Search', searchBody, { params }).then((r) => r.data),

  /**
   * Search contacts near coordinates
   * @see https://docs.virtuoussoftware.com/#78cff7bd-04fd-44e5-809f-625b2d63280c
   * @param {GeoCoordinateSearchParams} geoParams - Geo search.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactGeoResult[]>} Resolved API payload.
   */
  searchContactsNearCoordinates: (geoParams: GeoCoordinateSearchParams, params?: SkipTakeParams) =>
    client.post<ContactGeoResult[]>('/Contact/Proximity', geoParams, { params }).then((r) => r.data),

  // ── Create / Update / Archive ─────────────────────────────────────────
  /**
   * Creates a contact directly. Does not check for duplicates. Prefer `createContactTransaction`.
   * @see https://docs.virtuoussoftware.com/#ac338617-d5b2-4ce0-93c5-9921be01ec88
   * @param {CreateContactRequest} request - Create body.
   * @returns {Promise<Contact>} Resolved API payload.
   */
  createContact: (request: CreateContactRequest) =>
    client.post<Contact>('/Contact', request).then((r) => r.data),

  /**
   * Update a contact
   * @see https://docs.virtuoussoftware.com/#b1903993-cd12-400c-ba44-5ac553ae117c
   * @param {number} contactId - Contact id.
   * @param {UpdateContactRequest} request - Update body.
   * @returns {Promise<Contact>} Resolved API payload.
   */
  updateContact: (contactId: number, request: UpdateContactRequest) =>
    client.put<Contact>(`/Contact/${contactId}`, request).then((r) => r.data),

  /**
   * GETs the contact, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#b1903993-cd12-400c-ba44-5ac553ae117c
   * @param {number} contactId - Contact id.
   * @param {Partial<UpdateContactRequest>} changes - Fields to change.
   * @returns {Promise<Contact>} The updated contact.
   */
  updateContactSafely: async (contactId: number, changes: Partial<UpdateContactRequest>) => {
    const current = await client.get<Contact>(`/Contact/${contactId}`).then((r) => r.data);
    return client
      .put<Contact>(`/Contact/${contactId}`, mergeUpdate(contactToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

  /**
   * Archive a contact
   * @see https://docs.virtuoussoftware.com/#052d1067-9289-4a92-b8c4-f6e436b13f9b
   * @param {number} contactId - Contact id.
   * @param {ArchiveContactParams} params - Archive options.
   * @returns {Promise<void>} Resolved API payload.
   */
  archiveContact: (contactId: number, params: ArchiveContactParams) =>
    client.put<void>(`/Contact/Archive/${contactId}`, params).then(() => undefined),

  /**
   * Unarchive a contact
   * @see https://docs.virtuoussoftware.com/#4994fefa-2e0c-40be-8b35-1b297a575016
   * @param {number} contactId - Contact id.
   * @returns {Promise<void>} Resolved API payload.
   */
  unarchiveContact: (contactId: number) =>
    client.put<void>(`/Contact/Unarchive/${contactId}`).then(() => undefined),

  /**
   * Toggle follow on a contact
   * @see https://docs.virtuoussoftware.com/#contact/update-whether-the-user-is-following-a-contact
   * @param {number} contactId - Contact id.
   * @returns {Promise<void>} Resolved API payload.
   */
  toggleFollowContact: (contactId: number) =>
    client.post<void>(`/Contact/ToggleFollow/${contactId}`).then(() => undefined),

  // ── Contact Query ─────────────────────────────────────────────────────
  /**
   * Query contacts (abbreviated)
   * @see https://docs.virtuoussoftware.com/
   * @param {ContactQueryGeolocationRequest} request - Query body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactListResponse<ContactListItem>>} Resolved API payload.
   */
  queryContactsWithAbbreviatedDetails: async (request: ContactQueryGeolocationRequest, params?: SkipTakeParams) => {
    await checkQuery(request);
    return client.post<ContactListResponse<ContactListItem>>('/Contact/Query', request, { params }).then((r) => r.data);
  },

  /**
   * Pages abbreviated contact query results until the list ends or the cap is hit.
   * Default page size is 1,000. Default cap is 10,000 rows.
   *
   * @param request - Contact query body.
   * @param opts - Page size, cap, progress callback, abort signal.
   * @returns Concatenated contact list items.
   */
  queryAllContacts: (
    request: ContactQueryGeolocationRequest,
    opts?: QueryAllOptions,
  ): Promise<QueryAllResult<ContactListItem>> =>
    queryAll((params) => contact.queryContactsWithAbbreviatedDetails(request, params), opts),

  /**
   * Query contacts (full)
   * @see https://docs.virtuoussoftware.com/
   * @param {ContactQueryGeolocationRequest} request - Query body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactListResponse<Contact>>} Resolved API payload.
   */
  queryContactsWithFullDetails: async (request: ContactQueryGeolocationRequest, params?: SkipTakeParams) => {
    await checkQuery(request);
    return client.post<ContactListResponse<Contact>>('/Contact/Query/FullContact', request, { params }).then((r) => r.data);
  },

  /**
   * Get contact query options
   * @see https://docs.virtuoussoftware.com/#8f5e939c-e1e4-481e-a58e-f858d3217b53
   * @returns {Promise<QueryOptionsResponse>} Resolved API payload.
   */
  queryContactOptions: () =>
    client.get<QueryOptionsResponse>('/Contact/QueryOptions').then((r) => r.data),

  // ── Receipts ──────────────────────────────────────────────────────────
  /**
   * Get receipts for a contact email
   * @see https://docs.virtuoussoftware.com/#cafc4c21-01ea-49cd-8cea-c3d50b0c7584
   * @param {EmailSkipTakeParams} [params] - Email + pagination.
   * @returns {Promise<ReceiptListResponse>} Resolved API payload.
   */
  getReceipts: (params?: EmailSkipTakeParams) =>
    client.get<ReceiptListResponse>('/Contact/Receipts', { params }).then((r) => r.data),

  /**
   * Returns a receipt file payload (`fileStream`, `filePath`, `contentType`).
   * @see https://docs.virtuoussoftware.com/#70c4a8ab-65d9-44f7-9465-082182f6e4b9
   * @param {number} receiptId - Receipt id.
   * @returns {Promise<ReceiptFileResponse>} Receipt file metadata and stream.
   */
  getReceiptPdfById: (receiptId: number) =>
    client.get<ReceiptFileResponse>(`/Contact/Receipts/${receiptId}`).then((r) => r.data),

  /**
   * Returns recent activity on contacts the current user follows.
   * @see https://docs.virtuoussoftware.com/#8d547c98-fc38-403c-bedd-d73713be1c63
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<FollowedContactActivity>>} Followed-contact activity.
   */
  getFollowedContactActivity: (params?: SkipTakeParams) =>
    client
      .get<ListResponse<FollowedContactActivity>>('/Contact/Activity', { params })
      .then((r) => r.data),

  /**
   * Returns contacts the current user follows.
   * @see https://docs.virtuoussoftware.com/#0b0bd866-0c5b-463e-9d2e-f348cc32def0
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactListResponse<ContactListItem>>} Followed contacts.
   */
  getFollowedContacts: (params?: SkipTakeParams) =>
    client
      .get<ContactListResponse<ContactListItem>>('/Contact/Following', { params })
      .then((r) => r.data),

  /**
   * Pages followed contacts. `GET /Contact/Following` accepts `skip`/`take`
   * and otherwise defaults to a short page.
   *
   * @param opts - Page size (default 500) and cap (default 5,000).
   * @returns Every followed contact the cap allows.
   */
  getFollowedContactsAll: (opts?: ListAllOptions): Promise<ListAllResult<ContactListItem>> =>
    listAll(
      (params) =>
        client
          .get<ContactListResponse<ContactListItem>>('/Contact/Following', { params })
          .then((r) => r.data),
      opts,
    ),

  /**
   * Returns configured name prefixes and titles.
   *
   * This endpoint returns a plain array and does not accept `skip`/`take`.
   * Virtuous defaults many catalog lists to 10 rows when paging is omitted.
   *
   * @see https://docs.virtuoussoftware.com/#fc692434-1f79-4d7d-96bd-71f741eab7e9
   * @returns {Promise<string[]>} Prefixes and titles. May be truncated at 10.
   */
  getContactPrefixes: () => client.get<string[]>('/Contact/Prefixes').then((r) => r.data),

  /**
   * Returns enabled custom fields for contacts.
   *
   * Plain array, no `skip`/`take`. Virtuous may return only the first 10
   * definitions when the catalog is longer.
   *
   * @see https://docs.virtuoussoftware.com/#060c7f43-3ff8-40a3-8e29-431cecb27f3e
   * @returns {Promise<CustomFieldDefinition[]>} Custom field catalog. May be truncated at 10.
   */
  getContactCustomFields: () =>
    client.get<CustomFieldDefinition[]>('/Contact/CustomFields').then((r) => r.data),

  /**
   * Returns custom collection definitions for contacts.
   *
   * Plain array, no `skip`/`take`. Virtuous may return only the first 10
   * definitions when the catalog is longer.
   *
   * @see https://docs.virtuoussoftware.com/#a1699247-3c3d-4c8e-8348-b97f9134697b
   * @returns {Promise<CustomCollectionDefinition[]>} Collection definitions. May be truncated at 10.
   */
  listContactCustomCollections: () =>
    client.get<CustomCollectionDefinition[]>('/Contact/CustomCollections').then((r) => r.data),

  /**
   * Adds a custom collection instance to a contact.
   * @see https://docs.virtuoussoftware.com/#028b8b0d-62ae-4427-8b41-7edfe207aa0f
   * @param {number} contactId - Contact id.
   * @param {number} customCollectionId - Collection definition id.
   * @param {CreateCustomCollectionInstanceRequest} request - Field values.
   * @returns {Promise<CustomCollectionInstance>} The created instance.
   */
  createContactCollection: (
    contactId: number,
    customCollectionId: number,
    request: CreateCustomCollectionInstanceRequest,
  ) =>
    client
      .post<CustomCollectionInstance>(`/Contact/${contactId}/Collection/${customCollectionId}`, request)
      .then((r) => r.data),

  /**
   * Replaces a custom collection instance on a contact.
   * @see https://docs.virtuoussoftware.com/#2ee0875f-ab44-417a-88d5-7ae7e400cd45
   * @param {number} contactId - Contact id.
   * @param {number} collectionInstanceId - Instance id.
   * @param {CreateCustomCollectionInstanceRequest} request - Field values.
   * @returns {Promise<CustomCollectionInstance>} The updated instance.
   */
  updateContactCollection: (
    contactId: number,
    collectionInstanceId: number,
    request: CreateCustomCollectionInstanceRequest,
  ) =>
    client
      .put<CustomCollectionInstance>(
        `/Contact/${contactId}/Collection/${collectionInstanceId}`,
        request,
      )
      .then((r) => r.data),

  /**
   * Deletes a custom collection instance from a contact.
   * @see https://docs.virtuoussoftware.com/#04ce7d36-130b-46b8-aa98-b19101a012fb
   * @param {number} contactId - Contact id.
   * @param {number} collectionInstanceId - Instance id.
   * @returns {Promise<void>} Resolves when deleted.
   */
  deleteContactCollection: (contactId: number, collectionInstanceId: number) =>
    client
      .delete<void>(`/Contact/${contactId}/Collection/${collectionInstanceId}`)
      .then(() => undefined),

  /**
   * Submits a contact through the import process (preferred over createContact).
   * @see https://docs.virtuoussoftware.com/#0b27a920-243c-4f02-a5c3-6e522b926431
   * @param {CreateContactTransactionRequest} request - Import contact body.
   * @returns {Promise<QueuedImportResponse>} Queued-import acknowledgement.
   */
  createContactTransaction: (request: CreateContactTransactionRequest) =>
    client
      .post<QueuedImportResponse>('/Contact/Transaction', request)
      .then((r) => (r.data ?? {}) as QueuedImportResponse),

  /**
   * Submits a batch of contacts through the import process.
   * @see https://docs.virtuoussoftware.com/#fe6c2bdd-e65a-4e7c-b503-9ede0b7ea9f7
   * @param {CreateContactImportRequest} request - Batch import body.
   * @returns {Promise<QueuedImportResponse>} Queued-import acknowledgement.
   */
  createContactImport: (request: CreateContactImportRequest) =>
    client
      .post<QueuedImportResponse>('/Contact/Batch', request)
      .then((r) => (r.data ?? {}) as QueuedImportResponse),
  };

  return contact;
};

export default createContactClient;