/** Catalog row from `GET /Event/Types`. */
export interface EventType {
  id: number;
  name: string;
  isEnabled: boolean;
}

export interface Event {
  id: number;
  eventViewUrl?: string;
  name: string;
  eventType?: string;
  locationName?: string;
  displayAddress?: string;
  geocodeAddress?: string;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  description?: string;
  specialInstructions?: string;
  inviteOnly?: boolean;
  rsvpRequired?: boolean;
  totalInvites?: number;
  totalRsvps?: number;
  totalAttended?: number;
  totalGifts?: number;
  totalGiving?: string;
  communicationId?: number;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  eventContactsUrl?: string;
  generosityEventContacts?: {
    id?: number;
    eventContactUrl?: string;
    contactId?: number;
    contactUrl?: string;
    displayName?: string;
    firstName?: string;
    avatarUrl?: string;
    primaryPhone?: string;
    primaryEmail?: string;
  }[];
  tables?: string[];
  meals?: string[];
  eventInvitationsUrl?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface CreateEventRequest {
  name: string;
  eventType?: string;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  communicationId?: number;
  locationName?: string;
  description?: string;
  specialInstructions?: string;
  inviteOnly?: boolean;
  rsvpRequired?: boolean;
  tables?: string[];
  meals?: string[];
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  eventbriteId?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface UpdateEventRequest {
  name?: string;
  eventType?: string;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  communicationId?: number;
  locationName?: string;
  description?: string;
  specialInstructions?: string;
  inviteOnly?: boolean;
  rsvpRequired?: boolean;
  tables?: string[];
  meals?: string[];
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  eventbriteId?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}
