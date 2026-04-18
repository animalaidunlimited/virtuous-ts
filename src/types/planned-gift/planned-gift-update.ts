import { CustomField } from "../shared/custom-field";
import { PlannedGiftType } from "./planned-gift-constants";
import { PlannedGiftFrequency } from "../shared/gift-frequency";


export interface UpdatePlannedGiftRequest {
  plannedGiftDate: string;
  plannedGiftType: PlannedGiftType | string;
  frequency: PlannedGiftFrequency;
  anticipatedAmount?: number | null;
  anticipatedStartDate?: string | null;
  numberOfOccurrences?: number | null;
  currentValue?: number | null;
  contactIndividualId?: number | null;
  assignedUserId?: number | null;
  projectId?: number | null;
  segmentId?: number | null;
  thankYouDate?: string | null;
  customFields?: CustomField[];
}