import type { AxiosInstance } from 'axios';
import type { ContactAddressFull } from '../types/contact/contact';
import type {
  CreateContactAddressRequest,
  UpdateContactAddressRequest,
} from '../types/contact/contact-address-create';
import { addressToUpdateRequest, mergeUpdate } from '../utils/to-update-request';

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
   * @see https://docs.virtuoussoftware.com/#7b216277-1272-43f6-8001-7f0f466112b3
   * @param {number} contactId - Contact id.
   * @returns {Promise<ContactAddressFull[]>} Resolved API payload.
   */
  getAddressesForContact: (contactId: number) =>
    client.get<ContactAddressFull[]>(`/ContactAddress/ByContact/${contactId}`).then((r) => r.data),

  /**
   * Get address by id
   * @see https://docs.virtuoussoftware.com/#a1ec3ed7-929a-4fc1-99f6-ec60fcfc4072
   * @param {number} addressId - Address id.
   * @returns {Promise<ContactAddressFull>} Resolved API payload.
   */
  getAddressById: (addressId: number) =>
    client.get<ContactAddressFull>(`/ContactAddress/${addressId}`).then((r) => r.data),

  // ── Create / Update ───────────────────────────────────────────────────
  /**
   * Create a contact address
   * @see https://docs.virtuoussoftware.com/#57b822b2-7c3a-4672-9a81-7fd2f8c29dc9
   * @param {CreateContactAddressRequest} request - Create body.
   * @returns {Promise<ContactAddressFull>} Resolved API payload.
   */
  createAddress: (request: CreateContactAddressRequest) =>
    client.post<ContactAddressFull>('/ContactAddress', request).then((r) => r.data),

  /**
   * Update a contact address
   * @see https://docs.virtuoussoftware.com/#aa611560-0112-4362-929f-d4789ab70885
   * @param {number} addressId - Address id.
   * @param {UpdateContactAddressRequest} request - Update body.
   * @returns {Promise<ContactAddressFull>} Resolved API payload.
   */
  updateAddress: (addressId: number, request: UpdateContactAddressRequest) =>
    client.put<ContactAddressFull>(`/ContactAddress/${addressId}`, request).then((r) => r.data),

  /**
   * GETs the address, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#aa611560-0112-4362-929f-d4789ab70885
   * @param {number} addressId - Address id.
   * @param {Partial<UpdateContactAddressRequest>} changes - Fields to change.
   * @returns {Promise<ContactAddressFull>} The updated address.
   */
  updateAddressSafely: async (addressId: number, changes: Partial<UpdateContactAddressRequest>) => {
    const current = await client.get<ContactAddressFull>(`/ContactAddress/${addressId}`).then((r) => r.data);
    return client
      .put<ContactAddressFull>(
        `/ContactAddress/${addressId}`,
        mergeUpdate(addressToUpdateRequest(current), changes),
      )
      .then((r) => r.data);
  },

  // ── Archive / Unarchive / Delete ──────────────────────────────────────
  /**
   * Archive an address
   * @see https://docs.virtuoussoftware.com/#a6caa2c5-78dc-40db-a9f1-7d2e71ad815d
   * @param {number} addressId - Address id.
   * @returns {Promise<void>} Resolved API payload.
   */
  archiveAddress: (addressId: number) =>
    client.put<void>(`/ContactAddress/Archive/${addressId}`).then(() => undefined),

  /**
   * Unarchive an address
   * @see https://docs.virtuoussoftware.com/#52af925f-6221-4660-a7fa-e5eaa5923cde
   * @param {number} addressId - Address id.
   * @returns {Promise<void>} Resolved API payload.
   */
  unarchiveAddress: (addressId: number) =>
    client.put<void>(`/ContactAddress/Unarchive/${addressId}`).then(() => undefined),

  /**
   * Delete an address
   * @see https://docs.virtuoussoftware.com/#189fb0a3-45ac-46eb-9ee9-b770d93e5d7f
   * @param {number} addressId - Address id.
   * @returns {Promise<void>} Resolved API payload.
   */
  deleteAddress: (addressId: number) =>
    client.delete<void>(`/ContactAddress/${addressId}`).then(() => undefined),
});

export default createContactAddressesClient;