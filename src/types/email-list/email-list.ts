import type { SkipTakeParams } from '../shared/skip-take-params';

/**
 * An existing Virtuous email list (`POST /EmailList/Search`).
 * Lists are created in the CRM UI; the API cannot create a list from scratch.
 * @see https://docs.virtuoussoftware.com/#f750634b-e2be-4d49-a472-3e92f51fc382
 */
export interface EmailList {
  emailListId: number;
  name: string | null;
  total: number;
  totalUnsubscribes: number;
}

/**
 * Bulk-queue individuals onto existing email lists (`POST /EmailList`).
 * Returns 202 Accepted; processing can take up to 4 hours. Always send a batch,
 * never one individual at a time.
 * @see https://docs.virtuoussoftware.com/#afe46206-15b4-4f20-914e-1cae07d83246
 */
export interface AddIndividualsToEmailListRequest {
  emailListIds: number[];
  contactIndividualIds: number[];
}

/** Result of a queued bulk add (`202 Accepted`). Membership is not immediate. */
export interface AddIndividualsToEmailListResult {
  accepted: true;
}

/** Body for `POST /EmailList/Search`. */
export interface EmailListSearchBody {
  search: string;
}

/**
 * An email-list membership row for one individual
 * (`GET /ContactIndividual/{contactIndividualId}/EmailList`).
 * @see https://docs.virtuoussoftware.com/#60bf9add-0dcc-47e2-a9a6-5a7201207684
 */
export interface EmailListMembership {
  id: number;
  name: string | null;
  isSubscribed: boolean;
  unsubscribeReason: string | null;
  unsubscribeType: string | null;
  unsubscribeDateTimeUtc: string | null;
  createDateTimeUtc?: string;
  createdByUser?: string | null;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string | null;
}

export interface EmailListSearchResponse {
  list: EmailList[];
  total: number;
}

export interface EmailListMembershipListResponse {
  list: EmailListMembership[];
  total: number;
}

export type EmailListListParams = SkipTakeParams;
