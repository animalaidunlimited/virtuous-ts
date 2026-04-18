export interface RecurringGiftPaymentGift {
    id: number;
    contactId: number;
    giftDate: string; // ISO date
    amount: number;
  }
  
  export interface RecurringGiftPayment {
    id: number;
    gift: RecurringGiftPaymentGift;
    expectedAmount: number;
    expectedPaymentDate: string | null;
    dismissPaymentDate: string | null;
    fulfillPaymentDate: string | null;
  }

  export interface RecurringGiftPaymentListResponse {
    list: RecurringGiftPayment[];
    total: number;
  }