import type { GiftSummaryWithDesignations } from './gift';

export interface GiftQueryResponse {
  list: GiftSummaryWithDesignations[]; // abbreviated gift objects
  total: number;
}
