import type { SkipTakeParams } from '../shared/skip-take-params';

export type GiftSortBy = 'Id' | 'GiftDate' | 'Amount' | 'Batch' | 'CreatedDateTime';



export interface GiftsForContactByReferenceIdSkipTakeParams extends SkipTakeParams {
    excludeReferenceOriginatedGifts?: boolean;
}
