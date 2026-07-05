/** Gift specification on a Virtuous Project (GET response). */
export interface ProjectGiftSpecification {
  amount?: number;
  frequency?: string;
}

/**
 * Virtuous CRM Project — `GET /api/Project/Code/{projectCode}` and create response.
 * @see https://docs.virtuous.org/api-reference/project/get-project-by-code
 */
export interface Project {
  id?: number;
  name?: string;
  projectCode?: string;
  externalAccountingCode?: string;
  onlineDisplayName?: string;
  description?: string;
  photoUrl?: string | null;
  parentId?: number | null;
  parentName?: string | null;
  isSubProject?: boolean;
  inventoryStatus?: string;
  type?: string;
  location?: string;
  isRestrictedToGiftSpecifications?: boolean;
  isLimitedToFinancialNeed?: boolean;
  isPublic?: boolean;
  isActive?: boolean;
  isAvailableOnline?: boolean;
  isTaxDeductible?: boolean;
  treatAsAccountsPayable?: boolean;
  beginningBalance?: number;
  currentBalance?: number;
  /** Virtuous may return enum label or numeric code depending on tenant/API version. */
  financialNeedType?: string | number;
  financialNeedFrequency?: string;
  financialNeedAmount?: number;
  startDate?: string | null;
  endDate?: string | null;
  durationType?: string;
  lifeToDateGiving?: number;
  lifeToDateGiftCount?: number;
  lifeToDateGiversCount?: number;
  lifeToDateExpenseTotal?: number;
  calendarYearToDateGiving?: number;
  calendarYearToDateGiftCount?: number;
  calendarYearToDateGiversCount?: number;
  calendarYearToDateExpenseTotal?: number;
  createDateTimeUtc?: string;
  createdByUser?: string | null;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string | null;
  giftSpecifications?: ProjectGiftSpecification[];
  customFields?: Record<string, unknown>;
  enableSync?: boolean;
  revenueAccountingCode?: string;
}