export interface ContactMethodRecord {
  id: number;
  type: string;
  value: string;
  isOptedIn?: boolean;
  isPrimary?: boolean;
  canBePrimary?: boolean;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}

export interface CreateContactMethodRequest {
  contactIndividualId: number;
  type: string;
  value: string;
  isOptedIn?: boolean;
  setAsPrimary?: boolean;
}

export interface UpdateContactMethodRequest {
  type: string;
  value: string;
  isOptedIn?: boolean;
  setAsPrimary?: boolean;
}
