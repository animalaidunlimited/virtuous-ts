import { describe, expect, it, vi } from 'vitest';
import type { AxiosInstance } from 'axios';
import createEventClient from '../../src/client/event';
import createGrantClient from '../../src/client/grant';
import createTaskClient from '../../src/client/task';
import createSearchClient from '../../src/client/search';
import createEmailClient from '../../src/client/email';
import createPledgeClient from '../../src/client/pledge';
import createPremiumClient from '../../src/client/premium';
import createGiftAskClient from '../../src/client/gift-ask';
import createSegmentClient from '../../src/client/segment';
import createCommunicationClient from '../../src/client/communication';
import createVolunteerOpportunityClient from '../../src/client/volunteer-opportunity';
import createVolunteerClient from '../../src/client/volunteer';
import createContactMethodClient from '../../src/client/contact-method';
import createTributeClient from '../../src/client/tribute';
import createRelationshipClient from '../../src/client/relationship';
import createOrganizationGroupClient from '../../src/client/organization-group';
import createContactNoteClient from '../../src/client/contact-note';

const mockAxios = () => {
  const client = {
    get: vi.fn().mockResolvedValue({ data: { list: [], total: 0 } }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: undefined }),
    defaults: { baseURL: 'https://api.virtuoussoftware.com/api/' },
  };
  return client as unknown as AxiosInstance & typeof client;
};

describe('new module HTTP paths', () => {
  it('events, grants, tasks, search, email', async () => {
    const axios = mockAxios();
    await createEventClient(axios).queryEvents({ groups: [] });
    expect(axios.post.mock.calls.at(-1)?.[0]).toBe('/Event/Query');
    await createGrantClient(axios).getGrant(1);
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/Grant/1');
    await createTaskClient(axios).createTask({ task: 'Call' });
    expect(axios.post.mock.calls.at(-1)?.[0]).toBe('/Task');
    await createSearchClient(axios).search({ query: 'Ann', filterTypes: ['Contact'] });
    expect(axios.post.mock.calls.at(-1)?.[0]).toBe('/Search');
    await createEmailClient(axios).searchEmails({ search: 'Appeal' });
    expect(axios.post.mock.calls.at(-1)?.[0]).toBe('/Email/Search');
  });

  it('pledges, premiums, gift asks, segments, communications', async () => {
    const axios = mockAxios();
    await createPledgeClient(axios).getPledge(2);
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/v2/Pledge/2');
    await createPremiumClient(axios).getPremiumByCode('BOOK');
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/Premium/Code/BOOK');
    await createGiftAskClient(axios).getGiftAsk(3);
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/GiftAsk/3');
    await createSegmentClient(axios).getSegmentByCode('WIN25');
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/Segment/Code/WIN25');
    await createCommunicationClient(axios).listChannelTypes();
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/Communication/ChannelTypes');
  });

  it('volunteering, contact method, tribute, relationship, org group, notes', async () => {
    const axios = mockAxios();
    await createVolunteerOpportunityClient(axios).getVolunteerOpportunity(4);
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/VolunteerOpportunity/4');
    await createVolunteerClient(axios).createVolunteer(4, { contactIndividualId: 9 });
    expect(axios.post.mock.calls.at(-1)?.[0]).toBe('/VolunteerOpportunity/4/Volunteers');
    await createContactMethodClient(axios).listContactMethodTypes();
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/ContactMethod/Types');
    await createTributeClient(axios).searchTributes({ search: 'Jane' });
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/Tribute/Search');
    await createRelationshipClient(axios).listRelationshipTypes();
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/Relationship/Types');
    await createOrganizationGroupClient(axios).listOrganizationGroups();
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/OrganizationGroup');
    await createContactNoteClient(axios).getNotesForContact(5);
    expect(axios.get.mock.calls.at(-1)?.[0]).toBe('/ContactNote/ByContact/5');
  });
});
