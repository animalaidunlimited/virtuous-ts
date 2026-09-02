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

export interface VirtuousConfig {
  baseURL: string;
  apiKey: string;
  timeout?: number;
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

    this.client = axios.create({
      baseURL: virtuousConfig.baseURL,
      headers: {
        Authorization: `Bearer ${virtuousConfig.apiKey!}`,
        'Content-Type': 'application/json',
      },
      timeout: virtuousConfig.timeout ?? 30_000,
    });

    this.client.interceptors.response.use(
      (res: AxiosResponse) => res,
      (error: AxiosError<VirtuousApiErrorResponse>) => {
        const message =
          error.response?.data?.error_description || error.message || 'Unknown Virtuous API error';

        return Promise.reject(new VirtuousApiError(message, error));
      },
    );

    this.client.interceptors.request.use(
      (axiosConfig: any) => axiosConfig,
      (error: any) => Promise.reject(error),
    );

    this.account = createAccountClient(this.client);
    this.gift = createGiftClient(this.client);
    this.giftAsk = createGiftAskClient(this.client);
    this.pledge = createPledgeClient(this.client);
    this.premium = createPremiumClient(this.client);
    this.contactAddresses = createContactAddressesClient(this.client);
    this.contact = createContactClient(this.client);
    this.contactMethod = createContactMethodClient(this.client);
    this.contactReference = createContactReferenceClient(this.client);
    this.organizationGroup = createOrganizationGroupClient(this.client);
    this.relationship = createRelationshipClient(this.client);
    this.tribute = createTributeClient(this.client);
    this.recurringGift = createRecurringGiftClient(this.client);
    this.plannedGift = createPlannedGiftClient(this.client);
    this.project = createProjectClient(this.client);
    this.contactNote = createContactNoteClient(this.client);
    this.contactTag = createContactTagClient(this.client);
    this.emailList = createEmailListClient(this.client);
    this.email = createEmailClient(this.client);
    this.contactIndividual = createContactIndividualClient(this.client);
    this.campaign = createCampaignClient(this.client);
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
}
