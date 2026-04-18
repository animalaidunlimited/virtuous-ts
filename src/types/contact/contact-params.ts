import type { SkipTakeParams } from '../shared/skip-take-params';

export type ContactSortBy = 'Id' | 'Name' | 'CreatedDateTime';

export interface ContactListParams extends SkipTakeParams {
  sortBy?: ContactSortBy;
  descending?: boolean;
  filter?: string;
}

export interface EmailAddressOrReferenceSourceAndIdParams {
  email?: string;
  referenceSource?: string;
  referenceId?: string;
}

export interface SearchParams {
    "search": string;
}



export interface EmailSkipTakeParams extends SkipTakeParams {
    email: string;
}

export interface ReferenceSourceAndIdSkipTakeParams extends SkipTakeParams {
    referenceSource: string;
    referenceId: string;
}

export interface GeoCoordinateSearchParams {
    latitude: number;
    longitude: number;
    distanceInMiles: number;
}

export interface ArchiveContactParams {
    reason: string;
}