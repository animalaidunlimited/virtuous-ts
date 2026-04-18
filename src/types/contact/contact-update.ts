import type { CustomField } from '../shared/custom-field'; // reuse from read types
import { CustomCollectionWrite } from './contact-shared';

/**
 * Update contact request
 * 
 * name is mandatory
 */
export interface UpdateContactRequest {
  contactType?: string;
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

  // Note: array format – different from create!
  customFields?: CustomField[];

  // Slightly different shape than create (no customCollectionId/collectionInstanceId)
  customCollections?: CustomCollectionWrite[];
}