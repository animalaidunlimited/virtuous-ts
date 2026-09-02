import type { AxiosInstance } from 'axios';
import type {
  Email,
  SendEmailRequest,
} from '../types/email/email';
import type { SearchRequest } from '../types/shared/search-request';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { ListResponse } from '../types/shared/list-response';

/**
 * Virtuous CRM email API.
 * @see https://docs.virtuoussoftware.com/#3ba9aeda-8fb4-4f30-8d4a-b4b78aa81ed8
 */
const createEmailClient = (client: AxiosInstance) => ({
  /**
   * Searches saved emails by name.
   * @see https://docs.virtuoussoftware.com/#3ba9aeda-8fb4-4f30-8d4a-b4b78aa81ed8
   * @param {SearchRequest} request - Request body.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<Email>>}
   */
  searchEmails: (request: SearchRequest, params?: SkipTakeParams): Promise<ListResponse<Email>> => {
    return client.post<ListResponse<Email>>('/Email/Search', request, { params }).then((r) => r.data);
  },

  /**
   * Sends a saved email to a list of contacts.
   * @see https://docs.virtuoussoftware.com/#b1cf0016-8800-49b4-aba5-317ea47aa93d
   * @param {SendEmailRequest} request - Request body.
   * @returns {Promise<Record<string, unknown>>}
   */
  sendEmail: (request: SendEmailRequest): Promise<Record<string, unknown>> => {
    return client.post<Record<string, unknown>>('/Email/Send', request).then((r) => r.data);
  },

});

export default createEmailClient;
