// Used when CREATING or UPDATING a contact
export interface CustomCollectionWrite {
  name: string; // must match the collection name exactly (case-sensitive!)
  fields: CustomCollectionFieldWrite[];
}

export interface CustomCollectionFieldWrite {
  name: string;
  value: string | number | boolean | null;
}

export interface CustomCollectionFieldRead {
  name: string;
  value: string | null;
}

export interface CustomCollectionRead {
  customCollectionId: number;
  customCollectionName: string;
  collectionInstanceId: number;
  fields: CustomCollectionFieldRead[];
}

export interface ContactAddressBase {
  id: number;
  label: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  postal: string | null;
  country: string | null;
  startMonth: number | null;
  startDay: number | null;
  endMonth: number | null;
  endDay: number | null;
}

export interface ContactMethodBase {
  id: number;
  type: string;
  value: string;
  isOptedIn: boolean;
  isPrimary: boolean;
}
export interface ContactIndividualBase {
  id: number;
  prefix: string | null;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  suffix: string | null;
  gender: string | null;
  isPrimary: boolean;
  isSecondary: boolean;
  birthMonth: number | null;
  birthDay: number | null;
  birthYear: number | null;
  birthDate: string | null;
  approximateAge: number | null;
  isDeceased: boolean;
  passion: string | null;
  contactMethods: ContactMethodBase[];
}
