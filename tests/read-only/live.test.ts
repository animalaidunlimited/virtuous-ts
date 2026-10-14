/**
 * Live production smoke tests.
 *
 * Allowed: GET, plus POST to Query / Query/Full* / Search / Proximity.
 * A request interceptor fails the suite on PUT/PATCH/DELETE or write POSTs.
 * This file is excluded from the default Vitest config so globalSetup cannot run.
 *
 * Skips (does not fail) on empty lists, 403, and 404.
 * HMAC-only ByReference 403 with an API key is expected.
 * Requires VIRTUOUS_API_KEY. Does not log request or response bodies.
 */
import dotenv from 'dotenv';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { TestContext } from 'vitest';
import { VirtuousClient } from 'virtuous-ts';
import {
  attachReadOnlyGuard,
  axiosInstanceFromClient,
  isSkippableLiveError,
  READ_ONLY_MAX_CALLS,
  sanitizeLiveError,
} from './read-only-guard';

dotenv.config();

const EMPTY_QUERY = { groups: [] };
const PAGE = { skip: 0, take: 1 };

let client: VirtuousClient;
let getCallCount: () => number = () => 0;

function requireApiKey(): string {
  const apiKey = process.env.VIRTUOUS_API_KEY;
  if (!apiKey) {
    throw new Error('test:read-only requires VIRTUOUS_API_KEY');
  }
  return apiKey;
}

async function callOrSkip<T>(ctx: TestContext, run: () => Promise<T>): Promise<T> {
  try {
    return await run();
  } catch (error) {
    sanitizeLiveError(error);
    if (isSkippableLiveError(error)) {
      const status = (error as { status?: number }).status;
      ctx.skip(`HTTP ${status}`);
    }
    throw error;
  }
}

async function discoverAndGet<TRow, TDetail>(
  ctx: TestContext,
  options: {
    query: () => Promise<{ list?: TRow[]; total?: number }>;
    idOf: (row: TRow) => number | undefined;
    getById: (id: number) => Promise<TDetail>;
    detailId: (detail: TDetail) => number | undefined;
    emptyNote: string;
  },
): Promise<void> {
  const page = await callOrSkip(ctx, options.query);
  const list = page.list ?? [];
  expect(Array.isArray(list)).toBe(true);
  expect(page.total === undefined || typeof page.total === 'number').toBe(true);
  const id = list[0] ? options.idOf(list[0]) : undefined;
  if (id == null) {
    ctx.skip(options.emptyNote);
    return;
  }
  const detail = await callOrSkip(ctx, () => options.getById(id));
  expect(options.detailId(detail)).toBe(id);
}

beforeAll(() => {
  const apiKey = requireApiKey();
  client = new VirtuousClient({
    baseURL: 'https://api.virtuoussoftware.com/api/',
    apiKey,
    timeout: 30_000,
  });
  ({ getCallCount } = attachReadOnlyGuard(axiosInstanceFromClient(client), { enforceCallCap: true }));
});

afterAll(() => {
  if (!client) {
    return;
  }
  const calls = getCallCount();
  expect(calls).toBeGreaterThan(0);
  expect(calls).toBeLessThanOrEqual(READ_ONLY_MAX_CALLS);
});

describe('catalog reads', () => {
  it('returns the current organization', async (ctx) => {
    const org = await callOrSkip(ctx, () => client.account.getCurrentOrganization());
    expect(typeof org.organizationUserId).toBe('number');
    expect(typeof org.organizationName).toBe('string');
  });

  it('populates getRateLimitStatus after a GET', async (ctx) => {
    await callOrSkip(ctx, () => client.account.getCurrentOrganization());
    const status = client.getRateLimitStatus();
    expect(status.requestsThisProcess).toBeGreaterThan(0);
    expect(status.lastUpdated).toBeInstanceOf(Date);
    if (status.limit != null) {
      expect(typeof status.limit).toBe('number');
    }
    if (status.remaining != null) {
      expect(typeof status.remaining).toBe('number');
    }
  });

  it('lists contact types', async (ctx) => {
    const types = await callOrSkip(ctx, () => client.contact.getContactTypes());
    expect(Array.isArray(types)).toBe(true);
  });

  it('lists contact prefixes', async (ctx) => {
    const prefixes = await callOrSkip(ctx, () => client.contact.getContactPrefixes());
    expect(Array.isArray(prefixes)).toBe(true);
  });

  it('lists contact method types', async (ctx) => {
    const types = await callOrSkip(ctx, () => client.contactMethod.listContactMethodTypes());
    expect(Array.isArray(types)).toBe(true);
  });

  it('lists relationship types', async (ctx) => {
    const types = await callOrSkip(ctx, () => client.relationship.listRelationshipTypes());
    expect(Array.isArray(types)).toBe(true);
  });

  it('lists communication channel types', async (ctx) => {
    const types = await callOrSkip(ctx, () => client.communication.listChannelTypes());
    expect(Array.isArray(types)).toBe(true);
  });

  it('lists project types', async (ctx) => {
    const types = await callOrSkip(ctx, () => client.project.listProjectTypes());
    expect(Array.isArray(types)).toBe(true);
  });

  it('lists event types', async (ctx) => {
    const types = await callOrSkip(ctx, () => client.event.listEventTypes());
    expect(Array.isArray(types.list)).toBe(true);
    expect(typeof types.total).toBe('number');
  });

  it('returns gift query options', async (ctx) => {
    const options = await callOrSkip(ctx, () => client.gift.getGiftQueryOptions());
    expect(options).toEqual(expect.any(Object));
    expect(Array.isArray(options.options)).toBe(true);
  });

  it('returns contact query options', async (ctx) => {
    const options = await callOrSkip(ctx, () => client.contact.queryContactOptions());
    expect(options).toEqual(expect.any(Object));
    expect(Array.isArray(options.options)).toBe(true);
  });

  it('returns project query options', async (ctx) => {
    const options = await callOrSkip(ctx, () => client.project.getProjectQueryOptions());
    expect(options).toEqual(expect.any(Object));
    expect(Array.isArray(options.options)).toBe(true);
  });

  it('returns campaign query options', async (ctx) => {
    const options = await callOrSkip(ctx, () => client.campaign.getCampaignQueryOptions());
    expect(options).toEqual(expect.any(Object));
    expect(Array.isArray(options.options)).toBe(true);
  });
});

describe('discover then get-by-id', () => {
  it('contacts', async (ctx) => {
    await discoverAndGet(ctx, {
      query: () => client.contact.queryContactsWithAbbreviatedDetails(EMPTY_QUERY, PAGE),
      idOf: (row) => row.id,
      getById: (id) => client.contact.getContactById(id),
      detailId: (detail) => detail.id,
      emptyNote: 'no contacts returned',
    });
  });

  it('gifts', async (ctx) => {
    await discoverAndGet(ctx, {
      query: () => client.gift.queryGiftsWithAbbreviatedDetails(EMPTY_QUERY, PAGE),
      idOf: (row) => row.id,
      getById: (id) => client.gift.getGift(id),
      detailId: (detail) => detail.id,
      emptyNote: 'no gifts returned',
    });
  });

  it('projects', async (ctx) => {
    await discoverAndGet(ctx, {
      query: () => client.project.queryProjects(EMPTY_QUERY, PAGE),
      idOf: (row) => row.id,
      getById: (id) => client.project.getProject(id),
      detailId: (detail) => detail.id,
      emptyNote: 'no projects returned',
    });
  });

  it('campaigns', async (ctx) => {
    await discoverAndGet(ctx, {
      query: () => client.campaign.queryCampaigns(EMPTY_QUERY, PAGE),
      idOf: (row) => row.campaignId,
      getById: (id) => client.campaign.getCampaign(id),
      detailId: (detail) => detail.campaignId,
      emptyNote: 'no campaigns returned',
    });
  });

  it('events', async (ctx) => {
    await discoverAndGet(ctx, {
      query: () => client.event.listEvents(PAGE),
      idOf: (row) => row.id,
      getById: (id) => client.event.getEvent(id),
      detailId: (detail) => detail.id,
      emptyNote: 'no events returned',
    });
  });

  it('recurring gifts', async (ctx) => {
    await discoverAndGet(ctx, {
      query: () => client.recurringGift.queryRecurringGifts(EMPTY_QUERY, PAGE),
      idOf: (row) => row.id,
      getById: (id) => client.recurringGift.getRecurringGiftById(id),
      detailId: (detail) => detail.id,
      emptyNote: 'no recurring gifts returned',
    });
  });

  it('planned gifts', async (ctx) => {
    await discoverAndGet(ctx, {
      query: () => client.plannedGift.queryPlannedGifts(EMPTY_QUERY, PAGE),
      idOf: (row) => row.id,
      getById: (id) => client.plannedGift.getPlannedGiftById(id),
      detailId: (detail) => detail.id,
      emptyNote: 'no planned gifts returned',
    });
  });

  it('organization groups', async (ctx) => {
    await discoverAndGet(ctx, {
      query: () => client.organizationGroup.listOrganizationGroups(PAGE),
      idOf: (row) => row.id,
      getById: (id) => client.organizationGroup.getOrganizationGroup(id),
      detailId: (detail) => detail.id,
      emptyNote: 'no organization groups returned',
    });
  });

  it('global search', async (ctx) => {
    const result = await callOrSkip(ctx, () =>
      client.search.search({ query: 'contact', filterTypes: ['Contact'] }, PAGE),
    );
    expect(result).toEqual(expect.any(Object));
    expect(result.contacts ?? result.individuals ?? result.entities).toBeTruthy();
  });
});

describe('HMAC-only endpoints', () => {
  it('Contact ByReference 403 with an API key is not a failure', async (ctx) => {
    try {
      await client.contact.getContactByReferenceId('read-only-suite');
    } catch (error) {
      sanitizeLiveError(error);
      if (isSkippableLiveError(error)) {
        return;
      }
      const status = (error as { status?: number }).status;
      if (status === 401) {
        ctx.skip('HTTP 401');
      }
      throw error;
    }
  });
});
