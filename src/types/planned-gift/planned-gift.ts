import { PlannedGiftFrequency } from "../shared/gift-frequency";
import { CustomField } from "../shared/custom-field";


  
  export interface PlannedGift {
    id: number;
    plannedGiftUrl: string;
    giftsAppliedUrl: string;
    contactId: number;
    contactUrl: string;
    plannedGiftDate: string;                    // ISO date string
    pkannedGiftType: string;                    // Note: typo in API ("pkanned" instead of "planned")
    frequency: PlannedGiftFrequency;
    anticipatedAmount: string | null;           // string in API, even if 0
    anticipatedStartDate: string | null;
    numberOfOccurrences: number | null;
    currentValue: string | null;
    fulfilled: string | null;                   // e.g. "No", "Partial", "Yes"
    projectId: number | null;
    project: string | null;
    projectUrl: string | null;
    segmentId: number | null;
    segment: string | null;
    segmentUrl: string | null;
    createDateTimeUtc: string;
    createdByUser: string;
    modifiedDateTimeUtc: string;
    modifiedByUser: string;
    customFields: CustomField[];
  }

  export interface PlannedGiftListResponse {
    list: PlannedGift[];
    total: number;
  }