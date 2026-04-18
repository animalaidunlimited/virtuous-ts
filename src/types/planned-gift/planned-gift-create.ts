import { PlannedGiftType } from "./planned-gift-constants";
import { CustomField } from "../shared/custom-field";
import { PlannedGiftFrequency } from "../shared/gift-frequency";

  
  export interface CreatePlannedGiftRequest {
    contactId: number;
    plannedGiftDate: string;                     // ISO date "2025-11-28"
    plannedGiftType: PlannedGiftType | string;   // use enum if possible, fallback string
    frequency: PlannedGiftFrequency;
    anticipatedAmount?: number | null;
    anticipatedStartDate?: string | null;        // ISO date
    numberOfOccurrences?: number | null;
    currentValue?: number | null;
    contactIndividualId?: number | null;
    assignedUserId?: number | null;
    projectId?: number | null;
    segmentId?: number | null;
    thankYouDate?: string | null;                // ISO date
    customFields?: CustomField[];
  }