import type { AxiosInstance } from 'axios';
import type { Project } from '../types/project/project';
import type {
  CreateProjectOptions,
  CreateProjectRequest,
} from '../types/project/project-create';
import type {
  BulkProjectPatch,
  CreateProjectExpenseRequest,
  CreateProjectExpensesBatchRequest,
  CreateProjectNoteRequest,
  CreateProjectRoleRequest,
  ProjectExpense,
  ProjectNote,
  ProjectRole,
  UpdateProjectBalanceRequest,
  UpdateProjectExpenseRequest,
  UpdateProjectInventoryStatusRequest,
  UpdateProjectNoteRequest,
  UpdateProjectRequest,
  UpdateProjectRoleRequest,
} from '../types/project/project-expense';
import type { CustomFieldDefinition } from '../types/shared/custom-field-definition';
import type { ListResponse } from '../types/shared/list-response';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { QueryRequest } from '../types/shared/query';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import {
  mergeUpdate,
  projectExpenseToUpdateRequest,
  projectNoteToUpdateRequest,
  projectToUpdateRequest,
} from '../utils/to-update-request';
import type { SearchRequest } from '../types/shared/search-request';

/**
 * Virtuous CRM Project API.
 * @see https://docs.virtuoussoftware.com/#242b03c9-23db-459e-a02d-8b54987282f5
 */
const createProjectClient = (client: AxiosInstance) => ({
  /**
   * Returns a project by unique project code.
   * @see https://docs.virtuoussoftware.com/#242b03c9-23db-459e-a02d-8b54987282f5
   * @param {string} projectCode - Unique project code.
   * @returns {Promise<Project>} The matching project.
   */
  getProjectByCode: (projectCode: string) =>
    client.get<Project>(`/Project/Code/${encodeURIComponent(projectCode)}`).then((r) => r.data),

  /**
   * Returns a project by id.
   * @see https://docs.virtuoussoftware.com/#66885992-1f50-439e-a9fe-bde864ff24d5
   * @param {number} projectId - Project id.
   * @returns {Promise<Project>} The project record.
   */
  getProject: (projectId: number) =>
    client.get<Project>(`/Project/${projectId}`).then((r) => r.data),

  /**
   * Creates a project.
   * @see https://docs.virtuoussoftware.com/#aedd19ae-f342-4daf-b6a5-a2e3bbd1ed55
   * @param {CreateProjectRequest} request - Create body.
   * @param {CreateProjectOptions} [options] - Query options.
   * @returns {Promise<Project>} The created project.
   */
  createProject: (request: CreateProjectRequest, options: CreateProjectOptions = {}) => {
    const disableWebhookUpdates = options.disableWebhookUpdates ?? false;
    return client
      .post<Project>('/Project', request, { params: { disableWebhookUpdates } })
      .then((r) => r.data);
  },

  /**
   * Searches projects by name or code.
   * @see https://docs.virtuoussoftware.com/#find-projects
   * @param {SearchRequest} body - Search term.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<Project>>} Matching projects.
   */
  searchProjects: (body: SearchRequest, params?: SkipTakeParams) =>
    client.post<ListResponse<Project>>('/Project/Search', body, { params }).then((r) => r.data),

  /**
   * Replaces a project. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#aedd19ae-f342-4daf-b6a5-a2e3bbd1ed55
   * @param {number} projectId - Project id.
   * @param {UpdateProjectRequest} request - Full update body.
   * @returns {Promise<Project>} The updated project.
   */
  updateProject: (projectId: number, request: UpdateProjectRequest) =>
    client.put<Project>(`/Project/${projectId}`, request).then((r) => r.data),

  /**
   * GETs the project, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#aedd19ae-f342-4daf-b6a5-a2e3bbd1ed55
   * @param {number} projectId - Project id.
   * @param {Partial<UpdateProjectRequest>} changes - Fields to change.
   * @returns {Promise<Project>} The updated project.
   */
  updateProjectSafely: async (projectId: number, changes: Partial<UpdateProjectRequest>) => {
    const current = await client.get<Project>(`/Project/${projectId}`).then((r) => r.data);
    return client
      .put<Project>(`/Project/${projectId}`, mergeUpdate(projectToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

  /**
   * Bulk-patches projects. Send only fields being changed, including each project `id`.
   * @see https://docs.virtuoussoftware.com/#9345ac2e-bc27-4e33-b38a-18ac5048b084
   * @param {BulkProjectPatch[]} request - Partial project patches.
   * @returns {Promise<unknown>} Bulk update result.
   */
  bulkUpdateProjects: (request: BulkProjectPatch[]) =>
    client.patch<unknown>('/Project', request).then((r) => r.data),

  /**
   * Temporarily changes project inventory status, then restores it.
   * @see https://docs.virtuoussoftware.com/#29dafeff-28ab-4e9f-9794-5f31d97144b3
   * @param {number} projectId - Project id.
   * @param {UpdateProjectInventoryStatusRequest} request - Status and duration.
   * @returns {Promise<Project>} The project record.
   */
  updateProjectInventoryStatus: (projectId: number, request: UpdateProjectInventoryStatusRequest) =>
    client.put<Project>(`/Project/${projectId}/Status`, request).then((r) => r.data),

  /**
   * Sets project beginning and current balances.
   * @see https://docs.virtuoussoftware.com/#a143c7e8-044b-4617-80aa-8db2c13af1fb
   * @param {number} projectId - Project id.
   * @param {UpdateProjectBalanceRequest} request - Balance fields.
   * @returns {Promise<Project>} The project record.
   */
  updateProjectBalance: (projectId: number, request: UpdateProjectBalanceRequest) =>
    client.put<Project>(`/Project/${projectId}/Balance`, request).then((r) => r.data),

  /**
   * Returns enabled custom fields for projects.
   * @see https://docs.virtuoussoftware.com/#e65cd70e-d1d1-41c9-8030-3d594a662ee7
   * @returns {Promise<CustomFieldDefinition[]>} Custom field catalog.
   */
  getProjectCustomFields: () =>
    client.get<CustomFieldDefinition[]>('/Project/CustomFields').then((r) => r.data),

  /**
   * Returns configured project types.
   * @see https://docs.virtuoussoftware.com/#dad7c509-c57f-404f-97dc-f0ccc786d8c3
   * @returns {Promise<string[]>} Project types.
   */
  listProjectTypes: () => client.get<string[]>('/Project/Types').then((r) => r.data),

  /**
   * Returns query fields and operators for projects.
   * @see https://docs.virtuoussoftware.com/#786b0368-f1b2-438e-aac0-325c27774d0a
   * @returns {Promise<QueryOptionsResponse>} Query builder metadata.
   */
  getProjectQueryOptions: () =>
    client.get<QueryOptionsResponse>('/Project/QueryOptions').then((r) => r.data),

  /**
   * Queries projects. Prefer webhooks for new/updated projects. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#f092b678-21d9-4e60-873e-c59a53379384
   * @param {QueryRequest} request - Query body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<Project>>} Matching projects.
   */
  queryProjects: (request: QueryRequest, params?: SkipTakeParams) =>
    client.post<ListResponse<Project>>('/Project/Query', request, { params }).then((r) => r.data),

  /**
   * Returns expenses for a project. Identify the project with `projectId` or `projectCode`.
   * @see https://docs.virtuoussoftware.com/#project-expenses
   * @param {SkipTakeParams & { projectId?: number; projectCode?: string; filter?: string }} [params] - Project selector and pagination.
   * @returns {Promise<ListResponse<ProjectExpense> | ProjectExpense[]>} Project expenses.
   */
  getProjectExpenses: (
    params?: SkipTakeParams & { projectId?: number; projectCode?: string; filter?: string },
  ) => client.get<ListResponse<ProjectExpense> | ProjectExpense[]>('/ProjectExpense', { params }).then((r) => r.data),

  /**
   * Returns a project expense by id.
   * @see https://docs.virtuoussoftware.com/#f092b678-21d9-4e60-873e-c59a53379384
   * @param {number} projectExpenseId - Expense id.
   * @returns {Promise<ProjectExpense>} The expense record.
   */
  getProjectExpense: (projectExpenseId: number) =>
    client.get<ProjectExpense>(`/ProjectExpense/${projectExpenseId}`).then((r) => r.data),

  /**
   * Creates a project expense.
   * @see https://docs.virtuoussoftware.com/#bce73762-d9e1-4d80-9c27-39d2e7439ee4
   * @param {CreateProjectExpenseRequest} request - Expense body.
   * @returns {Promise<ProjectExpense>} The created expense.
   */
  createProjectExpense: (request: CreateProjectExpenseRequest) =>
    client.post<ProjectExpense>('/ProjectExpense', request).then((r) => r.data),

  /**
   * Creates many project expenses in one call.
   * @see https://docs.virtuoussoftware.com/#ad707bb1-b13c-454a-b1f6-5fbf20dcbb87
   * @param {CreateProjectExpensesBatchRequest} request - Batch body.
   * @returns {Promise<unknown>} Batch result.
   */
  createProjectExpensesBatch: (request: CreateProjectExpensesBatchRequest) =>
    client.post<unknown>('/ProjectExpense/Batch', request).then((r) => r.data),

  /**
   * Replaces a project expense. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#88255c06-2743-4009-9ff9-62ebdc52c965
   * @param {number} projectExpenseId - Expense id.
   * @param {UpdateProjectExpenseRequest} request - Full update body.
   * @returns {Promise<ProjectExpense>} The updated expense.
   */
  updateProjectExpense: (projectExpenseId: number, request: UpdateProjectExpenseRequest) =>
    client.put<ProjectExpense>(`/ProjectExpense/${projectExpenseId}`, request).then((r) => r.data),

  /**
   * GETs the expense, merges `changes`, then PUTs the full update body.
   * @param {number} projectExpenseId - Expense id.
   * @param {Partial<UpdateProjectExpenseRequest>} changes - Fields to change.
   * @returns {Promise<ProjectExpense>} The updated expense.
   */
  updateProjectExpenseSafely: async (
    projectExpenseId: number,
    changes: Partial<UpdateProjectExpenseRequest>,
  ) => {
    const current = await client
      .get<ProjectExpense>(`/ProjectExpense/${projectExpenseId}`)
      .then((r) => r.data);
    return client
      .put<ProjectExpense>(
        `/ProjectExpense/${projectExpenseId}`,
        mergeUpdate(projectExpenseToUpdateRequest(current), changes),
      )
      .then((r) => r.data);
  },

  /**
   * Returns notes for a project.
   * @see https://docs.virtuoussoftware.com/#9e70109f-542d-4738-82b9-501e19083501
   * @param {number} projectId - Project id.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<ProjectNote>>} Project notes.
   */
  getNotesForProject: (projectId: number, params?: SkipTakeParams) =>
    client
      .get<ListResponse<ProjectNote>>(`/ProjectNote/ByProject/${projectId}`, { params })
      .then((r) => r.data),

  /**
   * Returns a project note by id.
   * @see https://docs.virtuoussoftware.com/#9e70109f-542d-4738-82b9-501e19083501
   * @param {number} noteId - Note id.
   * @returns {Promise<ProjectNote>} The note record.
   */
  getProjectNote: (noteId: number) =>
    client.get<ProjectNote>(`/ProjectNote/${noteId}`).then((r) => r.data),

  /**
   * Creates a project note.
   * @see https://docs.virtuoussoftware.com/#c92ea39a-446e-494c-9606-a83888937c83
   * @param {CreateProjectNoteRequest} request - Note body.
   * @returns {Promise<ProjectNote>} The created note.
   */
  createProjectNote: (request: CreateProjectNoteRequest) =>
    client.post<ProjectNote>('/ProjectNote', request).then((r) => r.data),

  /**
   * Replaces a project note. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#885be2d4-bb2b-4af3-8ab3-44391be36f93
   * @param {number} noteId - Note id.
   * @param {UpdateProjectNoteRequest} request - Full update body.
   * @returns {Promise<ProjectNote>} The updated note.
   */
  updateProjectNote: (noteId: number, request: UpdateProjectNoteRequest) =>
    client.put<ProjectNote>(`/ProjectNote/${noteId}`, request).then((r) => r.data),

  /**
   * GETs the project note, merges `changes`, then PUTs the full update body.
   * @param {number} noteId - Note id.
   * @param {Partial<UpdateProjectNoteRequest>} changes - Fields to change.
   * @returns {Promise<ProjectNote>} The updated note.
   */
  updateProjectNoteSafely: async (noteId: number, changes: Partial<UpdateProjectNoteRequest>) => {
    const current = await client.get<ProjectNote>(`/ProjectNote/${noteId}`).then((r) => r.data);
    return client
      .put<ProjectNote>(`/ProjectNote/${noteId}`, mergeUpdate(projectNoteToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

  /**
   * Deletes a project note.
   * @see https://docs.virtuoussoftware.com/#c787e851-c0dd-4752-adfb-14408ca35192
   * @param {number} noteId - Note id.
   * @returns {Promise<void>} Resolves when deleted.
   */
  deleteProjectNote: (noteId: number) =>
    client.delete<void>(`/ProjectNote/${noteId}`).then(() => undefined),

  /**
   * Returns configured project note types.
   * @see https://docs.virtuoussoftware.com/#621dc020-fd23-4b36-9681-ab5ded17868c
   * @returns {Promise<string[]>} Note types.
   */
  listProjectNoteTypes: () => client.get<string[]>('/ProjectNote/Types').then((r) => r.data),

  /**
   * Returns project roles for a contact.
   * @see https://docs.virtuoussoftware.com/#7acf7762-4afe-4bf2-a94b-0a59d72f3245
   * @param {number} contactId - Contact id.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<ProjectRole>>} Project roles.
   */
  getProjectRolesForContact: (contactId: number, params?: SkipTakeParams) =>
    client
      .get<ListResponse<ProjectRole>>(`/ProjectRole/ByContact/${contactId}`, { params })
      .then((r) => r.data),

  /**
   * Returns project roles for a project.
   * @see https://docs.virtuoussoftware.com/#project-roles-by-project
   * @param {number} projectId - Project id.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<ProjectRole>>} Project roles.
   */
  getProjectRolesForProject: (projectId: number, params?: SkipTakeParams) =>
    client
      .get<ListResponse<ProjectRole>>(`/ProjectRole/ByProject/${projectId}`, { params })
      .then((r) => r.data),

  /**
   * Returns a project role by id.
   * @see https://docs.virtuoussoftware.com/#7acf7762-4afe-4bf2-a94b-0a59d72f3245
   * @param {number} projectRoleId - Role id.
   * @returns {Promise<ProjectRole>} The role record.
   */
  getProjectRole: (projectRoleId: number) =>
    client.get<ProjectRole>(`/ProjectRole/${projectRoleId}`).then((r) => r.data),

  /**
   * Creates a project role.
   * @see https://docs.virtuoussoftware.com/#ce624a7c-ffe4-4eb7-824d-40be4ef48c76
   * @param {CreateProjectRoleRequest} request - Role body.
   * @returns {Promise<ProjectRole>} The created role.
   */
  createProjectRole: (request: CreateProjectRoleRequest) =>
    client.post<ProjectRole>('/ProjectRole', request).then((r) => r.data),

  /**
   * Updates a project role type.
   * @see https://docs.virtuoussoftware.com/#981c5e6c-1b24-4fcf-8e95-dc588afb2c37
   * @param {number} projectRoleId - Role id.
   * @param {UpdateProjectRoleRequest} request - Role type.
   * @returns {Promise<ProjectRole>} The updated role.
   */
  updateProjectRole: (projectRoleId: number, request: UpdateProjectRoleRequest) =>
    client.put<ProjectRole>(`/ProjectRole/${projectRoleId}`, request).then((r) => r.data),

  /**
   * Deletes a project role.
   * @see https://docs.virtuoussoftware.com/#fc02cab3-aceb-4981-bc91-12ec037d9bf3
   * @param {number} projectRoleId - Role id.
   * @returns {Promise<void>} Resolves when deleted.
   */
  deleteProjectRole: (projectRoleId: number) =>
    client.delete<void>(`/ProjectRole/${projectRoleId}`).then(() => undefined),

  /**
   * Returns configured project role types.
   * @see https://docs.virtuoussoftware.com/#project-role-types
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ListResponse<unknown> | unknown[]>} Role types.
   */
  listProjectRoleTypes: (params?: SkipTakeParams) =>
    client.get<ListResponse<unknown> | unknown[]>('/ProjectRole/Types', { params }).then((r) => r.data),
});

export default createProjectClient;
