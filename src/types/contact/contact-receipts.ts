

export type ReceiptType =
  | 'SingleGiftPerReceipt'
  | 'MultipleGiftsPerReceipt';

export type ReceiptMedium =
  | 'Mail'
  | 'Email'
  | 'ReceiptsOnDemand'
  | 'ExternalProcessingCSV';

  /**
   * Receipt list item
   * @param id - The ID of the receipt
   * @param createdDateTimeUtc - The date and time the receipt was created
   * @param receiptType - The type of receipt
   * @param receiptMedium - The medium of the receipt
   * @param emialAddress - The email address of the receipt
   * @param receiptTitle - The title of the receipt
   * 
   * The email spelling mistake is intentional.
   */
export interface ReceiptListItem {
  id: number;
  createdDateTimeUtc: string;                    // ISO datetime
  receiptType: ReceiptType;
  receiptMedium: ReceiptMedium;
  emialAddress: string | null;                   // ← yes, they really misspell it!
  // Some versions also return the correctly spelled version:
  // emailAddress?: string | null;
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
  