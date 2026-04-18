

import { ContactMethodType } from "../shared/contact-method-type";

export interface ContactAddressCreateRequest {
    label?: string | null;
    address1?: string | null;
    address2?: string | null;
    city?: string | null;
    stateCode?: string | null;        // note: stateCode, not state
    postal?: string | null;
    countryCode?: string | null;      // note: countryCode, not country
    isPrimary?: boolean;
    latitude?: number | null;
    longitude?: number | null;
  }
  
  export interface CreateContactMethodRequest {
    type: ContactMethodType;
    value: string;
    isOptedIn?: boolean;
    isPrimary?: boolean;
  }
  
  export interface CreateContactIndividualRequest {
    firstName?: string | null;
    lastName?: string | null;
    prefix?: string | null;
    middleName?: string | null;
    suffix?: string | null;
  
    birthMonth?: number | null;
    birthDay?: number | null;
    birthYear?: number | null;
    approximateAge?: number | null;
  
    gender?: string | null;
    passion?: string | null;
  
    isPrimary?: boolean;
    isSecondary?: boolean;
    isDeceased?: boolean;
  
    contactMethods?: CreateContactMethodRequest[];
    customFields?: Record<string, any>;   // Virtuous accepts any key/value
  }
  
  export interface CreateCustomCollectionRequest {
    name: string;
    fields: Array<{
      name: string;
      value: string | number | boolean | null;
    }>;
  }
  
  export interface CreateContactRequest {
    contactType: string;                        // "Household" | "Individual" | "Organization"
    referenceSource?: string | null;            // your external system name
    referenceId?: string | null;                // your external ID (very useful!)
  
    name: string;
    informalName?: string | null;
    description?: string | null;
    website?: string | null;
    maritalStatus?: string | null;
  
    anniversaryMonth?: number | null;
    anniversaryDay?: number | null;
    anniversaryYear?: number | null;
  
    originSegmentId?: number | null;
    isPrivate?: boolean;
    isArchived?: boolean;
  
    contactAddresses?: ContactAddressCreateRequest[];
    contactIndividuals?: CreateContactIndividualRequest[];
  
    customFields?: Record<string, any>;
    customCollections?: CreateCustomCollectionRequest[];
  }