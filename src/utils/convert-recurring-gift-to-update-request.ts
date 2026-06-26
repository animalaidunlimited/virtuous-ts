import type { RecurringGift } from '../types/recurring-gift/recurring-gift';
import type { UpdateRecurringGiftRequest } from '../types/recurring-gift/recurring-gift-update';

/** Maps every editable recurring-gift field explicitly — no `...spread` from the read model. */
export function convertRecurringGiftToUpdateRequest(gift: RecurringGift): UpdateRecurringGiftRequest {
  return {
    startDate: gift.startDate,
    frequency: gift.frequency,
    amount: gift.amount,
    nextExpectedPaymentDate: gift.nextExpectedPaymentDate,
    anticipatedEndDate: gift.anticipatedEndDate,
    thankYouDate: gift.thankYouDate ?? null,
    segmentId: gift.segmentId,
    automatedPayments: gift.automatedPayments,
    trackPayments: gift.trackPayments,
    isPrivate: gift.isPrivate,
    designations: gift.designations.map((d) => ({
      projectId: d.projectId,
      amountDesignated: d.amountDesignated,
    })),
    customFields: gift.customFields.map((c) => ({
      name: c.name,
      value: c.value,
      displayName: c.displayName,
    })),
  };
}
