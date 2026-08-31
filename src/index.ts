// src/index.ts

// ── Core ─────────────────────────────────────
export { VirtuousClient } from './virtuous-client';
export type { VirtuousConfig } from './virtuous-client';
export { VirtuousApiError } from './errors/virtuous-api-error';

// ── Gift: Main Types ────────────────────────
export type {
  Gift,
  GiftDesignation,
  GiftSummary,
  GiftSummaryWithDesignations,
  GiftListResponse,
} from './types/gift/gift';

export type { UpdateGiftRequest } from './types/gift/gift-update';
export type {
  CreateGiftTransactionRequest,
  GiftPassthrough,
  GiftPassthroughContactInput,
} from './types/gift/gift-transaction-create';
export type { CreateGiftRequest } from './types/gift/gift-create';

// ── Gift: Query & Search ────────────────────
export type {
  QueryRequest,
} from './types/shared/query';
export type {
  QueryOptionsResponse,
} from './types/shared/query-options';

export type {
  GiftQueryResponse
} from './types/gift/gift-query';

export type { SimpleGiftFilters } from './utils/build-gift-query';
export { buildGiftQuery } from './utils/build-gift-query';
export { convertGiftToUpdateGiftRequest } from './utils/convert-gift-to-update-request';
export { convertRecurringGiftToUpdateRequest } from './utils/convert-recurring-gift-to-update-request';

// ── Gift: Creation Helpers ──────────────────
export type { SimpleDonationForm } from './utils/create-gift-from-form';
export { createGiftFromForm } from './utils/create-gift-from-form';

// ── Gift: Constants ────────────────────────
export type { GiftType } from './types/gift/gift-constants';

export type { GiftFrequency } from './types/shared/gift-frequency';


// ── Contact: Main Types ─────────────────────
export type {
  Contact,
  ContactListResponse,
  ContactAddress,
  ContactAddressFull,
  ContactType,
} from './types/contact/contact';

export type { CreateContactRequest } from './types/contact/contact-create';
export type { UpdateContactRequest } from './types/contact/contact-update';

// ── Contact: Search & Params ────────────────
export type {
  ContactListParams,
  SearchParams as ContactSearchBody,
  GeoCoordinateSearchParams,
  EmailSkipTakeParams,
} from './types/contact/contact-params';

// ── Contact: Creation Helpers ──────────────────
export type { SimpleContactFilters } from './utils/build-contact-query';
export { buildContactQuery } from './utils/build-contact-query';

// ── Contact: Query & Search ────────────────────
export type {
  ContactQueryGeolocationRequest,
  ContactQueryGeolocationResponse,
  ContactQueryGeolocation,
} from './types/contact/contact-geo-location-query';

// ── Recurring Gift: Main Types ─────────────────────
export type {
  RecurringGift,
  RecurringGiftListResponse,
} from './types/recurring-gift/recurring-gift';
export type {
  RecurringGiftCustomFieldListResponse,
} from './types/recurring-gift/recurring-gift-custom-field';
export type {
  RecurringGiftPayment,
  RecurringGiftPaymentListResponse,
} from './types/recurring-gift/recurring-gift-payment';
export type {
  CancelRecurringGiftRequest,
} from './types/recurring-gift/recurring-gift-cancel';
export type {
  UpdateRecurringGiftRequest,
} from './types/recurring-gift/recurring-gift-update';
export type {
  CreateRecurringGiftRequest,
} from './types/recurring-gift/recurring-gift-create';
export type { SimpleRecurringGiftFilters } from './utils/build-recurring-gift-query';
export { buildRecurringGiftQuery } from './utils/build-recurring-gift-query';

// ── Recurring Gift: Constants ────────────────────────
export type { RecurringGiftFrequency } from './types/shared/gift-frequency';



// ── Planned Gift: Main Types ─────────────────────
export type {
  PlannedGift,
  PlannedGiftListResponse,
} from './types/planned-gift/planned-gift';

export type { UpdatePlannedGiftRequest } from './types/planned-gift/planned-gift-update';
export type { CreatePlannedGiftRequest } from './types/planned-gift/planned-gift-create';



// ── Planned Gift: Applied Gifts ─────────────────────
export type { GiftDesignationApplied } from './types/planned-gift/planned-gift-applied-gifts';
export type { GiftPremiumApplied } from './types/planned-gift/planned-gift-applied-gifts';
export type { PledgePaymentApplied } from './types/planned-gift/planned-gift-applied-gifts';
export type { RecurringGiftPaymentApplied } from './types/planned-gift/planned-gift-applied-gifts';
export type { RecurringGiftPaymentAppliedGift } from './types/planned-gift/planned-gift-applied-gifts';
export type { GiftsAppliedToPlannedGiftResponse } from './types/planned-gift/planned-gift-applied-gifts';

// ── Planned Gift: Constants ────────────────────────

export type { PlannedGiftFrequency } from './types/shared/gift-frequency';
export type { PlannedGiftType } from './types/planned-gift/planned-gift-constants';
export type { CurrencyCode } from './types/shared/currency-code';

// ── Planned Gift: Helpers ────────────────────
export type { SimplePlannedGiftFilters } from './utils/build-planned-gift-query';
export { buildPlannedGiftQuery } from './utils/build-planned-gift-query';


// ── Project ───────────────────────────────────
export type { Project, ProjectGiftSpecification } from './types/project/project';
export type {
  CreateProjectRequest,
  CreateProjectOptions,
} from './types/project/project-create';
export { buildAutoCreateProjectRequest } from './utils/build-auto-create-project-request';

// ── Contact Note ──────────────────────────────
export type { ContactNote, ContactNoteReminder } from './types/contact-note/contact-note';
export type { CreateContactNoteInput, CreateContactNoteWireBody } from './types/contact-note/create-contact-note';
export {
  toCreateContactNoteWireBody,
  buildGeneralContactNoteInput,
} from './types/contact-note/create-contact-note';

// ── Contact Tag ───────────────────────────────
export type {
  Tag,
  ContactTag,
  CreateContactTagRequest,
  TagSearchBody,
  TagListResponse,
  ContactTagListResponse,
  TagListParams,
} from './types/contact-tag/contact-tag';

// ── Email List ────────────────────────────────
export type {
  EmailList,
  AddIndividualsToEmailListRequest,
  AddIndividualsToEmailListResult,
  EmailListSearchBody,
  EmailListMembership,
  EmailListSearchResponse,
  EmailListMembershipListResponse,
  EmailListListParams,
} from './types/email-list/email-list';

// ── Audience helpers ──────────────────────────
export type {
  AudienceSkipReason,
  AudienceSkip,
  AddEmailsToTagResult,
  AddEmailsToEmailListResult,
} from './utils/add-emails-to-audience';
export { addEmailsToTag } from './utils/add-emails-to-tag';
export { addEmailsToEmailList } from './utils/add-emails-to-email-list';


// ── Receipts ────────────────────────────────
export type { ReceiptListResponse } from './types/contact/contact-receipts';

// ── Address Operations ──────────────────────
export type {
  CreateContactAddressRequest,
  UpdateContactAddressRequest,
} from './types/contact/contact-address-create';

// ── Errors ──────────────────────────────────
export type { VirtuousApiErrorResponse } from './errors/virtuous-api-error';