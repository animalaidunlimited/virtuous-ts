/** Paginated list envelope used by most Virtuous query and list endpoints. */
export interface ListResponse<T> {
  list: T[];
  total: number;
}
