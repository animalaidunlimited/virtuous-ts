export interface Email {
  id?: number;
  name?: string;
  subject?: string;
  fromName?: string;
  fromEmail?: string;
  html?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}

export interface SendEmailRequest {
  emailId?: number;
  contactIds?: number[];
  personalizations?: {
    contactId?: number;
    mergeFields?: Record<string, unknown>;
  }[];
  sections?: Record<string, unknown>;
}
