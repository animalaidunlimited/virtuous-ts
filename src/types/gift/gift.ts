import { GiftType } from "./gift-constants";
import { RecurringGiftPayment } from "../recurring-gift/recurring-gift-payment";
import { CurrencyCode } from "../shared/currency-code";
import { CustomField } from "../shared/custom-field";

export interface GiftDesignation {
  id: number;
  projectId: number;
  project: string;
  projectCode: string;
  externalAccountingCode: string | null;
  projectType: string | null;
  projectLocation: string | null;
  projectUrl: string;
  amountDesignated: number;
  display: string;
}

export interface GiftPremium {
  id: number;
  premiumId: number;
  premium: string;
  premiumUrl: string;
  quantity: number;
  display: string;
}

export interface PledgePayment {
  id: number;
  expectedPaymentDate: string | null; // ISO date string
  expectedAmount: number;
  giftId: number;
  actualAmount: number | null;
}

export interface Gift {
  id: number;
  transactionSource: string;
  transactionId: string | null;
  contactId: number;
  contactName: string;
  contactUrl: string;

  giftType: GiftType;
  giftTypeFormatted: string;
  giftDate: string; // ISO datetime
  giftDateFormatted: string;

  amount: number;
  amountFormatted: string;
  currencyCode: CurrencyCode;
  exchangeRate: number | null;
  baseCurrencyCode: CurrencyCode | null;

  batch: string | null;
  createDateTimeUtc: string;
  createdByUser: string | null;
  modifiedDateTimeUtc: string;
  modifiedByUser: string | null;

  segmentId: number | null;
  segment: string | null;
  segmentCode: string | null;
  segmentUrl: string | null;

  mediaOutletId: number | null;
  mediaOutlet: string | null;

  grantId: number | null;
  grant: string | null;
  grantUrl: string | null;

  notes: string | null;
  tribute: string | null;
  tributeId: number | null;
  tributeType: string | null;
  acknowledgeeIndividualId: number | null;

  receiptDate: string | null;
  receiptDateFormatted: string | null;

  contactPassthroughId: number | null;
  contactPassthroughUrl: string | null;
  contactIndividualId: number | null;

  cashAccountingCode: string | null;
  giftAskId: number | null;
  contactMembershipId: number | null;

  giftDesignations: GiftDesignation[];
  giftPremiums: GiftPremium[];
  pledgePayments: PledgePayment[];
  recurringGiftPayments: RecurringGiftPayment[];

  giftUrl: string;
  isPrivate: boolean;
  isTaxDeductible: boolean;

  customFields: CustomField[];
}

export interface GiftSummary {
  id: number;
  contactId: number;
  contactIndividualId: number | null;
  giftType: GiftType;
  giftDate: string; //ISO Date string
  amount: string;
  segment: string | null;
  batch: string | null;
  giftUrl: string;
  culture: string;
  exchangeRate: number | null;
}

/** This is the version returned in list/by-contact endpoints */
export interface GiftSummaryWithDesignations {
  id: number;
  contactId: number;
  contactIndividualId: number | null;

  giftType: GiftType;
  giftDate: string;                 // ISO date string
  amount: string;                    // Virtuous returns as string in list views
  segment: string | null;
  batch: string | null;
  giftUrl: string;

  culture: string;
  exchangeRate: number | null;

  /** The big difference from the minimal summary */
  giftDesignations: GiftDesignation[];
}

/** Response wrapper for paginated gift lists */
export interface GiftListResponse<T extends GiftSummary | Gift | GiftSummaryWithDesignations | NonCashGiftTypes> {
  list: T[];
  total: number;
}

export interface NonCashGiftTypes {
  id: number;
  name: string;
  isEnabled: boolean;
}



