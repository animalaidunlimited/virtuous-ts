# Changelog

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
