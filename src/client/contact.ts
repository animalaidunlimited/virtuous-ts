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
import type { ReceiptListResponse } from '../types/contact/contact-receipts';
import type { ContactQueryGeolocationRequest } from '../types/contact/contact-geo-location-query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ContactListItem } from '../types/contact/contact';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { ContactGeoResult } from '../types/contact/contact-geo-location-query';

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
const createContactClient = (client: AxiosInstance) => ({
  // ── Single Contact Lookups ─────────────────────────────────────────────
  /**
   * Get a contact by ID
   * @see https://docs.virtuous.org/api-reference/contact/get-contact-by-id
   * @param {number} contactId - Virtuous contact id.
   * @returns {Promise<Contact>} Resolved API payload.
   * @example
   * const contact = await virtuous.contact.getContactById(12345);
   */
  getContactById: (contactId: number) =>
    client.get<Contact>(`/Contact/${contactId}`).then((r) => r.data),

  /**
   * Get a contact by reference source and ID
   * @see https://docs.virtuous.org/api-reference/contact/get-contact-by-reference-source-and-id
   * @param {string} referenceSource - Reference source.
   * @param {string} referenceId - Reference id.
   * @returns {Promise<Contact>} Resolved API payload.
   */
  getContactByReferenceSourceAndId: (referenceSource: string, referenceId: string) =>
    client.get<Contact>(`/Contact/${referenceSource}/${referenceId}`).then((r) => r.data),

  /**
   * Get a contact by reference ID
   * @see https://docs.virtuous.org/api-reference/contact/get-contact-by-reference-id
   * @param {string} referenceId - Reference id.
   * @returns {Promise<ContactLookup>} Resolved API payload.
   */
  getContactByReferenceId: (referenceId: string) =>
    client.get<ContactLookup>(`/Contact/ByReference/${referenceId}`).then((r) => r.data),

  // ── List & Search ─────────────────────────────────────────────────────
  /**
   * Get contacts by tag ID
   * @see https://docs.virtuous.org/api-reference/contact/get-contacts-by-tag-id
   * @param {number} tagId - Tag id.
   * @param {ContactListParams} [params] - Pagination/sort.
   * @returns {Promise<ContactListResponse<ContactListItem>>} Resolved API payload.
   */
  getContactsByTagId: (tagId: number, params?: ContactListParams) =>
    client.get<ContactListResponse<ContactListItem>>(`/Contact/ByTag/${tagId}`, { params }).then((r) => r.data),

  /**
   * Get contact types
   * @see https://docs.virtuous.org/api-reference/contact/get-contact-types
   * @returns {Promise<ContactType[]>} Resolved API payload.
   */
  getContactTypes: () =>
    client.get<ContactType[]>('/Contact/Types').then((r) => r.data),

  /**
   * Find a contact by email or reference
   * @see https://docs.virtuous.org/api-reference/contact/find-a-contact-by-email-address-or-reference-source-and-id
   * @param {EmailOrReferenceParams} params - Lookup query params.
   * @returns {Promise<Contact>} Resolved API payload.
   */
  findContactByEmailOrReference: (params: EmailOrReferenceParams) =>
    client.get<Contact>('/Contact/Find', { params }).then((r) => r.data),

  /**
   * Search contacts
   * @see https://docs.virtuous.org/api-reference/contact/find-all-contacts-that-match-fully-or-partially-the-given-search-parameters
   * @param {ContactSearchBody} searchBody - Search body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactListResponse<ContactListItem>>} Resolved API payload.
   */
  searchContacts: (searchBody: ContactSearchBody, params?: SkipTakeParams) =>
    client.post<ContactListResponse<ContactListItem>>('/Contact/Search', searchBody, { params }).then((r) => r.data),

  /**
   * Search contacts near coordinates
   * @see https://docs.virtuous.org/api-reference/contact/find-all-contacts-within-a-given-proximity-of-a-geocoordinate
   * @param {GeoCoordinateSearchParams} geoParams - Geo search.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactGeoResult[]>} Resolved API payload.
   */
  searchContactsNearCoordinates: (geoParams: GeoCoordinateSearchParams, params?: SkipTakeParams) =>
    client.post<ContactGeoResult[]>('/Contact/Proximity', geoParams, { params }).then((r) => r.data),

  // ── Create / Update / Archive ─────────────────────────────────────────
  /**
   * Create a contact
   * @see https://docs.virtuous.org/api-reference/contact/create-a-new-contact
   * @param {CreateContactRequest} request - Create body.
   * @returns {Promise<Contact>} Resolved API payload.
   */
  createContact: (request: CreateContactRequest) =>
    client.post<Contact>('/Contact', request).then((r) => r.data),

  /**
   * Update a contact
   * @see https://docs.virtuous.org/api-reference/contact/update-an-existing-contact
   * @param {number} contactId - Contact id.
   * @param {UpdateContactRequest} request - Update body.
   * @returns {Promise<Contact>} Resolved API payload.
   */
  updateContact: (contactId: number, request: UpdateContactRequest) =>
    client.put<Contact>(`/Contact/${contactId}`, request).then((r) => r.data),

  /**
   * Archive a contact
   * @see https://docs.virtuous.org/api-reference/contact/archive-a-contact
   * @param {number} contactId - Contact id.
   * @param {ArchiveContactParams} params - Archive options.
   * @returns {Promise<void>} Resolved API payload.
   */
  archiveContact: (contactId: number, params: ArchiveContactParams) =>
    client.put<void>(`/Contact/Archive/${contactId}`, params).then(() => undefined),

  /**
   * Unarchive a contact
   * @see https://docs.virtuous.org/api-reference/contact/unarchive-a-contact
   * @param {number} contactId - Contact id.
   * @returns {Promise<void>} Resolved API payload.
   */
  unarchiveContact: (contactId: number) =>
    client.put<void>(`/Contact/Unarchive/${contactId}`).then(() => undefined),

  /**
   * Toggle follow on a contact
   * @see https://docs.virtuous.org/api-reference/contact/update-whether-the-user-is-following-a-contact
   * @param {number} contactId - Contact id.
   * @returns {Promise<void>} Resolved API payload.
   */
  toggleFollowContact: (contactId: number) =>
    client.post<void>(`/Contact/ToggleFollow/${contactId}`).then(() => undefined),

  // ── Contact Query ─────────────────────────────────────────────────────
  /**
   * Query contacts (abbreviated)
   * @see https://docs.virtuous.org/api-reference/contact/request-contacts-with-a-custom-query
   * @param {ContactQueryGeolocationRequest} request - Query body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactListResponse<ContactListItem>>} Resolved API payload.
   */
  queryContactsWithAbbreviatedDetails: (request: ContactQueryGeolocationRequest, params?: SkipTakeParams) =>
    client.post<ContactListResponse<ContactListItem>>('/Contact/Query', request, { params }).then((r) => r.data),

  /**
   * Query contacts (full)
   * @see https://docs.virtuous.org/api-reference/contact/request-contacts-with-a-custom-query-1
   * @param {ContactQueryGeolocationRequest} request - Query body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactListResponse<Contact>>} Resolved API payload.
   */
  queryContactsWithFullDetails: (request: ContactQueryGeolocationRequest, params?: SkipTakeParams) =>
    client.post<ContactListResponse<Contact>>('/Contact/Query/FullContact', request, { params }).then((r) => r.data),

  /**
   * Get contact query options
   * @see https://docs.virtuous.org/api-reference/contact/request-query-options-to-build-a-query-for-contacts
   * @returns {Promise<QueryOptionsResponse>} Resolved API payload.
   */
  queryContactOptions: () =>
    client.get<QueryOptionsResponse>('/Contact/QueryOptions').then((r) => r.data),

  // ── Receipts ──────────────────────────────────────────────────────────
  /**
   * Get receipts for a contact email
   * @see https://docs.virtuous.org/api-reference/contact/get-receipts
   * @param {EmailSkipTakeParams} [params] - Email + pagination.
   * @returns {Promise<ReceiptListResponse>} Resolved API payload.
   */
  getReceipts: (params?: EmailSkipTakeParams) =>
    client.get<ReceiptListResponse>('/Contact/Receipts', { params }).then((r) => r.data),

  /**
   * Get receipt PDF
   * @see https://docs.virtuous.org/api-reference/contact/get-receipt
   * @param {number} receiptId - Receipt id.
   * @returns {Promise<Blob>} Resolved API payload.
   */
  getReceiptPdfById: (receiptId: number) =>
    client
      .get<Blob>(`/Contact/Receipts/${receiptId}`, {
        responseType: 'blob',
        headers: { Accept: 'application/pdf' },
      })
      .then((r) => r.data),
});

export default createContactClient;