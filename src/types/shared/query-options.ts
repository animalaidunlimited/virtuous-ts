export interface QueryOperatorOption {
    operator: string;
    multipleValuesAllowed: boolean;
    valueRequired: boolean;
  }
  
  export interface QueryParameterOption {
    parameter: string;
    type: string;                         // "String", "Int", "Decimal", "Date", "List", "Boolean"
    operatorOptions: QueryOperatorOption[];
    valueOptions: string[];
  }
  
  export interface QueryOptionsResponse {
    options: QueryParameterOption[];
    operatorOptions: QueryOperatorOption[];
  }