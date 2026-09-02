import type { QueryRequest } from '../types/shared/query';
import {
  addBooleanCondition,
  addContainsCondition,
  addSimpleCondition,
} from './query-builder-helpers';

export interface SimpleResourceFilters {
  idIs?: number | string;
  nameIs?: string;
  nameContains?: string;
  contactIdIs?: number | string;
  codeIs?: string;
  typeIs?: string;
  statusIs?: string;
  emailIs?: string;
  projectCodeIs?: string;
  isActive?: boolean;
  isArchived?: boolean;
  isPublic?: boolean;
  sortBy?: string;
  descending?: boolean;
}

export interface ResourceQueryFieldNames {
  idParameter?: string;
  nameParameter?: string;
  contactIdParameter?: string;
  codeParameter?: string;
  typeParameter?: string;
  statusParameter?: string;
  emailParameter?: string;
  projectCodeParameter?: string;
  activeParameter?: string;
  archivedParameter?: string;
  publicParameter?: string;
}

/**
 * Builds a QueryRequest from common resource filters.
 * Parameter names match Virtuous QueryOptions display names.
 *
 * @param {ResourceQueryFieldNames} fields - Query option parameter names.
 * @param {SimpleResourceFilters} filters - Filter values and sort.
 * @returns {QueryRequest} Body for a Virtuous Query endpoint.
 */
export const buildResourceQuery = (
  fields: ResourceQueryFieldNames,
  filters: SimpleResourceFilters,
): QueryRequest => {
  const conditions: QueryRequest['groups'][0]['conditions'] = [];
  if (filters.idIs !== undefined && fields.idParameter) {
    addSimpleCondition(conditions, fields.idParameter, filters.idIs);
  }
  if (filters.contactIdIs !== undefined && fields.contactIdParameter) {
    addSimpleCondition(conditions, fields.contactIdParameter, filters.contactIdIs);
  }
  if (filters.codeIs && fields.codeParameter) {
    addSimpleCondition(conditions, fields.codeParameter, filters.codeIs);
  }
  if (filters.typeIs && fields.typeParameter) {
    addSimpleCondition(conditions, fields.typeParameter, filters.typeIs);
  }
  if (filters.statusIs && fields.statusParameter) {
    addSimpleCondition(conditions, fields.statusParameter, filters.statusIs);
  }
  if (filters.emailIs && fields.emailParameter) {
    addSimpleCondition(conditions, fields.emailParameter, filters.emailIs);
  }
  if (filters.projectCodeIs && fields.projectCodeParameter) {
    addSimpleCondition(conditions, fields.projectCodeParameter, filters.projectCodeIs);
  }
  if (filters.nameIs && filters.nameContains) {
    throw new Error('Use nameIs or nameContains, not both.');
  }
  if (filters.nameContains && fields.nameParameter) {
    addContainsCondition(conditions, fields.nameParameter, filters.nameContains);
  } else if (filters.nameIs && fields.nameParameter) {
    addSimpleCondition(conditions, fields.nameParameter, filters.nameIs);
  }
  if (filters.isActive !== undefined && fields.activeParameter) {
    addBooleanCondition(conditions, fields.activeParameter, filters.isActive);
  }
  if (filters.isArchived !== undefined && fields.archivedParameter) {
    addBooleanCondition(conditions, fields.archivedParameter, filters.isArchived);
  }
  if (filters.isPublic !== undefined && fields.publicParameter) {
    addBooleanCondition(conditions, fields.publicParameter, filters.isPublic);
  }
  return {
    groups: conditions.length ? [{ conditions }] : [],
    sortBy: filters.sortBy,
    descending: filters.descending,
  };
};

export const buildProjectQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Project Id',
      nameParameter: 'Name',
      codeParameter: 'Project Code',
      typeParameter: 'Type',
      activeParameter: 'Active',
      publicParameter: 'Public',
    },
    filters,
  );

export const buildCampaignQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    { idParameter: 'Campaign Id', nameParameter: 'Name', archivedParameter: 'Archived' },
    filters,
  );

export const buildCommunicationQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    { idParameter: 'Communication Id', nameParameter: 'Name', typeParameter: 'Communication Type' },
    filters,
  );

export const buildEventQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    { idParameter: 'Event Id', nameParameter: 'Name', typeParameter: 'Event Type' },
    filters,
  );

export const buildEventAttendeeQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Event Attendee Id',
      nameParameter: 'Name',
      contactIdParameter: 'Contact Id',
      emailParameter: 'Email Address',
    },
    filters,
  );

export const buildGrantQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Grant Id',
      nameParameter: 'Title',
      contactIdParameter: 'Contact Id',
      statusParameter: 'Status',
    },
    filters,
  );

export const buildVolunteerOpportunityQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Volunteer Opportunity Id',
      nameParameter: 'Name',
      activeParameter: 'Active',
    },
    filters,
  );

export const buildVolunteerQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    { idParameter: 'Volunteer Id', nameParameter: 'Name', contactIdParameter: 'Contact Id' },
    filters,
  );

export const buildTaskQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Task Id',
      nameParameter: 'Task',
      contactIdParameter: 'Contact Id',
      typeParameter: 'Task Type',
      statusParameter: 'Status',
    },
    filters,
  );

export const buildContactNoteQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    { idParameter: 'Note Id', contactIdParameter: 'Contact Id', typeParameter: 'Type' },
    filters,
  );

export const buildGiftAskQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Gift Ask Id',
      contactIdParameter: 'Contact Id',
      statusParameter: 'Status',
      typeParameter: 'Ask Type',
    },
    filters,
  );

export const buildPledgeQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Pledge Id',
      contactIdParameter: 'Contact Id',
      statusParameter: 'Status',
      projectCodeParameter: 'Project Code',
    },
    filters,
  );

export const buildPremiumQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Premium Id',
      nameParameter: 'Name',
      codeParameter: 'Code',
      activeParameter: 'Active',
    },
    filters,
  );

export const buildGiftDesignationQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Gift Id',
      nameParameter: 'Project Name',
      contactIdParameter: 'Contact Id',
      projectCodeParameter: 'Project Code',
    },
    filters,
  );

export const buildIndividualQuery = (filters: SimpleResourceFilters) =>
  buildResourceQuery(
    {
      idParameter: 'Contact Individual Id',
      nameParameter: 'Last Name',
      contactIdParameter: 'Contact Id',
      emailParameter: 'Email Address',
    },
    filters,
  );
