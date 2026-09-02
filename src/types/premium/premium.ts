export interface Premium {
  id: number;
  name: string;
  code: string;
  description?: string;
  price?: number;
  fairMarketValue?: number;
  cost?: number;
  inventoryCount?: number;
  isActive?: boolean;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface CreatePremiumRequest {
  name: string;
  code: string;
  price?: number;
  fairMarketValue?: number;
  description?: string;
  cost?: number;
  inventoryCount?: number;
  isActive?: boolean;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}

export interface UpdatePremiumRequest {
  name?: string;
  code?: string;
  price?: number;
  fairMarketValue?: number;
  description?: string;
  cost?: number;
  inventoryCount?: number;
  isActive?: boolean;
  customFields?: {
    name?: string;
    value?: string;
    displayName?: string;
  }[];
}
