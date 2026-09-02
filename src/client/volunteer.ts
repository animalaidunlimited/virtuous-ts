import type { AxiosInstance } from 'axios';
import type {
  CreateVolunteerAttendanceRequest,
  CreateVolunteerOrganizerRequest,
  CreateVolunteerRequest,
  UpdateVolunteerAttendanceRequest,
  Volunteer,
  VolunteerAttendance,
  VolunteerOrganizer,
} from '../types/volunteer/volunteer';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';
import { mergeUpdate, volunteerAttendanceToUpdateRequest } from '../utils/to-update-request';

/**
 * Virtuous CRM volunteer API.
 * @see https://docs.virtuoussoftware.com/#14d81ccf-3a19-4c45-a81f-823f342da2c3
 */
const createVolunteerClient = (client: AxiosInstance) => ({
  /**
   * Returns volunteers for an opportunity.
   * @see https://docs.virtuoussoftware.com/#14d81ccf-3a19-4c45-a81f-823f342da2c3
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Volunteer>>}
   */
  getVolunteersForOpportunity: (volunteerOpportunityId: number, params?: SkipTakeParams): Promise<ListResponse<Volunteer>> => {
    return client.get<ListResponse<Volunteer>>(`/VolunteerOpportunity/${volunteerOpportunityId}/Volunteers`, { params }).then((r) => r.data);
  },

  /**
   * Returns a volunteer by id.
   * @see https://docs.virtuoussoftware.com/#5f1edce3-3c0a-4dea-8226-d991dd4d98cc
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {number} volunteerId - Volunteer id.
   * @returns {Promise<Volunteer>}
   */
  getVolunteer: (volunteerOpportunityId: number, volunteerId: number): Promise<Volunteer> => {
    return client.get<Volunteer>(`/VolunteerOpportunity/${volunteerOpportunityId}/Volunteers/${volunteerId}`).then((r) => r.data);
  },

  /**
   * Searches volunteers by opportunity, volunteer, contact, individual, or email.
   * @see https://docs.virtuoussoftware.com/#4994c81a-52ee-4e0e-8e0b-5cc775d03457
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Volunteer>>}
   */
  searchVolunteers: (params?: SkipTakeParams & { volunteerOpportunityId?: number; volunteerId?: number; contactId?: number; contactIndividualId?: number; emailAddress?: string }): Promise<ListResponse<Volunteer>> => {
    return client.get<ListResponse<Volunteer>>('/Volunteer/Search', { params }).then((r) => r.data);
  },

  /**
   * Adds a volunteer to an opportunity.
   * @see https://docs.virtuoussoftware.com/#c9f8ddf8-0117-4945-a744-1b498e772a3d
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {CreateVolunteerRequest} request - Request body.
   * @returns {Promise<Volunteer>}
   */
  createVolunteer: (volunteerOpportunityId: number, request: CreateVolunteerRequest): Promise<Volunteer> => {
    return client.post<Volunteer>(`/VolunteerOpportunity/${volunteerOpportunityId}/Volunteers`, request).then((r) => r.data);
  },

  /**
   * Removes a volunteer from an opportunity.
   * @see https://docs.virtuoussoftware.com/#35000635-0259-4d8f-95cd-f9d0dc41a97b
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {number} volunteerId - Volunteer id.
   * @returns {Promise<void>}
   */
  deleteVolunteer: (volunteerOpportunityId: number, volunteerId: number): Promise<void> => {
    return client.delete<void>(`/VolunteerOpportunity/${volunteerOpportunityId}/Volunteers/${volunteerId}`).then(() => undefined);
  },

  /**
   * Returns query fields and operators for volunteers.
   * @see https://docs.virtuoussoftware.com/#87f1dc67-141e-4ca3-8732-cac59e93a432
   * @returns {Promise<QueryOptionsResponse>}
   */
  getVolunteerQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/Volunteer/QueryOptions').then((r) => r.data);
  },

  /**
   * Queries volunteers.
   * @see https://docs.virtuoussoftware.com/#2a14fe35-5055-4cb7-9024-f88d39be994f
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Volunteer>>}
   */
  queryVolunteers: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<Volunteer>> => {
    return client.post<ListResponse<Volunteer>>('/Volunteer/Query', request, { params }).then((r) => r.data);
  },

  /**
   * Returns attendance records for a volunteer.
   * @see https://docs.virtuoussoftware.com/#d2f76728-173a-428e-be07-cf388d9f7a21
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {number} volunteerId - Volunteer id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<VolunteerAttendance>>}
   */
  getVolunteerAttendanceForVolunteer: (volunteerOpportunityId: number, volunteerId: number, params?: SkipTakeParams): Promise<ListResponse<VolunteerAttendance>> => {
    return client.get<ListResponse<VolunteerAttendance>>(`/VolunteerOpportunity/${volunteerOpportunityId}/Volunteers/${volunteerId}/Attendance`, { params }).then((r) => r.data);
  },

  /**
   * Returns a volunteer attendance record.
   * @see https://docs.virtuoussoftware.com/#780abb6d-712a-487d-a3a3-cb0d6100a2fd
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {number} volunteerAttendanceId - Volunteer Attendance id.
   * @returns {Promise<VolunteerAttendance>}
   */
  getVolunteerAttendance: (volunteerOpportunityId: number, volunteerAttendanceId: number): Promise<VolunteerAttendance> => {
    return client.get<VolunteerAttendance>(`/VolunteerOpportunity/${volunteerOpportunityId}/Attendance/${volunteerAttendanceId}`).then((r) => r.data);
  },

  /**
   * Records volunteer attendance.
   * @see https://docs.virtuoussoftware.com/#100df729-3cbc-49d1-8035-2c699f2fb89c
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {number} volunteerId - Volunteer id.
   * @param {CreateVolunteerAttendanceRequest} request - Request body.
   * @returns {Promise<VolunteerAttendance>}
   */
  createVolunteerAttendance: (volunteerOpportunityId: number, volunteerId: number, request: CreateVolunteerAttendanceRequest): Promise<VolunteerAttendance> => {
    return client.post<VolunteerAttendance>(`/VolunteerOpportunity/${volunteerOpportunityId}/Volunteers/${volunteerId}/Attendance`, request).then((r) => r.data);
  },

  /**
   * Replaces a volunteer attendance record.
   * @see https://docs.virtuoussoftware.com/#2dce06e8-d03e-45e5-95fd-5e0c6b8ba032
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {number} volunteerAttendanceId - Volunteer Attendance id.
   * @param {UpdateVolunteerAttendanceRequest} request - Request body.
   * @returns {Promise<VolunteerAttendance>}
   */
  updateVolunteerAttendance: (volunteerOpportunityId: number, volunteerAttendanceId: number, request: UpdateVolunteerAttendanceRequest): Promise<VolunteerAttendance> => {
    return client.put<VolunteerAttendance>(`/VolunteerOpportunity/${volunteerOpportunityId}/Attendance/${volunteerAttendanceId}`, request).then((r) => r.data);
  },

  /**
   * GETs attendance, merges `changes`, then PUTs the full update body.
   * @param {number} volunteerOpportunityId - Opportunity id.
   * @param {number} volunteerAttendanceId - Attendance id.
   * @param {Partial<UpdateVolunteerAttendanceRequest>} changes - Fields to change.
   * @returns {Promise<VolunteerAttendance>} The updated attendance record.
   */
  updateVolunteerAttendanceSafely: async (
    volunteerOpportunityId: number,
    volunteerAttendanceId: number,
    changes: Partial<UpdateVolunteerAttendanceRequest>,
  ): Promise<VolunteerAttendance> => {
    const current = await client
      .get<VolunteerAttendance>(
        `/VolunteerOpportunity/${volunteerOpportunityId}/Attendance/${volunteerAttendanceId}`,
      )
      .then((r) => r.data);
    return client
      .put<VolunteerAttendance>(
        `/VolunteerOpportunity/${volunteerOpportunityId}/Attendance/${volunteerAttendanceId}`,
        mergeUpdate(volunteerAttendanceToUpdateRequest(current), changes),
      )
      .then((r) => r.data);
  },

  /**
   * Deletes a volunteer attendance record.
   * @see https://docs.virtuoussoftware.com/#65acbf88-1690-4702-9f32-0499c9f33c8e
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {number} volunteerAttendanceId - Volunteer Attendance id.
   * @returns {Promise<void>}
   */
  deleteVolunteerAttendance: (volunteerOpportunityId: number, volunteerAttendanceId: number): Promise<void> => {
    return client.delete<void>(`/VolunteerOpportunity/${volunteerOpportunityId}/Attendance/${volunteerAttendanceId}`).then(() => undefined);
  },

  /**
   * Returns organizers for an opportunity.
   * @see https://docs.virtuoussoftware.com/#1fe17c8d-bcf5-48d0-bbc0-9aa794a3fa9c
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @returns {Promise<VolunteerOrganizer[]>}
   */
  getVolunteerOrganizers: (volunteerOpportunityId: number): Promise<VolunteerOrganizer[]> => {
    return client.get<VolunteerOrganizer[]>(`/VolunteerOpportunity/${volunteerOpportunityId}/Organizers`).then((r) => r.data);
  },

  /**
   * Returns a volunteer organizer by id.
   * @see https://docs.virtuoussoftware.com/#6ce58c0b-280c-4d3a-a322-fa3697aa27ba
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {number} volunteerOrganizerId - Volunteer Organizer id.
   * @returns {Promise<VolunteerOrganizer>}
   */
  getVolunteerOrganizer: (volunteerOpportunityId: number, volunteerOrganizerId: number): Promise<VolunteerOrganizer> => {
    return client.get<VolunteerOrganizer>(`/VolunteerOpportunity/${volunteerOpportunityId}/Organizers/${volunteerOrganizerId}`).then((r) => r.data);
  },

  /**
   * Adds an organizer to an opportunity.
   * @see https://docs.virtuoussoftware.com/#c3024e97-53e7-4077-a838-a9bcd38ab480
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {CreateVolunteerOrganizerRequest} request - Request body.
   * @returns {Promise<VolunteerOrganizer>}
   */
  createVolunteerOrganizer: (volunteerOpportunityId: number, request: CreateVolunteerOrganizerRequest): Promise<VolunteerOrganizer> => {
    return client.post<VolunteerOrganizer>(`/VolunteerOpportunity/${volunteerOpportunityId}/Organizers`, request).then((r) => r.data);
  },

  /**
   * Removes an organizer from an opportunity.
   * @see https://docs.virtuoussoftware.com/#b751a18f-26e9-4c9f-bf83-5c3fee8c2ac6
   * @param {number} volunteerOpportunityId - Volunteer Opportunity id.
   * @param {number} volunteerOrganizerId - Volunteer Organizer id.
   * @returns {Promise<void>}
   */
  deleteVolunteerOrganizer: (volunteerOpportunityId: number, volunteerOrganizerId: number): Promise<void> => {
    return client.delete<void>(`/VolunteerOpportunity/${volunteerOpportunityId}/Organizers/${volunteerOrganizerId}`).then(() => undefined);
  },

});

export default createVolunteerClient;
