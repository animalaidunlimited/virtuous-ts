import { describe, it, expect } from 'vitest';
import { PlannedGift } from '';
import { buildPlannedGiftQuery } from '';
import { VirtuousApiError } from '';
import { PlannedGiftFrequency, CurrencyCode, PlannedGiftType } from '';
import { toVirtuousMMDDYYYY } from 'virtuous-ts';
import { getSharedContactId, getSharedContactIndividualId } from './shared-test-data';
import { createTestClient, generateTransactionId } from './test-helpers';

describe('Planned Gift Tests', () => {
  const client = createTestClient();

  let plannedGiftObject: PlannedGift | null = null;
  let updatedPlannedGift: PlannedGift | null = null;

  const plannedGiftDate = new Date().toISOString().split('T')[0];

  it('should get planned gift query options', async () => {
    const options = await client.plannedGift.getPlannedGiftQueryOptions();
    console.log('Planned Gift Query Options', JSON.stringify(options, null, 2));
    expect(options).toBeDefined();
    expect(options.options.length).toBeGreaterThan(0);
  });

  it('should create a planned gift', async () => {
    const plannedGiftAmount = 10;
    const plannedGiftFrequency: PlannedGiftFrequency = 'Once';
    const plannedGiftType: PlannedGiftType = 'WillAndBequest';
    const plannedGiftNumberOfOccurrences = 1;
    const plannedGiftCurrentValue = 10;
    const plannedGiftCurrencyCode: CurrencyCode = 'USD';
    const transactionSource = 'API Test';
    const transactionId = generateTransactionId();
    const testNotes = 'This is a test gift from the API';
    const testContactId = getSharedContactId();
    const testIndividualId = getSharedContactIndividualId();

    try {
      plannedGiftObject = await client.plannedGift.createPlannedGift({
        transactionSource: transactionSource,
        transactionId: transactionId,
        contactId: testContactId,
        plannedGiftDate: plannedGiftDate,
        plannedGiftType: plannedGiftType,
        frequency: plannedGiftFrequency,
        anticipatedAmount: plannedGiftAmount,
        currencyCode: plannedGiftCurrencyCode,
        numberOfOccurrences: plannedGiftNumberOfOccurrences,
        currentValue: plannedGiftCurrentValue,
        contactIndividualId: testIndividualId,
        notes: testNotes,
      });
    } catch (error) {
      if (error instanceof VirtuousApiError) {
        console.error('VirtuousError Details:');
        console.error('  Status:', error.status);
        console.error('  Message:', error.message);
        console.error('  Details:', error.details);
        console.error('  Data:', JSON.stringify(error.data, null, 2));
        console.error('  Code:', error.code);
        console.error('  Validation Errors:', JSON.stringify(error.validationErrors, null, 2));
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
    if (!plannedGiftObject) {
      throw new Error('Created planned gift is null cannot continue with createPlannedGift');
    }

    console.log('Planned Gift', JSON.stringify(plannedGiftObject, null, 2));
    expect(plannedGiftObject).toBeDefined();
    expect(plannedGiftObject.id).toBeGreaterThan(0);
    expect(plannedGiftObject.contactId).toBe(testContactId);
    expect(plannedGiftObject.plannedGiftDate).toBe(toVirtuousMMDDYYYY(plannedGiftDate));
    expect(plannedGiftObject.frequency).toBe(plannedGiftFrequency);
    expect(plannedGiftObject.anticipatedAmount).toBe('$' + plannedGiftAmount + '.00');
  });

  it('should get a planned gift', async () => {
    if (!plannedGiftObject) {
      throw new Error('Created planned gift is null cannot continue with getPlannedGiftById');
    }
    const testContactId = getSharedContactId();
    const plannedGift = await client.plannedGift.getPlannedGiftById(plannedGiftObject.id);
    console.log('Planned Gift', JSON.stringify(plannedGift, null, 2));
    expect(plannedGift).toBeDefined();
    expect(plannedGift.id).toBe(plannedGiftObject.id);
    expect(plannedGift.contactId).toBe(testContactId);
    expect(plannedGift.plannedGiftDate).toBe(toVirtuousMMDDYYYY(plannedGiftDate));
  });

  it('should get planned gifts for a contact', async () => {
    if (!plannedGiftObject) {
      throw new Error('Created planned gift is null cannot continue with getPlannedGiftsForContact');
    }

    const testContactId = getSharedContactId();

    const plannedGifts = await client.plannedGift.getPlannedGiftsForContact(testContactId);
    console.log('Planned Gifts', JSON.stringify(plannedGifts, null, 2));
    expect(plannedGifts).toBeDefined();
    expect(plannedGifts.total).toBeGreaterThan(0);
    expect(plannedGifts.list.length).toBeGreaterThan(0);
  });

  it('should query planned gifts', async () => {
    if (!plannedGiftObject) {
      throw new Error('Created planned gift is null cannot continue with queryPlannedGifts');
    }
    const testContactId = getSharedContactId();
    const plannedGifts = await client.plannedGift.queryPlannedGifts(
      buildPlannedGiftQuery({
        contactIdIs: testContactId,
        sortBy: 'PlannedGiftDate',
        descending: true,
      }),
    );
    console.log('Planned Gifts', JSON.stringify(plannedGifts, null, 2));
    expect(plannedGifts).toBeDefined();
    expect(plannedGifts.total).toBeGreaterThan(0);
    expect(plannedGifts.list.length).toBeGreaterThan(0);
  });

  it('should update a planned gift', async () => {
    if (!plannedGiftObject) {
      throw new Error('Created planned gift is null cannot continue with updatePlannedGiftSafely');
    }

    const plannedGiftUpdatedAmount = 11;

    updatedPlannedGift = await client.plannedGift.updatePlannedGiftSafely(plannedGiftObject.id, {
      anticipatedAmount: plannedGiftUpdatedAmount,
    });
    if (!updatedPlannedGift) {
      throw new Error('Updated planned gift is null cannot continue with updatePlannedGiftSafely');
    }
    console.log('Updated Planned Gift', JSON.stringify(updatedPlannedGift, null, 2));
    expect(updatedPlannedGift).not.toBeNull();
    expect(updatedPlannedGift).toBeDefined();
    expect(updatedPlannedGift.anticipatedAmount).toBe('$' + plannedGiftUpdatedAmount + '.00');
  });
});
