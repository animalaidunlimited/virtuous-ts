import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import createGiftClient from './client/gift';
import createContactAddressesClient from './client/contact-addresses';
import createContactClient from './client/contact';
import { VirtuousApiErrorResponse, VirtuousApiError } from './errors/virtuous-api-error';
import createRecurringGiftClient from './client/recurring-gift';
import createPlannedGiftClient from './client/planned-gift';

export interface VirtuousConfig {
  baseURL: string;
  apiKey: string;
  timeout?: number; // milliseconds
}

/**
 * VirtuousClient is the main class for interacting with the Virtuous API.
 *
 * @param virtuousConfig - The configuration for the Virtuous client
 * @returns The Virtuous client
 * @example
 * const virtuous = new VirtuousClient({
 *   baseURL: 'https://api.virtuoussoftware.com/api/',
 *   apiKey: 'your-api-key',
 * });
 *
 * const result = await virtuous.gift.createGiftTransaction({
 *   transactionSource: "Online Form",
 *   contact: { email: "donor@example.com", firstname: "Sarah" },
 *   giftType: "Cash",
 *   amount: 100.00,
 *   giftDate: "2025-04-05",
 *   frequency: "OneTime",
 * });
 *
 * await virtuous.recurringGift.updateRecurringGiftSafely(12345, { amount: 500 });
 */
export class VirtuousClient {
  private client: AxiosInstance;
  public gift: ReturnType<typeof createGiftClient>;
  public contactAddresses: ReturnType<typeof createContactAddressesClient>;
  public contact: ReturnType<typeof createContactClient>;
  public recurringGift: ReturnType<typeof createRecurringGiftClient>;
  public plannedGift: ReturnType<typeof createPlannedGiftClient>;

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

    // Response interceptor: normalize all errors to VirtuousApiError
    this.client.interceptors.response.use(
      (res: AxiosResponse) => res,
      (error: AxiosError<VirtuousApiErrorResponse>) => {
        const message =
          error.response?.data?.error_description || error.message || 'Unknown Virtuous API error';

        return Promise.reject(new VirtuousApiError(message, error));
      },
    );

    // Request interceptor: minimal for now (can be extended with retry etc.)
    this.client.interceptors.request.use(
      (axiosConfig: any) => axiosConfig,
      (error: any) => Promise.reject(error),
    );

    this.gift = createGiftClient(this.client);
    this.contactAddresses = createContactAddressesClient(this.client);
    this.contact = createContactClient(this.client);
    this.recurringGift = createRecurringGiftClient(this.client);
    this.plannedGift = createPlannedGiftClient(this.client);
  }

  public setTimeout(ms: number) {
    this.client.defaults.timeout = ms;
  }
}
