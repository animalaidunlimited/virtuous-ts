export interface EventAttendee {
  id: number;
  eventInvitationUrl?: string;
  contactId?: number;
  contactIndividualId?: number;
  invitee?: string;
  contactUrl?: string;
  event?: string;
  eventId?: number;
  eventViewUrl?: string;
  location?: string;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  rsvp?: string;
  attended?: string;
  emailAddress?: string;
  invited?: string;
  emailStatus?: string;
  emailSent?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface CreateEventAttendeeRequest {
  contactIndividualId: number;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface UpdateEventAttendeeRequest {
  invited?: boolean;
  rsvp?: boolean;
  rsvpResponse?: boolean;
  attended?: boolean;
  schedule?: string;
  table?: string;
  meal?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}
