export interface Pledge {
  id: number;
  contactId: number;
  amountPledged: number;
  frequency?: string;
  pledgeDate?: string;
  expectedFulfillmentDate?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  segmentId?: number;
  segment?: string;
  projectId?: number;
  project?: string;
  isPrivate?: boolean;
  status?: string;
  payments?: {
    id?: number;
    expectedPaymentDate?: string;
    expectedAmount?: number;
    giftId?: number;
    actualAmount?: number;
  }[];
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface CreatePledgeRequest {
  contactId: number;
  amountPledged: number;
  frequency: string;
  pledgeDate: string;
  expectedFulfillmentDate: string;
  giftAskId?: number;
  segmentId?: number;
  projectId?: number;
  isPrivate: boolean;
  payments?: {
    expectedPaymentDate: string;
    expectedAmount: number;
  }[];
  customFields?: {
    name: string;
    value?: string;
  }[];
}

export interface UpdatePledgeRequest {
  amountPledged: number;
  frequency: string;
  pledgeDate: string;
  expectedFulfillmentDate: string;
  giftAskId?: number;
  segmentId?: number;
  projectId?: number;
  isPrivate: boolean;
  payments?: {
    expectedPaymentDate: string;
    expectedAmount: number;
  }[];
  customFields?: {
    name: string;
    value?: string;
  }[];
}

export interface WriteOffPledgeRequest {
  reason?: string;
}
