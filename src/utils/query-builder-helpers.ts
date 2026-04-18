// src/utils/query-builder-helpers.ts

import type { QueryCondition } from '../types/shared/query';
import zod from 'zod';

/**
 * Convert YYYY-MM-DD date string to MM/DD/YYYY format
 * @param date - Date string in YYYY-MM-DD format
 * @returns Date string in MM/DD/YYYY format
 */
export const toVirtuousMMDDYYYY = (date: string): string => {
  const schema = zod.iso.date()
  try {
    schema.parse(date);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid date: ${date} -- ` + error.issues);
    }
    throw error;
  }
  let [y, m, d] = date.split('-');
  m = m.replace(/^0+/, '');
  d = d.replace(/^0+/, '');
  return `${m}/${d}/${y}`;  
};

/**
 * Add date range conditions (GreaterThanOrEqual + LessThanOrEqual)
 * Handles DateFrom, DateTo, and DateYear patterns
 * @param conditions - Array to add conditions to
 * @param parameter - The parameter name (e.g., "Gift Date", "Receipt Date")
 * @param from - Optional date string in YYYY-MM-DD format
 * @param to - Optional date string in YYYY-MM-DD format
 * @param year - Optional year as string or number (e.g. "2025" or 2025)
 */
export const addDateRangeConditions = (
  conditions: QueryCondition[],
  parameter: string,
  from?: string,
  to?: string,
  year?: string | number
): void => {
  if (!from && !to && !year) return;
  if(year && (from || to)) {
    throw new Error(`${parameter}: 'year' cannot be used with 'from' or 'to' dates`);
  }

  let fromDate = '01/01/1900';
  let toDate = '12/31/2100';

  if (year) {
    const yearStr = typeof year === 'number' ? year.toString() : year;
    const schema = zod.string().regex(/^\d{4}$/);
    try {
      schema.parse(yearStr);
    } catch (error) {
      if (error instanceof zod.ZodError) {
        throw new Error(`Invalid year for ${parameter}: ${year} -- ` + error.issues);
      }
      throw error;
    }
    fromDate = `01/01/${yearStr}`;
    toDate = `12/31/${yearStr}`;
  } else {
    if (from) {
      const schema = zod.string().regex(/^\d{2}\/\d{2}\/\d{4}$/);
      try {
        schema.parse(from);
      } catch (error) {
        if (error instanceof zod.ZodError) {
          throw new Error(`Invalid from date for ${parameter}: ${from} -- ` + error.issues);
        }
        throw error;
      }
      fromDate = from;
    }
    if (to) {
      const schema = zod.string().regex(/^\d{2}\/\d{2}\/\d{4}$/);
      try {
        schema.parse(to);
      } catch (error) {
        if (error instanceof zod.ZodError) {
          throw new Error(`Invalid to date for ${parameter}: ${to} -- ` + error.issues);
        }
        throw error;
      }
      toDate = to;
      }
    }
  

  conditions.push({
    parameter,
    operator: 'GreaterThanOrEqual',
    value: fromDate,
    secondaryValue: '',
  });
  conditions.push({
    parameter,
    operator: 'LessThanOrEqual',
    value: toDate,
    secondaryValue: '',
  });
};

/**
 * Add numeric range conditions (GreaterThanOrEqual + LessThanOrEqual)
 * @param conditions - Array to add conditions to
 * @param parameter - The parameter name (e.g., "Amount", "Anticipated Amount")
 * @param min - Optional minimum value
 * @param max - Optional maximum value
 */
export const addRangeConditions = (
  conditions: QueryCondition[],
  parameter: string,
  min?: number | string,
  max?: number | string,
  is?: number | string
): void => {
  if(is && (min || max)) {
    throw new Error(`${parameter}: 'is' cannot be used with 'min' or 'max'`);
  }
  if(is) {
    const schema = zod.coerce.number();
    try {
      schema.parse(is);
    } catch (error) {
      if (error instanceof zod.ZodError) {
        throw new Error(`Invalid is for ${parameter}: ${is} -- ` + error.issues);
      }
      throw error;
    }
    addSimpleCondition(conditions, parameter, is, 'Is');
  } else {
    if (min !== undefined) {
      const schema = zod.coerce.number();
      try {
        schema.parse(min);
      } catch (error) {
        if (error instanceof zod.ZodError) {
          throw new Error(`Invalid min for ${parameter}: ${min} -- ` + error.issues);
        }
        throw error;
      }
      conditions.push({
        parameter,
        operator: 'GreaterThanOrEqual',
        value: String(min),
      });
    }
    if (max !== undefined) {
      const schema = zod.coerce.number();
      try {
        schema.parse(max);
      } catch (error) {
        if (error instanceof zod.ZodError) {
          throw new Error(`Invalid max for ${parameter}: ${max} -- ` + error.issues);
        }
        throw error;
      }
      conditions.push({
        parameter,
        operator: 'LessThanOrEqual',
        value: String(max),
      });
    }
  }
};

/**
 * Add boolean condition (IsTrue or IsFalse)
 * @param conditions - Array to add condition to
 * @param parameter - The parameter name (e.g., "Contact Archived", "Private")
 * @param value - Boolean value
 */
export const addBooleanCondition = (
  conditions: QueryCondition[],
  parameter: string,
  value: boolean
): void => {
  const schema = zod.coerce.boolean();
  try {
    schema.parse(value);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid value for ${parameter}: ${value} -- ` + error.issues);
    }
    throw error;
  }
  conditions.push({
    parameter,
    operator: value ? 'IsTrue' : 'IsFalse',
  });
};

/**
 * Add array condition (In or IsAnyOf)
 * Normalizes single value to array
 * @param conditions - Array to add condition to
 * @param parameter - The parameter name (e.g., "Contact Type", "Gift Type")
 * @param values - Single value or array of values
 * @param operator - Either 'In' or 'IsAnyOf'
 */
export const addArrayCondition = (
  conditions: QueryCondition[],
  parameter: string,
  values: string | string[],
  operator: 'In' | 'IsAnyOf' = 'In'
): void => {
  const normalizedValues = Array.isArray(values) ? values : [values];
  const schema = zod.string().array();
  try {
    schema.parse(normalizedValues);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid values for ${parameter}: ${values} -- ` + error.issues);
    }
    throw error;
  }
  conditions.push({
    parameter,
    operator,
    values: normalizedValues,
  });
};

/**
 * Add simple condition with "Is" operator (or other specified operator)
 * @param conditions - Array to add condition to
 * @param parameter - The parameter name (e.g., "First Name", "Contact Id")
 * @param value - The value to match
 * @param operator - The operator to use (defaults to 'Is')
 */
export const addSimpleCondition = (
  conditions: QueryCondition[],
  parameter: string,
  value: string | number,
  operator: 'Is' | 'IsNot' = 'Is'
): void => {
  const schema = zod.string().or(zod.number());
  try {
    schema.parse(value);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid value for ${parameter}: ${value} -- ` + error.issues);
    }
    throw error;
  }
  conditions.push({
    parameter,
    operator,
    value: String(value),
  });
};

/**
 * Add "Contains" condition
 * @param conditions - Array to add condition to
 * @param parameter - The parameter name (e.g., "Contact Name", "Notes")
 * @param value - The value to search for
 */
export const addContainsCondition = (
  conditions: QueryCondition[],
  parameter: string,
  value: string
): void => {
  const schema = zod.string();
  try {
    schema.parse(value);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid value for ${parameter}: ${value} -- ` + error.issues);
    }
    throw error;
  }
  conditions.push({
    parameter,
    operator: 'Contains',
    value,
  });
};

