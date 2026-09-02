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
  contactAvatarUrl?: string;
  reminderTypeDisplayName?: string;
  taskStatusDisplayName?: string;
  completeUrl?: string;
}

/**
 * Contact note returned by Virtuous CRM.
 * @see https://docs.virtuoussoftware.com/#e267ff27-b827-486e-8ef1-8b80bfc480c4
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