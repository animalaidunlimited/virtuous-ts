import { GiftType } from "./gift-constants";
import { GiftFrequency } from "../shared/gift-frequency";
import { CurrencyCode } from "../shared/currency-code";

export interface GiftContactInput {
    referenceId?: string | null;
    id?: number | null;
    name?: string | null;
    type?: string | null;
    title?: string | null;
    firstname?: string | null;
    middlename?: string | null;
    lastname?: string | null;
    suffix?: string | null;
    birthMonth?: string | null;
    birthDay?: string | null;
    birthYear?: string | null;
    gender?: string | null;
  
    emailType?: string | null;
    email?: string | null;
    phoneType?: string | null;
    phone?: string | null;
  
    address?: {
      address1?: string | null;
      address2?: string | null;
      city?: string | null;
      state?: string | null;
      postal?: string | null;
      country?: string | null;
    } | null;
  
    tags?: string | null;                    // comma-separated?
    emailLists?: string[] | null;
  }
  
  export interface GiftDesignationInput {
    id?: number | null;
    name?: string | null;
    code?: string | null;
    amountDesignated: string | number;
  }
  
  export interface GiftPremiumInput {
    id?: number | null;
    name?: string | null;
    code?: string | null;
    quantity: string | number;
  }
  
  export interface TributeDedication {
    tributeId?: number | null;
    tributeType?: string | null;
    tributeFirstName?: string | null;
    tributeLastName?: string | null;
    tributeCity?: string | null;
    tributeState?: string | null;
    acknowledgeeIndividualId?: number | null;
    acknowledgeeFirstName?: string | null;
    acknowledgeeLastName?: string | null;
    acknowledgeeAddress?: string | null;
    acknowledgeeCity?: string | null;
    acknowledgeeState?: string | null;
    acknowledgeePostal?: string | null;
    acknowledgeeEmail?: string | null;
    acknowledgeePhone?: string | null;
  }
  
  export interface EventAttendee {
    eventId?: number | null;
    eventName?: string | null;
    invited?: boolean;
    rsvp?: boolean;
    rsvpResponse?: boolean;
    attended?: boolean;
  }
  
  export interface CreateGiftTransactionRequest {
    // Required core
    transactionSource: string;                    // e.g. "Online Form", "Import", "API"
    transactionId?: string | null;                // your external ID
  
    contact: GiftContactInput;
  
    giftDate: string;                             // ISO date or "YYYY-MM-DD"
    giftType: GiftType;
    amount: string | number;
  
    // Optional but common
    currencyCode?: CurrencyCode | null;
    exchangeRate?: number | null;
    frequency: GiftFrequency;                    // for recurring
    batch?: string | null;
    notes?: string | null;
    segment?: string | null;
    mediaOutlet?: string | null;
    receiptDate?: string | null;
    receiptSegment?: string | null;
    isPrivate?: boolean;
    isTaxDeductible?: boolean;
  
    // Payment method
    checkNumber?: string | null;
    creditCardType?: string | null;
  
    // Non-cash
    nonCashGiftTypeId?: number | null;
    nonCashGiftType?: string | null;
    nonCashGiftDescription?: string | null;
    stockTickerSymbol?: string | null;
    stockNumberOfShares?: number | null;
    iraCustodian?: string | null;
  
    // Tribute
    tribute?: string | null;
    tributeDedication?: TributeDedication | null;
  
    // Designations & premiums
    designations?: GiftDesignationInput[];
    premiums?: GiftPremiumInput[];
  
    // Custom fields (as object or array — Virtuous accepts both)
    customFields?: Record<string, string | number | boolean |null> | null;
    customObjects?: Array<{
      name: string;
      fields: Array<{ name: string; value: string }>;
    }> | null;
  
    // Passthrough / event
    contactIndividualId?: number | null;
    passthroughContact?: GiftContactInput | null;
    eventAttendee?: EventAttendee | null;
  
    // URLs
    submissionUrl?: string | null;
  }