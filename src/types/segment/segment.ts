export interface Segment {
  id: number;
  name: string;
  description?: string;
  code?: string;
  communicationId?: number;
  communicationName?: string;
  campaignId?: number;
  campaignName?: string;
  segmentOrganizerId?: number;
}

export interface CreateSegmentRequest {
  name: string;
  code: string;
  communicationId: number;
  description?: string;
  totalContacts?: number;
  contactQueryId?: number;
  costPerContact?: number;
  packageCode?: string;
  packageDescription?: string;
  receiptSegmentId?: number;
  segmentOrganizerId?: number;
}

export interface UpdateSegmentRequest {
  name?: string;
  code?: string;
  description?: string;
  totalContacts?: number;
  contactQueryId?: number;
  costPerContact?: number;
  packageCode?: string;
  packageDescription?: string;
  receiptSegmentId?: number;
  segmentOrganizerId?: number;
}
