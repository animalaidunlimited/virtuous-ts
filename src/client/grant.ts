import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import type { AxiosInstance } from 'axios';
import type {
  CreateGrantRequest,
  Grant,
  UpdateGrantRequest,
} from '../types/grant/grant';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';
import type { Gift } from '../types/gift/gift';
import { grantToUpdateRequest, mergeUpdate } from '../utils/to-update-request';

/**
 * Virtuous CRM grant API.
 * @see https://docs.virtuoussoftware.com/#f8e0e120-4aef-47e5-880c-7588d2dc00b2
 */
const createGrantClient = (client: AxiosInstance) => ({
  /**
   * Returns grants for a contact.
   * @see https://docs.virtuoussoftware.com/#f8e0e120-4aef-47e5-880c-7588d2dc00b2
   * @param {number} contactId - Contact id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Grant>>}
   */
  getGrantsForContact: (contactId: number, params?: SkipTakeParams): Promise<ListResponse<Grant>> => {
    return client.get<ListResponse<Grant>>(`/Grant/ByContact/${contactId}`, { params }).then((r) => r.data);
  },

  /**
   * Returns a grant by id.
   * @see https://docs.virtuoussoftware.com/#a8f1f12b-801d-40ca-b3ce-eff549f55d4b
   * @param {number} grantId - Grant id.
   * @returns {Promise<Grant>}
   */
  getGrant: (grantId: number): Promise<Grant> => {
    return client.get<Grant>(`/Grant/${grantId}`).then((r) => r.data);
  },

  /**
   * Returns a grant by external reference id.
   * @see https://docs.virtuoussoftware.com/#5c0b46f9-ad6a-4772-815e-5d5ac9e0f0d5
   * @param {string} referenceId - Reference id.
   * @returns {Promise<Grant>}
   */
  getGrantByReferenceId: (referenceId: string): Promise<Grant> => {
    return client.get<Grant>(`/Grant/ByReference/${referenceId}`).then((r) => r.data);
  },

  /**
   * Returns gifts applied to a grant.
   * @see https://docs.virtuoussoftware.com/#92f2e932-d842-4359-b3b3-4c4e24fb8be2
   * @param {number} grantId - Grant id.
   * @returns {Promise<Gift[]>}
   */
  getGiftsForGrant: (grantId: number): Promise<Gift[]> => {
    return client.get<Gift[]>(`/Grant/${grantId}/Gifts`).then((r) => r.data);
  },

  /**
   * Creates a grant.
   * @see https://docs.virtuoussoftware.com/#7609b2eb-fbf3-46b8-a9a5-64ef09d9e84d
   * @param {CreateGrantRequest} request - Request body.
   * @returns {Promise<Grant>}
   */
  createGrant: (request: CreateGrantRequest): Promise<Grant> => {
    return client.post<Grant>('/Grant', request).then((r) => r.data);
  },

  /**
   * Replaces a grant. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#008f3cf2-e5c1-4007-a5b0-975040ed7cdb
   * @param {number} grantId - Grant id.
   * @param {UpdateGrantRequest} request - Request body.
   * @returns {Promise<Grant>}
   */
  updateGrant: (grantId: number, request: UpdateGrantRequest): Promise<Grant> => {
    return client.put<Grant>(`/Grant/${grantId}`, request).then((r) => r.data);
  },

  /**
   * GETs the grant, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#008f3cf2-e5c1-4007-a5b0-975040ed7cdb
   * @param {number} grantId - Grant id.
   * @param {Partial<UpdateGrantRequest>} changes - Fields to change.
   * @returns {Promise<Grant>} The updated grant.
   */
  updateGrantSafely: async (grantId: number, changes: Partial<UpdateGrantRequest>): Promise<Grant> => {
    const current = await client.get<Grant>(`/Grant/${grantId}`).then((r) => r.data);
    return client
      .put<Grant>(`/Grant/${grantId}`, mergeUpdate(grantToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

  /**
   * Deletes a grant.
   * @see https://docs.virtuoussoftware.com/#d86770cf-e93a-4251-9be3-10e85b32393d
   * @param {number} grantId - Grant id.
   * @returns {Promise<void>}
   */
  deleteGrant: (grantId: number): Promise<void> => {
    return client.delete<void>(`/Grant/${grantId}`).then(() => undefined);
  },

  /**
   * Returns enabled custom fields for grants.
   * @see https://docs.virtuoussoftware.com/#f93c3184-49a1-4878-a127-d23a9cd56525
   * @returns {Promise<CustomFieldDefinition[]>}
   */
  getGrantCustomFields: (): Promise<CustomFieldDefinition[]> => {
    return client.get<CustomFieldDefinition[]>('/Grant/CustomFields').then((r) => r.data);
  },

  /**
   * Returns query fields and operators for grants.
   * @see https://docs.virtuoussoftware.com/#10e3f108-76aa-4914-8633-227ce77a416f
   * @returns {Promise<QueryOptionsResponse>}
   */
  getGrantQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/Grant/QueryOptions').then((r) => r.data);
  },

  /**
   * Queries grants. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#0899e4cf-0cae-482c-bd88-b2a610d2e2aa
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Grant>>}
   */
  queryGrants: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<Grant>> => {
    return client.post<ListResponse<Grant>>('/Grant/Query', request, { params }).then((r) => r.data);
  },

});

export default createGrantClient;
