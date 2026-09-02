import type { AxiosInstance } from 'axios';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type {
  AddIndividualsToEmailListRequest,
  AddIndividualsToEmailListResult,
  EmailListMembershipListResponse,
  EmailListSearchBody,
  EmailListSearchResponse,
} from '../types/email-list/email-list';

/**
 * Virtuous CRM Email List API.
 *
 * Search existing lists, bulk-queue individuals onto lists, and list memberships
 * for an individual. List definitions are created in the CRM UI.
 *
 * @see https://docs.virtuoussoftware.com/#afe46206-15b4-4f20-914e-1cae07d83246
 */
const createEmailListClient = (client: AxiosInstance) => ({
  /**
   * Search email lists whose name matches fully or partially (`POST /EmailList/Search`).
   * @see https://docs.virtuoussoftware.com/#f750634b-e2be-4d49-a472-3e92f51fc382
   * @param {EmailListSearchBody} body - Search term.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<EmailListSearchResponse>} Matching lists.
   * @example
   * const lists = await virtuous.emailList.searchEmailLists({ search: 'August briefing' });
   */
  searchEmailLists: (body: EmailListSearchBody, params?: SkipTakeParams) =>
    client
      .post<EmailListSearchResponse>('/EmailList/Search', body, { params })
      .then((r) => r.data),

  /**
   * Queue individuals onto existing email lists (`POST /EmailList`).
   *
   * Places a message on a queue and returns 202 Accepted. Processing can take
   * up to 4 hours. Do not call this once per individual — batch `contactIndividualIds`
   * (use ContactIndividual Query or Find to resolve ids). Calling one-at-a-time
   * blocks the organization's queue.
   *
   * @see https://docs.virtuoussoftware.com/#afe46206-15b4-4f20-914e-1cae07d83246
   * @param {AddIndividualsToEmailListRequest} request - List ids and individual ids.
   * @returns {Promise<AddIndividualsToEmailListResult>} `{ accepted: true }` after 202.
   * @example
   * await virtuous.emailList.addIndividualsToEmailList({
   *   emailListIds: [42],
   *   contactIndividualIds: [101, 102, 103],
   * });
   */
  addIndividualsToEmailList: (request: AddIndividualsToEmailListRequest) =>
    client
      .post<unknown>('/EmailList', request)
      .then((): AddIndividualsToEmailListResult => ({ accepted: true })),

  /**
   * List email lists an individual belongs to
   * (`GET /ContactIndividual/{contactIndividualId}/EmailList`).
   * @see https://docs.virtuoussoftware.com/#60bf9add-0dcc-47e2-a9a6-5a7201207684
   * @param {number} contactIndividualId - Virtuous individual id.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<EmailListMembershipListResponse>} Membership rows.
   * @example
   * const memberships = await virtuous.emailList.getEmailListsForIndividual(101);
   */
  getEmailListsForIndividual: (contactIndividualId: number, params?: SkipTakeParams) =>
    client
      .get<EmailListMembershipListResponse>(
        `/ContactIndividual/${contactIndividualId}/EmailList`,
        { params },
      )
      .then((r) => r.data),
});

export default createEmailListClient;
