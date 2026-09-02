export interface EventContact {
  id?: number;
  eventContactUrl?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  contactId?: number;
  contactUrl?: string;
  displayName?: string;
  firstName?: string;
  avatarUrl?: string;
  primaryPhone?: string;
  primaryEmail?: string;
}

export interface CreateEventContactRequest {
  contactIndividualId?: number;
}
