import { describe, it, expect } from 'vitest';
import { buildGiftQuery, SimpleGiftFilters } from '';
import { Gift, GiftType, GiftFrequency } from '';
import { getSharedContactId, getSharedContactIndividualId, getSharedContactName } from './shared-test-data';
import { createTestClient, generateTransactionId } from './test-helpers';
import { SkipTakeParams } from 'virtuous-ts';

describe('Gift Tests', () => {
  const client = createTestClient();

  let createdGiftObject: Gift | null = null;
  let updatedGift: Gift | null = null;

  it('should create a gift', async () => {
    const transactionId = generateTransactionId();
    const transactionSource = 'API Test';
    const giftType: GiftType = 'Cash';
    const giftAmount = 10;
    const frequency: GiftFrequency = 'OneTime';
    const testNotes = 'This is a test gift from the API';

    const testContactId = getSharedContactId();
    const testContactIndividualId = getSharedContactIndividualId();
    const gift = await client.gift.createGift({
      transactionSource: transactionSource,
      transactionId: transactionId,
      contactId: testContactId,
      contactIndividualId: testContactIndividualId,
      giftType: giftType,
      amount: giftAmount,
      giftDate: new Date().toISOString().split('T')[0],
      frequency: frequency,
      notes: testNotes,
      isPrivate: false,
      isTaxDeductible: true,
    });
    createdGiftObject = gift;
    const testContactName = getSharedContactName();
    console.log('Gift', JSON.stringify(gift, null, 2));
    expect(gift).toBeDefined();
    expect(gift.id).toBeGreaterThan(0);
    expect(gift.contactId).toBe(testContactId);
    expect(gift.contactName).toBe(testContactName);
    expect(gift.giftType).toBe(giftType);
    expect(gift.giftTypeFormatted).toBe(giftType);
    expect(gift.amount).toBe(giftAmount);
    expect(gift.transactionId).toBe(transactionId);
    expect(gift.transactionSource).toBe(transactionSource);
    expect(gift.notes).toBe(testNotes);
    expect(gift.isPrivate).toBe(false);
    expect(gift.isTaxDeductible).toBe(true);
  }, 10000);

  it('should get a gift', async () => {
    if (!createdGiftObject) {
      throw new Error('Created gift is null cannot continue with getGift');
    }

    const giftAmount = createdGiftObject.amount;
    const giftType = createdGiftObject.giftType;
    const testContactId = getSharedContactId();
    const testContactName = getSharedContactName();
    const gift = await client.gift.getGift(createdGiftObject.id);
    expect(gift).toBeDefined();
    expect(gift.id).toBe(createdGiftObject.id);
    expect(gift.amount).toBe(giftAmount);
    expect(gift.giftType).toBe(giftType);
    expect(gift.giftTypeFormatted).toBe(giftType);
    expect(gift.contactId).toBe(testContactId);
    expect(gift.contactName).toBe(testContactName);
  }, 10000);

  it('should get gifts by contact', async () => {
    if (!createdGiftObject) {
      throw new Error('Created gift is null cannot continue with getGiftsByContact');
    }
    const testContactId = getSharedContactId();
    const giftAmount = createdGiftObject.amount;
    const giftType = createdGiftObject.giftType;
    const gifts = await client.gift.getGiftsByContact(testContactId);
    const gift = gifts.list.find((gift) => gift.id === createdGiftObject?.id);
    if (!gift) {
      throw new Error('Gift not found in getGiftsByContact');
    }
    expect(gifts.total).toBeGreaterThan(0);
    expect(gift).toBeDefined();
    expect(gift.id).toBe(createdGiftObject.id);
    expect(gift.amount).toBe('$' + giftAmount + '.00');
    expect(gift.giftType).toBe(giftType);
    expect(gift.contactId).toBe(testContactId);
  }, 10000);

  it('should query gifts', async () => {
    if (!createdGiftObject) {
      throw new Error('Created gift is null cannot continue with queryGifts');
    }

    const giftAmount = createdGiftObject.amount;
    const giftType = createdGiftObject.giftType;
    const testContactId = getSharedContactId();
    const testContactName = getSharedContactName();

    const simpleGiftQueryFilters: SimpleGiftFilters = {
      contactIdIs: testContactId,
      sortBy: 'GiftDate',
      descending: true,
    };

    const skipTakeParams: SkipTakeParams = {
      take: 100,
      skip: 0,
    };

    const gifts = await client.gift.queryGiftsWithFullDetails(
      buildGiftQuery(simpleGiftQueryFilters),
      skipTakeParams,
    );
    const gift = gifts.list.find((gift) => gift.id === createdGiftObject?.id);
    if (!gift) {
      throw new Error('Gift not found in getGiftsByContact');
    }
    expect(gifts.total).toBeGreaterThan(0);
    expect(gifts.list.length).toBeGreaterThan(0);
    expect(gift.contactId).toBe(testContactId);
    expect(gift.contactName).toBe(testContactName);
    expect(gift.giftType).toBe(giftType);
    expect(gift.giftTypeFormatted).toBe(giftType);
    expect(gift.amount).toBe(giftAmount);
    expect(gift.id).toBe(createdGiftObject.id);
  }, 10000);

  it('should get gift query options', async () => {
    const options = await client.gift.getGiftQueryOptions();
    expect(options).toBeDefined();
    expect(options.options.length).toBeGreaterThan(0);
  }, 10000);

  it('should query non cash gift types', async () => {
    const nonCashGiftTypes = await client.gift.getNonCashGiftTypes({
      take: 100,
    });
    console.log('Non Cash Gift Types', JSON.stringify(nonCashGiftTypes, null, 2));
    expect(nonCashGiftTypes).toBeDefined();
    expect(nonCashGiftTypes.total).toBeGreaterThan(0);
    expect(nonCashGiftTypes.list.length).toBeGreaterThan(0);
  }, 10000);

  it('should update a gift Safely', async () => {
    if (!createdGiftObject) {
      throw new Error('Created gift is null cannot continue with updateGiftSafely');
    }

    const updatedGiftObject = await client.gift.updateGiftSafely(createdGiftObject.id, {
      amount: 20.0,
    });
    updatedGift = updatedGiftObject;
    console.log('Gift', JSON.stringify(updatedGiftObject, null, 2));
    expect(updatedGiftObject).toBeDefined();
    expect(updatedGiftObject.id).toBe(createdGiftObject.id);
    expect(updatedGiftObject.amount).toBe(20.0);
  }, 10000);

  it('should delete a gift', async () => {
    if (!updatedGift) {
      throw new Error('Updated gift is null cannot continue with deleteGift');
    }

    // comment out delete test for now. Can manually delete via the GUI
    //const deletedGift = await client.gift.deleteGift(updatedGift.id);
    //expect(deletedGift).toBeUndefined();
  }, 10000);
});
