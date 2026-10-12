import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import createGiftClient from './client/gift';
import createContactAddressesClient from './client/contact-addresses';
import createContactClient from './client/contact';
import { VirtuousApiErrorResponse, VirtuousApiError } from './errors/virtuous-api-error';
import createRecurringGiftClient from './client/recurring-gift';
import createPlannedGiftClient from './client/planned-gift';
import createProjectClient from './client/project';
import createContactNoteClient from './client/contact-note';
import createContactTagClient from './client/contact-tag';
import createEmailListClient from './client/email-list';
import createContactIndividualClient from './client/contact-individual';
import createAccountClient from './client/account';
import createContactMethodClient from './client/contact-method';
import createContactReferenceClient from './client/contact-reference';
import createOrganizationGroupClient from './client/organization-group';
import createRelationshipClient from './client/relationship';
import createTributeClient from './client/tribute';
import createGiftAskClient from './client/gift-ask';
import createPledgeClient from './client/pledge';
import createPremiumClient from './client/premium';
import createCampaignClient from './client/campaign';
import createCommunicationClient from './client/communication';
import createSegmentClient from './client/segment';
import createEventClient from './client/event';
import createEventAttendeeClient from './client/event-attendee';
import createEventContactClient from './client/event-contact';
import createGrantClient from './client/grant';
import createVolunteerOpportunityClient from './client/volunteer-opportunity';
import createVolunteerClient from './client/volunteer';
import createEmailClient from './client/email';
import createSearchClient from './client/search';
import createTaskClient from './client/task';
import createWebhookClient from './client/webhook';
import { attachRateLimitTracker, RateLimitTracker, VirtuousRateLimitError } from './http/rate-limit';
import type { RateLimitStatus } from './http/rate-limit';
import { attachRetry, resolveRetryOptions } from './http/retry';
import type { RetryOptions } from './http/retry';
import { attachReadOnlyGuard } from './http/read-only-guard';
import { QueryOptionsCache } from './http/query-options-cache';

/** Documented Virtuous REST origin. `baseURL` stays required on the client. */
export const DEFAULT_BASE_URL = 'https://api.virtuoussoftware.com/api/';

/**
 * Connection and optional resilience settings.
 *
 * `{ baseURL, apiKey }` is the 1.0 shape and behaves the same as 1.0:
 * no retries, no reserve guard, no query validation, no read-only block.
 * Header tracking is passive and always on. It does not add requests.
 */
export interface VirtuousConfig {
  /** API origin, including the `/api/` path. Required. See {@link DEFAULT_BASE_URL}. */
  baseURL: string;
  /** Bearer token from Settings, Connectivity, API Keys. */
  apiKey: string;
  /** Axios timeout in milliseconds. Default 30,000. */
  timeout?: number;
  /**
   * Retry transient failures. Default off.
   * `undefined` or `false` installs no retry interceptor.
   * `true` or `{}` enables defaults: 3 retries, 500ms base, 30s cap,
   * statuses 429, 502, 503, 504. Writes are not retried unless
   * `retryNonIdempotent` is true.
   */
  retry?: RetryOptions | boolean;
  /**
   * When true, query methods load QueryOptions (cached one hour) and throw
   * `VirtuousQueryValidationError` before posting a bad body. Default false.
   */
  validateQueries?: boolean;
  /**
   * When true, reject PUT, PATCH, DELETE, and write POSTs before they are sent.
   * GET, HEAD, OPTIONS, and read POSTs (`/Query`, `/Search`, `/Proximity`) pass.
   * Default false. Does not apply the live-suite 40-call cap.
   */
  readOnly?: boolean;
  /**
   * If set, reject a request before send when `X-RateLimit-Remaining` is
   * known and `<= rateLimitReserve`. Undefined means no guard.
   */
  rateLimitReserve?: number;
  /** Called after each response updates the rate-limit snapshot. */
  onRateLimit?: (status: RateLimitStatus) => void;
}

/**
 * Typed client for the Virtuous CRM REST API.
 *
 * @param virtuousConfig - API base URL, bearer token, and optional timeout
 * @returns The Virtuous client
 * @example
 * const virtuous = new VirtuousClient({
 *   baseURL: 'https://api.virtuoussoftware.com/api/',
 *   apiKey: 'your-api-key',
 * });
 *
 * await virtuous.gift.createGiftTransaction({
 *   transactionSource: 'Online Form',
 *   contact: { email: 'donor@example.com', firstname: 'Sarah' },
 *   giftType: 'Cash',
 *   amount: 100.00,
 *   giftDate: '2025-04-05',
 *   frequency: 'OneTime',
 * });
 */
export class VirtuousClient {
  private client: AxiosInstance;
  private readonly rateLimitTracker = new RateLimitTracker();
  /** Shared QueryOptions cache. One hour per resource. Used when `validateQueries` is on. */
  public readonly queryOptionsCache = new QueryOptionsCache();
  /** True when query methods should validate before POST. */
  public readonly validateQueries: boolean;
  public account: ReturnType<typeof createAccountClient>;
  public gift: ReturnType<typeof createGiftClient>;
  public giftAsk: ReturnType<typeof createGiftAskClient>;
  public pledge: ReturnType<typeof createPledgeClient>;
  public premium: ReturnType<typeof createPremiumClient>;
  public contactAddresses: ReturnType<typeof createContactAddressesClient>;
  public contact: ReturnType<typeof createContactClient>;
  public contactMethod: ReturnType<typeof createContactMethodClient>;
  public contactReference: ReturnType<typeof createContactReferenceClient>;
  public organizationGroup: ReturnType<typeof createOrganizationGroupClient>;
  public relationship: ReturnType<typeof createRelationshipClient>;
  public tribute: ReturnType<typeof createTributeClient>;
  public recurringGift: ReturnType<typeof createRecurringGiftClient>;
  public plannedGift: ReturnType<typeof createPlannedGiftClient>;
  public project: ReturnType<typeof createProjectClient>;
  public contactNote: ReturnType<typeof createContactNoteClient>;
  public contactTag: ReturnType<typeof createContactTagClient>;
  public emailList: ReturnType<typeof createEmailListClient>;
  public email: ReturnType<typeof createEmailClient>;
  public contactIndividual: ReturnType<typeof createContactIndividualClient>;
  public campaign: ReturnType<typeof createCampaignClient>;
  public communication: ReturnType<typeof createCommunicationClient>;
  public segment: ReturnType<typeof createSegmentClient>;
  public event: ReturnType<typeof createEventClient>;
  public eventAttendee: ReturnType<typeof createEventAttendeeClient>;
  public eventContact: ReturnType<typeof createEventContactClient>;
  public grant: ReturnType<typeof createGrantClient>;
  public volunteerOpportunity: ReturnType<typeof createVolunteerOpportunityClient>;
  public volunteer: ReturnType<typeof createVolunteerClient>;
  public search: ReturnType<typeof createSearchClient>;
  public task: ReturnType<typeof createTaskClient>;
  public webhook: ReturnType<typeof createWebhookClient>;

  constructor(virtuousConfig: VirtuousConfig) {
    if (!virtuousConfig.apiKey) {
      throw new Error('VirtuousClient requires apiKey');
    }

    this.validateQueries = virtuousConfig.validateQueries ?? false;

    this.client = axios.create({
      baseURL: virtuousConfig.baseURL,
      headers: {
        Authorization: `Bearer ${virtuousConfig.apiKey!}`,
        'Content-Type': 'application/json',
      },
      timeout: virtuousConfig.timeout ?? 30_000,
    });

    attachRateLimitTracker(this.client, this.rateLimitTracker, {
      reserve: virtuousConfig.rateLimitReserve,
      onUpdate: virtuousConfig.onRateLimit,
    });

    if (virtuousConfig.readOnly) {
      attachReadOnlyGuard(this.client, { enforceCallCap: false });
    }

    // Register retry before the error wrapper. Axios runs response error
    // interceptors newest-first, so the wrapper sees only the final failure.
    const retry = resolveRetryOptions(virtuousConfig.retry);
    if (retry) {
      attachRetry(this.client, retry);
    }

    this.client.interceptors.response.use(
      (res: AxiosResponse) => res,
      (error: AxiosError<VirtuousApiErrorResponse> | Error) => {
        // Request guards throw plain errors. Leave them alone so callers see
        // VirtuousRateLimitError and the read-only block, not a wrapped API error.
        if (error instanceof VirtuousRateLimitError || !axios.isAxiosError(error)) {
          return Promise.reject(error);
        }
        const message =
          error.response?.data?.error_description || error.message || 'Unknown Virtuous API error';
        const retryCount = (error.config as { __retryCount?: number } | undefined)?.__retryCount ?? 0;

        return Promise.reject(new VirtuousApiError(message, error, retryCount + 1));
      },
    );

    const clientOptions = {
      validateQueries: this.validateQueries,
      queryOptionsCache: this.queryOptionsCache,
    };

    this.account = createAccountClient(this.client);
    this.gift = createGiftClient(this.client, clientOptions);
    this.giftAsk = createGiftAskClient(this.client);
    this.pledge = createPledgeClient(this.client);
    this.premium = createPremiumClient(this.client);
    this.contactAddresses = createContactAddressesClient(this.client);
    this.contact = createContactClient(this.client, clientOptions);
    this.contactMethod = createContactMethodClient(this.client);
    this.contactReference = createContactReferenceClient(this.client);
    this.organizationGroup = createOrganizationGroupClient(this.client);
    this.relationship = createRelationshipClient(this.client);
    this.tribute = createTributeClient(this.client);
    this.recurringGift = createRecurringGiftClient(this.client, clientOptions);
    this.plannedGift = createPlannedGiftClient(this.client, clientOptions);
    this.project = createProjectClient(this.client, clientOptions);
    this.contactNote = createContactNoteClient(this.client, clientOptions);
    this.contactTag = createContactTagClient(this.client);
    this.emailList = createEmailListClient(this.client);
    this.email = createEmailClient(this.client);
    this.contactIndividual = createContactIndividualClient(this.client);
    this.campaign = createCampaignClient(this.client, clientOptions);
    this.communication = createCommunicationClient(this.client);
    this.segment = createSegmentClient(this.client);
    this.event = createEventClient(this.client);
    this.eventAttendee = createEventAttendeeClient(this.client);
    this.eventContact = createEventContactClient(this.client);
    this.grant = createGrantClient(this.client);
    this.volunteerOpportunity = createVolunteerOpportunityClient(this.client);
    this.volunteer = createVolunteerClient(this.client);
    this.search = createSearchClient(this.client);
    this.task = createTaskClient(this.client);
    this.webhook = createWebhookClient(this.client);
  }

  public setTimeout(ms: number) {
    this.client.defaults.timeout = ms;
  }

  /**
   * Latest rate-limit snapshot from response headers.
   * Null fields mean no response has reported that header yet.
   * This does not send a request.
   *
   * @returns Limit, remaining, reset time, and the local request count.
   */
  public getRateLimitStatus(): RateLimitStatus {
    return this.rateLimitTracker.status();
  }
}
