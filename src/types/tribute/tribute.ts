export interface Tribute {
  id: number;
  tributeType?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  defaultAcknowledgeeIndividualId?: number;
  defaultAcknowledgeeIndividualUrl?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}

export interface TributeSearchRequest {
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  tributeType?: string;
}

export interface CreateTributeRequest {
  tributeType?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  contactIndividualId?: number;
  defaultAcknowledgeeIndividualId?: number;
}

export interface UpdateTributeRequest {
  tributeType?: string;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  contactIndividualId?: number;
  defaultAcknowledgeeIndividualId?: number;
}
