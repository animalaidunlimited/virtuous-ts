export interface VolunteerOpportunity {
  id: number;
  name: string;
  url?: string;
  description?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  anytime?: boolean;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  isActive?: boolean;
  isLocalOnly?: boolean;
  currentPriority?: string;
  currentNeed?: number;
  preferredNumberOfHours?: number;
  anywhere?: boolean;
  locationName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal?: number;
  country?: string;
  totalVolunteers?: number;
  totalVolunteerHours?: number;
  currentNeedFilledPercentage?: number;
  hoursFilledPercentage?: number;
  volunteerOrganizers?: {
    id?: number;
    contactId?: number;
    contactIndividualId?: number;
    displayName?: string;
    firstName?: string;
    avatarUrl?: null;
    primaryPhone?: string;
    primaryEmail?: string;
    contactUrl?: string;
    volunteerOrganizerUrl?: string;
    volunteerOpportunityUrl?: string;
  }[];
  volunteerOpportunityUrl?: string;
  volunteerOrganizersUrl?: string;
  volunteersUrl?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface CreateVolunteerOpportunityRequest {
  name: string;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  preferredNumberOfHours?: number;
  projectId?: number;
  locationName?: string;
  description?: string;
  isActive?: boolean;
  isLocalOnly?: boolean;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  preferredDateTime?: string;
  currentPriority?: string;
  currentNeed?: number;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface UpdateVolunteerOpportunityRequest {
  name?: string;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  preferredNumberOfHours?: number;
  projectId?: number;
  locationName?: string;
  description?: string;
  isActive?: boolean;
  isLocalOnly?: boolean;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postal?: string;
  country?: string;
  preferredDateTime?: string;
  currentPriority?: string;
  currentNeed?: number;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}
