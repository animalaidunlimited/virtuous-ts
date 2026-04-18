
import type { ContactListItem } from './contact';
import type { QueryGroup } from '../shared/query';


  
  export interface ContactQueryGeolocation {
    topLatitude: number;
    leftLongitude: number;
    bottomLatitude: number;
    rightLongitude: number;
  }
  
  export interface ContactQueryGeolocationRequest {
    includeArchived?: boolean;
    queryLocation?: ContactQueryGeolocation | null;
    groups: QueryGroup[];
    sortBy?: string;
    descending?: boolean;

  }
  
  export interface ContactQueryGeolocationResponse {
    list: ContactListItem[];
    total: number;
  }

  export interface ContactGeoResult {
    id: number;
    name: string;
    address: string | null;
    lifeToDateGiving: string | null;
    contactViewUrl: string;
    latitude: number;
    longitude: number;
  }
