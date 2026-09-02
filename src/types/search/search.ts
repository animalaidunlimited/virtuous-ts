export interface SearchResponse {
  contacts?: {
    hits?: {
      document?: {
        contactId?: number;
        contactType?: string;
        contactSubtype?: string | null;
        contactName?: string;
        informalName?: string;
        formalName?: string;
        alternateName?: string;
        individualId?: number;
        individualName?: string;
        isPrimary?: boolean;
        address?: string;
        email?: string;
        phoneNumber?: string | null;
        isArchived?: boolean;
      };
      highlights?: {
        field?: string;
        snippet?: string;
      }[];
    }[];
    total?: number;
  };
  individuals?: {
    hits?: unknown[];
    total?: number;
  };
  entities?: {
    hits?: unknown[];
    total?: number;
  };
}

export type SearchFilterType =
  | 'Contact'
  | 'Individual'
  | 'Campaign'
  | 'Project'
  | 'Segment'
  | 'Tag';

export interface EntitySearchRequest {
  query: string;
  filterTypes: SearchFilterType[];
}
