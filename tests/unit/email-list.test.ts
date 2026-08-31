import { describe, expect, it, vi } from 'vitest';
import type { AxiosInstance } from 'axios';
import createEmailListClient from '../../src/client/email-list';

const mockAxios = () => {
  const client = {
    get: vi.fn(),
    post: vi.fn(),
  };
  return client as unknown as AxiosInstance & typeof client;
};

describe('emailList client', () => {
  it('searchEmailLists POSTs /EmailList/Search', async () => {
    const axios = mockAxios();
    axios.post.mockResolvedValue({
      data: { list: [{ emailListId: 42, name: 'August briefing', total: 0, totalUnsubscribes: 0 }], total: 1 },
    });
    const emailList = createEmailListClient(axios);

    const result = await emailList.searchEmailLists({ search: 'August briefing' }, { take: 25 });

    expect(axios.post).toHaveBeenCalledWith(
      '/EmailList/Search',
      { search: 'August briefing' },
      { params: { take: 25 } },
    );
    expect(result.list[0]?.emailListId).toBe(42);
  });

  it('addIndividualsToEmailList POSTs /EmailList with both id arrays and returns accepted', async () => {
    const axios = mockAxios();
    axios.post.mockResolvedValue({ status: 202, data: {} });
    const emailList = createEmailListClient(axios);

    const result = await emailList.addIndividualsToEmailList({
      emailListIds: [42],
      contactIndividualIds: [101, 102],
    });

    expect(axios.post).toHaveBeenCalledWith('/EmailList', {
      emailListIds: [42],
      contactIndividualIds: [101, 102],
    });
    expect(result).toEqual({ accepted: true });
  });

  it('getEmailListsForIndividual GETs /ContactIndividual/{id}/EmailList', async () => {
    const axios = mockAxios();
    axios.get.mockResolvedValue({ data: { list: [], total: 0 } });
    const emailList = createEmailListClient(axios);

    await emailList.getEmailListsForIndividual(101, { skip: 0, take: 10 });

    expect(axios.get).toHaveBeenCalledWith('/ContactIndividual/101/EmailList', {
      params: { skip: 0, take: 10 },
    });
  });
});
