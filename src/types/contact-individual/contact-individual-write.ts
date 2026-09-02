import type { CustomField } from '../shared/custom-field';

import type { CustomCollectionWrite } from '../contact/contact-shared';

export interface CreateIndividualContactMethod {
  type?: string;
  value?: string;
  isOptedIn?: boolean;
  isPrimary?: boolean;
}

/** Body for POST /ContactIndividual. */
export interface CreateIndividualRequest {
  contactId: number;
  firstName?: string;
  lastName?: string;
  contactMethods?: CreateIndividualContactMethod[];
  prefix?: string;
  middleName?: string;
  suffix?: string;
  gender?: string;
  setAsPrimary?: boolean;
  setAsSecondary?: boolean;
  birthMonth?: number;
  birthDay?: number;
  birthYear?: number;
  approximateAge?: number;
  isDeceased?: boolean;
  deceasedDate?: string;
  passion?: string;
  avatarUrl?: string;
  customFields?: CustomField[];
  customCollections?: CustomCollectionWrite[];
}

export type UpdateIndividualRequest = Omit<CreateIndividualRequest, 'contactId'>;
