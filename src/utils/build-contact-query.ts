// src/utils/buildContactQuery.ts

import type { ContactQueryGeolocationRequest } from '../types/contact/contact-geo-location-query';
import type { QueryCondition } from '../types/shared/query';
import { addSimpleCondition, addArrayCondition, addContainsCondition } from './query-builder-helpers';


/**
 * Filters for {@link buildContactQuery}.
 */
export interface SimpleContactFilters {
    firstNameIs?: string;
    lastNameIs?: string;
    contactNameIs?: string;
    emailIs?: string;
    phoneIs?: string;
    contactTypeIn?: string | string[];
    tagsIn?: string | string[];
    cityIs?: string;
    address1Is?: string;
    address2Is?: string;
    address1Contains?: string;
    address2Contains?: string;
    stateIs?: string;
    postalCodeIs?: string;
    contactArchived?: boolean;
    sortBy?: string;
    descending?: boolean;
    skip?: number;
    take?: number;
  }
  
  /**
   * Builds a contact query body for `POST /Contact/Query`.
   *
   * @param filters - Field filters and sort options. Pagination is the query method's second argument.
   * @returns Query body for {@link VirtuousClient.contact.queryContactsWithAbbreviatedDetails}.
   *
   * @example
   * const query = buildContactQuery({
   *   firstNameIs: 'John',
   *   sortBy: 'Name',
   *   descending: true,
   * });
   * const results = await virtuous.contact.queryContactsWithAbbreviatedDetails(query);
   */
  export const buildContactQuery = (filters: SimpleContactFilters): ContactQueryGeolocationRequest => {
    const conditions: QueryCondition[] = [];
  
    if (filters.firstNameIs) {
      addSimpleCondition(conditions, "First Name", filters.firstNameIs);
    }
    if (filters.lastNameIs) {
      addSimpleCondition(conditions, "Last Name", filters.lastNameIs);
    }
    if (filters.contactNameIs) {
      addSimpleCondition(conditions, "Contact Name", filters.contactNameIs);
    }
    if (filters.emailIs) {
      addSimpleCondition(conditions, "Email Address", filters.emailIs);
    }
    if (filters.phoneIs) {
      addSimpleCondition(conditions, "Phone", filters.phoneIs);
    }
    if (filters.cityIs) {
      addSimpleCondition(conditions, "City", filters.cityIs);
    }
    if (filters.address1Is) {
      addSimpleCondition(conditions, "Address 1", filters.address1Is);
    }
    if (filters.address2Is) {
      addSimpleCondition(conditions, "Address 2", filters.address2Is);
    }
    if (filters.address1Contains) {
      addContainsCondition(conditions, "Address 1", filters.address1Contains);
    }
    if (filters.address2Contains) {
      addContainsCondition(conditions, "Address 2", filters.address2Contains);
    }
    if (filters.stateIs) {
      addSimpleCondition(conditions, "State", filters.stateIs);
    }
    if (filters.postalCodeIs) {
      addSimpleCondition(conditions, "Postal", filters.postalCodeIs);
    }
  
    if (filters.contactTypeIn) {
      addArrayCondition(conditions, "Contact Type", filters.contactTypeIn, 'In');
    }
  
    if (filters.tagsIn) {
      addArrayCondition(conditions, "Tags", filters.tagsIn, 'In');
    }
  
    return {
      includeArchived: filters.contactArchived,
      groups: conditions.length ? [{ conditions }] : [],
      sortBy: filters.sortBy,
      descending: filters.descending,
    };
  };