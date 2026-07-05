import type { AxiosInstance } from 'axios';
import type { Project } from '../types/project/project';
import type {
  CreateProjectOptions,
  CreateProjectRequest,
} from '../types/project/project-create';

/**
 * Virtuous CRM Project API.
 * @see https://docs.virtuous.org/api-reference/project/get-project-by-code
 */
const createProjectClient = (client: AxiosInstance) => ({
  /**
   * Get a project by its unique project code.
   * @see https://docs.virtuous.org/api-reference/project/get-project-by-code
   * @param {string} projectCode - Unique project code (URL-encoded on the wire).
   * @returns {Promise<Project>} The matching project.
   * @throws VirtuousApiError with 404 when not found.
   * @example
   * const project = await virtuous.project.getProjectByCode('general-fund');
   */
  getProjectByCode: (projectCode: string) =>
    client
      .get<Project>(`/Project/Code/${encodeURIComponent(projectCode)}`)
      .then((r) => r.data),

  /**
   * Create a new project (`POST /api/Project`).
   * @see https://docs.virtuous.org/api-reference/project/create-project
   * @param {CreateProjectRequest} request - Project fields for the create body.
   * @param {CreateProjectOptions} [options] - Query options (e.g. `disableWebhookUpdates`).
   * @returns {Promise<Project>} The created project.
   * @example
   * import { buildAutoCreateProjectRequest } from 'virtuous-ts';
   * const request = buildAutoCreateProjectRequest('general-fund');
   * const project = await virtuous.project.createProject(request);
   *
   * @example
   * await virtuous.project.createProject(request, { disableWebhookUpdates: true });
   */
  createProject: (
    request: CreateProjectRequest,
    options: CreateProjectOptions = {},
  ) => {
    const disableWebhookUpdates = options.disableWebhookUpdates ?? false;
    return client
      .post<Project>('/Project', request, {
        params: { disableWebhookUpdates },
      })
      .then((r) => r.data);
  },
});

export default createProjectClient;