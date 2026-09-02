export interface ContactTransactionVolunteerAttendance {
  volunteerOpportunityId?: number;
  volunteerOpportunityName?: string;
  date?: string;
  hours?: string | number;
}

/** Body for POST /Contact/Transaction (queued import). */
export interface CreateContactTransactionRequest {
  referenceSource?: string;
  referenceId?: string;
  contactType?: string;
  name?: string;
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  suffix?: string;
  emailType?: string;
  email?: string;
  phoneType?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  eventId?: number;
  eventName?: string;
  invited?: boolean;
  rsvp?: boolean;
  rsvpResponse?: boolean;
  attended?: boolean;
  tags?: string;
  originSegmentCode?: string;
  emailLists?: string[];
  customFields?: Record<string, unknown>;
  volunteerAttendances?: ContactTransactionVolunteerAttendance[];
}

/** Body for POST /Contact/Batch. */
export interface CreateContactImportRequest {
  referenceSource?: string;
  contacts?: CreateContactTransactionRequest[];
}

export interface CustomCollectionDefinitionField {
  dataType?: string;
  name?: string;
  displayName?: string;
  required?: boolean;
  options?: string[];
}

export interface CustomCollectionDefinition {
  id?: number;
  entityType?: string;
  name?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  fields?: CustomCollectionDefinitionField[];
}

export interface CustomCollectionInstanceField {
  name?: string;
  value?: string | number | boolean | null;
}

export interface CreateCustomCollectionInstanceRequest {
  fields?: CustomCollectionInstanceField[];
}

export interface CustomCollectionInstance {
  customCollectionId?: number;
  customCollectionName?: string;
  collectionInstanceId?: number;
  fields?: CustomCollectionInstanceField[];
}
