export interface GiftAsk {
  id: number;
  giftAskUrl?: string;
  giftsAppliedUrl?: string;
  contactId?: number;
  contactUrl?: string;
  askAmount?: number;
  askAmountFormatted?: string;
  askDate?: string;
  askDateFormatted?: string;
  expectedFulfillmentDate?: string;
  expectedFulfillmentDateFormatted?: string;
  notes?: string;
  askType?: string;
  frequency?: string;
  declined?: boolean;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  projectId?: number;
  project?: string;
  projectUrl?: string;
  segmentId?: number;
  segment?: string;
  segmentCode?: string;
  segmentUrl?: string;
  assignedUserId?: number;
  assignedUser?: string;
  secondaryAssignedUser?: string;
  secondaryAssignedUserId?: number;
  status?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface CreateGiftAskRequest {
  contactId: number;
  askAmount: number;
  askDate?: string;
  expectedFulfillmentDate?: string;
  notes?: string;
  askType: string;
  frequency?: string;
  declined?: boolean;
  projectId?: number;
  segmentId?: number;
  assignedUserId?: number;
  secondaryAssignedUserId?: number;
  status?: string;
  customFields?: {
    name?: string;
    value?: string;
  }[];
}

export interface UpdateGiftAskRequest {
  askAmount?: number;
  askDate?: string;
  expectedFulfillmentDate?: string;
  notes?: string;
  askType?: string;
  frequency?: string;
  declined?: boolean;
  projectId?: number;
  segmentId?: number;
  assignedUserId?: number;
  secondaryAssignedUserId?: number;
  status?: string;
  customFields?: {
    name?: string;
    value?: string;
  }[];
}
