/** Catalog definition for a custom field (GET .../CustomFields). */
export interface CustomFieldDefinition {
  dataType?: string;
  name?: string;
  displayName?: string;
  options?: string[];
  required?: boolean;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}
