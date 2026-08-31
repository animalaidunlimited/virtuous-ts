import { describe, expect, it, vi } from 'vitest';
import type { AxiosInstance } from 'axios';
import createContactTagClient from '../../src/client/contact-tag';

const mockAxios = () => {
  const client = {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  };
  return client as unknown as AxiosInstance & typeof client;
};

describe('contactTag client', () => {
  it('listAllTags GETs /Tag with skip/take', async () => {
    const axios = mockAxios();
    axios.get.mockResolvedValue({ data: { list: [], total: 0 } });
    const contactTag = createContactTagClient(axios);

    await contactTag.listAllTags({ skip: 0, take: 50 });

    expect(axios.get).toHaveBeenCalledWith('/Tag', { params: { skip: 0, take: 50 } });
  });

  it('searchTags POSTs /Tag/Search with search body', async () => {
    const axios = mockAxios();
    axios.post.mockResolvedValue({ data: { list: [{ id: 9, tagName: 'Briefing' }], total: 1 } });
    const contactTag = createContactTagClient(axios);

    const result = await contactTag.searchTags({ search: 'Briefing' }, { take: 10 });

    expect(axios.post).toHaveBeenCalledWith(
      '/Tag/Search',
      { search: 'Briefing' },
      { params: { take: 10 } },
    );
    expect(result.list[0]?.id).toBe(9);
  });

  it('getTagsForContact GETs /ContactTag/ByContact/{id}', async () => {
    const axios = mockAxios();
    axios.get.mockResolvedValue({ data: { list: [], total: 0 } });
    const contactTag = createContactTagClient(axios);

    await contactTag.getTagsForContact(12345, { skip: 0, take: 10 });

    expect(axios.get).toHaveBeenCalledWith('/ContactTag/ByContact/12345', {
      params: { skip: 0, take: 10 },
    });
  });

  it('createContactTag POSTs /ContactTag with tagId and contactId', async () => {
    const axios = mockAxios();
    axios.post.mockResolvedValue({
      data: { contactTagId: 77, tagId: 9, contactId: 12345, name: 'Briefing', total: 1 },
    });
    const contactTag = createContactTagClient(axios);

    const applied = await contactTag.createContactTag({ tagId: 9, contactId: 12345 });

    expect(axios.post).toHaveBeenCalledWith('/ContactTag', { tagId: 9, contactId: 12345 });
    expect(applied.contactTagId).toBe(77);
  });

  it('deleteContactTag DELETEs /ContactTag/{contactTagId}', async () => {
    const axios = mockAxios();
    axios.delete.mockResolvedValue({ data: undefined });
    const contactTag = createContactTagClient(axios);

    await contactTag.deleteContactTag(77);

    expect(axios.delete).toHaveBeenCalledWith('/ContactTag/77');
  });
});
