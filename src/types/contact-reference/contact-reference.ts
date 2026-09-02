export interface ContactReferenceRecord {
  contactId: number;
  referenceSource: string;
  referenceId: string;
}

export interface CreateContactReferenceRequest {
  contactId: number;
  referenceSource: string;
  referenceId: string;
}
