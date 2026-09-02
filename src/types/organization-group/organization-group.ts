export interface OrganizationGroup {
  id: number;
  organizationGroupUrl?: string;
  organizationId?: number;
  organizationName?: string;
  name?: string;
  location?: string;
  description?: string;
  organizationGroupContactsUrl?: string;
}

export interface OrganizationGroupContact {
  organizationGroupId?: number;
  organizationGroupUrl?: string;
  organizationId?: number;
  organizationName?: string;
  organizationGroupName?: string;
  organizationGroupLocation?: string;
  organizationGroupDescription?: string;
  contactId?: number;
  contactName?: string;
  contactUrl?: string;
}
