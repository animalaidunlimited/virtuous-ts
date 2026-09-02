import type { AxiosInstance } from 'axios';
import type {
  ContactRelationship,
  CreateRelationshipRequest,
  RelationshipType,
  UpdateRelationshipRequest,
} from '../types/relationship/relationship';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { ListResponse } from '../types/shared/list-response';

/**
 * Virtuous CRM relationship API.
 * @see https://docs.virtuoussoftware.com/#48497cb3-2183-4592-bc5b-db5d2e6d4689
 */
const createRelationshipClient = (client: AxiosInstance) => ({
  /**
   * Returns relationships recorded on a contact.
   * @see https://docs.virtuoussoftware.com/#48497cb3-2183-4592-bc5b-db5d2e6d4689
   * @param {number} contactId - Contact id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<ContactRelationship>>}
   */
  getRelationshipsForContact: (contactId: number, params?: SkipTakeParams): Promise<ListResponse<ContactRelationship>> => {
    return client.get<ListResponse<ContactRelationship>>(`/Relationship/ByContact/${contactId}`, { params }).then((r) => r.data);
  },

  /**
   * Records a relationship between two contacts or individuals.
   * @see https://docs.virtuoussoftware.com/#67f32c77-5072-4a74-acc1-9816455ae400
   * @param {CreateRelationshipRequest} request - Request body.
   * @returns {Promise<ContactRelationship>}
   */
  createRelationship: (request: CreateRelationshipRequest): Promise<ContactRelationship> => {
    return client.post<ContactRelationship>('/Relationship', request).then((r) => r.data);
  },

  /**
   * Replaces a relationship. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#5d2478de-c8cc-4b5d-9074-eed2efafcf47
   * @param {number} relationshipId - Relationship id.
   * @param {UpdateRelationshipRequest} request - Request body.
   * @returns {Promise<ContactRelationship>}
   */
  updateRelationship: (relationshipId: number, request: UpdateRelationshipRequest): Promise<ContactRelationship> => {
    return client.put<ContactRelationship>(`/Relationship/${relationshipId}`, request).then((r) => r.data);
  },

  /**
   * Deletes a relationship and its inverse.
   * @see https://docs.virtuoussoftware.com/#5d09b912-2a90-4696-8ef2-5d36255a5d89
   * @param {number} relationshipId - Relationship id.
   * @returns {Promise<void>}
   */
  deleteRelationship: (relationshipId: number): Promise<void> => {
    return client.delete<void>(`/Relationship/${relationshipId}`).then(() => undefined);
  },

  /**
   * Returns configured relationship types.
   * @see https://docs.virtuoussoftware.com/#b9d43217-fdf1-4243-8d06-1f60ce9a1dc8
   * @returns {Promise<RelationshipType[]>}
   */
  listRelationshipTypes: (): Promise<RelationshipType[]> => {
    return client.get<RelationshipType[]>('/Relationship/Types').then((r) => r.data);
  },

});

export default createRelationshipClient;
