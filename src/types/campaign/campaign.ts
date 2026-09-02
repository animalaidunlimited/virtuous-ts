export interface Campaign {
  campaignId: number;
  name: string;
  startDateTimeUtc?: string;
  endDateTimeUtc?: string;
  givingGoal?: number;
  newGiverGoal?: number;
  totalGiftGoal?: number;
  isArchived?: boolean;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}
