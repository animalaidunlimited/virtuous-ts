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
   * Get the addresses for a contact
   * @param contactId - The ID of the contact
   * @returns the addresses for a contact
   * @example
   * const addresses = await virtuous.contactAddresses.getAddressesForContact(12345);
   */
  getAddressesForContact: (contactId: number) =>
    client.get<ContactAddressFull[]>(`/ContactAddress/ByContact/${contactId}`).then((r) => r.data),

  /**
   * Get an address by ID
   * @param addressId - The ID of the address
   * @returns the address
   * @example
   * const address = await virtuous.contactAddresses.getAddressById(12345);
   */
  getAddressById: (addressId: number) =>
    client.get<ContactAddressFull>(`/ContactAddress/${addressId}`).then((r) => r.data),

  // ── Create / Update ───────────────────────────────────────────────────
  /**
   * Create an address
   * @param request - The request to create an address
   * @returns the created address
   * @example
   * const address = await virtuous.contactAddresses.createAddress({
   *   contactId: 12345,
   *   label: "Home",
   *   address1: "123 Main St",
   *   address2: "Apt 1",
   *   city: "Anytown",
   *   state: "CA",
   *   postal: "12345",
   *   country: "USA",
   * });
   */
  createAddress: (request: CreateContactAddressRequest) =>
    client.post<ContactAddressFull>('/ContactAddress', request).then((r) => r.data),

  /**
   * Update an address
   * @param request - The request to update the address
   * @returns the updated address
   * @example
   * const address = await virtuous.contactAddresses.updateAddress(12345, {
   *   label: "Home",
   *   address1: "123 Main St",
   *   city: "Anytown",
   *   state: "CA",
   *   postal: "12345",
   *   country: "USA",
   * });
   */
  updateAddress: (addressId: number, request: UpdateContactAddressRequest) =>
    client.put<ContactAddressFull>(`/ContactAddress/${addressId}`, request).then((r) => r.data),

  // ── Archive / Unarchive / Delete ──────────────────────────────────────
  /**
   * Archive an address
   * @param addressId - The ID of the address
   * @returns void
   * @example
   * await virtuous.contactAddresses.archiveAddress(12345);
   */
  archiveAddress: (addressId: number) =>
    client.put<void>(`/ContactAddress/Archive/${addressId}`).then(() => undefined),

  /**
   * Unarchive an address
   * @param addressId - The ID of the address
   * @returns void
   * @example
   * await virtuous.contactAddresses.unarchiveAddress(12345);
   */
  unarchiveAddress: (addressId: number) =>
    client.put<void>(`/ContactAddress/Unarchive/${addressId}`).then(() => undefined),

  /**
   * Delete an address
   * @param addressId - The ID of the address
   * @returns void
   * @example
   * await virtuous.contactAddresses.deleteAddress(12345);
   */
  deleteAddress: (addressId: number) =>
    client.delete<void>(`/ContactAddress/${addressId}`).then(() => undefined),
});

export default createContactAddressesClient;