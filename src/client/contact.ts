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
   * @param contactId - The ID of the contact
   * @returns The contact
   * @example
   * const contact = await virtuous.contact.getContactById(12345);
   */
  getContactById: (contactId: number) =>
    client.get<Contact>(`/Contact/${contactId}`).then((r) => r.data),

  /**
   * Get a contact by reference source and ID
   * @param referenceSource - The reference source
   * @param referenceId - The reference ID
   * @returns The contact
   * @example
   * const contact = await virtuous.contact.getContactByReferenceSourceAndId("Face to Face Campaign 01", "sarah@example.com");
   */
  getContactByReferenceSourceAndId: (referenceSource: string, referenceId: string) =>
    client.get<Contact>(`/Contact/${referenceSource}/${referenceId}`).then((r) => r.data),

  /**
   * Get a contact by reference ID
   * @param referenceId - The reference ID
   * @returns The contact
   * @example
   * const contact = await virtuous.contact.getContactByReferenceId("12345");
   */
  getContactByReferenceId: (referenceId: string) =>
    client.get<ContactLookup>(`/Contact/ByReference/${referenceId}`).then((r) => r.data),

  // ── List & Search ─────────────────────────────────────────────────────
  /**
   * Get contacts by tag ID
   * @param tagId - The ID of the tag
   * @param params - The parameters for the request to paginate and sort the results
   * @returns List of contacts matching the tag ID
   * @example
   * const contacts = await virtuous.contact.getContactsByTagId(12345);
   */
  getContactsByTagId: (tagId: number, params?: ContactListParams) =>
    client.get<ContactListResponse<ContactListItem>>(`/Contact/ByTag/${tagId}`, { params }).then((r) => r.data),

  /**
   * Get the contact types
   * @returns The contact types used in queries
   * @example
   * const contactTypes = await virtuous.contact.getContactTypes();
   */
  getContactTypes: () =>
    client.get<ContactType[]>('/Contact/Types').then((r) => r.data),

  /**
   * Find a contact by email or reference source and ID
   * @param params - The parameters for the request to find a contact by email or reference source and ID
   * @returns The contact
   * @example
   * const contact = await virtuous.contact.findContactByEmailOrReference({ email: "sarah@example.com" });
   */
  findContactByEmailOrReference: (params: EmailOrReferenceParams) =>
    client.get<Contact>('/Contact/Find', { params }).then((r) => r.data),

  /**
   * Search contacts by name, email, phone, or address
   * @param searchBody - The body of the request to search contacts by name, email, phone, or address
   * @param params - The parameters for the request to paginate and sort the results
   * @returns List of contacts matching the search criteria
   * @example
   * const contacts = await virtuous.contact.searchContacts({ search: "Sarah" });
   */
  searchContacts: (searchBody: ContactSearchBody, params?: SkipTakeParams) =>
    client.post<ContactListResponse<ContactListItem>>('/Contact/Search', searchBody, { params }).then((r) => r.data),

  /**
   * Search contacts by coordinates
   * @param geoParams - The parameters for the request to search contacts by coordinates (lat, lon, distanceInMiles)
   * @param params - The parameters for the request to paginate and sort the results
   * @returns List of contacts matching the coordinates
   * @example
   * const contacts = await virtuous.contact.searchContactsNearCoordinates({ latitude: 37.774929, longitude: -122.419418 });
   */
  searchContactsNearCoordinates: (geoParams: GeoCoordinateSearchParams, params?: SkipTakeParams) =>
    client.post<ContactGeoResult[]>('/Contact/Proximity', geoParams, { params }).then((r) => r.data),

  // ── Create / Update / Archive ─────────────────────────────────────────
  /**
   * Create a contact
   * @param request - The create contact request object
   * @returns The contact
   * @example
   * const contact = await virtuous.contact.createContact({ contactType: "Individual", name: "Sarah Johnson" });
   */
  createContact: (request: CreateContactRequest) =>
    client.post<Contact>('/Contact', request).then((r) => r.data),

  /**
   * Update a contact
   * @param contactId - The ID of the contact
   * @param request - The update contact request object
   * @returns The contact
   * @example
   * const contact = await virtuous.contact.updateContact(12345, { name: "Sarah Johnson" });
   */
  updateContact: (contactId: number, request: UpdateContactRequest) =>
    client.put<Contact>(`/Contact/${contactId}`, request).then((r) => r.data),

  /**
   * Archive a contact
   * @param contactId - The ID of the contact
   * @param params - The archive contact request object
   * @returns void
   * @example
   * await virtuous.contact.archiveContact(12345, { reason: "Inactive" });
   */
  archiveContact: (contactId: number, params: ArchiveContactParams) =>
    client.put<void>(`/Contact/Archive/${contactId}`, params).then(() => undefined),

  /**
   * Unarchive a contact
   * @param contactId - The ID of the contact
   * @returns void
   * @example
   * await virtuous.contact.unarchiveContact(12345);
   */
  unarchiveContact: (contactId: number) =>
    client.put<void>(`/Contact/Unarchive/${contactId}`).then(() => undefined),

  /**
   * Toggle the follow status of a contact
   * @param contactId - The ID of the contact
   * @returns void
   * @example
   * await virtuous.contact.toggleFollowContact(12345);
   */
  toggleFollowContact: (contactId: number) =>
    client.post<void>(`/Contact/ToggleFollow/${contactId}`).then(() => undefined),

  // ── Contact Query ─────────────────────────────────────────────────────
  /**
   * Query contacts and return a list of contacts with abbreviated details
   * @param request - The request query object
   * @param params - The parameters for the request to paginate and sort the results
   * @returns List of contacts with abbreviated details
   * @example
   * const contacts = await virtuous.contact.queryContactsWithAbbreviatedDetails({ search: "Sarah" });
   */
  queryContactsWithAbbreviatedDetails: (request: ContactQueryGeolocationRequest, params?: SkipTakeParams) =>
    client.post<ContactListResponse<ContactListItem>>('/Contact/Query', request, { params }).then((r) => r.data),

  /**
   * Query contacts and return a list of contacts with full details
   * @param request - The request query object
   * @param params - The parameters for the request to paginate and sort the results
   * @returns List of contacts with full details
   * @example
   * const contacts = await virtuous.contact.queryContactsWithFullDetails({ search: "Sarah" });
   */
  queryContactsWithFullDetails: (request: ContactQueryGeolocationRequest, params?: SkipTakeParams) =>
    client.post<ContactListResponse<Contact>>('/Contact/Query/FullContact', request, { params }).then((r) => r.data),

  /**
   * Get the contact query options
   * @returns Contact query options
   * @example
   * const options = await virtuous.contact.queryContactOptions();
   */
  queryContactOptions: () =>
    client.get<QueryOptionsResponse>('/Contact/QueryOptions').then((r) => r.data),

  // ── Receipts ──────────────────────────────────────────────────────────
  /**
   * Get the receipts for a contact
   * @param params - The email address for the request and parameters to sort and paginate the results
   * @returns List of receipts for the contact
   * @example
   * const receipts = await virtuous.contact.getReceipts({ email: "sarah@example.com" });
   */
  getReceipts: (params?: EmailSkipTakeParams) =>
    client.get<ReceiptListResponse>('/Contact/Receipts', { params }).then((r) => r.data),

  /**
   * Get the receipt PDF by ID
   * @param receiptId - The ID of the receipt
   * @returns the receipt PDF
   * @example
   * const receiptPdf = await virtuous.contact.getReceiptPdfById(12345);
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