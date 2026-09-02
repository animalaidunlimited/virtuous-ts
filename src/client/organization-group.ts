import type { AxiosInstance } from 'axios';
import type {
  OrganizationGroup,
  OrganizationGroupContact,
} from '../types/organization-group/organization-group';
import type { SkipTakeParams } from '../types/shared/skip-take-params';
import type { ListResponse } from '../types/shared/list-response';

/**
 * Virtuous CRM organization group API.
 * @see https://docs.virtuoussoftware.com/#eca74327-f334-4a70-ad67-dbdd04fccd80
 */
const createOrganizationGroupClient = (client: AxiosInstance) => ({
  /**
   * Returns organization groups, optionally filtered by name.
   * @see https://docs.virtuoussoftware.com/#eca74327-f334-4a70-ad67-dbdd04fccd80
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<OrganizationGroup>>}
   */
  listOrganizationGroups: (params?: SkipTakeParams & { filter?: string }): Promise<ListResponse<OrganizationGroup>> => {
    return client.get<ListResponse<OrganizationGroup>>('/OrganizationGroup', { params }).then((r) => r.data);
  },

  /**
   * Returns organization groups the contact belongs to.
   * @see https://docs.virtuoussoftware.com/#84f881df-27cc-44ce-b8f6-ff5f647b7acf
   * @param {number} contactId - Contact id.
   * @returns {Promise<OrganizationGroup[]>}
   */
  getOrganizationGroupsForContact: (contactId: number): Promise<OrganizationGroup[]> => {
    return client.get<OrganizationGroup[]>(`/OrganizationGroup/ByContact/${contactId}`).then((r) => r.data);
  },

  /**
   * Returns contacts in an organization group.
   * @see https://docs.virtuoussoftware.com/#9bf99237-b0b4-4778-9d1b-dd725d4c5087
   * @param {number} organizationGroupId - Organization Group id.
   * @param {SkipTakeParams} params - Query parameters.
   * @returns {Promise<ListResponse<OrganizationGroupContact>>}
   */
  getContactsInOrganizationGroup: (organizationGroupId: number, params?: SkipTakeParams): Promise<ListResponse<OrganizationGroupContact>> => {
    return client.get<ListResponse<OrganizationGroupContact>>(`/OrganizationGroup/${organizationGroupId}/contacts`, { params }).then((r) => r.data);
  },

  /**
   * Returns an organization group by id.
   * @see https://docs.virtuoussoftware.com/#28890529-872e-4420-8c8f-12aeb4444d23
   * @param {number} organizationGroupId - Organization Group id.
   * @returns {Promise<OrganizationGroup>}
   */
  getOrganizationGroup: (organizationGroupId: number): Promise<OrganizationGroup> => {
    return client.get<OrganizationGroup>(`/OrganizationGroup/${organizationGroupId}`).then((r) => r.data);
  },

  /**
   * Adds a contact to an organization group.
   * @see https://docs.virtuoussoftware.com/#2d9bad2d-0922-4f27-b2b3-a0acb1b34de5
   * @param {number} organizationGroupId - Organization Group id.
   * @param {number} contactId - Contact id.
   * @returns {Promise<void>}
   */
  addContactToOrganizationGroup: (organizationGroupId: number, contactId: number): Promise<void> => {
    return client.put<void>(`/OrganizationGroup/${organizationGroupId}/contacts/${contactId}`, {}).then(() => undefined);
  },

  /**
   * Removes a contact from an organization group.
   * @see https://docs.virtuoussoftware.com/#80972d99-32fd-42de-965c-13c44010b931
   * @param {number} organizationGroupId - Organization Group id.
   * @param {number} contactId - Contact id.
   * @returns {Promise<void>}
   */
  removeContactFromOrganizationGroup: (organizationGroupId: number, contactId: number): Promise<void> => {
    return client.delete<void>(`/OrganizationGroup/${organizationGroupId}/contacts/${contactId}`).then(() => undefined);
  },

});

export default createOrganizationGroupClient;
