import { QueryRequest } from '../types/shared/query';
import {
  addDateRangeConditions,
  addRangeConditions,
  addBooleanCondition,
  addArrayCondition,
  addSimpleCondition,
  addContainsCondition,
} from './query-builder-helpers';

export interface SimplePlannedGiftFilters {
  plannedGiftIdIs?: number;
  legacyIdIs?: number;
  createdDateFrom?: string;
  createdDateTo?: string;
  createdDateYear?: string | number;
  anticipatedStartDateFrom?: string;
  anticipatedStartDateTo?: string;
  anticipatedStartDateYear?: string | number;
  anticipatedAmountMin?: number;
  anticipatedAmountMax?: number;
  anticipatedAmountIs?: number;
  contactIdIs?: number;
  legacyContactIdIs?: number;
  contactNameContains?: string;
  contactNameIs?: string;
  contactArchived?: boolean;
  campaignNameContains?: string;
  campaignNameIs?: string;
  frequencyIs?: string;
  frequencyIsNot?: string;
  frequencyIsAnyOf?: string[];

  // Sorting & pagination
  sortBy?: string;
  descending?: boolean;
  skip?: number;
  take?: number;
}

const buildPlannedGiftQuery = (filters: SimplePlannedGiftFilters): QueryRequest => {
  const conditions: QueryRequest['groups'][0]['conditions'] = [];

  if (filters.plannedGiftIdIs) {
    addSimpleCondition(conditions, 'Planned Gift Id', filters.plannedGiftIdIs);
  }
  if (filters.legacyIdIs) {
    addSimpleCondition(conditions, 'Legacy Id', filters.legacyIdIs);
  }
  if (filters.contactIdIs) {
    addSimpleCondition(conditions, 'Contact Id', filters.contactIdIs);
  }
  if (filters.legacyContactIdIs) {
    addSimpleCondition(conditions, 'Legacy Contact Id', filters.legacyContactIdIs);
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

  if (filters.contactArchived !== undefined) {
    addBooleanCondition(conditions, 'Contact Archived', filters.contactArchived);
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

  // ── ANTICIPATED START DATE ─────────────────────────────────────────────────────────
  if (
    filters.anticipatedStartDateFrom ||
    filters.anticipatedStartDateTo ||
    filters.anticipatedStartDateYear
  ) {
    addDateRangeConditions(
      conditions,
      'Anticipated Start Date',
      filters.anticipatedStartDateFrom,
      filters.anticipatedStartDateTo,
      filters.anticipatedStartDateYear,
    );
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
  // ── ANTICIPATED AMOUNT ─────────────────────────────────────────────────────────
  if (filters.anticipatedAmountMin || filters.anticipatedAmountMax || filters.anticipatedAmountIs) {
    addRangeConditions(
      conditions,
      'Anticipated Amount',
      filters.anticipatedAmountMin,
      filters.anticipatedAmountMax,
      filters.anticipatedAmountIs,
    );
  }


  return {
    groups: conditions.length ? [{ conditions }] : [],
    SortBy: filters.sortBy,
    Descending: filters.descending,
  };
};
export { buildPlannedGiftQuery };
