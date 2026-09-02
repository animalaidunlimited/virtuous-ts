export interface BulkGiftPatch {
  id: number;
  receiptDateUtc?: string;
  segmentId?: number;
  notes?: string;
  customFields?: Record<string, unknown>;
}

export interface CreateReversingTransactionRequest {
  giftDate?: string;
  reversedGiftId: number;
  notes?: string;
}

export interface CreateGiftTransactionsRequest {
  transactionSource: string;
  transactions: import('./gift-transaction-create').CreateGiftTransactionRequest[];
}

export interface GiftDesignationQueryRow {
  id?: number;
  createDate?: string;
  amountDesignated?: number;
  giftId?: number;
  giftDate?: string;
  giftType?: string;
  giftIsPrivate?: boolean;
  giftCustomFields?: Record<string, unknown>;
  giftUrl?: string;
  contactId?: number;
  contactName?: string;
  contactType?: string;
  contactUrl?: string;
  projectId?: number;
  project?: string;
  projectCode?: string;
  projectExternalAccountingCode?: string;
  projectType?: string;
  projectLocation?: string;
  projectCustomFields?: Record<string, unknown>;
  projectUrl?: string;
  parentProjectId?: number;
}
