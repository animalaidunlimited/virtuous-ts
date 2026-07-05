import type { AxiosInstance } from 'axios';
import type { ContactAddressFull } from '../types/contact/contact';
import type {
  CreateContactAddressRequest,
  UpdateContactAddressRequest,
} from '../types/contact/contact-address-create';

/**
 * Contact Address API client
 *
 * All contact address-related operations: create, update, query, etc.
 *
 * @example
 * const addresses = await virtuous.contactAddresses.getAddressesForContact(12345);
 *
 * @example
 * const address = await virtuous.contactAddresses.getAddressById(12345);
 *
 * @example
 * const address = await virtuous.contactAddresses.createAddress({
 *   contactId: 12345,
 *   addressType: "Home",
 *   addressLine1: "123 Main St",
 *   city: "Anytown",
 *   state: "CA",
 *   zip: "12345",
 *   country: "USA",
 * });
 *
 * @example
 * const address = await virtuous.contactAddresses.updateAddress(12345, {
 *   addressType: "Home",
 *   addressLine1: "123 Main St",
 *   city: "Anytown",
 *   state: "CA",
 *   zip: "12345",
 *   country: "USA",
 * });
 */
const createContactAddressesClient = (client: AxiosInstance) => ({
  // ── List & Get ────────────────────────────────────────────────────────
  /**
   * Get addresses for a contact
   * @see https://docs.virtuous.org/api-reference/contact-address/gets-the-contact-addresses-for-the-specified-contact
   * @param {number} contactId - Contact id.
   * @returns {Promise<ContactAddressFull[]>} Resolved API payload.
   */
  getAddressesForContact: (contactId: number) =>
    client.get<ContactAddressFull[]>(`/ContactAddress/ByContact/${contactId}`).then((r) => r.data),

  /**
   * Get address by id
   * @see https://docs.virtuous.org/api-reference/contact-address/gets-the-specified-contact-address
   * @param {number} addressId - Address id.
   * @returns {Promise<ContactAddressFull>} Resolved API payload.
   */
  getAddressById: (addressId: number) =>
    client.get<ContactAddressFull>(`/ContactAddress/${addressId}`).then((r) => r.data),

  // ── Create / Update ───────────────────────────────────────────────────
  /**
   * Create a contact address
   * @see https://docs.virtuous.org/api-reference/contact-address/creates-a-new-contact-address
   * @param {CreateContactAddressRequest} request - Create body.
   * @returns {Promise<ContactAddressFull>} Resolved API payload.
   */
  createAddress: (request: CreateContactAddressRequest) =>
    client.post<ContactAddressFull>('/ContactAddress', request).then((r) => r.data),

  /**
   * Update a contact address
   * @see https://docs.virtuous.org/api-reference/contact-address/updates-contact-address
   * @param {number} addressId - Address id.
   * @param {UpdateContactAddressRequest} request - Update body.
   * @returns {Promise<ContactAddressFull>} Resolved API payload.
   */
  updateAddress: (addressId: number, request: UpdateContactAddressRequest) =>
    client.put<ContactAddressFull>(`/ContactAddress/${addressId}`, request).then((r) => r.data),

  // ── Archive / Unarchive / Delete ──────────────────────────────────────
  /**
   * Archive an address
   * @see https://docs.virtuous.org/api-reference/contact-address/archive-a-contact-address
   * @param {number} addressId - Address id.
   * @returns {Promise<void>} Resolved API payload.
   */
  archiveAddress: (addressId: number) =>
    client.put<void>(`/ContactAddress/Archive/${addressId}`).then(() => undefined),

  /**
   * Unarchive an address
   * @see https://docs.virtuous.org/api-reference/contact-address/unarchive-a-contact-address
   * @param {number} addressId - Address id.
   * @returns {Promise<void>} Resolved API payload.
   */
  unarchiveAddress: (addressId: number) =>
    client.put<void>(`/ContactAddress/Unarchive/${addressId}`).then(() => undefined),

  /**
   * Delete an address
   * @see https://docs.virtuous.org/api-reference/contact-address/deletes-the-specified-contact-address
   * @param {number} addressId - Address id.
   * @returns {Promise<void>} Resolved API payload.
   */
  deleteAddress: (addressId: number) =>
    client.delete<void>(`/ContactAddress/${addressId}`).then(() => undefined),
});

export default createContactAddressesClient;