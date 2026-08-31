import type { SkipTakeParams } from '../shared/skip-take-params';

/**
 * Tag definition in the organization catalog (`GET /Tag`, `POST /Tag/Search`).
 * Tags are created in the Virtuous CRM UI, not through the API.
 * @see https://docs.virtuoussoftware.com/#48163372-9904-49d5-ad59-a0f039284245
 */
export interface Tag {
  id: number;
  tagName: string | null;
  tagGroupName: string | null;
  contactsByTagUrl: string | null;
}

/**
 * A tag applied to a contact (`POST /ContactTag`, `GET /ContactTag/ByContact/{contactId}`).
 * `contactTagId` identifies the application; `tagId` identifies the catalog tag.
 * @see https://docs.virtuoussoftware.com/#c3156a7f-2480-48ac-8f6a-0a21b58defc5
 */
export interface ContactTag {
  contactTagId: number;
  tagId: number;
  name: string | null;
  total: number;
  createDateTimeUtc?: string;
  createdByUser?: string | null;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string | null;
  contactsByTagUrl?: string | null;
}

/** Body for applying an existing tag to a contact. */
export interface CreateContactTagRequest {
  tagId: number;
  contactId: number;
}

/** Body for `POST /Tag/Search`. */
export interface TagSearchBody {
  search: string;
}

export interface TagListResponse {
  list: Tag[];
  total: number;
}

export interface ContactTagListResponse {
  list: ContactTag[];
  total: number;
}

export type TagListParams = SkipTakeParams;
