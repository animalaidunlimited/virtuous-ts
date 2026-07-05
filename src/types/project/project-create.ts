/**
 * Request body for `POST /api/Project`.
 * @see https://docs.virtuous.org/api-reference/project/create-project
 */
export interface CreateProjectRequest {
  name: string;
  revenueAccountingCode?: string;
  inventoryStatus?: string;
  type?: string;
  onlineDisplayName?: string;
  description?: string;
  durationType?: string;
  financialNeedAmount?: number;
  financialNeedType?: string | number;
  financialNeedFrequency?: string;
  location?: string;
  isPublic?: boolean;
  isActive?: boolean;
  isAvailableOnline?: boolean;
  isLimitedToFinancialNeed?: boolean;
  isTaxDeductible?: boolean;
  treatAsAccountsPayable?: boolean;
  isRestrictedToGiftSpecifications?: boolean;
  enableSync?: boolean;
}

export interface CreateProjectOptions {
  /**
   * Query param `disableWebhookUpdates` on POST Project.
   * @default false — when false, Virtuous may emit webhook updates for the new project.
   */
  disableWebhookUpdates?: boolean;
}