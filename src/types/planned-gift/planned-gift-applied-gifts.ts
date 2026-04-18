import { CurrencyCode } from "../shared/currency-code";
import { CustomField } from "../shared/custom-field";

export interface GiftDesignationApplied {
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
  
  export interface GiftPremiumApplied {
    id: number;
    premiumId: number;
    premium: string;
    premiumUrl: string;
    quantity: number;
    display: string;
    createDateTimeUtc: string;
    createdByUser: string;
    modifiedDateTimeUtc: string;
    modifiedByUser: string;
  }
  
  export interface PledgePaymentApplied {
    id: number;
    expectedPaymentDate: string | null;
    expectedAmount: number;
    giftId: number | null;
    actualAmount: number | null;
  }
  
  export interface RecurringGiftPaymentAppliedGift {
    id: number;
    contactId: number;
    giftDate: string;
    amount: number;
  }
  
  export interface RecurringGiftPaymentApplied {
    id: number;
    gift: RecurringGiftPaymentAppliedGift;
    expectedAmount: number;
    expectedPaymentDate: string | null;
    dismissPaymentDate: string | null;
    fulfillPaymentDate: string | null;
  }
  
  export interface GiftAppliedToPlannedGift {
    id: number;
    transactionSource: string;
    transactionId: string;
    contactId: number;
    contactName: string;
    contactUrl: string;
    giftType: string;
    giftTypeFormatted: string;
    giftDate: string;
    giftDateFormatted: string;
    amount: number;
    amountFormatted: string;
    currencyCode: CurrencyCode;
    exchangeRate: number;
    baseCurrencyCode: CurrencyCode;
    batch: string | null;
    createDateTimeUtc: string;
    createdByUser: string;
    modifiedDateTimeUtc: string;
    modifiedByUser: string;
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
    receiptDateFormatted: string;
    contactPassthroughId: number | null;
    contactPassthroughUrl: string | null;
    contactIndividualId: number | null;
    cashAccountingCode: string | null;
    giftAskId: number | null;
    contactMembershipId: number | null;
    giftDesignations: GiftDesignationApplied[];
    giftPremiums: GiftPremiumApplied[];
    pledgePayments: PledgePaymentApplied[];
    recurringGiftPayments: RecurringGiftPaymentApplied[];
    giftUrl: string;
    isPrivate: boolean;
    isTaxDeductible: boolean;
    customFields: CustomField[];
  }
  
  export type GiftsAppliedToPlannedGiftResponse = GiftAppliedToPlannedGift[];