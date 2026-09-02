import { mergeUpdate, webhookToUpdateRequest } from '../utils/to-update-request';
import type { AxiosInstance } from 'axios';
import type {
  CreateWebhookRequest,
  UpdateWebhookRequest,
  Webhook,
} from '../types/webhook/webhook';

/**
 * Virtuous CRM webhook API.
 * @see https://docs.virtuoussoftware.com/#89cebbe6-2ffa-4775-a021-41aa0cd5c435
 */
const createWebhookClient = (client: AxiosInstance) => ({
  /**
   * Returns a webhook by id.
   * @see https://docs.virtuoussoftware.com/#89cebbe6-2ffa-4775-a021-41aa0cd5c435
   * @param {number} webhookId - Webhook id.
   * @returns {Promise<Webhook>}
   */
  getWebhook: (webhookId: number): Promise<Webhook> => {
    return client.get<Webhook>(`/Webhook/${webhookId}`).then((r) => r.data);
  },

  /**
   * Creates a webhook subscription.
   * @see https://docs.virtuoussoftware.com/#04dc3569-e386-46fc-b6c9-136452d4851f
   * @param {CreateWebhookRequest} request - Request body.
   * @returns {Promise<Webhook>}
   */
  createWebhook: (request: CreateWebhookRequest): Promise<Webhook> => {
    return client.post<Webhook>('/Webhook', request).then((r) => r.data);
  },

  /**
   * Replaces a webhook. Omitted properties are cleared.
   * @see https://docs.virtuoussoftware.com/#9a56ffb2-cd97-4b52-99b3-067c0fe0842e
   * @param {number} webhookId - Webhook id.
   * @param {UpdateWebhookRequest} request - Request body.
   * @returns {Promise<Webhook>}
   */
  updateWebhook: (webhookId: number, request: UpdateWebhookRequest): Promise<Webhook> => {
    return client.put<Webhook>(`/Webhook/${webhookId}`, request).then((r) => r.data);
  },

  /**
   * GETs the webhook, merges `changes`, then PUTs the full update body.
   * @see https://docs.virtuoussoftware.com/#9a56ffb2-cd97-4b52-99b3-067c0fe0842e
   * @param {number} webhookId - Webhook id.
   * @param {Partial<UpdateWebhookRequest>} changes - Fields to change.
   * @returns {Promise<Webhook>} The updated webhook.
   */
  updateWebhookSafely: async (
    webhookId: number,
    changes: Partial<UpdateWebhookRequest>,
  ): Promise<Webhook> => {
    const current = await client.get<Webhook>(`/Webhook/${webhookId}`).then((r) => r.data);
    return client
      .put<Webhook>(`/Webhook/${webhookId}`, mergeUpdate(webhookToUpdateRequest(current), changes))
      .then((r) => r.data);
  },

  /**
   * Sets whether a webhook is active.
   * @see https://docs.virtuoussoftware.com/#2ee75c65-99ae-4fa4-b599-d3b2dbd6fb4a
   * @param {number} webhookId - Webhook id.
   * @param {object} params - Query parameters.
   * @returns {Promise<void>}
   */
  setWebhookActive: (webhookId: number, params?: { active?: boolean }): Promise<void> => {
    return client.put<void>(`/Webhook/${webhookId}/Active`, {}, { params }).then(() => undefined);
  },

  /**
   * Deletes a webhook.
   * @see https://docs.virtuoussoftware.com/#d3d82fae-0865-4893-aa59-5ca64273ddd5
   * @param {number} webhookId - Webhook id.
   * @returns {Promise<void>}
   */
  deleteWebhook: (webhookId: number): Promise<void> => {
    return client.delete<void>(`/Webhook/${webhookId}`).then(() => undefined);
  },

});

export default createWebhookClient;
