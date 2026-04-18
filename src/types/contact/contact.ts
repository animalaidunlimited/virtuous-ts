
import type {
    ContactAddressBase,
    ContactMethodBase,
    ContactIndividualBase,
  } from './contact-shared';
import { CustomCollectionRead } from './contact-shared';
import { CustomField } from '../shared/custom-field';
  
  // ──────────────────────────────────────────────────────────────
  // Full versions (only returned by getContactById)
  // ──────────────────────────────────────────────────────────────
  export interface ContactAddress extends ContactAddressBase {
    isPrimary: boolean;
    canBePrimary: boolean;
  }

  export interface ContactAddressFull extends ContactAddress {
    createDateTimeUtc: string;
    createdByUser: string | null;
    modifiedDateTimeUtc: string;
    modifiedByUser: string | null;
  }
  
  export interface ContactMethod extends ContactMethodBase {
    canBePrimary: boolean;
  }
  

  

  
  export interface ContactIndividual extends ContactIndividualBase {
    contactId: number;
    canBePrimary: boolean;
    canBeSecondary: boolean;
    avatarUrl: string | null;
    createDateTimeUtc: string;
    modifiedDateTimeUtc: string;
    contactMethods: ContactMethod[];           // full version has canBePrimary
    customFields: CustomField[];
    customCollections: CustomCollectionRead[];
  }
  
  export interface ContactReference {
    source: string;
    id: string;
  }
  
  // Full rich contact – returned by /Contact/{id}
  export interface Contact {
    isCurrentUserFollowing: boolean;
    id: number;
    contactType: string;
    isPrivate: boolean;
  
    name: string;
    informalName: string | null;
    description: string | null;
    website: string | null;
  
    maritalStatus: string | null;
    anniversaryMonth: number | null;
    anniversaryDay: number | null;
    anniversaryYear: number | null;
  
    mergedIntoContactId: number | null;
  
    address: ContactAddress | null;
  
    giftAskAmount: string | null;
    giftAskType: string | null;
    lifeToDateGiving: string | null;
    yearToDateGiving: string | null;
    lastGiftAmount: string | null;
    lastGiftDate: string | null;
  
    contactIndividuals: ContactIndividual[];
  
    contactGiftsUrl: string;
    contactPassthroughGiftsUrl: string;
    contactPlannedGiftsUrl: string;
    contactRecurringGiftsUrl: string;
    contactImportantNotesUrl: string;
    contactNotesUrl: string;
    contactTagsUrl: string;
    contactRelationshipsUrl: string;
    primaryAvatarUrl: string | null;
  
    contactReferences: ContactReference[];
  
    originSegmentId: number | null;
    originSegment: string | null;
  
    createDateTimeUtc: string;
    createdByUser: string | null;
    modifiedDateTimeUtc: string;
    modifiedByUser: string | null;
  
    tags: string[];
    organizationGroups: string[];
  
    customFields: CustomField[];
    customCollections: CustomCollectionRead[];
  }
  
  // Lightweight version – returned by ByReferenceId, search, list endpoints, etc.
  export interface ContactLookup {
    id: number;
    contactType: string;
    isPrivate: boolean;
  
    name: string;
    informalName: string | null;
    description: string | null;
    website: string | null;
  
    maritalStatus: string | null;
    anniversaryMonth: number | null;
    anniversaryDay: number | null;
    anniversaryYear: number | null;
  
    giftAskAmount: string | null;
    giftAskType: string | null;
    lifeToDateGiving: string | null;
    yearToDateGiving: string | null;
    lastGiftAmount: string | null;
    lastGiftDate: string | null;
  
    address: ContactAddressBase | null;
    contactIndividuals: ContactIndividualBase[];
  }

export interface ContactListItem {
    id: number;
    name: string;
    contactType: string;
    contactName: string;
    address: string | null;
    email: string | null;
    phone: string | null;
    contactViewUrl: string;
  }
  
  export interface ContactListResponse<T extends ContactLookup | Contact | ContactIndividual | ContactListItem> {
    list: T[];
    total: number;
  }



  export interface ContactType {
    parentType: string;
    type: string;
  }