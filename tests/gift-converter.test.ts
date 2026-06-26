import { describe, expect, it } from 'vitest';
import { convertGiftToUpdateGiftRequest } from '../src/utils/convert-gift-to-update-request';
import { convertRecurringGiftToUpdateRequest } from '../src/utils/convert-recurring-gift-to-update-request';
import type { Gift } from '../src/types/gift/gift';
import type { RecurringGift } from '../src/types/recurring-gift/recurring-gift';

describe('convertGiftToUpdateGiftRequest', () => {
  const baseGift: Gift = {
    id: 1,
    transactionSource: 'PayPal',
    transactionId: 'TX1',
    contactId: 10,
    contactName: 'Jane Doe',
    contactUrl: '/Contact/10',
    giftType: 'Cash',
    giftTypeFormatted: 'Cash',
    giftDate: '2025-04-01T00:00:00Z',
    giftDateFormatted: '4/1/2025',
    amount: 100,
    amountFormatted: '$100.00',
    currencyCode: 'USD',
    exchangeRate: null,
    baseCurrencyCode: 'USD',
    batch: 'April',
    createDateTimeUtc: '2025-04-01T00:00:00Z',
    createdByUser: 'api',
    modifiedDateTimeUtc: '2025-04-01T00:00:00Z',
    modifiedByUser: 'api',
    segmentId: 5,
    segment: 'Web',
    segmentCode: 'WEB',
    segmentUrl: '/Segment/5',
    mediaOutletId: null,
    mediaOutlet: null,
    grantId: null,
    grant: null,
    grantUrl: null,
    notes: 'Thank you',
    tribute: 'In memory of Max',
    tributeId: 99,
    tributeType: 'In Memory Of',
    acknowledgeeIndividualId: 42,
    receiptDate: null,
    receiptDateFormatted: null,
    contactPassthroughId: null,
    contactPassthroughUrl: null,
    contactIndividualId: 11,
    cashAccountingCode: 'CASH',
    giftAskId: null,
    contactMembershipId: null,
    giftDesignations: [
      {
        id: 1,
        projectId: 2,
        project: 'Default',
        projectCode: 'Default',
        externalAccountingCode: null,
        projectType: null,
        projectLocation: null,
        projectUrl: '/Project/2',
        amountDesignated: 100,
        display: 'Default $100',
      },
    ],
    giftPremiums: [],
    pledgePayments: [],
    recurringGiftPayments: [],
    giftUrl: '/Gift/1',
    isPrivate: false,
    isTaxDeductible: true,
    customFields: [{ name: 'Source', value: 'PayPal', displayName: 'Source' }],
    checkNumber: '1234',
    tickerSymbol: 'AAPL',
    numberOfShares: 10,
  };

  it('remaps tribute and acknowledgee read fields to update field names', () => {
    const update = convertGiftToUpdateGiftRequest(baseGift);
    expect(update.tributeDescription).toBe('In memory of Max');
    expect(update.acknowledgeeId).toBe(42);
    expect(update).not.toHaveProperty('tribute');
    expect(update).not.toHaveProperty('acknowledgeeIndividualId');
  });

  it('prefers update-shaped field names when the API returns both', () => {
    const update = convertGiftToUpdateGiftRequest({
      ...baseGift,
      tribute: 'legacy tribute text',
      tributeDescription: 'canonical tribute text',
      acknowledgeeIndividualId: 1,
      acknowledgeeId: 2,
    });
    expect(update.tributeDescription).toBe('canonical tribute text');
    expect(update.acknowledgeeId).toBe(2);
  });

  it('maps payment-method and type-specific fields explicitly', () => {
    const update = convertGiftToUpdateGiftRequest(baseGift);
    expect(update.checkNumber).toBe('1234');
    expect(update.tickerSymbol).toBe('AAPL');
    expect(update.numberOfShares).toBe(10);
    expect(update.giftDesignations).toEqual([
      { projectId: 2, amount: 100, state: 'Updated' },
    ]);
    expect(update.customFields).toEqual([
      { name: 'Source', value: 'PayPal', displayName: 'Source' },
    ]);
  });
});

describe('convertRecurringGiftToUpdateRequest', () => {
  it('includes thankYouDate and remaps collections', () => {
    const gift: RecurringGift = {
      id: 1,
      transactionSource: 'PayPal',
      transactionId: 'SUB1',
      contactId: 10,
      startDate: '2025-04-01',
      amount: 50,
      frequency: 'Monthly',
      anticipatedEndDate: null,
      cancelDateTimeUtc: null,
      createDateTimeUtc: '2025-04-01T00:00:00Z',
      createdByUser: 'api',
      modifiedDateTimeUtc: '2025-04-01T00:00:00Z',
      modifiedByUser: 'api',
      segmentId: null,
      segment: null,
      segmentUrl: null,
      automatedPayments: true,
      trackPayments: true,
      isPrivate: false,
      status: 'Active',
      nextExpectedPaymentDate: '2025-05-01',
      thankYouDate: '2025-04-02',
      designations: [
        {
          projectId: 2,
          project: 'Default',
          projectUrl: '/Project/2',
          amountDesignated: 50,
          projectCode: 'Default',
        },
      ],
      customFields: [{ name: 'Source', value: 'PayPal', displayName: 'Source' }],
    };

    const update = convertRecurringGiftToUpdateRequest(gift);
    expect(update.thankYouDate).toBe('2025-04-02');
    expect(update.designations).toEqual([{ projectId: 2, amountDesignated: 50 }]);
    expect(update).not.toHaveProperty('status');
    expect(update).not.toHaveProperty('transactionId');
  });
});
