export interface CreateContactAddressRequest extends UpdateContactAddressRequest {
    contactId: number;
}

export interface UpdateContactAddressRequest {
    label: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postal: string;
    country: string;
    setAsPrimary: boolean;
    startMonth: number;
    startDay: number;
    endMonth: number;
    endDay: number;
}