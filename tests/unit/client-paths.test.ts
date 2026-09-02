import { describe, expect, it, vi } from 'vitest';
import type { AxiosInstance } from 'axios';
import { VirtuousClient } from '../../src/index';
import createPlannedGiftClient from '../../src/client/planned-gift';
import createRecurringGiftClient from '../../src/client/recurring-gift';
import createGiftClient from '../../src/client/gift';
import createContactClient from '../../src/client/contact';
import createProjectClient from '../../src/client/project';
import createCampaignClient from '../../src/client/campaign';
import createWebhookClient from '../../src/client/webhook';
import createAccountClient from '../../src/client/account';

const mockAxios = () => {
  const client = {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: undefined }),
    defaults: { baseURL: 'https://api.virtuoussoftware.com/api/' },
  };
  return client as unknown as AxiosInstance & typeof client;
};

describe('path corrections and new endpoints', () => {
  it('planned gift applied gifts uses /PlannedGift/{id}/Gifts', async () => {
    const axios = mockAxios();
    await createPlannedGiftClient(axios).getGiftsAppliedToPlannedGift(12);
    expect(axios.get).toHaveBeenCalledWith('/PlannedGift/12/Gifts', { params: undefined });
  });

  it('recurring gift payments uses /RecurringGiftPayment/{id}', async () => {
    const axios = mockAxios();
    await createRecurringGiftClient(axios).getPaymentForRecurringGift(44);
    expect(axios.get).toHaveBeenCalledWith('/RecurringGiftPayment/44', { params: undefined });
  });

  it('gift transaction posts v2 transaction and batch paths', async () => {
    const axios = mockAxios();
    const gift = createGiftClient(axios);
    await gift.createGiftTransaction({
      transactionSource: 'Web',
      contact: { email: 'a@b.c' },
      giftType: 'Cash',
      amount: 10,
      giftDate: '2026-01-01',
      frequency: 'OneTime',
    });
    expect(axios.post.mock.calls[0][0]).toBe('/v2/Gift/Transaction');
    await gift.createGiftTransactions({ transactionSource: 'Web', transactions: [] });
    expect(axios.post.mock.calls[1][0]).toBe('/v2/Gift/Transactions');
    await gift.bulkUpdateGifts([{ id: 1, notes: 'x' }]);
    expect(axios.patch).toHaveBeenCalledWith('/Gift', [{ id: 1, notes: 'x' }]);
  });

  it('contact transaction and receipt file payload', async () => {
    const axios = mockAxios();
    const contact = createContactClient(axios);
    await contact.createContactTransaction({ email: 'a@b.c', firstName: 'A' });
    expect(axios.post.mock.calls[0][0]).toBe('/Contact/Transaction');
    await contact.getReceiptPdfById(9);
    expect(axios.get).toHaveBeenCalledWith('/Contact/Receipts/9');
  });

  it('project query and campaign get', async () => {
    const axios = mockAxios();
    await createProjectClient(axios).queryProjects({ groups: [] }, { skip: 0, take: 10 });
    expect(axios.post).toHaveBeenCalledWith('/Project/Query', { groups: [] }, { params: { skip: 0, take: 10 } });
    await createCampaignClient(axios).getCampaign(3);
    expect(axios.get).toHaveBeenCalledWith('/Campaign/3');
  });

  it('webhook CRUD and account token origin', async () => {
    const axios = mockAxios();
    await createWebhookClient(axios).createWebhook({ payloadUrl: 'https://example.com/hook' });
    expect(axios.post.mock.calls[0][0]).toBe('/Webhook');
    await createAccountClient(axios).getToken({
      grant_type: 'password',
      username: 'user@example.com',
      password: 'secret',
    });
    expect(axios.post.mock.calls[1][0]).toBe('https://api.virtuoussoftware.com/Token');
  });

  it('updateContactSafely GETs then PUTs a merged body', async () => {
    const axios = mockAxios();
    axios.get.mockResolvedValue({
      data: {
        id: 5,
        contactType: 'Household',
        name: 'Smith',
        informalName: null,
        description: null,
        website: null,
        maritalStatus: null,
        anniversaryMonth: null,
        anniversaryDay: null,
        anniversaryYear: null,
        originSegmentId: null,
        isPrivate: false,
        customFields: [],
      },
    });
    const contact = createContactClient(axios);
    await contact.updateContactSafely(5, { description: 'Board member' });
    expect(axios.get).toHaveBeenCalledWith('/Contact/5');
    const putBody = axios.put.mock.calls[0][1];
    expect(putBody.name).toBe('Smith');
    expect(putBody.description).toBe('Board member');
  });

  it('VirtuousClient wires new modules', () => {
    const client = new VirtuousClient({
      baseURL: 'https://api.virtuoussoftware.com/api/',
      apiKey: 'test-key',
    });
    expect(client.campaign).toBeDefined();
    expect(client.event).toBeDefined();
    expect(client.grant).toBeDefined();
    expect(client.webhook).toBeDefined();
    expect(client.task).toBeDefined();
    expect(client.volunteer).toBeDefined();
    expect(client.account).toBeDefined();
  });
});
