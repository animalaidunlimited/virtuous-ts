
import { RecurringGiftFrequency } from "../shared/gift-frequency";

export interface RecurringGiftDesignation {
    projectId: number;
    project: string;
    projectUrl: string;
    amountDesignated: number;
    projectCode: string;
  }
  
  export interface RecurringGiftCustomField {
    name: string;
    value: string;
    displayName: string;
  }
  
  export interface RecurringGift {
    id: number;
    transactionSource: string;
    transactionId: string;
    contactId: number;
    startDate: string;                    // ISO date string
    amount: number;
    frequency: RecurringGiftFrequency;                    // e.g. "Monthly", "Quarterly"
    anticipatedEndDate: string | null;
    cancelDateTimeUtc: string | null;
    createDateTimeUtc: string;
    createdByUser: string;
    modifiedDateTimeUtc: string;
    modifiedByUser: string;
    segmentId: number | null;
    segment: string | null;
    segmentUrl: string | null;
    automatedPayments: boolean;
    trackPayments: boolean;
    isPrivate: boolean;
    status: string;                       // e.g. "Active", "Cancelled"
    nextExpectedPaymentDate: string | null;
    thankYouDate?: string | null;
    designations: RecurringGiftDesignation[];
    customFields: RecurringGiftCustomField[];
  }
  
  export interface RecurringGiftListResponse {
    list: RecurringGift[];
    total: number;
  }