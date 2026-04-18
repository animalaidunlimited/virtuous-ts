// src/types/gift-update.ts

// Reusable from before
import type { CustomField } from '../shared/custom-field'; // or wherever you keep shared ones
import { GiftType } from './gift-constants';
import { CurrencyCode } from '../shared/currency-code';
import { State } from '../shared/gift-state';

/** Designation when creating/updating a gift */
export interface GiftDesignationUpdate {
  projectId: number;
  amount: number;
  state?: State;
}

/** Premiums (physical thank-you items) */
export interface GiftPremiumUpdate {
  premiumId: number;
  quantity: number;
  state?: State;
}

/** Applying a payment to an existing pledge */
export interface PledgePaymentUpdate {
  id: number;
  amount: number;
  state?: State;
}

/** Applying a payment to a recurring gift schedule */
export interface RecurringGiftPaymentUpdate {
  id: number;
  amount: number;
  state?: State;
}

/** Main request body for PATCH /Gift/{id} */
export interface UpdateGiftRequest {
  // Core fields
  giftType?: GiftType;
  giftDate?: string;                    // ISO datetime, e.g. "2025-04-01T00:00:00Z"
  amount?: number;
  batch?: string | null;
  segmentId?: number | null;
  receiptSegmentId?: number | null;
  mediaOutletId?: number | null;
  notes?: string | null;
  isPrivate?: boolean;
  receiptDate?: string | null;          // ISO datetime
  contactIndividualId?: number | null;
  contactPassthroughId?: number | null;
  cashAccountingCode?: string | null;
  state?: State;                        // rarely used on root, but allowed
  isTaxDeductible?: boolean;

  // Ask / Grant / Membership
  giftAskId?: number | null;
  passthroughGiftAskId?: number | null;
  grantId?: number | null;
  contactMembershipId?: number | null;

  // Currency
  currencyCode?: CurrencyCode | null;
  exchangeRate?: number | null;

  // Payment method details
  checkNumber?: string | null;
  creditCardType?: string | null;

  // Crypto
  cryptocoinType?: string | null;
  transactionHash?: string | null;
  coinSoldForCash?: boolean;
  coinAmount?: number | null;
  dateCoinWasSold?: string | null;
  coinSaleAmount?: number | null;

  // Stock
  tickerSymbol?: string | null;
  numberOfShares?: number | null;
  stockSoldForCash?: boolean;
  dateStockWasSold?: string | null;
  stockSaleAmount?: number | null;

  // IRA / Non-cash
  iraCustodian?: string | null;
  nonCashGiftTypeId?: number | null;
  nonCashGiftType?: string | null;
  description?: string | null;
  nonCashSoldForCash?: boolean;
  dateNonCashWasSold?: string | null;
  nonCashOriginalAmount?: number | null;
  nonCashSaleAmount?: number | null;

  // Tribute / Acknowledgement
  tributeType?: string | null;
  tributeId?: number | null;
  tributeDescription?: string | null;
  acknowledgeeId?: number | null;

  // Collections
  giftDesignations?: GiftDesignationUpdate[];
  giftPremiums?: GiftPremiumUpdate[];
  pledgePayments?: PledgePaymentUpdate[];
  recurringGiftPayments?: RecurringGiftPaymentUpdate[];

  customFields?: CustomField[];
}