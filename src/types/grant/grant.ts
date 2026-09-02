export interface Grant {
  id: number;
  grantUrl?: string;
  giftsAppliedUrl?: string;
  ownerId?: number;
  title?: string;
  grantingOrganizationId?: number;
  grantingOrganizationUrl?: string;
  description?: string;
  referenceId?: string;
  receivingOrganizationId?: number;
  receivingOrganizationUrl?: string;
  projectUrl?: string;
  projectId?: number;
  project?: string;
  dueDateUtc?: string;
  totalAnticipatedAmount?: number;
  status?: string;
  submissionDateUtc?: string;
  anticipatedAwardDateUtc?: string;
  pointOfContactName?: string;
  pointOfContactEmail?: string;
  pointOfContactPhone?: string;
  website?: string;
  awardedGrant?: boolean;
  awardedAmount?: number;
  awardedDateUtc?: string;
  awardTerms?: string;
  grantType?: string;
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

export interface CreateGrantRequest {
  ownerId?: number;
  title: string;
  grantingOrganizationId?: number;
  description?: string;
  referenceId?: string;
  receivingOrganizationId?: number;
  projectId?: number;
  dueDate?: string;
  totalAnticipatedAmount?: number;
  status?: string;
  submissionDate?: string;
  anticipatedAwardDate?: string;
  pointOfContactName?: string;
  pointOfContactEmail?: string;
  pointOfContactPhone?: string;
  website?: string;
  awardedGrant?: boolean;
  awardedAmount?: number;
  awardedDate?: string;
  awardTerms?: string;
  grantType?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface UpdateGrantRequest {
  ownerId?: number;
  title?: string;
  grantingOrganizationId?: number;
  description?: string;
  referenceId?: string;
  receivingOrganizationId?: number;
  projectId?: number;
  dueDate?: string;
  totalAnticipatedAmount?: number;
  status?: string;
  submissionDate?: string;
  anticipatedAwardDate?: string;
  pointOfContactName?: string;
  pointOfContactEmail?: string;
  pointOfContactPhone?: string;
  website?: string;
  awardedGrant?: boolean;
  awardedAmount?: number;
  awardedDate?: string;
  awardTerms?: string;
  grantType?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}
