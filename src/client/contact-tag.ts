import type { AxiosInstance } from 'axios';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type {
  ContactTag,
  ContactTagListResponse,
  CreateContactTagRequest,
  TagListResponse,
  TagSearchBody,
} from '../types/contact-tag/contact-tag';

/**
 * Virtuous CRM Tag and Contact Tag API.
 *
 * List/search catalog tags, apply an existing tag to a contact, list tags on a
 * contact, or remove a tag application. Tag definitions are created in the CRM
 * UI, not through the API.
 *
 * @see https://docs.virtuoussoftware.com/#c3156a7f-2480-48ac-8f6a-0a21b58defc5
 */
const createContactTagClient = (client: AxiosInstance) => ({
  /**
   * List every tag defined in the organization (`GET /Tag`).
   * @see https://docs.virtuoussoftware.com/#48163372-9904-49d5-ad59-a0f039284245
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<TagListResponse>} Paged catalog tags.
   * @example
   * const tags = await virtuous.contactTag.listAllTags({ skip: 0, take: 50 });
   */
  listAllTags: (params?: SkipTakeParams) =>
    client.get<TagListResponse>('/Tag', { params }).then((r) => r.data),

  /**
   * Search tags whose name matches fully or partially (`POST /Tag/Search`).
   * @see https://docs.virtuoussoftware.com/#b282d660-0eca-4337-869f-c0d315bdd286
   * @param {TagSearchBody} body - Search term.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<TagListResponse>} Matching catalog tags.
   * @example
   * const tags = await virtuous.contactTag.searchTags({ search: 'August briefing' });
   */
  searchTags: (body: TagSearchBody, params?: SkipTakeParams) =>
    client.post<TagListResponse>('/Tag/Search', body, { params }).then((r) => r.data),

  /**
   * List tags applied to a contact (`GET /ContactTag/ByContact/{contactId}`).
   * @see https://docs.virtuoussoftware.com/#b7fdf974-09b7-450f-a2a2-dca84c09c451
   * @param {number} contactId - Virtuous contact id.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactTagListResponse>} Tags on that contact.
   * @example
   * const tags = await virtuous.contactTag.getTagsForContact(12345);
   */
  getTagsForContact: (contactId: number, params?: SkipTakeParams) =>
    client
      .get<ContactTagListResponse>(`/ContactTag/ByContact/${contactId}`, { params })
      .then((r) => r.data),

  /**
   * Apply an existing tag to a contact (`POST /ContactTag`).
   * Does not create a tag definition — pass a `tagId` from listAllTags/searchTags.
   * @see https://docs.virtuoussoftware.com/#c3156a7f-2480-48ac-8f6a-0a21b58defc5
   * @param {CreateContactTagRequest} request - `tagId` and `contactId`.
   * @returns {Promise<ContactTag>} The applied tag row (`contactTagId` for deletes).
   * @example
   * const applied = await virtuous.contactTag.createContactTag({ tagId: 10, contactId: 12345 });
   */
  createContactTag: (request: CreateContactTagRequest) =>
    client.post<ContactTag>('/ContactTag', request).then((r) => r.data),

  /**
   * Remove a tag from a contact (`DELETE /ContactTag/{contactTagId}`).
   * Pass `contactTagId` from getTagsForContact, not the catalog `tagId`.
   * @see https://docs.virtuoussoftware.com/#b98a8bc2-3c6b-4a28-b5c2-21cc59b2ae3e
   * @param {number} contactTagId - Application id, not tag id.
   * @returns {Promise<void>} Resolves when the application is removed.
   * @example
   * await virtuous.contactTag.deleteContactTag(applied.contactTagId);
   */
  deleteContactTag: (contactTagId: number) =>
    client.delete<void>(`/ContactTag/${contactTagId}`).then(() => undefined),
});

export default createContactTagClient;
