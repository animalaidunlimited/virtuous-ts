# Changelog

## 1.1.0

Opt-in resilience for the org-wide 5,000 requests/hour limit, transient errors, and silent query mistakes. `{ baseURL, apiKey }` behaves as in 1.0.1: no retries, no reserve guard, no query validation.

### Added

- Passive rate-limit tracking from `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset` (epoch seconds or HTTP date), including error responses. `getRateLimitStatus()` reads the snapshot and does not send a request.
- Opt-in `rateLimitReserve`. When remaining quota is known and at or below the reserve, the next request is rejected with `VirtuousRateLimitError` before it is sent.
- Opt-in retry. `retry: {}` or `retry: true` uses 3 retries, 500ms base, 30s cap, and statuses 429, 502, 503, 504. Honours `Retry-After`, otherwise full-jitter backoff. Retries GET/HEAD and read POSTs (`/Query`, `/Search`, `/Proximity`) only, unless `retryNonIdempotent` is true. `VirtuousApiError.attempts` counts sends.
- `queryAll`, `listAll`, and convenience methods `queryAllGifts`, `queryAllContacts`, `queryAllCampaigns`, plus `contactTag.listAllTagsFully()`.
- `validateQuery` and `VirtuousQueryValidationError`. `validateQueries: true` checks gift, contact, campaign, project, recurring gift, planned gift, contact note, and gift designation queries before POST. QueryOptions are cached for one hour.
- `readOnly: true` promotes the test allowlist into the client. The live suite still uses the re-exported guard.
- `DEFAULT_BASE_URL`. `baseURL` stays required.
- `docs/list-audit.md` lists skip/take methods and plain-array catalogs that default to 10 rows.

## 1.0.1

Dependency and toolchain updates. No public API changes.

- Runtime: `axios` 1.20.0, `zod` 4.5.4.
- Dev: TypeScript 7.0.2, Vitest 4.1.11, `@types/node` 26.4.1.
- TypeScript 7 requires `module: "Node16"` / `moduleResolution: "node16"` and no longer accepts `baseUrl`.
- Removed unused `ts-node` dev dependency.
- Vitest configs are `.mts` so Vite can load them as ESM in this CommonJS package.

## 1.0.0

First stable public API. Clients, types, and JSDoc follow the Postman collection at [docs.virtuoussoftware.com](https://docs.virtuoussoftware.com/).

### Breaking

- Query bodies use camelCase `sortBy` and `descending` (previously `SortBy` / `Descending`).
- `plannedGift.getGiftsAppliedToPlannedGift` calls `GET /PlannedGift/{id}/Gifts`.
- `recurringGift.getPaymentForRecurringGift` calls `GET /RecurringGiftPayment/{id}`.
- `gift.createGiftTransaction` returns a queued-import acknowledgement, not a `Gift`.
- `contact.getReceiptPdfById` returns `{ fileStream, filePath, contentType }` instead of a `Blob`.
- `SimpleRecurringGiftFilters.reccurringGiftDateYear` renamed to `recurringGiftDateYear`.

### Added

- Account: OAuth token, organizations, permissions.
- Contact: followed activity, prefixes, custom fields, custom collections, contact transaction, contact batch import.
- Individuals: get/create/update/delete, avatars, collections.
- Contact methods, references, organization groups, relationships, tributes.
- Contact notes: list, important, email, update, delete, query.
- Gifts: batch transactions, reversing transaction, bulk PATCH, custom fields, designation query.
- Gift asks, pledges, premiums.
- Projects: get by id, search, update, bulk PATCH, balances, expenses, notes, roles, query.
- Campaigns, communications, segments.
- Events, attendees, event contacts.
- Grants, volunteering, emails, global search, tasks, webhooks.
- Query helpers for the new Query endpoints.
- `CHANGELOG.md`.

### Docs

- README rewritten for the 1.0 surface.
- JSDoc `@see` links point at docs.virtuoussoftware.com request hashes.

### 1.0 polish

- Identifier and create-body required fields tightened from the collection (ids, names, pledge/webhook/method required keys).
- Index-signature types replaced with explicit fields (tributes, references, organizers).
- `update*Safely` helpers for remaining full-object PUT resources.
- Query helpers accept code, type, status, email, and boolean filters.
- `package.json` contributors field corrected.
- `npm run test:read-only` live smoke suite (GET and Query/Search/Proximity only; separate Vitest config so the write global setup never runs).
- `event.listEventTypes` returns `{ list, total }` of `{ id, name, isEnabled }` (not `string[]`).
- `search.search` requires `query` and `filterTypes`.
