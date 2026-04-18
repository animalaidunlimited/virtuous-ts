

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
    parameter: string; // e.g. "GiftDate", "Amount", "GiftType", "ContactId"
    operator: QueryOperator;
    value?: string | null; // used by most operators
    secondaryValue?: string | null; // used by "Between"
    values?: string[]; // used by "In", "Between" (as array)
  }
  
  export interface QueryGroup {
    conditions: QueryCondition[];
    // logic?: 'And' | 'Or';              // default is And (Virtuous ignores if missing)
  }
  
  export interface QueryRequest {
    groups: QueryGroup[];
    SortBy?: string; // e.g. "GiftDate", "Amount", "Contact.Name"
    Descending?: boolean;
  }
  
