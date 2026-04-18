
export interface RecurringGiftCustomFieldDefinition {
    dataType: string;                     // e.g. "Text", "Date", "Dropdown", "Number"
    name: string;                         // internal name (machine-friendly)
    displayName: string;                  
    options: string[];                    // for Dropdown type — possible values
    createDateTimeUtc: string;            // ISO date string
    createdByUser: string;
    modifiedDateTimeUtc: string;
    modifiedByUser: string;
  }
  
  export type RecurringGiftCustomFieldListResponse = RecurringGiftCustomFieldDefinition[];