
export type ReceiptType =
  | 'SingleGiftPerReceipt'
  | 'MultipleGiftsPerReceipt';

export type ReceiptMedium =
  | 'Mail'
  | 'Email'
  | 'ReceiptsOnDemand'
  | 'ExternalProcessingCSV';

/** Receipt list item. `emialAddress` is the documented wire field name. */
export interface ReceiptListItem {
  id: number;
  createdDateTimeUtc: string;
  receiptType: ReceiptType;
  receiptMedium: ReceiptMedium;
  emialAddress: string | null;
  emailAddress?: string | null;
  receiptTitle: string | null;
}

export interface ReceiptListResponse {
  list: ReceiptListItem[];
  total: number;
}

export interface ReceiptFileResponse {
    fileStream: string;     
    filePath: string;
    contentType: string;      
  }
  