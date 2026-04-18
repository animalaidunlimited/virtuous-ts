import { GiftSortBy } from "../gift/gift-params";


export interface SkipTakeParams {
    skip?: number;
    take?: number;
}

export interface GiftListSkipTakeParams extends SkipTakeParams {
    sortBy?: GiftSortBy;
    descending?: boolean;
  }