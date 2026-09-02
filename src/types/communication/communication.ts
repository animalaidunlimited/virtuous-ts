export interface Communication {
  communicationId: number;
  name: string;
  campaignId: number;
  campaignName?: string;
  channelType?: string;
  communicationType?: string;
  startDateTimeUtc?: string;
  givingGoal?: number;
  projectId?: number;
  projectCode?: string;
  projectName?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}

export interface CreateCommunicationRequest {
  name: string;
  campaignId: number;
  channelType?: string;
  communicationType?: string;
  communicationStep?: string;
  startDateTime?: string;
  ownerId?: number;
  givingGoal?: number;
  newGiverGoal?: number;
  internalCostEstimate?: number;
  vendorCostEstimate?: number;
  networkReach?: number;
}
