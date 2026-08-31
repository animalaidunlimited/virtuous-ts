import type { AxiosInstance } from 'axios';
import type { ContactIndividual, ContactListResponse } from '../types/contact/contact';
import type { QueryRequest } from '../types/shared/query';
import type { QueryOptionsResponse } from '../types/shared/query-options';
import type { SkipTakeParams } from '../types/shared/skip-take-params';

/**
 * Virtuous CRM Contact Individual identity API (find + query only).
 *
 * Use Find / Query to map an email to `contactIndividualId` (email lists are
 * individual-scoped). Create/update/delete individuals are out of scope.
 *
 * @see https://docs.virtuoussoftware.com/#ba6fb21c-071d-4993-85b0-4777a23d14dd
 */
const createContactIndividualClient = (client: AxiosInstance) => ({
  /**
   * Find an individual by email address (`GET /ContactIndividual/Find`).
   * @see https://docs.virtuoussoftware.com/#ba6fb21c-071d-4993-85b0-4777a23d14dd
   * @param {string} email - Email address to look up.
   * @returns {Promise<ContactIndividual>} The matching individual (includes `contactId`).
   * @throws VirtuousApiError with 404 when not found.
   * @example
   * const individual = await virtuous.contactIndividual.findIndividualByEmail('sarah@example.com');
   */
  findIndividualByEmail: (email: string) =>
    client
      .get<ContactIndividual>('/ContactIndividual/Find', { params: { email } })
      .then((r) => r.data),

  /**
   * Query individuals (`POST /ContactIndividual/Query`).
   * Use `queryIndividualOptions` for valid parameter names. Max `take` is 1,000.
   * The Add-Individuals-to-Email-List docs recommend this for resolving ids.
   * @see https://docs.virtuoussoftware.com/#6f7c7ebb-aa2e-4a22-82c8-0bd07476673a
   * @param {QueryRequest} request - Query body.
   * @param {SkipTakeParams} [params] - Pagination.
   * @returns {Promise<ContactListResponse<ContactIndividual>>} Matching individuals.
   * @example
   * const result = await virtuous.contactIndividual.queryIndividuals(
   *   { groups: [{ conditions: [] }] },
   *   { skip: 0, take: 50 },
   * );
   */
  queryIndividuals: (request: QueryRequest, params?: SkipTakeParams) =>
    client
      .post<ContactListResponse<ContactIndividual>>('/ContactIndividual/Query', request, {
        params,
      })
      .then((r) => r.data),

  /**
   * Get individual query options (`GET /ContactIndividual/QueryOptions`).
   * @see https://docs.virtuoussoftware.com/#1adfce43-e6bd-43c6-9be9-783e48134950
   * @returns {Promise<QueryOptionsResponse>} Fields and operators for Query Individuals.
   * @example
   * const options = await virtuous.contactIndividual.queryIndividualOptions();
   */
  queryIndividualOptions: () =>
    client.get<QueryOptionsResponse>('/ContactIndividual/QueryOptions').then((r) => r.data),
});

export default createContactIndividualClient;
