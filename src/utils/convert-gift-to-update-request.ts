import type { Gift } from '../types/gift/gift';
import type { UpdateGiftRequest } from '../types/gift/gift-update';

/**
 * Builds a fully-populated UpdateGiftRequest from a Gift read model.
 *
 * Every editable field on UpdateGiftRequest is mapped explicitly so read/write
 * name differences (e.g. tribute → tributeDescription) cannot silently drop data.
 */
export function convertGiftToUpdateGiftRequest(gift: Gift): UpdateGiftRequest {
  const giftDesignations = gift.giftDesignations ?? [];
  const giftPremiums = gift.giftPremiums ?? [];
  const pledgePayments = gift.pledgePayments ?? [];
  const recurringGiftPayments = gift.recurringGiftPayments ?? [];
  const customFields = gift.customFields ?? [];

  return {
    giftType: gift.giftType,
    giftDate: gift.giftDate,
    amount: gift.amount,
    batch: gift.batch,
    segmentId: gift.segmentId,
    receiptSegmentId: gift.receiptSegmentId ?? null,
    mediaOutletId: gift.mediaOutletId,
    notes: gift.notes,
    isPrivate: gift.isPrivate,
    receiptDate: gift.receiptDate,
    contactIndividualId: gift.contactIndividualId,
    contactPassthroughId: gift.contactPassthroughId,
    cashAccountingCode: gift.cashAccountingCode,
    state: gift.state ?? undefined,
    isTaxDeductible: gift.isTaxDeductible,
    giftAskId: gift.giftAskId,
    passthroughGiftAskId: gift.passthroughGiftAskId ?? null,
    grantId: gift.grantId,
    contactMembershipId: gift.contactMembershipId,
    currencyCode: gift.currencyCode,
    exchangeRate: gift.exchangeRate,
    checkNumber: gift.checkNumber ?? null,
    creditCardType: gift.creditCardType ?? null,
    cryptocoinType: gift.cryptocoinType ?? null,
    transactionHash: gift.transactionHash ?? null,
    coinSoldForCash: gift.coinSoldForCash,
    coinAmount: gift.coinAmount ?? null,
    dateCoinWasSold: gift.dateCoinWasSold ?? null,
    coinSaleAmount: gift.coinSaleAmount ?? null,
    tickerSymbol: gift.tickerSymbol ?? null,
    numberOfShares: gift.numberOfShares ?? null,
    stockSoldForCash: gift.stockSoldForCash,
    dateStockWasSold: gift.dateStockWasSold ?? null,
    stockSaleAmount: gift.stockSaleAmount ?? null,
    iraCustodian: gift.iraCustodian ?? null,
    nonCashGiftTypeId: gift.nonCashGiftTypeId ?? null,
    nonCashGiftType: gift.nonCashGiftType ?? null,
    description: gift.description ?? null,
    nonCashSoldForCash: gift.nonCashSoldForCash,
    dateNonCashWasSold: gift.dateNonCashWasSold ?? null,
    nonCashOriginalAmount: gift.nonCashOriginalAmount ?? null,
    nonCashSaleAmount: gift.nonCashSaleAmount ?? null,
    tributeType: gift.tributeType,
    tributeId: gift.tributeId,
    tributeDescription: gift.tributeDescription ?? gift.tribute ?? null,
    acknowledgeeId: gift.acknowledgeeId ?? gift.acknowledgeeIndividualId ?? null,
    giftDesignations: giftDesignations.map((d) => ({
      projectId: d.projectId,
      amount: d.amountDesignated,
      state: 'Updated',
    })),
    giftPremiums: giftPremiums.map((p) => ({
      premiumId: p.premiumId,
      quantity: p.quantity,
      state: 'Updated',
    })),
    pledgePayments: pledgePayments.map((p) => ({
      id: p.id,
      amount: p.actualAmount ?? p.expectedAmount ?? 0,
      state: 'Updated',
    })),
    recurringGiftPayments: recurringGiftPayments.map((r) => ({
      id: r.id,
      amount: r.gift.amount,
      state: 'Updated',
    })),
    customFields: customFields.map((c) => ({
      name: c.name,
      value: c.value,
      displayName: c.displayName,
    })),
  };
}
