# virtuous-ts

[![npm version](https://img.shields.io/npm/v/virtuous-ts.svg)](https://www.npmjs.com/package/virtuous-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

TypeScript client for the [Virtuous CRM API](https://docs.virtuoussoftware.com/). Methods, request bodies, and response types follow the published Postman collection at [docs.virtuoussoftware.com](https://docs.virtuoussoftware.com/). JSDoc `@see` links point at the matching collection request.

**Requires** `axios`. Query builders also use `zod` for input checks.

## Install

```bash
npm install virtuous-ts
```

## Quick start

```typescript
import { VirtuousClient } from 'virtuous-ts';

const virtuous = new VirtuousClient({
  baseURL: 'https://api.virtuoussoftware.com/api/',
  apiKey: process.env.VIRTUOUS_API_KEY!,
  timeout: 30_000,
});
```

Use an API key from Virtuous **Settings → Connectivity → API Keys**. Send it as `Authorization: Bearer <key>`. OAuth password tokens are available via `virtuous.account.getToken` when a user-scoped token is required.

Hourly rate limit: 5,000 requests per organization, shared by every app on the key. Response headers include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`. `DEFAULT_BASE_URL` is `https://api.virtuoussoftware.com/api/`. `baseURL` is still required.

## Create gifts and contacts

Virtuous recommends the **transaction** endpoints. They match contacts, validate designations, and queue work for the nightly import. Direct `POST /Gift` and `POST /Contact` skip that matching and can create duplicates.

```typescript
await virtuous.gift.createGiftTransaction({
  transactionSource: 'Website',
  contact: {
    email: 'sarah@example.com',
    firstname: 'Sarah',
    lastname: 'Smith',
  },
  giftType: 'Cash',
  amount: '100.00',
  giftDate: '2025-04-05',
  frequency: 'OneTime',
});

await virtuous.contact.createContactTransaction({
  referenceSource: 'Website',
  referenceId: 'donor-1001',
  email: 'sarah@example.com',
  firstName: 'Sarah',
  lastName: 'Smith',
});
```

Transaction and batch calls return an empty acknowledgement. Records are not created in real time. Subscribe to webhooks if you need create/update notifications.

For many gifts at once, use `virtuous.gift.createGiftTransactions`. For many contacts, use `virtuous.contact.createContactImport`.

## Query helpers

`build*Query` helpers turn simple filters into the `groups` / `sortBy` / `descending` body Virtuous Query endpoints expect. Pagination is the query method’s second argument (`{ skip, take }`, max `take` 1,000).

```typescript
import { buildGiftQuery } from 'virtuous-ts';

const query = buildGiftQuery({
  giftDateYear: 2025,
  amountMin: 1000,
  sortBy: 'Gift Date',
  descending: true,
});

const results = await virtuous.gift.queryGiftsWithAbbreviatedDetails(query, {
  skip: 0,
  take: 50,
});
```

Date filters accept `YYYY-MM-DD` or `M/D/YYYY`.

## Safe updates

Most PUT endpoints require a full object. Omitting a property clears it. Use the matching `update*Safely` method to GET the current record, merge your changes, then PUT.

Covered: gift, recurring gift, planned gift, contact, contact address, individual, contact method, contact note, event, event attendee, grant, segment, project, project expense, project note, premium, pledge, gift ask, webhook, volunteer opportunity, volunteer attendance.

```typescript
await virtuous.gift.updateGiftSafely(giftId, {
  amount: 150,
  notes: 'Amount corrected',
});
```

Bulk PATCH endpoints (`gift.bulkUpdateGifts`, `project.bulkUpdateProjects`) are the opposite: send only the fields you are changing, including each record `id`.

## Clients

| Property | Coverage |
|----------|----------|
| `account` | Token, organizations, permissions |
| `contact` | Contacts, query, receipts, collections, import/transaction |
| `contactIndividual` | Individuals, query, avatars, collections |
| `contactAddresses` | Address CRUD, archive |
| `contactMethod` | Phone/email methods |
| `contactNote` | Notes, query, email-to-note |
| `contactTag` | Tag catalog and applications |
| `contactReference` | External reference ids |
| `organizationGroup` | Groups and membership |
| `relationship` | Contact relationships |
| `tribute` | Tribute search and write |
| `gift` | Gifts, transactions, bulk patch, designations query |
| `giftAsk` | Gift asks |
| `recurringGift` | Recurring gifts and payments |
| `plannedGift` | Planned gifts |
| `pledge` | Pledges (`/api/v2/Pledge`) |
| `premium` | Premiums and inventory |
| `project` | Projects, expenses, notes, roles |
| `campaign` | Campaigns |
| `communication` | Communications |
| `segment` | Segments |
| `event` | Events |
| `eventAttendee` | Event attendees |
| `eventContact` | Event contacts |
| `grant` | Grants |
| `volunteerOpportunity` | Volunteer opportunities |
| `volunteer` | Volunteers, attendance, organizers |
| `email` / `emailList` | Saved emails and list membership |
| `search` | Global search |
| `task` | Tasks |
| `webhook` | Webhook subscriptions |

Tag and email-list **definitions** are created in the CRM UI, not through the API. `addEmailsToTag` and `addEmailsToEmailList` apply an existing tag or list to addresses already in Virtuous.

`GET /Contact/ByReference/{id}` and `GET /Gift/ByReference/{id}` are HMAC-only. API keys may receive 403.

Deprecated Reminder endpoints are not wrapped.

## Resilience (1.1.0)

Everything below is off unless you opt in, except header tracking. Tracking reads headers already on each response and never adds a request. `{ baseURL, apiKey }` keeps the 1.0 behaviour: one attempt, no reserve rejection, no query check.

### Retry

```typescript
import { VirtuousClient, VirtuousApiError } from 'virtuous-ts';

const virtuous = new VirtuousClient({
  baseURL: 'https://api.virtuoussoftware.com/api/',
  apiKey: process.env.VIRTUOUS_API_KEY!,
  retry: {},
});
```

`retry: {}` or `retry: true` means 3 extra attempts, 500ms base delay, 30s cap, and statuses 429, 502, 503, 504. Network errors `ECONNRESET` and `ETIMEDOUT` are included. Delay uses `Retry-After` when present (seconds or an HTTP date), otherwise full-jitter backoff: a random wait in `[0, min(maxDelayMs, baseDelayMs * 2^attempt)]`.

Retries run for GET, HEAD, and read POSTs (`/Query`, `/Search`, `/Proximity`). `POST /Gift` and other writes are not retried, because a retry can duplicate a gift. Set `retryNonIdempotent: true` only when repeating the write is safe. `retry: false` and omitting `retry` install no retry interceptor.

```typescript
try {
  await virtuous.gift.getGift(1);
} catch (error) {
  if (error instanceof VirtuousApiError) {
    console.error(error.status, error.attempts);
  }
}
```

### Rate limits

```typescript
const virtuous = new VirtuousClient({
  baseURL: 'https://api.virtuoussoftware.com/api/',
  apiKey: process.env.VIRTUOUS_API_KEY!,
  rateLimitReserve: 50,
  onRateLimit: (status) => {
    console.log(status.remaining, status.resetAt);
  },
});

const status = virtuous.getRateLimitStatus();
```

`getRateLimitStatus()` returns `limit`, `remaining`, `resetAt`, `lastUpdated`, and `requestsThisProcess`. Fields stay null until a response includes the headers. Reset is epoch seconds or an HTTP date.

`rateLimitReserve` is optional. When remaining is known and `<= rateLimitReserve`, the next call throws `VirtuousRateLimitError` and is not sent. Leave it unset if this process should use the full window.

### queryAll and listAll

```typescript
import { queryAll, listAll } from 'virtuous-ts';

const gifts = await virtuous.gift.queryAllGifts(query, {
  pageSize: 1000,
  maxRecords: 10_000,
  onPage: (page, total) => console.log(page, total),
});

const contacts = await virtuous.contact.queryAllContacts(query);
const campaigns = await virtuous.campaign.queryAllCampaigns(query);

const anyResource = await queryAll((page) =>
  virtuous.project.queryProjects(query, page),
);

const tags = await virtuous.contactTag.listAllTagsFully();
const followed = await virtuous.contact.getFollowedContactsAll();
const custom = await listAll((page) => virtuous.contactTag.listAllTags(page));
```

`queryAll` pages at 1,000 (the Virtuous max, clamped if you pass more) and stops at 10,000 rows unless you pass a larger `maxRecords`. `listAll` pages at 500 and stops at 5,000. Both stop on a short page or when `skip` reaches `total`. Hitting the cap returns `truncated: true` and does not throw.

Several catalog endpoints return a plain array and ignore `skip`/`take`. Those default to 10 rows. See `docs/list-audit.md`. `getContactTypesAll()` documents that limit: it cannot page a longer catalog.

### validateQueries

Virtuous ignores unknown parameters and returns every row. `"Gift date"` is not `"Gift Date"`, and the typo looks like a successful unfiltered query.

```typescript
import { validateQuery, VirtuousQueryValidationError } from 'virtuous-ts';

const virtuous = new VirtuousClient({
  baseURL: 'https://api.virtuoussoftware.com/api/',
  apiKey: process.env.VIRTUOUS_API_KEY!,
  validateQueries: true,
});

try {
  await virtuous.gift.queryGiftsWithAbbreviatedDetails({
    groups: [{ conditions: [{ parameter: 'Gift date', operator: 'GreaterThan', value: '2026-01-01' }] }],
  });
} catch (error) {
  if (error instanceof VirtuousQueryValidationError) {
    console.error(error.issues);
  }
}

const options = await virtuous.gift.getGiftQueryOptions();
const issues = validateQuery(
  { groups: [{ conditions: [{ parameter: 'Gift Date', operator: 'GreaterThan', value: '2026-01-01' }] }] },
  options,
);
```

Checks: parameter exists (case-sensitive, with a case-insensitive suggestion), operator is allowed, `value` is present when required, `values` is used only when multiple values are allowed, and `value` is in `valueOptions` when that list is non-empty. The catalog is cached in memory for one hour per resource. Default is off, so a typo still reaches Virtuous unless you opt in.

### readOnly

```typescript
const virtuous = new VirtuousClient({
  baseURL: 'https://api.virtuoussoftware.com/api/',
  apiKey: process.env.VIRTUOUS_API_KEY!,
  readOnly: true,
});
```

PUT, PATCH, DELETE, and write POSTs throw before they are sent. GET, HEAD, OPTIONS, and POST to `/Query`, `/Search`, and `/Proximity` are allowed. This is the same allowlist as the live test suite, without the suite's 40-call cap. Default is false.

## Errors

API failures are thrown as `VirtuousApiError`:

```typescript
import { VirtuousApiError } from 'virtuous-ts';

try {
  await virtuous.gift.getGift(99999);
} catch (error) {
  if (error instanceof VirtuousApiError) {
    console.error(error.message, error.status, error.code);
  }
}
```

## License

MIT. See [LICENSE](LICENSE).
