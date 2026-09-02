import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import type { AxiosInstance } from 'axios';
import type {
  CreatePledgeRequest,
  Pledge,
  UpdatePledgeRequest,
  WriteOffPledgeRequest,
} from '../types/pledge/pledge';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';
import { mergeUpdate, pledgeToUpdateRequest } from '../utils/to-update-request';

/**
 * Virtuous CRM pledge API.
 * @see https://docs.virtuoussoftware.com/#8dc1a4ee-ec17-41c5-9cf9-1c676eb57d6b
 */
const createPledgeClient = (client: AxiosInstance) => ({
  /**
   * Returns pledges for a contact.
   * @see https://docs.virtuoussoftware.com/#8dc1a4ee-ec17-41c5-9cf9-1c676eb57d6b
   * @param {number} contactId - Contact id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Pledge>>}
   */
  getPledgesForContact: (contactId: number, params?: SkipTakeParams): Promise<ListResponse<Pledge>> => {
    return client.get<ListResponse<Pledge>>(`/v2/Pledge/ByContact/${contactId}`, { params }).then((r) => r.data);
  },

  /**
   * Returns a pledge by id.
   * @see https://docs.virtuoussoftware.com/#6f411bb7-6aff-4957-ae3c-16514b22e4e6
   * @param {number} pledgeId - Pledge id.
   * @returns {Promise<Pledge>}
   */
  getPledge: (pledgeId: number): Promise<Pledge> => {
    return client.get<Pledge>(`/v2/Pledge/${pledgeId}`).then((r) => r.data);
  },

  /**
   * Records a pledge with an expected payment schedule.
   * @see https://docs.virtuoussoftware.com/#292ce2f5-37a3-4a36-a03f-74c0a10c1770
   * @param {CreatePledgeRequest} request - Request body.
   * @returns {Promise<Pledge>}
   */
  createPledge: (request: CreatePledgeRequest): Promise<Pledge> => {
    return client.post<Pledge>('/v2/Pledge', request).then((r) => r.data);
  },

  /**
   * Replaces a pledge. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#5ed2f2c5-74cb-43f1-af07-4e9b867c4f68
   * @param {number} pledgeId - Pledge id.
   * @param {UpdatePledgeRequest} request - Request body.
   * @returns {Promise<Pledge>}
   */
  updatePledge: (pledgeId: number, request: UpdatePledgeRequest): Promise<Pledge> => {
    return client.put<Pledge>(`/v2/Pledge/${pledgeId}`, request).then((r) => r.data);
  },

  /**
   * GETs the pledge, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#update-pledge
   * @param {number} pledgeId - Pledge id.
   * @param {Partial<UpdatePledgeRequest>} changes - Fields to change.
   * @returns {Promise<Pledge>} The updated pledge.
   */
  updatePledgeSafely: async (
    pledgeId: number,
    changes: Partial<UpdatePledgeRequest>,
  ): Promise<Pledge> => {
    const current = await client.get<Pledge>(`/v2/Pledge/${pledgeId}`).then((r) => r.data);
    return client
      .put<Pledge>(`/v2/Pledge/${pledgeId}`, mergeUpdate(pledgeToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

  /**
   * Writes off the unpaid balance of a pledge.
   * @see https://docs.virtuoussoftware.com/#d9c026b9-fd22-4bc2-b0eb-d49ed51e0168
   * @param {number} pledgeId - Pledge id.
   * @param {WriteOffPledgeRequest} request - Request body.
   * @returns {Promise<Pledge>}
   */
  writeOffPledge: (pledgeId: number, request: WriteOffPledgeRequest): Promise<Pledge> => {
    return client.put<Pledge>(`/v2/Pledge/WriteOff/${pledgeId}`, request).then((r) => r.data);
  },

  /**
   * Returns enabled custom fields for pledges.
   * @see https://docs.virtuoussoftware.com/#e8300cd0-0df9-4db2-86f5-996fdb3dc207
   * @returns {Promise<CustomFieldDefinition[]>}
   */
  getPledgeCustomFields: (): Promise<CustomFieldDefinition[]> => {
    return client.get<CustomFieldDefinition[]>('/v2/Pledge/CustomFields').then((r) => r.data);
  },

  /**
   * Returns query fields and operators for pledges.
   * @see https://docs.virtuoussoftware.com/#069ed470-88c7-4c1d-881a-537c2578faad
   * @returns {Promise<QueryOptionsResponse>}
   */
  getPledgeQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/v2/Pledge/QueryOptions').then((r) => r.data);
  },

  /**
   * Queries pledges. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#890f77ab-268c-4c40-b7b9-dd22d47cafe1
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Pledge>>}
   */
  queryPledges: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<Pledge>> => {
    return client.post<ListResponse<Pledge>>('/v2/Pledge/Query', request, { params }).then((r) => r.data);
  },

});

export default createPledgeClient;
