import { GiftType } from "./gift-constants";
import { GiftFrequency, RecurringGiftFrequency } from "../shared/gift-frequency";
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

  /**
   * A single passthrough (soft credit) entry for the `giftPassthroughs` collection.
   * Note: the Virtuous API expects camelCase name fields here (firstName/lastName),
   * which differs from the lowercase fields on the top-level `contact`/`passthroughContact`.
   */
  export interface GiftPassthroughContactInput {
    referenceId?: string | null;
    id?: number | null;
    name?: string | null;
    type?: string | null;
    title?: string | null;
    firstName?: string | null;
    middleName?: string | null;
    lastName?: string | null;
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
    tags?: string | null;
    emailLists?: string[] | null;
  }

  export interface GiftPassthrough {
    contactId?: number | null;
    passthroughContact?: GiftPassthroughContactInput | null;
    amount?: string | number | null;
  }
  
  export interface CreateGiftTransactionRequest {
    // Required core
    transactionSource: string;                    // e.g. "Online Form", "Import", "API"
    transactionId?: string | null;                // your external ID
  
    contact: GiftContactInput;
  
    giftDate: string;                             // ISO date or "YYYY-MM-DD"
    cancelDate?: string | null;                   // for reversing/cancelling a recurring or pledge schedule
    giftType: GiftType;
    amount: string | number;
  
    // Optional but common
    currencyCode?: CurrencyCode | null;
    exchangeRate?: number | null;
    frequency: GiftFrequency;                    // for recurring

    // ── Recurring gift linking ──────────────────
    /**
     * Links this gift to an existing recurring gift commitment by the recurring
     * gift's TransactionId. Use this on subsequent payments (omit `frequency` on
     * those) so Virtuous attaches the payment to the right recurring gift instead
     * of creating a new commitment.
     */
    recurringGiftTransactionId?: string | null;
    /** Set true to update the matched recurring gift commitment from this transaction. */
    recurringGiftTransactionUpdate?: boolean | null;

    // ── Pledge linking ──────────────────────────
    pledgeFrequency?: RecurringGiftFrequency | null;
    pledgeTransactionId?: string | null;
    /** Note: the API field name is misspelled ("Fullfillment"); kept verbatim to match the wire format. */
    pledgeExpectedFullfillmentDate?: string | null;

    batch?: string | null;
    notes?: string | null;
    segment?: string | null;
    mediaOutlet?: string | null;
    receiptDate?: string | null;
    receiptSegment?: string | null;
    cashAccountingCode?: string | null;
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
    /**
     * Multiple passthrough (soft credit) entries. Takes precedence over
     * `passthroughContact` when both are supplied. Max 100 entries, no duplicate contacts.
     */
    giftPassthroughs?: GiftPassthrough[] | null;
    eventAttendee?: EventAttendee | null;
  
    // URLs
    submissionUrl?: string | null;
  }