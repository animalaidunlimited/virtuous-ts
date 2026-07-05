/** Nested reminder object on contact notes (optional). */
export interface ContactNoteReminder {
  id?: number;
  message?: string;
  targetDate?: string;
  targetResolutionDateUtc?: string;
  contactId?: number;
  contactViewUrl?: string;
  contactDisplayName?: string;
  reminderType?: string;
  taskStatus?: string;
  description?: string;
  isPastDue?: boolean;
  isUnresolved?: boolean;
  [key: string]: unknown;
}

/**
 * Contact note returned by Virtuous CRM.
 * @see https://docs.virtuous.org/api-reference/contact-note/gets-the-specified-note
 */
export interface ContactNote {
  id: number;
  contactId: number;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  noteDate?: string;
  type: string;
  note: string;
  important?: boolean;
  isPrivate?: boolean;
  createdByAvatarUrl?: string;
  reminder?: ContactNoteReminder | null;
}