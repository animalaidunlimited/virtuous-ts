export interface Webhook {
  id: number;
  payloadUrl: string;
  secret?: string;
  contactCreate?: boolean;
  contactUpdate?: boolean;
  giftCreate?: boolean;
  giftUpdate?: boolean;
  giftDelete?: boolean;
  projectCreate?: boolean;
  projectUpdate?: boolean;
  projectDelete?: boolean;
  formSubmission?: boolean;
  contactNoteCreate?: boolean;
  contactNoteUpdate?: boolean;
  contactNoteDelete?: boolean;
  eventCreate?: boolean;
  eventUpdate?: boolean;
  eventDelete?: boolean;
  active?: boolean;
}

export interface CreateWebhookRequest {
  payloadUrl: string;
  secret?: string;
  contactCreate?: boolean;
  contactUpdate?: boolean;
  giftCreate?: boolean;
  giftUpdate?: boolean;
  giftDelete?: boolean;
  projectCreate?: boolean;
  projectUpdate?: boolean;
  projectDelete?: boolean;
  formSubmission?: boolean;
  contactNoteCreate?: boolean;
  contactNoteUpdate?: boolean;
  contactNoteDelete?: boolean;
  eventCreate?: boolean;
  eventUpdate?: boolean;
  eventDelete?: boolean;
  active?: boolean;
}

export interface UpdateWebhookRequest {
  payloadUrl: string;
  secret?: string;
  contactCreate?: boolean;
  contactUpdate?: boolean;
  giftCreate?: boolean;
  giftUpdate?: boolean;
  giftDelete?: boolean;
  projectCreate?: boolean;
  projectUpdate?: boolean;
  projectDelete?: boolean;
  formSubmission?: boolean;
  contactNoteCreate?: boolean;
  contactNoteUpdate?: boolean;
  contactNoteDelete?: boolean;
  eventCreate?: boolean;
  eventUpdate?: boolean;
  eventDelete?: boolean;
  active?: boolean;
}
