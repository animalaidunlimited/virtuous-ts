export interface OAuthTokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  userName?: string;
  twoFactorEnabled?: string | boolean;
  '.issued'?: string;
  '.expires'?: string;
}

export interface OAuthTokenRequest {
  grant_type: 'password' | 'refresh_token';
  username?: string;
  password?: string;
  otp?: string;
  refresh_token?: string;
}

export interface Organization {
  organizationUserId: number;
  organizationName: string;
  organizationTimeZone?: string;
  organizationCulture?: string;
  isAdministrator?: boolean;
  isEnabled?: boolean;
}

export interface SwitchOrganizationRequest {
  organizationUserId: number;
}

export interface Permission {
  module: string;
  action: string;
  allowed: boolean;
}
