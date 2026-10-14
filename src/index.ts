// src/index.ts

export { VirtuousClient, DEFAULT_BASE_URL } from './virtuous-client';
export type { VirtuousConfig } from './virtuous-client';
export { VirtuousApiError } from './errors/virtuous-api-error';
export type { VirtuousApiErrorResponse } from './errors/virtuous-api-error';

export { VirtuousRateLimitError } from './http/rate-limit';
export type { RateLimitStatus } from './http/rate-limit';
export type { RetryOptions } from './http/retry';
export { queryAll } from './utils/query-all';
export type { QueryAllOptions, QueryAllResult } from './utils/query-all';
export { listAll } from './utils/list-all';
export type { ListAllOptions, ListAllResult } from './utils/list-all';
export { validateQuery, VirtuousQueryValidationError } from './utils/validate-query';
export type { QueryValidationIssue } from './utils/validate-query';

export type { ListResponse } from './types/shared/list-response';
export type { QueryRequest, QueryGroup, QueryCondition, QueryOperator } from './types/shared/query';
export type { QueryOptionsResponse, QueryParameterOption, QueryOperatorOption } from './types/shared/query-options';
export type { CustomField } from './types/shared/custom-field';
export type { CustomFieldDefinition } from './types/shared/custom-field-definition';
export type { SearchRequest } from './types/shared/search-request';
export type { QueuedImportResponse } from './types/shared/queued-import';
export type { SkipTakeParams, GiftListSkipTakeParams } from './types/shared/skip-take-params';
export type { CurrencyCode } from './types/shared/currency-code';
export type { GiftFrequency, RecurringGiftFrequency, PlannedGiftFrequency } from './types/shared/gift-frequency';

export type { OAuthTokenRequest, OAuthTokenResponse, Organization, Permission, SwitchOrganizationRequest } from './types/account/account';
export type { Campaign } from './types/campaign/campaign';
export type { Communication, CreateCommunicationRequest } from './types/communication/communication';
export type { FollowedContactActivity } from './types/contact/contact-activity';
export type { CreateContactAddressRequest, UpdateContactAddressRequest } from './types/contact/contact-address-create';
export type { ContactAddressCreateRequest, CreateContactIndividualRequest, CreateContactRequest } from './types/contact/contact-create';
export type { ArchiveContactParams, ContactListParams, ContactSortBy, EmailAddressOrReferenceSourceAndIdParams, EmailSkipTakeParams, GeoCoordinateSearchParams, ReferenceSourceAndIdSkipTakeParams, SearchParams } from './types/contact/contact-params';
export type { ReceiptFileResponse, ReceiptListItem, ReceiptListResponse, ReceiptMedium, ReceiptType } from './types/contact/contact-receipts';
export type { ContactAddressBase, ContactIndividualBase, ContactMethodBase, CustomCollectionFieldRead, CustomCollectionFieldWrite, CustomCollectionRead, CustomCollectionWrite } from './types/contact/contact-shared';
export type { ContactTransactionVolunteerAttendance, CreateContactImportRequest, CreateContactTransactionRequest, CreateCustomCollectionInstanceRequest, CustomCollectionDefinition, CustomCollectionDefinitionField, CustomCollectionInstance, CustomCollectionInstanceField } from './types/contact/contact-transaction';
export type { UpdateContactRequest } from './types/contact/contact-update';
export type { Contact, ContactAddress, ContactAddressFull, ContactIndividual, ContactListItem, ContactListResponse, ContactLookup, ContactMethod, ContactReference, ContactType } from './types/contact/contact';
export type { CreateIndividualContactMethod, CreateIndividualRequest, UpdateIndividualRequest } from './types/contact-individual/contact-individual-write';
export type { ContactMethodRecord, CreateContactMethodRequest, UpdateContactMethodRequest } from './types/contact-method/contact-method';
export type { ContactNote, ContactNoteReminder } from './types/contact-note/contact-note';
export type { CreateContactNoteInput, CreateContactNoteWireBody } from './types/contact-note/create-contact-note';
export type { CreateNoteFromEmailRequest, UpdateContactNoteRequest } from './types/contact-note/update-contact-note';
export type { ContactReferenceRecord, CreateContactReferenceRequest } from './types/contact-reference/contact-reference';
export type { ContactTag, ContactTagListResponse, CreateContactTagRequest, Tag, TagListParams, TagListResponse, TagSearchBody } from './types/contact-tag/contact-tag';
export type { Email, SendEmailRequest } from './types/email/email';
export type { AddIndividualsToEmailListRequest, AddIndividualsToEmailListResult, EmailList, EmailListListParams, EmailListMembership, EmailListMembershipListResponse, EmailListSearchBody, EmailListSearchResponse } from './types/email-list/email-list';
export type { CreateEventRequest, Event, EventType, UpdateEventRequest } from './types/event/event';
export type { CreateEventAttendeeRequest, EventAttendee, UpdateEventAttendeeRequest } from './types/event-attendee/event-attendee';
export type { CreateEventContactRequest, EventContact } from './types/event-contact/event-contact';
export type { BulkGiftPatch, CreateGiftTransactionsRequest, CreateReversingTransactionRequest, GiftDesignationQueryRow } from './types/gift/gift-bulk';
export type { GiftType, NonCashGiftType } from './types/gift/gift-constants';
export type { CreateGiftRequest, GiftDesignationRequest, GiftPremiumRequest, PledgePaymentRequest, RecurringGiftPaymentRequest, TributeType } from './types/gift/gift-create';
export type { GiftSortBy, GiftsForContactByReferenceIdSkipTakeParams } from './types/gift/gift-params';
export type { GiftQueryResponse } from './types/gift/gift-query';
export type { CreateGiftTransactionRequest, GiftContactInput, GiftDesignationInput, GiftPassthrough, GiftPassthroughContactInput, GiftPremiumInput, TributeDedication } from './types/gift/gift-transaction-create';
export type { GiftDesignationUpdate, GiftPremiumUpdate, PledgePaymentUpdate, RecurringGiftPaymentUpdate, UpdateGiftRequest } from './types/gift/gift-update';
export type { Gift, GiftDesignation, GiftListResponse, GiftPremium, GiftSummary, GiftSummaryWithDesignations, NonCashGiftTypes, PledgePayment } from './types/gift/gift';
export type { CreateGiftAskRequest, GiftAsk, UpdateGiftAskRequest } from './types/gift-ask/gift-ask';
export type { CreateGrantRequest, Grant, UpdateGrantRequest } from './types/grant/grant';
export type { OrganizationGroup, OrganizationGroupContact } from './types/organization-group/organization-group';
export type { GiftAppliedToPlannedGift, GiftDesignationApplied, GiftPremiumApplied, GiftsAppliedToPlannedGiftResponse, PledgePaymentApplied, RecurringGiftPaymentApplied, RecurringGiftPaymentAppliedGift } from './types/planned-gift/planned-gift-applied-gifts';
export type { CreatePlannedGiftRequest } from './types/planned-gift/planned-gift-create';
export type { PlannedGift, PlannedGiftListResponse } from './types/planned-gift/planned-gift';
export type { UpdatePlannedGiftRequest } from './types/planned-gift/planned-gift-update';
export type { CreatePledgeRequest, Pledge, UpdatePledgeRequest, WriteOffPledgeRequest } from './types/pledge/pledge';
export type { CreatePremiumRequest, Premium, UpdatePremiumRequest } from './types/premium/premium';
export type { CreateProjectOptions, CreateProjectRequest } from './types/project/project-create';
export type { BulkProjectPatch, CreateProjectExpenseRequest, CreateProjectExpensesBatchRequest, CreateProjectNoteRequest, CreateProjectRoleRequest, ProjectExpense, ProjectNote, ProjectRole, ProjectSearchRequest, UpdateProjectBalanceRequest, UpdateProjectExpenseRequest, UpdateProjectInventoryStatusRequest, UpdateProjectNoteRequest, UpdateProjectRequest, UpdateProjectRoleRequest } from './types/project/project-expense';
export type { Project, ProjectGiftSpecification } from './types/project/project';
export type { CancelRecurringGiftRequest } from './types/recurring-gift/recurring-gift-cancel';
export type { CreateRecurringGiftRequest, RecurringGiftCustomFieldRequest, RecurringGiftDesignationRequest } from './types/recurring-gift/recurring-gift-create';
export type { RecurringGiftCustomFieldDefinition } from './types/recurring-gift/recurring-gift-custom-field';
export type { RecurringGiftPayment, RecurringGiftPaymentGift, RecurringGiftPaymentListResponse } from './types/recurring-gift/recurring-gift-payment';
export type { RecurringGiftCustomFieldUpdate, RecurringGiftDesignationUpdate, UpdateRecurringGiftRequest } from './types/recurring-gift/recurring-gift-update';
export type { RecurringGift, RecurringGiftCustomField, RecurringGiftDesignation, RecurringGiftListResponse } from './types/recurring-gift/recurring-gift';
export type { ContactRelationship, CreateRelationshipRequest, RelationshipType, UpdateRelationshipRequest } from './types/relationship/relationship';
export type { EntitySearchRequest, SearchFilterType, SearchResponse } from './types/search/search';
export type { CreateSegmentRequest, Segment, UpdateSegmentRequest } from './types/segment/segment';
export type { CreateTaskRequest, Task } from './types/task/task';
export type { CreateTributeRequest, Tribute, TributeSearchRequest, UpdateTributeRequest } from './types/tribute/tribute';
export type { CreateVolunteerAttendanceRequest, CreateVolunteerOrganizerRequest, CreateVolunteerRequest, UpdateVolunteerAttendanceRequest, Volunteer, VolunteerAttendance, VolunteerOrganizer } from './types/volunteer/volunteer';
export type { CreateVolunteerOpportunityRequest, UpdateVolunteerOpportunityRequest, VolunteerOpportunity } from './types/volunteer-opportunity/volunteer-opportunity';
export type { CreateWebhookRequest, UpdateWebhookRequest, Webhook } from './types/webhook/webhook';

export type { SimpleGiftFilters } from './utils/build-gift-query';
export { buildGiftQuery } from './utils/build-gift-query';
export type { SimpleContactFilters } from './utils/build-contact-query';
export { buildContactQuery } from './utils/build-contact-query';
export type { SimpleRecurringGiftFilters } from './utils/build-recurring-gift-query';
export { buildRecurringGiftQuery } from './utils/build-recurring-gift-query';
export type { SimplePlannedGiftFilters } from './utils/build-planned-gift-query';
export { buildPlannedGiftQuery } from './utils/build-planned-gift-query';
export type { SimpleResourceFilters } from './utils/build-resource-query';
export {
  buildProjectQuery,
  buildCampaignQuery,
  buildCommunicationQuery,
  buildEventQuery,
  buildEventAttendeeQuery,
  buildGrantQuery,
  buildVolunteerOpportunityQuery,
  buildVolunteerQuery,
  buildTaskQuery,
  buildContactNoteQuery,
  buildGiftAskQuery,
  buildPledgeQuery,
  buildPremiumQuery,
  buildGiftDesignationQuery,
  buildIndividualQuery,
} from './utils/build-resource-query';
export { convertGiftToUpdateGiftRequest } from './utils/convert-gift-to-update-request';
export { convertRecurringGiftToUpdateRequest } from './utils/convert-recurring-gift-to-update-request';
export {
  addressToUpdateRequest,
  contactMethodToUpdateRequest,
  contactToUpdateRequest,
  eventToUpdateRequest,
  giftAskToUpdateRequest,
  grantToUpdateRequest,
  individualToUpdateRequest,
  mergeUpdate,
  omitReadOnly,
  pledgeToUpdateRequest,
  premiumToUpdateRequest,
  projectToUpdateRequest,
  segmentToUpdateRequest,
  webhookToUpdateRequest,
} from './utils/to-update-request';
export type { SimpleDonationForm } from './utils/create-gift-from-form';
export { createGiftFromForm } from './utils/create-gift-from-form';
export { buildAutoCreateProjectRequest } from './utils/build-auto-create-project-request';
export { addEmailsToTag } from './utils/add-emails-to-tag';
export { addEmailsToEmailList } from './utils/add-emails-to-email-list';
export type { AudienceSkipReason, AudienceSkip, AddEmailsToTagResult, AddEmailsToEmailListResult } from './utils/add-emails-to-audience';
export { toCreateContactNoteWireBody, buildGeneralContactNoteInput } from './types/contact-note/create-contact-note';
