import type { CustomField } from '../shared/custom-field';

export interface ProjectExpense {
  id: number;
  projectId?: number;
  projectName?: string;
  projectCode?: string;
  parentProjectId?: number;
  parentProjectName?: string;
  parentProjectCode?: string;
  expenseAmount?: number;
  expenseDate?: string;
  accountingCode?: string;
  expenseDescription?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}

export interface CreateProjectExpenseRequest {
  projectId: number;
  expenseAmount: number;
  expenseDate?: string;
  accountingCode?: string;
  expenseDescription?: string;
}

export interface UpdateProjectExpenseRequest {
  expenseAmount?: number;
  expenseDate?: string;
  accountingCode?: string;
  expenseDescription?: string;
}

export interface CreateProjectExpensesBatchRequest {
  projectExpenses?: CreateProjectExpenseRequest[];
}

export interface ProjectNote {
  id?: number;
  projectId?: number;
  type?: string;
  note?: string;
  important?: boolean;
  isPrivate?: boolean;
  contactId?: number;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}

export interface CreateProjectNoteRequest {
  projectId: number;
  type?: string;
  note?: string;
  important?: boolean;
  isPrivate?: boolean;
  contactId?: number;
}

export type UpdateProjectNoteRequest = Omit<CreateProjectNoteRequest, 'projectId'>;

export interface ProjectRole {
  id?: number;
  projectId?: number;
  contactId?: number;
  projectRoleTypeId?: number;
  projectRoleType?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}

export interface CreateProjectRoleRequest {
  projectId: number;
  contactId: number;
  projectRoleTypeId?: number;
}

export interface UpdateProjectRoleRequest {
  projectRoleTypeId?: number;
}

export interface UpdateProjectRequest {
  name?: string;
  projectCode?: string;
  onlineDisplayName?: string;
  description?: string;
  financialNeedAmount?: number;
  beginningBalance?: number;
  currentBalance?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  customFields?: CustomField[] | Record<string, unknown>;
}

export interface BulkProjectPatch {
  id: number;
  name?: string;
  projectCode?: string;
  onlineDisplayName?: string;
  description?: string;
  financialNeedAmount?: number;
  beginningBalance?: number;
  currentBalance?: number;
  type?: string;
  startDate?: string;
  endDate?: string;
  customFields?: Record<string, unknown>;
}

export interface UpdateProjectBalanceRequest {
  beginningBalance?: number;
  currentBalance?: number;
}

export interface UpdateProjectInventoryStatusRequest {
  inventoryStatus?: string;
  durationMinutes?: number;
}

export interface ProjectSearchRequest {
  search: string;
}
