import type { Contact, ContactAddressFull, ContactIndividual } from '../types/contact/contact';
import type { UpdateContactRequest } from '../types/contact/contact-update';
import type { UpdateContactAddressRequest } from '../types/contact/contact-address-create';
import type { UpdateIndividualRequest } from '../types/contact-individual/contact-individual-write';
import type { ContactMethodRecord, UpdateContactMethodRequest } from '../types/contact-method/contact-method';
import type { Event, UpdateEventRequest } from '../types/event/event';
import type { Grant, UpdateGrantRequest } from '../types/grant/grant';
import type { Webhook, UpdateWebhookRequest } from '../types/webhook/webhook';
import type { Segment, UpdateSegmentRequest } from '../types/segment/segment';
import type { Premium, UpdatePremiumRequest } from '../types/premium/premium';
import type { Pledge, UpdatePledgeRequest } from '../types/pledge/pledge';
import type { GiftAsk, UpdateGiftAskRequest } from '../types/gift-ask/gift-ask';
import type { Project } from '../types/project/project';
import type {
  ProjectExpense,
  ProjectNote,
  UpdateProjectExpenseRequest,
  UpdateProjectNoteRequest,
  UpdateProjectRequest,
} from '../types/project/project-expense';
import type {
  UpdateVolunteerOpportunityRequest,
  VolunteerOpportunity,
} from '../types/volunteer-opportunity/volunteer-opportunity';
import type { UpdateVolunteerAttendanceRequest, VolunteerAttendance } from '../types/volunteer/volunteer';
import type { EventAttendee, UpdateEventAttendeeRequest } from '../types/event-attendee/event-attendee';
import type { Tribute, UpdateTributeRequest } from '../types/tribute/tribute';

/**
 * Maps GET (read) models onto PUT bodies. Virtuous clears omitted properties.
 */

const DEFAULT_SKIP = new Set([
  'id',
  'createDateTimeUtc',
  'createdByUser',
  'modifiedDateTimeUtc',
  'modifiedByUser',
]);

function skipKey(key: string, extra: Set<string>): boolean {
  if (DEFAULT_SKIP.has(key) || extra.has(key)) return true;
  if (key.endsWith('Url') || key.endsWith('Formatted')) return true;
  return false;
}

/** Copies enumerable own properties except read-only / URL / formatted fields. */
export function omitReadOnly<T extends object>(record: T, extraSkip: string[] = []): Partial<T> {
  const extra = new Set(extraSkip);
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(record as Record<string, unknown>)) {
    if (skipKey(key, extra)) continue;
    (out as Record<string, unknown>)[key] = value;
  }
  return out;
}

export function mergeUpdate<T extends object>(base: T, changes: Partial<T>): T {
  return { ...base, ...changes };
}

export function contactToUpdateRequest(contact: Contact): UpdateContactRequest {
  return {
    contactType: contact.contactType,
    name: contact.name,
    informalName: contact.informalName,
    description: contact.description,
    website: contact.website,
    maritalStatus: contact.maritalStatus,
    anniversaryMonth: contact.anniversaryMonth,
    anniversaryDay: contact.anniversaryDay,
    anniversaryYear: contact.anniversaryYear,
    originSegmentId: contact.originSegmentId,
    isPrivate: contact.isPrivate,
    customFields: contact.customFields,
  };
}

export function addressToUpdateRequest(address: ContactAddressFull): UpdateContactAddressRequest {
  return {
    label: address.label ?? '',
    address1: address.address1 ?? '',
    address2: address.address2 ?? '',
    city: address.city ?? '',
    state: address.state ?? '',
    postal: address.postal ?? '',
    country: address.country ?? '',
    setAsPrimary: address.isPrimary,
    startMonth: address.startMonth ?? 0,
    startDay: address.startDay ?? 0,
    endMonth: address.endMonth ?? 0,
    endDay: address.endDay ?? 0,
  };
}

export function individualToUpdateRequest(individual: ContactIndividual): UpdateIndividualRequest {
  return {
    firstName: individual.firstName ?? undefined,
    lastName: individual.lastName ?? undefined,
    prefix: individual.prefix ?? undefined,
    middleName: individual.middleName ?? undefined,
    suffix: individual.suffix ?? undefined,
    gender: individual.gender ?? undefined,
    setAsPrimary: individual.isPrimary,
    setAsSecondary: individual.isSecondary,
    birthMonth: individual.birthMonth ?? undefined,
    birthDay: individual.birthDay ?? undefined,
    birthYear: individual.birthYear ?? undefined,
    approximateAge: individual.approximateAge ?? undefined,
    isDeceased: individual.isDeceased,
    passion: individual.passion ?? undefined,
    avatarUrl: individual.avatarUrl ?? undefined,
    customFields: individual.customFields,
  };
}

export function contactMethodToUpdateRequest(method: ContactMethodRecord): UpdateContactMethodRequest {
  return {
    type: method.type,
    value: method.value,
    isOptedIn: method.isOptedIn,
    setAsPrimary: method.isPrimary,
  };
}

export function eventToUpdateRequest(event: Event): UpdateEventRequest {
  return {
    name: event.name,
    eventType: event.eventType,
    startDateTime: event.startDateTime,
    endDateTime: event.endDateTime,
    timeZone: event.timeZone,
    communicationId: event.communicationId,
    locationName: event.locationName,
    description: event.description,
    specialInstructions: event.specialInstructions,
    inviteOnly: event.inviteOnly,
    rsvpRequired: event.rsvpRequired,
    tables: event.tables,
    meals: event.meals,
    customFields: event.customFields,
  };
}

export function grantToUpdateRequest(grant: Grant): UpdateGrantRequest {
  return {
    ownerId: grant.ownerId,
    title: grant.title,
    grantingOrganizationId: grant.grantingOrganizationId,
    description: grant.description,
    referenceId: grant.referenceId,
    receivingOrganizationId: grant.receivingOrganizationId,
    projectId: grant.projectId,
    dueDate: grant.dueDateUtc,
    totalAnticipatedAmount: grant.totalAnticipatedAmount,
    status: grant.status,
    submissionDate: grant.submissionDateUtc,
    anticipatedAwardDate: grant.anticipatedAwardDateUtc,
    pointOfContactName: grant.pointOfContactName,
    pointOfContactEmail: grant.pointOfContactEmail,
    pointOfContactPhone: grant.pointOfContactPhone,
    website: grant.website,
    awardedGrant: grant.awardedGrant,
    awardedAmount: grant.awardedAmount,
    awardedDate: grant.awardedDateUtc,
    awardTerms: grant.awardTerms,
    grantType: grant.grantType,
    customFields: grant.customFields,
  };
}

export function webhookToUpdateRequest(webhook: Webhook): UpdateWebhookRequest {
  return {
    payloadUrl: webhook.payloadUrl,
    secret: webhook.secret,
    contactCreate: webhook.contactCreate,
    contactUpdate: webhook.contactUpdate,
    giftCreate: webhook.giftCreate,
    giftUpdate: webhook.giftUpdate,
    giftDelete: webhook.giftDelete,
    projectCreate: webhook.projectCreate,
    projectUpdate: webhook.projectUpdate,
    projectDelete: webhook.projectDelete,
    formSubmission: webhook.formSubmission,
    contactNoteCreate: webhook.contactNoteCreate,
    contactNoteUpdate: webhook.contactNoteUpdate,
    contactNoteDelete: webhook.contactNoteDelete,
    eventCreate: webhook.eventCreate,
    eventUpdate: webhook.eventUpdate,
    eventDelete: webhook.eventDelete,
    active: webhook.active,
  };
}

export function segmentToUpdateRequest(segment: Segment): UpdateSegmentRequest {
  return {
    name: segment.name,
    code: segment.code,
    description: segment.description,
    segmentOrganizerId: segment.segmentOrganizerId,
  };
}

export function premiumToUpdateRequest(premium: Premium): UpdatePremiumRequest {
  return {
    name: premium.name,
    code: premium.code,
    price: premium.price,
    fairMarketValue: premium.fairMarketValue,
    description: premium.description,
    cost: premium.cost,
    inventoryCount: premium.inventoryCount,
    isActive: premium.isActive,
    customFields: premium.customFields,
  };
}

export function pledgeToUpdateRequest(pledge: Pledge): UpdatePledgeRequest {
  return {
    amountPledged: pledge.amountPledged,
    frequency: pledge.frequency ?? 'Once',
    pledgeDate: pledge.pledgeDate ?? '',
    expectedFulfillmentDate: pledge.expectedFulfillmentDate ?? '',
    segmentId: pledge.segmentId,
    projectId: pledge.projectId,
    isPrivate: pledge.isPrivate ?? false,
    payments: pledge.payments?.map((p) => ({
      expectedPaymentDate: p.expectedPaymentDate ?? '',
      expectedAmount: p.expectedAmount ?? 0,
    })),
    customFields: pledge.customFields?.map((f) => ({ name: f.name ?? '', value: f.value })),
  };
}

export function giftAskToUpdateRequest(ask: GiftAsk): UpdateGiftAskRequest {
  return {
    askAmount: ask.askAmount,
    askDate: ask.askDate,
    expectedFulfillmentDate: ask.expectedFulfillmentDate,
    notes: ask.notes,
    askType: ask.askType,
    frequency: ask.frequency,
    declined: ask.declined,
    projectId: ask.projectId,
    segmentId: ask.segmentId,
    assignedUserId: ask.assignedUserId,
    secondaryAssignedUserId: ask.secondaryAssignedUserId,
    status: ask.status,
    customFields: ask.customFields,
  };
}

export function projectToUpdateRequest(project: Project): UpdateProjectRequest {
  return {
    name: project.name,
    projectCode: project.projectCode,
    onlineDisplayName: project.onlineDisplayName,
    description: project.description,
    financialNeedAmount: project.financialNeedAmount,
    beginningBalance: project.beginningBalance,
    currentBalance: project.currentBalance,
    type: project.type,
    startDate: project.startDate ?? undefined,
    endDate: project.endDate ?? undefined,
  };
}

export function projectExpenseToUpdateRequest(expense: ProjectExpense): UpdateProjectExpenseRequest {
  return {
    expenseAmount: expense.expenseAmount,
    expenseDate: expense.expenseDate,
    accountingCode: expense.accountingCode,
    expenseDescription: expense.expenseDescription,
  };
}

export function projectNoteToUpdateRequest(note: ProjectNote): UpdateProjectNoteRequest {
  return {
    type: note.type,
    note: note.note,
    important: note.important,
    isPrivate: note.isPrivate,
    contactId: note.contactId,
  };
}

export function volunteerOpportunityToUpdateRequest(
  opportunity: VolunteerOpportunity,
): UpdateVolunteerOpportunityRequest {
  return {
    name: opportunity.name,
    startDateTime: opportunity.startDateTime,
    endDateTime: opportunity.endDateTime,
    timeZone: opportunity.timeZone,
    preferredNumberOfHours: opportunity.preferredNumberOfHours,
    locationName: opportunity.locationName,
    description: opportunity.description,
    isActive: opportunity.isActive,
    isLocalOnly: opportunity.isLocalOnly,
    address1: opportunity.address1,
    address2: opportunity.address2,
    city: opportunity.city,
    state: opportunity.state,
    postal: opportunity.postal != null ? String(opportunity.postal) : undefined,
    country: opportunity.country,
    currentPriority: opportunity.currentPriority,
    currentNeed: opportunity.currentNeed,
  };
}

export function volunteerAttendanceToUpdateRequest(
  attendance: VolunteerAttendance,
): UpdateVolunteerAttendanceRequest {
  return {
    timeZone: attendance.timeZone,
    hours: attendance.hours,
    startDateTimeUtc: attendance.startDateTimeUtc,
    endDateTimeUtc: attendance.endDateTimeUtc,
  };
}

export function eventAttendeeToUpdateRequest(attendee: EventAttendee): UpdateEventAttendeeRequest {
  return {
    invited: attendee.invited === 'true' || attendee.invited === 'True' ? true : undefined,
    attended: attendee.attended === 'true' || attendee.attended === 'True' ? true : undefined,
    customFields: attendee.customFields,
  };
}

export function tributeToUpdateRequest(tribute: Tribute): UpdateTributeRequest {
  return {
    tributeType: tribute.tributeType,
    firstName: tribute.firstName,
    lastName: tribute.lastName,
    address1: tribute.address1,
    address2: tribute.address2,
    city: tribute.city,
    state: tribute.state,
    postalCode: tribute.postalCode,
    defaultAcknowledgeeIndividualId: tribute.defaultAcknowledgeeIndividualId,
  };
}
