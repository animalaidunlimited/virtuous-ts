/**
 * Input for creating a contact note.
 * `isPrivate` maps to the JSON field `private` on POST /api/ContactNote.
 * @see https://docs.virtuoussoftware.com/
 */
export interface CreateContactNoteInput {
  contactId: number;
  type: string;
  note: string;
  noteDateTime: string;
  important?: boolean;
  isPrivate?: boolean;
  timeSpent?: number;
}

/** Wire body for Virtuous POST /ContactNote (includes reserved `private` key). */
export type CreateContactNoteWireBody = {
  contactId: number;
  type: string;
  note: string;
  noteDateTime: string;
  important: boolean;
  private: boolean;
  timeSpent: number;
};

export function toCreateContactNoteWireBody(
  input: CreateContactNoteInput,
): CreateContactNoteWireBody {
  return {
    contactId: input.contactId,
    type: input.type,
    note: input.note,
    noteDateTime: input.noteDateTime,
    important: input.important ?? false,
    private: input.isPrivate ?? false,
    timeSpent: input.timeSpent ?? 0,
  };
}

/**
 * Defaults for general contact notes (e.g. e-commerce order notes).
 * @see https://docs.virtuoussoftware.com/
 * @param {object} input - `contactId`, `note`, `noteDateTime`, optional `type`.
 * @returns {CreateContactNoteInput} Input for {@link VirtuousClient.contactNote.createContactNote}.
 * @example
 * const input = buildGeneralContactNoteInput({
 *   contactId: 1,
 *   note: 'Order confirmation note',
 *   noteDateTime: '2026-01-01T12:00:00Z',
 * });
 * await virtuous.contactNote.createContactNote(input);
 */
export function buildGeneralContactNoteInput(input: {
  contactId: number;
  note: string;
  noteDateTime: string;
  type?: string;
}): CreateContactNoteInput {
  return {
    contactId: input.contactId,
    type: input.type ?? 'General',
    note: input.note,
    noteDateTime: input.noteDateTime,
    important: false,
    isPrivate: false,
    timeSpent: 0,
  };
}