import { describe, expect, it, vi } from 'vitest';
import type { AxiosInstance } from 'axios';
import createContactIndividualClient from '../../src/client/contact-individual';

const mockAxios = () => {
  const client = {
    get: vi.fn(),
    post: vi.fn(),
  };
  return client as unknown as AxiosInstance & typeof client;
};

describe('contactIndividual client', () => {
  it('findIndividualByEmail GETs /ContactIndividual/Find with email param', async () => {
    const axios = mockAxios();
    axios.get.mockResolvedValue({ data: { id: 101, contactId: 12345, firstName: 'Sarah' } });
    const contactIndividual = createContactIndividualClient(axios);

    const found = await contactIndividual.findIndividualByEmail('sarah@example.com');

    expect(axios.get).toHaveBeenCalledWith('/ContactIndividual/Find', {
      params: { email: 'sarah@example.com' },
    });
    expect(found.id).toBe(101);
  });

  it('queryIndividuals POSTs /ContactIndividual/Query', async () => {
    const axios = mockAxios();
    axios.post.mockResolvedValue({ data: { list: [], total: 0 } });
    const contactIndividual = createContactIndividualClient(axios);
    const request = { groups: [{ conditions: [] }] };

    await contactIndividual.queryIndividuals(request, { skip: 0, take: 50 });

    expect(axios.post).toHaveBeenCalledWith('/ContactIndividual/Query', request, {
      params: { skip: 0, take: 50 },
    });
  });

  it('queryIndividualOptions GETs /ContactIndividual/QueryOptions', async () => {
    const axios = mockAxios();
    axios.get.mockResolvedValue({ data: { options: [], operatorOptions: [] } });
    const contactIndividual = createContactIndividualClient(axios);

    await contactIndividual.queryIndividualOptions();

    expect(axios.get).toHaveBeenCalledWith('/ContactIndividual/QueryOptions');
  });
});
