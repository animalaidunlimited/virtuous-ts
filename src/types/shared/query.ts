
export type QueryOperator =
| 'Is'
| 'IsNot'
| 'IsKnown'
| 'IsNotKnown'
| 'LessThan'
| 'LessThanOrEqual'
| 'GreaterThan'
| 'GreaterThanOrEqual'
| 'Contains'
| 'StartsWith'
| 'EndsWith'
| 'IsTrue'
| 'IsFalse'
| 'IsSet'
| 'IsNotSet'
| 'In'
| 'NotIn'
| 'Between'
| 'Before'
| 'After'
| 'IsAnyOf'
| 'IsNoneOf'
| 'Matches'
| 'OnOrBefore'
| 'OnOrAfter'


export interface QueryCondition {
    /** Query option parameter name, e.g. "Gift Date", "Contact Id". */
    parameter: string;
    operator: QueryOperator;
    value?: string | null;
    secondaryValue?: string | null;
    values?: string[];
  }
  
  export interface QueryGroup {
    conditions: QueryCondition[];
  }
  
  /** Body for Virtuous `POST .../Query` endpoints. Field names are camelCase. */
  export interface QueryRequest {
    groups: QueryGroup[];
    sortBy?: string;
    descending?: boolean;
  }
  
