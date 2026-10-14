import type { AxiosInstance } from 'axios';
import type { ContactNote } from '../types/contact-note/contact-note';
import {
  type CreateContactNoteInput,
  toCreateContactNoteWireBody,
} from '../types/contact-note/create-contact-note';
import type {
  CreateNoteFromEmailRequest,
  UpdateContactNoteRequest,
} from '../types/contact-note/update-contact-note';
import type { ListResponse } from '../types/shared/list-response';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import { validateQueryWithCache } from '../http/query-validation';
import type { QueryOptionsCache } from '../http/query-options-cache';

/**
 * Virtuous CRM Contact Note API.
 * @see https://docs.virtuoussoftware.com/#e5a3357c-c7d7-44e9-920a-cf4c13b32867
 */
const createContactNoteClient = (
  client: AxiosInstance,
  options: { validateQueries?: boolean; queryOptionsCache?: QueryOptionsCache } = {},
) => ({
  /**
   * Creates a note on a contact. `isPrivate` maps to JSON `private`.
   * @see https://docs.virtuoussoftware.com/#e5a3357c-c7d7-44e9-920a-cf4c13b32867
   * @param {CreateContactNoteInput} input - Note fields.
   * @returns {Promise<ContactNote>} The created note.
   */
  createContactNote: (input: CreateContactNoteInput) =>
    client
      .post<ContactNote>('/ContactNote', toCreateContactNoteWireBody(input))
      .then((r) => r.data),

  /**
   * Returns a contact note by id.
   * @see https://docs.virtuoussoftware.com/#e267ff27-b827-486e-8ef1-8b80bfc480c4
   * @param {number} noteId - Contact note id.
   * @returns {Promise<ContactNote>} The note record.
   */
  getContactNote: (noteId: number) =>
    client.get<ContactNote>(`/ContactNote/${noteId}`).then((r) => r.data),

  /**
   * Returns notes for a contact.
   * @see https://docs.virtuoussoftware.com/#20c64072-2cc9-4fd6-b5c7-30261f66e247
   * @param {number} contactId - Contact id.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<ContactNote>>} Notes for the contact.
   */
  getNotesForContact: (contactId: number, params?: SkipTakeParams) =>
    client
      .get<ListResponse<ContactNote>>(`/ContactNote/ByContact/${contactId}`, { params })
      .then((r) => r.data),

  /**
   * Returns important notes for a contact.
   * @see https://docs.virtuoussoftware.com/#744da609-761f-4088-9939-a7b65ddf3451
   * @param {number} contactId - Contact id.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<ContactNote>>} Important notes.
   */
  getImportantNotesForContact: (contactId: number, params?: SkipTakeParams) =>
    client
      .get<ListResponse<ContactNote>>(`/ContactNote/Important/ByContact/${contactId}`, { params })
      .then((r) => r.data),

  /**
   * Records an email exchange as a note on matching contacts.
   * @see https://docs.virtuoussoftware.com/#4b103c68-63a8-488e-82bd-b93812c4ee02
   * @param {CreateNoteFromEmailRequest} request - From/to/subject/body.
   * @returns {Promise<ContactNote[]>} Notes created (possibly more than one).
   */
  createNoteFromEmail: (request: CreateNoteFromEmailRequest) =>
    client.post<ContactNote[]>('/ContactNote/Email', request).then((r) => r.data),

  /**
   * Replaces a contact note. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#8be9268a-7834-4fb1-bc1b-19399fdf3305
   * @param {number} noteId - Contact note id.
   * @param {UpdateContactNoteRequest} request - Update fields (`isPrivate` maps to `private`).
   * @returns {Promise<ContactNote>} The updated note.
   */
  updateContactNote: (noteId: number, request: UpdateContactNoteRequest) => {
    const { isPrivate, ...rest } = request;
    const body = {
      ...rest,
      ...(isPrivate !== undefined ? { private: isPrivate } : {}),
    };
    return client.put<ContactNote>(`/ContactNote/${noteId}`, body).then((r) => r.data);
  },

  /**
   * Fetches the current note and applies a partial update.
   * @see https://docs.virtuoussoftware.com/#e267ff27-b827-486e-8ef1-8b80bfc480c4
   * @param {number} noteId - Contact note id.
   * @param {Partial<UpdateContactNoteRequest>} changes - Fields to change.
   * @returns {Promise<ContactNote>} The updated note.
   */
  updateContactNoteSafely: async (noteId: number, changes: Partial<UpdateContactNoteRequest>) => {
    const current = await client.get<ContactNote>(`/ContactNote/${noteId}`).then((r) => r.data);
    return createContactNoteClient(client).updateContactNote(noteId, {
      type: current.type,
      note: current.note,
      important: current.important,
      isPrivate: current.isPrivate,
      ...changes,
    });
  },

  /**
   * Deletes a contact note.
   * @see https://docs.virtuoussoftware.com/#ea196bc2-c769-46cc-8403-e497f9fd4712
   * @param {number} noteId - Contact note id.
   * @returns {Promise<void>} Resolves when deleted.
   */
  deleteContactNote: (noteId: number) =>
    client.delete<void>(`/ContactNote/${noteId}`).then(() => undefined),

  /**
   * Returns query fields and operators for contact notes.
   * @see https://docs.virtuoussoftware.com/#4823ef8f-c65d-47c4-ae23-bb00f2d4a9b4
   * @returns {Promise<QueryOptionsResponse>} Query builder metadata.
   */
  getContactNoteQueryOptions: () =>
    client.get<QueryOptionsResponse>('/ContactNote/QueryOptions').then((r) => r.data),

  /**
   * Queries contact notes. Prefer webhooks for new/updated notes. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#f0208a32-c3c0-408b-bf5b-f28ad7c0a0f7
   * @param {QueryRequest} request - Query body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<ContactNote>>} Matching notes.
   */
  queryContactNotes: async (request: QueryRequest, params?: SkipTakeParams) => {
    if (options.validateQueries && options.queryOptionsCache) {
      await validateQueryWithCache(client, options.queryOptionsCache, '/ContactNote/QueryOptions', request);
    }
    return client
      .post<ListResponse<ContactNote>>('/ContactNote/Query', request, { params })
      .then((r) => r.data);
  },

  /**
   * Returns configured contact note types.
   *
   * Plain array, no `skip`/`take`. Virtuous may return only the first 10 types.
   *
   * @see https://docs.virtuoussoftware.com/#3842f3ed-833b-4ad1-94ce-e20ab6867dd5
   * @returns {Promise<unknown>} Note types. May be truncated at 10.
   */
  listContactNoteTypes: () => client.get<unknown>('/ContactNote/Types').then((r) => r.data),

  /**
   * Returns enabled custom fields for contact notes.
   *
   * Plain array, no `skip`/`take`. Virtuous may return only the first 10 definitions.
   *
   * @see https://docs.virtuoussoftware.com/#4142c2e4-58af-4e2a-b3ea-a85ccf9d3723
   * @returns {Promise<CustomFieldDefinition[]>} Custom field catalog. May be truncated at 10.
   */
  getContactNoteCustomFields: () =>
    client.get<CustomFieldDefinition[]>('/ContactNote/CustomFields').then((r) => r.data),
});

export default createContactNoteClient;
