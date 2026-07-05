import type { AxiosInstance } from 'axios';
import type { ContactNote } from '../types/contact-note/contact-note';
import {
  type CreateContactNoteInput,
  toCreateContactNoteWireBody,
} from '../types/contact-note/create-contact-note';

/**
 * Virtuous CRM Contact Note API.
 * @see https://docs.virtuous.org/api-reference/contact-note/creates-a-new-note-for-the-specified-contact
 */
const createContactNoteClient = (client: AxiosInstance) => ({
  /**
   * Create a note on a contact (`POST /ContactNote`).
   * @see https://docs.virtuous.org/api-reference/contact-note/creates-a-new-note-for-the-specified-contact
   * @param {CreateContactNoteInput} input - Note fields (`isPrivate` maps to JSON `private`).
   * @returns {Promise<ContactNote>} The created note.
   * @example
   * import { buildGeneralContactNoteInput } from 'virtuous-ts';
   * const input = buildGeneralContactNoteInput({
   *   contactId: 1,
   *   note: 'Follow-up from web form',
   *   noteDateTime: '2026-01-01T12:00:00Z',
   * });
   * const note = await virtuous.contactNote.createContactNote(input);
   */
  createContactNote: (input: CreateContactNoteInput) =>
    client
      .post<ContactNote>('/ContactNote', toCreateContactNoteWireBody(input))
      .then((r) => r.data),

  /**
   * Get a contact note by id (`GET /ContactNote/{noteId}`).
   * @see https://docs.virtuous.org/api-reference/contact-note/gets-the-specified-note
   * @param {number} noteId - Virtuous contact note id.
   * @returns {Promise<ContactNote>} The note record.
   * @example
   * const note = await virtuous.contactNote.getContactNote(1);
   */
  getContactNote: (noteId: number) =>
    client.get<ContactNote>(`/ContactNote/${noteId}`).then((r) => r.data),
});

export default createContactNoteClient;