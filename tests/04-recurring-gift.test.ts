import { describe, it, expect } from 'vitest';
import { getSharedContactId } from './shared-test-data';
import { createTestClient } from './test-helpers';
import { buildRecurringGiftQuery } from 'virtuous-ts';

describe('Recurring Gift Tests', () => {
  const client = createTestClient();

  it('should get recurring gifts for a contact', async () => {
    const testContactId = getSharedContactId();
    const recurringGifts = await client.recurringGift.getRecurringGiftsForContact(testContactId);
    expect(recurringGifts).toBeDefined();
    expect(recurringGifts.total).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(recurringGifts.list)).toBe(true);
  });

  it('should query recurring gifts', async () => {
    const testContactId = getSharedContactId();
    const recurringGifts = await client.recurringGift.queryRecurringGifts(buildRecurringGiftQuery({
      contactIdIs: testContactId,
      sortBy: 'StartDate',
      descending: true,
    }), {
      take: 100,
      skip: 0,
    });
    expect(recurringGifts).toBeDefined();
    expect(recurringGifts.total).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(recurringGifts.list)).toBe(true);
  });

  it('should get recurring gift query options', async () => {
    const options = await client.recurringGift.getRecurringGiftQueryOptions();
    expect(options).toBeDefined();
    expect(options.options.length).toBeGreaterThan(0);
  });
});
