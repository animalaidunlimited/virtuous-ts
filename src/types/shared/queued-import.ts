/**
 * Response for Gift/Contact transaction and batch import endpoints.
 * The collection example body is empty; records are queued and processed later.
 */
export type QueuedImportResponse = Record<string, never> | Record<string, unknown>;
