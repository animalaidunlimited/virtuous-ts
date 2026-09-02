import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import type { AxiosInstance } from 'axios';
import type {
  CreateVolunteerOpportunityRequest,
  UpdateVolunteerOpportunityRequest,
  VolunteerOpportunity,
} from '../types/volunteer-opportunity/volunteer-opportunity';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';
import { mergeUpdate, volunteerOpportunityToUpdateRequest } from '../utils/to-update-request';

/**
 * Virtuous CRM volunteer opportunity API.
 * @see https://docs.virtuoussoftware.com/#60660fd6-6917-4e11-a587-ade251d1ec7b
 */
const createVolunteerOpportunityClient = (client: AxiosInstance) => ({
  /**
   * Returns volunteer opportunities.
   * @see https://docs.virtuoussoftware.com/#60660fd6-6917-4e11-a587-ade251d1ec7b
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<VolunteerOpportunity>>}
   */
  listVolunteerOpportunities: (params?: SkipTakeParams & { filter?: string }): Promise<ListResponse<VolunteerOpportunity>> => {
    return client.get<ListResponse<VolunteerOpportunity>>('/VolunteerOpportunity', { params }).then((r) => r.data);
  },

  /**
   * Returns a volunteer opportunity by id.
   * @see https://docs.virtuoussoftware.com/#33131efc-aa1d-4e8e-bf53-79720d2b67e1
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @returns {Promise<VolunteerOpportunity>}
   */
  getVolunteerOpportunity: (volunteerOpportunityId: number): Promise<VolunteerOpportunity> => {
    return client.get<VolunteerOpportunity>(`/VolunteerOpportunity/${volunteerOpportunityId}`).then((r) => r.data);
  },

  /**
   * Creates a volunteer opportunity.
   * @see https://docs.virtuoussoftware.com/#dbabf899-0b78-4f8d-a4ed-a4f776c45225
   * @param {CreateVolunteerOpportunityRequest} request - Request body.
   * @returns {Promise<VolunteerOpportunity>}
   */
  createVolunteerOpportunity: (request: CreateVolunteerOpportunityRequest): Promise<VolunteerOpportunity> => {
    return client.post<VolunteerOpportunity>('/VolunteerOpportunity', request).then((r) => r.data);
  },

  /**
   * Replaces a volunteer opportunity. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#2df40846-ed7b-4cfd-8067-5b4d98cbe36e
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {UpdateVolunteerOpportunityRequest} request - Request body.
   * @returns {Promise<VolunteerOpportunity>}
   */
  updateVolunteerOpportunity: (volunteerOpportunityId: number, request: UpdateVolunteerOpportunityRequest): Promise<VolunteerOpportunity> => {
    return client.put<VolunteerOpportunity>(`/VolunteerOpportunity/${volunteerOpportunityId}`, request).then((r) => r.data);
  },

  /**
   * GETs the opportunity, merges `changes`, then PUTs the full update body.
   * @param {number} volunteerOpportunityId - Opportunity id.
   * @param {Partial<UpdateVolunteerOpportunityRequest>} changes - Fields to change.
   * @returns {Promise<VolunteerOpportunity>} The updated opportunity.
   */
  updateVolunteerOpportunitySafely: async (
    volunteerOpportunityId: number,
    changes: Partial<UpdateVolunteerOpportunityRequest>,
  ): Promise<VolunteerOpportunity> => {
    const current = await client
      .get<VolunteerOpportunity>(`/VolunteerOpportunity/${volunteerOpportunityId}`)
      .then((r) => r.data);
    return client
      .put<VolunteerOpportunity>(
        `/VolunteerOpportunity/${volunteerOpportunityId}`,
        mergeUpdate(volunteerOpportunityToUpdateRequest(current), changes),
      )
      .then((r) => r.data);
  },

  /**
   * Deletes a volunteer opportunity.
   * @see https://docs.virtuoussoftware.com/#d6686f73-57e9-4a4d-9496-77221f6da68b
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @returns {Promise<void>}
   */
  deleteVolunteerOpportunity: (volunteerOpportunityId: number): Promise<void> => {
    return client.delete<void>(`/VolunteerOpportunity/${volunteerOpportunityId}`).then(() => undefined);
  },

  /**
   * Returns enabled custom fields for volunteer opportunities.
   * @see https://docs.virtuoussoftware.com/#cf8125da-6d7f-4f80-a9f6-86b981e09f22
   * @returns {Promise<CustomFieldDefinition[]>}
   */
  getVolunteerOpportunityCustomFields: (): Promise<CustomFieldDefinition[]> => {
    return client.get<CustomFieldDefinition[]>('/VolunteerOpportunity/CustomFields').then((r) => r.data);
  },

  /**
   * Returns query fields and operators for volunteer opportunities.
   * @see https://docs.virtuoussoftware.com/#98130d97-7f0b-4e6d-8d4e-3d514517971d
   * @returns {Promise<QueryOptionsResponse>}
   */
  getVolunteerOpportunityQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/VolunteerOpportunity/QueryOptions').then((r) => r.data);
  },

  /**
   * Queries volunteer opportunities.
   * @see https://docs.virtuoussoftware.com/#36021e2a-a418-4031-b5ab-2d586e244e91
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<VolunteerOpportunity>>}
   */
  queryVolunteerOpportunities: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<VolunteerOpportunity>> => {
    return client.post<ListResponse<VolunteerOpportunity>>('/VolunteerOpportunity/Query', request, { params }).then((r) => r.data);
  },

});

export default createVolunteerOpportunityClient;
