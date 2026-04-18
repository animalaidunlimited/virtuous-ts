import { GiftType } from "./gift-constants";
import { CustomField } from "../shared/custom-field";
import { CurrencyCode } from "../shared/currency-code";
import { State } from "../shared/gift-state";
;

export type TributeType = 'In Honor Of' | 'In Memory Of';

export interface GiftDesignationRequest {
projectId: number;
amount: number;
state?: State | null;
}

export interface GiftPremiumRequest {
premiumId: number;
quantity: number;
state?: State | null;
}

export interface PledgePaymentRequest {
id: number;
amount: number;
state?: State | null;
}

export interface RecurringGiftPaymentRequest {
id: number;
paymentId: string;  // format: "RecurringGiftPayment-<id>"
amount: number;
state?: State | null;
}


export interface CreateGiftRequest {
contactId: number;
giftType: GiftType;
giftDate: string;                     // ISO date "2025-04-05"
amount: number;
transactionSource: string;
transactionId?: string | null;
batch?: string | null;
segmentId?: number | null;
receiptSegmentId?: number | null;
mediaOutletId?: number | null;
notes?: string | null;
isPrivate?: boolean;
receiptDate?: string | null;
contactIndividualId?: number | null;
contactPassthroughId?: number | null;
cashAccountingCode?: string | null;
state?: State | null;
isTaxDeductible?: boolean;
giftAskId?: number | null;
passthroughGiftAskId?: number | null;
grantId?: number | null;
contactMembershipId?: number | null;
currencyCode?: CurrencyCode | null;
exchangeRate?: number | null;
checkNumber?: string | null;
creditCardType?: string | null;
cryptocoinType?: string | null;
transactionHash?: string | null;
coinSoldForCash?: boolean;
coinAmount?: number | null;
dateCoinWasSold?: string | null;
coinSaleAmount?: number | null;
tickerSymbol?: string | null;
numberOfShares?: number | null;
iraCustodian?: string | null;
stockSoldForCash?: boolean;
dateStockWasSold?: string | null;
stockSaleAmount?: number | null;
nonCashGiftTypeId?: number | null;
nonCashGiftType?: string | null;
description?: string | null;
nonCashSoldForCash?: boolean;
dateNonCashWasSold?: string | null;
nonCashOriginalAmount?: number | null;
nonCashSaleAmount?: number | null;

// Collections
giftDesignations?: GiftDesignationRequest[];
giftPremiums?: GiftPremiumRequest[];
pledgePayments?: PledgePaymentRequest[];
recurringGiftPayments?: RecurringGiftPaymentRequest[];

// Tribute
tributeType?: TributeType | null;
tributeId?: number | null;
tributeDescription?: string | null;
acknowledgeeId?: number | null;

// Reversing
reversedGiftId?: number | null;

// Custom fields
customFields?: CustomField[];
}