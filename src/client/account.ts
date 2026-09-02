import type { AxiosInstance } from 'axios';
import type {
  OAuthTokenRequest,
  OAuthTokenResponse,
  Organization,
  Permission,
  SwitchOrganizationRequest,
} from '../types/account/account';

/**
 * Virtuous CRM account API.
 * @see https://docs.virtuoussoftware.com/#899b354a-86a1-41e9-ac40-303cfd0ccda5
 */
const createAccountClient = (client: AxiosInstance) => ({
  /**
   * Exchanges user credentials for an OAuth token. Prefer API keys for server integrations.
   * Posts to /Token on the API origin (not under /api).
   * @see https://docs.virtuoussoftware.com/#899b354a-86a1-41e9-ac40-303cfd0ccda5
   * @param {OAuthTokenRequest} request - Request body.
   * @returns {Promise<OAuthTokenResponse>}
   */
  getToken: (request: OAuthTokenRequest): Promise<OAuthTokenResponse> => {
    const apiBase = client.defaults.baseURL ?? '';
    const origin = apiBase.replace(/\/api\/?$/, '');
    const params = new URLSearchParams();
    params.set('grant_type', request.grant_type);
    if (request.grant_type === 'refresh_token') {
      if (request.refresh_token) params.set('refresh_token', request.refresh_token);
    } else {
      if (request.username) params.set('username', request.username);
      if (request.password) params.set('password', request.password);
    }
    if (request.otp) params.set('otp', request.otp);
    return client
      .post<OAuthTokenResponse>(`${origin}/Token`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then((r) => r.data);
  },

  /**
   * Returns organizations the authenticated user belongs to.
   * @see https://docs.virtuoussoftware.com/#c097204e-dbd7-4ad9-8ca8-ee9961d16e1a
   * @returns {Promise<Organization[]>}
   */
  listOrganizations: (): Promise<Organization[]> => {
    return client.get<Organization[]>('/Organization').then((r) => r.data);
  },

  /**
   * Returns the organization the current token is scoped to.
   * @see https://docs.virtuoussoftware.com/#ba04990d-6579-405d-8a98-67471e9ff24c
   * @returns {Promise<Organization>}
   */
  getCurrentOrganization: (): Promise<Organization> => {
    return client.get<Organization>('/Organization/Current').then((r) => r.data);
  },

  /**
   * Switches the current organization for subsequent requests.
   * @see https://docs.virtuoussoftware.com/#56ecc784-298a-4a0f-9944-0616428ee0ed
   * @param {SwitchOrganizationRequest} request - Request body.
   * @returns {Promise<void>}
   */
  switchOrganization: (request: SwitchOrganizationRequest): Promise<void> => {
    return client.put<void>('/Organization/Switch', request).then(() => undefined);
  },

  /**
   * Returns module/action permissions for the current user or API key.
   * @see https://docs.virtuoussoftware.com/#9718828a-169e-42e7-881b-19f347d7b719
   * @returns {Promise<Permission[]>}
   */
  getPermissions: (): Promise<Permission[]> => {
    return client.get<Permission[]>('/Permission').then((r) => r.data);
  },

});

export default createAccountClient;
