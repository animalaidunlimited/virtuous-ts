import { describe, expect, it } from 'vitest';
import { validateQuery } from '../../src/utils/validate-query';
import type { QueryOptionsResponse } from '../../src/types/shared/query-options';

const options: QueryOptionsResponse = {
  options: [
    {
      parameter: 'Gift Date',
      type: 'Date',
      operatorOptions: [
        { operator: 'GreaterThan', multipleValuesAllowed: false, valueRequired: true },
        { operator: 'IsAnyOf', multipleValuesAllowed: true, valueRequired: true },
      ],
      valueOptions: [],
    },
    {
      parameter: 'Gift Type',
      type: 'List',
      operatorOptions: [{ operator: 'Is', multipleValuesAllowed: false, valueRequired: true }],
      valueOptions: ['Cash', 'Check'],
    },
  ],
  operatorOptions: [],
};

describe('validateQuery', () => {
  it('flags an unknown parameter and suggests a case-insensitive match', () => {
    const issues = validateQuery(
      { groups: [{ conditions: [{ parameter: 'Gift date', operator: 'GreaterThan', value: '2026-01-01' }] }] },
      options,
    );
    expect(issues).toHaveLength(1);
    expect(issues[0]?.code).toBe('unknown-parameter');
    expect(issues[0]?.suggestion).toBe('Gift Date');
  });

  it('flags an operator that the parameter does not allow', () => {
    const issues = validateQuery(
      { groups: [{ conditions: [{ parameter: 'Gift Date', operator: 'Contains', value: '2026' }] }] },
      options,
    );
    expect(issues[0]?.code).toBe('unknown-operator');
  });

  it('flags a missing required value', () => {
    const issues = validateQuery(
      { groups: [{ conditions: [{ parameter: 'Gift Date', operator: 'GreaterThan' }] }] },
      options,
    );
    expect(issues[0]?.code).toBe('missing-value');
  });

  it('flags values when the operator does not allow multiple values', () => {
    const issues = validateQuery(
      {
        groups: [
          { conditions: [{ parameter: 'Gift Date', operator: 'GreaterThan', values: ['2026-01-01'] }] },
        ],
      },
      options,
    );
    expect(issues.some((issue) => issue.code === 'values-not-allowed')).toBe(true);
  });

  it('flags a value outside valueOptions', () => {
    const issues = validateQuery(
      { groups: [{ conditions: [{ parameter: 'Gift Type', operator: 'Is', value: 'Stock' }] }] },
      options,
    );
    expect(issues[0]?.code).toBe('value-not-in-options');
  });

  it('returns no issues for a valid query', () => {
    const issues = validateQuery(
      {
        groups: [
          {
            conditions: [
              { parameter: 'Gift Date', operator: 'GreaterThan', value: '2026-01-01' },
              { parameter: 'Gift Type', operator: 'Is', value: 'Cash' },
            ],
          },
        ],
      },
      options,
    );
    expect(issues).toEqual([]);
  });
});
