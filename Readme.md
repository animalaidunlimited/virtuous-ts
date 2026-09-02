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

Hourly rate limit: 1,500 requests. Response headers include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.

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
