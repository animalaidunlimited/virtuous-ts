import { describe, expect, it } from 'vitest';
import {
  buildCampaignQuery,
  buildContactQuery,
  buildGiftQuery,
  buildPlannedGiftQuery,
  buildProjectQuery,
  buildRecurringGiftQuery,
} from '../../src/index';

describe('query builders', () => {
  it('emits camelCase sortBy and descending', () => {
    const gift = buildGiftQuery({ sortBy: 'Gift Date', descending: true, amountMin: 10 });
    expect(gift).toHaveProperty('sortBy', 'Gift Date');
    expect(gift).toHaveProperty('descending', true);
    expect(gift).not.toHaveProperty('SortBy');
    expect(gift).not.toHaveProperty('Descending');
  });

  it('accepts YYYY-MM-DD gift date ranges', () => {
    const gift = buildGiftQuery({ giftDateFrom: '2025-01-01', giftDateTo: '2025-12-31' });
    const values = gift.groups[0]?.conditions.map((c) => c.value);
    expect(values).toContain('1/1/2025');
    expect(values).toContain('12/31/2025');
  });

  it('builds contact queries with firstNameIs', () => {
    const query = buildContactQuery({ firstNameIs: 'John', sortBy: 'Name' });
    expect(query.groups[0]?.conditions[0]).toMatchObject({
      parameter: 'First Name',
      operator: 'Is',
      value: 'John',
    });
    expect(query.sortBy).toBe('Name');
  });

  it('builds recurring gift queries with recurringGiftDateYear', () => {
    const query = buildRecurringGiftQuery({ recurringGiftDateYear: 2025 });
    expect(query.groups[0]?.conditions.length).toBeGreaterThan(0);
  });

  it('builds planned gift and project queries', () => {
    expect(buildPlannedGiftQuery({ contactIdIs: 1 }).groups[0]?.conditions[0]?.parameter).toBe(
      'Contact Id',
    );
    expect(buildProjectQuery({ nameContains: 'Fund' }).groups[0]?.conditions[0]).toMatchObject({
      parameter: 'Name',
      operator: 'Contains',
      value: 'Fund',
    });
    expect(buildCampaignQuery({ idIs: 9 }).groups[0]?.conditions[0]?.parameter).toBe('Campaign Id');
  });

  it('supports code, type, status, and boolean filters', () => {
    const project = buildProjectQuery({
      codeIs: 'GEN',
      typeIs: 'Program',
      isActive: true,
      isPublic: false,
    });
    const params = project.groups[0]?.conditions.map((c) => c.parameter);
    expect(params).toEqual(expect.arrayContaining(['Project Code', 'Type', 'Active', 'Public']));
    expect(buildCampaignQuery({ isArchived: true }).groups[0]?.conditions[0]).toMatchObject({
      parameter: 'Archived',
      operator: 'IsTrue',
    });
  });
});
