/** Body for PUT /ContactNote/{noteId}. Wire field `private` maps from `isPrivate`. */
export interface UpdateContactNoteRequest {
  type?: string;
  note?: string;
  noteDateTime?: string;
  important?: boolean;
  isPrivate?: boolean;
  timeSpent?: number;
}

export interface CreateNoteFromEmailRequest {
  fromEmail?: string;
  toEmail?: string;
  subject?: string;
  body?: string;
}
