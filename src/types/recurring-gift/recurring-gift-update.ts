import { RecurringGiftFrequency } from "../shared/gift-frequency";


export interface RecurringGiftDesignationUpdate {
  projectId: number;
  amountDesignated: number;
}

export interface RecurringGiftCustomFieldUpdate {
  name: string;
  value: string;
  displayName?: string;
}

export interface UpdateRecurringGiftRequest {
  startDate: string;
  frequency: RecurringGiftFrequency;
  amount: number;
  nextExpectedPaymentDate?: string | null;
  anticipatedEndDate?: string | null;
  thankYouDate?: string | null;
  segmentId?: number | null;
  automatedPayments?: boolean;
  trackPayments?: boolean;
  isPrivate?: boolean;
  designations?: RecurringGiftDesignationUpdate[];
  customFields?: RecurringGiftCustomFieldUpdate[];
}