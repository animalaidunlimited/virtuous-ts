// src/utils/buildGiftQuery.ts

import type { QueryRequest } from '../types/shared/query';
import { CurrencyCode } from '../types/shared/currency-code';
import {
  addDateRangeConditions,
  addRangeConditions,
  addBooleanCondition,
  addArrayCondition,
  addSimpleCondition,
  addContainsCondition,
} from './query-builder-helpers';

export interface SimpleGiftFilters {
  // Date range
  giftDateFrom?: string; // "2023-01-01"
  giftDateTo?: string;
  giftDateYear?: string | number;

  // Amount
  amountMin?: number | string;
  amountMax?: number | string;
  amountIs?: number;

  // Gift basics
  giftTypeIs?: string | string[];
  transactionSourceIs?: string | string[];
  transactionIdIs?: string | string[];
  batchIs?: string | string[];

  // Contact
  contactIdIs?: number | number[];
  contactNameIs?: string;
  contactNameContains?: string;
  contactArchived?: boolean;

  // Project & splits
  projectNameIsAnyOf?: string | string[];
  projectCodeIsAnyOf?: string | string[];
  hasGiftSplits?: boolean;

  // Notes & flags
  notesContain?: string;
  isPrivate?: boolean;
  isTaxDeductible?: boolean;
  hasAttachment?: boolean;

  // Currency & receipt
  currencyCodeIs?: CurrencyCode | CurrencyCode[];
  receiptDateFrom?: string;
  receiptDateTo?: string;
  receiptDateYear?: string | number;

  // Sorting & pagination
  sortBy?: string;
  descending?: boolean;
  skip?: number;
  take?: number;
}

/**
 * Build a gift query request
 * @param filters - The filters to apply to the query
 * @returns The query request
 */
export const buildGiftQuery = (filters: SimpleGiftFilters): QueryRequest => {
  const conditions: QueryRequest['groups'][0]['conditions'] = [];

  // ── GIFT DATE (GreaterThanOrEqual + LessThanOrEqual) ─────────────────────────────────────────────────────────
  addDateRangeConditions(
    conditions,
    'Gift Date',
    filters.giftDateFrom,
    filters.giftDateTo,
    filters.giftDateYear,
  );

  // ── RECEIPT DATE (GreaterThanOrEqual + LessThanOrEqual) ─────────────────────────────────────────────────────────
  addDateRangeConditions(conditions, 'Receipt Date', filters.receiptDateFrom, filters.receiptDateTo, filters.receiptDateYear);

  // ── AMOUNT (GreaterThanOrEqual + LessThanOrEqual) ─────────────────────────────────────────────────────────
  addRangeConditions(conditions, 'Amount', filters.amountMin, filters.amountMax, filters.amountIs);

  // ── GIFT TYPE (Is + multiple values) ─────────────────────────────────────────────────
  if (filters.giftTypeIs) {
    const types = Array.isArray(filters.giftTypeIs) ? filters.giftTypeIs : [filters.giftTypeIs];
    conditions.push({
      parameter: 'Gift Type',
      operator: 'Is',
      values: types,
    });
  }

  // ── Batch (Is) ─────────────────────────────────────────────────────────
  if (filters.batchIs) {
    const batchValue = Array.isArray(filters.batchIs) ? filters.batchIs[0] : filters.batchIs;
    addSimpleCondition(conditions, 'Batch', batchValue);
  }

  // ── Transaction ID (Is) ─────────────────────────────────────────────────────────
  if (filters.transactionIdIs) {
    const transactionIdValue = Array.isArray(filters.transactionIdIs)
      ? filters.transactionIdIs[0]
      : filters.transactionIdIs;
    addSimpleCondition(conditions, 'Transaction Id', transactionIdValue);
  }

  // ── Transaction SOURCE (Is) ─────────────────────────────────────────────────────────
  if (filters.transactionSourceIs) {
    const sourceValue = Array.isArray(filters.transactionSourceIs)
      ? filters.transactionSourceIs[0]
      : filters.transactionSourceIs;
    addSimpleCondition(conditions, 'Transaction Source', sourceValue);
  }

  // ── CONTACT ID (Is) ─────────────────────────────────────────────────────────
  if (filters.contactIdIs) {
    const contactIdValue = Array.isArray(filters.contactIdIs) ? filters.contactIdIs[0] : filters.contactIdIs;
    addSimpleCondition(conditions, 'Contact Id', contactIdValue);
  }

  // ── CONTACT NAME (Contains) ──────────────────────────────────────────────────
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

  // ── CONTACT ARCHIVED (True/False) ──────────────────────────────────────────────
  if (filters.contactArchived !== undefined) {
    addBooleanCondition(conditions, 'Contact Archived', filters.contactArchived);
  }

  // ── PROJECT NAME (IsAnyOf + multiple values) ───────────────
  if (filters.projectNameIsAnyOf) {
    addArrayCondition(conditions, 'Project Name', filters.projectNameIsAnyOf, 'IsAnyOf');
  }

  // ── PROJECT CODE (IsAnyOf + multiple values) ────────────────────
  if (filters.projectCodeIsAnyOf) {
    addArrayCondition(conditions, 'Project Code', filters.projectCodeIsAnyOf, 'IsAnyOf');
  }

  // ── HAS GIFT SPLITS (True/False) ───────────────────────────────────────────────
  if (filters.hasGiftSplits !== undefined) {
    addBooleanCondition(conditions, 'Has Gift Splits', filters.hasGiftSplits);
  }

  // ── NOTES (Contains) ─────────────────────────────────────────────────────────
  if (filters.notesContain) {
    addContainsCondition(conditions, 'Notes', filters.notesContain);
  }

  // ── BOOLEAN FLAGS (True/False) ─────────────────────────────────────────────────
  if (filters.isPrivate !== undefined) {
    addBooleanCondition(conditions, 'Private', filters.isPrivate);
  }

  // ── GIFT TAX-DEDUCTIBLE (True/False) ─────────────────────────────────────────────────
  if (filters.isTaxDeductible !== undefined) {
    addBooleanCondition(conditions, 'Gift Tax-Deductible', filters.isTaxDeductible);
  }

  // ── HAS ATTACHMENT (True/False) ─────────────────────────────────────────────────
  if (filters.hasAttachment !== undefined) {
    addBooleanCondition(conditions, 'Has Attachment', filters.hasAttachment);
  }

  // ── CURRENCY CODE (Is + multiple values) ─────────────────────────────────────────────────
  if (filters.currencyCodeIs) {
    const codes = Array.isArray(filters.currencyCodeIs)
      ? filters.currencyCodeIs.map((c) => String(c))
      : [String(filters.currencyCodeIs)];
    conditions.push({
      parameter: 'Currency Code',
      operator: 'Is',
      values: codes,
    });
  }

  return {
    groups: conditions.length ? [{ conditions }] : [],
    SortBy: filters.sortBy,
    Descending: filters.descending,
  };
};
