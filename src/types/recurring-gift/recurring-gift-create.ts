
export type RecurringGiftFrequency =
  | 'Weekly'
  | 'Bimonthly'
  | 'Monthly'
  | 'Quarterly'
  | 'Semiannually'
  | 'Annually'
  | 'Biennially';

export interface RecurringGiftDesignationRequest {
  projectId: number;
  amountDesignated: number;
}

export interface RecurringGiftCustomFieldRequest {
  name: string;
  value: string;
  displayName?: string;  // optional in request
}

export interface CreateRecurringGiftRequest {
  contactId: number;
  startDate: string;                    // ISO date (e.g. "2025-04-01")
  frequency: RecurringGiftFrequency;
  amount: number;
  nextExpectedPaymentDate?: string;     // ISO date
  anticipatedEndDate?: string | null;   // ISO date or null
  thankYouDate?: string | null;         // ISO date or null
  segmentId?: number | null;
  automatedPayments?: boolean;
  trackPayments?: boolean;
  isPrivate?: boolean;
  designations?: RecurringGiftDesignationRequest[];
  customFields?: RecurringGiftCustomFieldRequest[];
}