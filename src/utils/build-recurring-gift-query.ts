import { QueryRequest } from '../types/shared/query';
import {
  addDateRangeConditions,
  addRangeConditions,
  addBooleanCondition,
  addArrayCondition,
  addSimpleCondition,
  addContainsCondition,
} from './query-builder-helpers';

export interface SimpleRecurringGiftFilters {
  recurringGiftIdIs?: number;
  legacyIdIs?: number;
  transactionSourceIs?: string;
  transactionIdIs?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
  createdDateYear?: string | number;
  reccurringGiftDateYear?: string | number;
  recurringGiftDateFrom?: string;
  recurringGiftDateTo?: string;
  startDateFrom?: string;
  startDateTo?: string;
  startDateYear?: string | number;
  amountMin?: number;
  amountMax?: number;
  amountIs?: number;
  convertedAmountMin?: number;
  convertedAmountMax?: number;
  convertedAmountIs?: number;
  frequencyIs?: string;
  frequencyIsNot?: string;
  frequencyIsAnyOf?: string[];
  contactIdIs?: number;
  contactNameContains?: string;
  contactNameIs?: string;
  contactArchived?: boolean;
  projectNameContains?: string;
  projectNameIs?: string;
  projectCodeIs?: string;
  projectCodeContains?: string;
  segmentNameIs?: string;
  segmentNameContains?: string;
  campaignNameIs?: string;
  campaignNameContains?: string;

  // Sorting & pagination
  sortBy?: string;
  descending?: boolean;
  skip?: number;
  take?: number;
}

const buildRecurringGiftQuery = (filters: SimpleRecurringGiftFilters): QueryRequest => {
  const conditions: QueryRequest['groups'][0]['conditions'] = [];

  if (filters.recurringGiftIdIs) {
    addSimpleCondition(conditions, 'Recurring Gift Id', filters.recurringGiftIdIs);
  }
  if (filters.legacyIdIs) {
    addSimpleCondition(conditions, 'Legacy Id', filters.legacyIdIs);
  }
  if (filters.transactionSourceIs) {
    addSimpleCondition(conditions, 'Transaction Source', filters.transactionSourceIs);
  }
  if (filters.transactionIdIs) {
    addSimpleCondition(conditions, 'Transaction Id', filters.transactionIdIs);
  }

  // ── CREATED DATE ─────────────────────────────────────────────────────────
  if (filters.createdDateFrom || filters.createdDateTo || filters.createdDateYear) {
  addDateRangeConditions(
    conditions,
    'Create Date',
      filters.createdDateFrom,
      filters.createdDateTo,
      filters.createdDateYear,
    );
  }

  // ── RECURRING GIFT DATE ─────────────────────────────────────────────────────────
  if (filters.recurringGiftDateFrom || filters.recurringGiftDateTo || filters.reccurringGiftDateYear) {
  addDateRangeConditions(
    conditions,
    'Recurring Gift Date',
    filters.recurringGiftDateFrom,
      filters.recurringGiftDateTo,
      filters.reccurringGiftDateYear,
    );
  }

  // ── START DATE ─────────────────────────────────────────────────────────
  if (filters.startDateFrom || filters.startDateTo || filters.startDateYear) {  
  addDateRangeConditions(
    conditions,
    'Start Date',
    filters.startDateFrom,
    filters.startDateTo,
    filters.startDateYear,
  );
  }
  // ── AMOUNT ─────────────────────────────────────────────────────────
  if (filters.amountIs !== undefined) {
    addSimpleCondition(conditions, 'Amount', filters.amountIs);
  } else if (filters.amountMin || filters.amountMax) {
    addRangeConditions(conditions, 'Amount', filters.amountMin, filters.amountMax);
  }

  // ── CONVERTED AMOUNT ─────────────────────────────────────────────────────────
  if (filters.convertedAmountIs !== undefined) {
    addSimpleCondition(conditions, 'Converted Amount', filters.convertedAmountIs);
  } else if (filters.convertedAmountMin || filters.convertedAmountMax) {
    addRangeConditions(
      conditions,
      'Converted Amount',
      filters.convertedAmountMin,
      filters.convertedAmountMax,
    );
  }

  // ── FREQUENCY (mutually exclusive) ─────────────────────────────────────────────────────────
  const frequencyFiltersCount = [
    filters.frequencyIs,
    filters.frequencyIsNot,
    filters.frequencyIsAnyOf,
  ].filter(Boolean).length;

  if (frequencyFiltersCount > 1) {
    throw new Error(
      'Only one frequency filter can be used at a time. Use frequencyIs, frequencyIsNot, or frequencyIsAnyOf, but not multiple.'
    );
  }

  if (filters.frequencyIs) {
    addSimpleCondition(conditions, 'Frequency', filters.frequencyIs, 'Is');
  } else if (filters.frequencyIsNot) {
    addSimpleCondition(conditions, 'Frequency', filters.frequencyIsNot, 'IsNot');
  } else if (filters.frequencyIsAnyOf) {
    addArrayCondition(conditions, 'Frequency', filters.frequencyIsAnyOf, 'IsAnyOf');
  }

  if (filters.contactIdIs) {
    addSimpleCondition(conditions, 'Contact Id', filters.contactIdIs);
  }

  // ── CONTACT NAME (mutually exclusive) ─────────────────────────────────────────────────────────
  if (filters.contactNameIs && filters.contactNameContains) {
    throw new Error(
      'Only one contact name filter can be used at a time. Use contactNameIs or contactNameContains, but not both.'
    );
  }
  if (filters.contactNameContains) {
    addContainsCondition(conditions, 'Contact Name', filters.contactNameContains);
  } else if (filters.contactNameIs) {
    addSimpleCondition(conditions, 'Contact Name', filters.contactNameIs);
  }

  // ── CONTACT ARCHIVED (Fixed: use IsTrue/IsFalse instead of Is with toString) ──────────────────────────────────────────────
  if (filters.contactArchived !== undefined) {
    addBooleanCondition(conditions, 'Contact Archived', filters.contactArchived);
  }

  // ── PROJECT NAME (mutually exclusive) ─────────────────────────────────────────────────────────
  if (filters.projectNameIs && filters.projectNameContains) {
    throw new Error(
      'Only one project name filter can be used at a time. Use projectNameIs or projectNameContains, but not both.'
    );
  }
  if (filters.projectNameContains) {
    addContainsCondition(conditions, 'Project Name', filters.projectNameContains);
  } else if (filters.projectNameIs) {
    addSimpleCondition(conditions, 'Project Name', filters.projectNameIs);
  }

  // ── PROJECT CODE (mutually exclusive) ─────────────────────────────────────────────────────────
  if (filters.projectCodeIs && filters.projectCodeContains) {
    throw new Error(
      'Only one project code filter can be used at a time. Use projectCodeIs or projectCodeContains, but not both.'
    );
  }
  if (filters.projectCodeContains) {
    addContainsCondition(conditions, 'Project Code', filters.projectCodeContains);
  } else if (filters.projectCodeIs) {
    addSimpleCondition(conditions, 'Project Code', filters.projectCodeIs);
  }

  // ── SEGMENT NAME (mutually exclusive) ─────────────────────────────────────────────────────────
  if (filters.segmentNameIs && filters.segmentNameContains) {
    throw new Error(
      'Only one segment name filter can be used at a time. Use segmentNameIs or segmentNameContains, but not both.'
    );
  }
  if (filters.segmentNameContains) {
    addContainsCondition(conditions, 'Segment Name', filters.segmentNameContains);
  } else if (filters.segmentNameIs) {
    addSimpleCondition(conditions, 'Segment Name', filters.segmentNameIs);
  }

  // ── CAMPAIGN NAME (mutually exclusive) ─────────────────────────────────────────────────────────
  if (filters.campaignNameIs && filters.campaignNameContains) {
    throw new Error(
      'Only one campaign name filter can be used at a time. Use campaignNameIs or campaignNameContains, but not both.'
    );
  }
  if (filters.campaignNameContains) {
    addContainsCondition(conditions, 'Campaign Name', filters.campaignNameContains);
  } else if (filters.campaignNameIs) {
    addSimpleCondition(conditions, 'Campaign Name', filters.campaignNameIs);
  }

  return {
    groups: conditions.length ? [{ conditions }] : [],
    SortBy: filters.sortBy,
    Descending: filters.descending,
  };
};

export { buildRecurringGiftQuery };
