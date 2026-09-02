import type { AxiosInstance } from 'axios';
import type {
  CreateTaskRequest,
  Task,
} from '../types/task/task';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { ListResponse } from '../types/shared/list-response';

/**
 * Virtuous CRM task API.
 * @see https://docs.virtuoussoftware.com/#92a9f52b-b399-485b-a538-353b38b39cb5
 */
const createTaskClient = (client: AxiosInstance) => ({
  /**
   * Creates a task.
   * @see https://docs.virtuoussoftware.com/#92a9f52b-b399-485b-a538-353b38b39cb5
   * @param {CreateTaskRequest} request - Request body.
   * @returns {Promise<Task>}
   */
  createTask: (request: CreateTaskRequest): Promise<Task> => {
    return client.post<Task>('/Task', request).then((r) => r.data);
  },

  /**
   * Returns default and configured task types.
   * @see https://docs.virtuoussoftware.com/#d1e0880d-9e9a-41b7-a424-4b2db747c07c
   * @returns {Promise<string[]>}
   */
  listTaskTypes: (): Promise<string[]> => {
    return client.get<string[]>('/Task/Types').then((r) => r.data);
  },

  /**
   * Queries tasks. Max take is 1,000.
   * @see https://docs.virtuoussoftware.com/#c3765875-59ac-44c8-8925-a12b35884817
   * @param {QueryRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Task>>}
   */
  queryTasks: (request: QueryRequest, params?: SkipTakeParams): Promise<ListResponse<Task>> => {
    return client.post<ListResponse<Task>>('/Task/Query', request, { params }).then((r) => r.data);
  },

  /**
   * Returns query fields and operators for tasks.
   * @see https://docs.virtuoussoftware.com/#bf5703dc-93d5-4527-a61c-803ea9518e2b
   * @returns {Promise<QueryOptionsResponse>}
   */
  getTaskQueryOptions: (): Promise<QueryOptionsResponse> => {
    return client.get<QueryOptionsResponse>('/Task/QueryOptions').then((r) => r.data);
  },

});

export default createTaskClient;
