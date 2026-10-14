import axios, { type AxiosAdapter, type AxiosResponse } from 'axios';
import { describe, expect, it } from 'vitest';
import { VirtuousApiError, VirtuousClient } from '../../src/index';
import { attachRetry, fullJitterDelayMs } from '../../src/http/retry';

interface Scripted {
  status: number;
  data?: unknown;
  headers?: Record<string, string>;
  code?: string;
}

function scriptedAdapter(steps: Scripted[], seen: string[]): AxiosAdapter {
  return async (config) => {
    seen.push(`${(config.method ?? 'get').toUpperCase()} ${config.url}`);
    const step = steps.shift() ?? { status: 200, data: {} };
    const response = {
      data: step.data ?? {},
      status: step.status,
      statusText: String(step.status),
      headers: step.headers ?? {},
      config,
    } as AxiosResponse;
    if (step.code && step.status === 0) {
      throw new axios.AxiosError(step.code, step.code, config, {}, undefined);
    }
    if (step.status >= 400) {
      throw new axios.AxiosError(
        `Request failed with status code ${step.status}`,
        axios.AxiosError.ERR_BAD_RESPONSE,
        config,
        {},
        response,
      );
    }
    return response;
  };
}

describe('retry interceptor', () => {
  it('keeps full jitter inside the computed window', () => {
    expect(fullJitterDelayMs(0, 500, 30_000, () => 0)).toBe(0);
    expect(fullJitterDelayMs(0, 500, 30_000, () => 1)).toBe(500);
    expect(fullJitterDelayMs(2, 500, 30_000, () => 1)).toBe(2000);
    expect(fullJitterDelayMs(10, 500, 30_000, () => 1)).toBe(30_000);
  });

  it('retries 429 then succeeds, honouring Retry-After', async () => {
    const seen: string[] = [];
    const delays: number[] = [];
    const ax = axios.create({
      baseURL: 'https://api.virtuoussoftware.com/api/',
      adapter: scriptedAdapter(
        [
          { status: 429, headers: { 'Retry-After': '2' }, data: { error_description: 'slow' } },
          { status: 200, data: { ok: true } },
        ],
        seen,
      ),
    });
    attachRetry(ax, { retries: 3 }, async (ms) => {
      delays.push(ms);
    });
    const response = await ax.get('/Organization/Current');
    expect(response.data).toEqual({ ok: true });
    expect(seen).toEqual(['GET /Organization/Current', 'GET /Organization/Current']);
    expect(delays).toEqual([2000]);
  });

  it('stops after N tries and records attempts on VirtuousApiError', async () => {
    const seen: string[] = [];
    const client = new VirtuousClient({
      baseURL: 'https://api.virtuoussoftware.com/api/',
      apiKey: 'test-key',
      retry: { retries: 2, baseDelayMs: 0, maxDelayMs: 0 },
    });
    const ax = (client as unknown as { client: import('axios').AxiosInstance }).client;
    ax.defaults.adapter = scriptedAdapter(
      [
        { status: 503, data: { error_description: 'down' } },
        { status: 503, data: { error_description: 'down' } },
        { status: 503, data: { error_description: 'down' } },
      ],
      seen,
    );
    // The client sleep is the real setTimeout. Zero delay keeps this instant.
    try {
      await client.account.getCurrentOrganization();
      throw new Error('expected failure');
    } catch (error) {
      expect(error).toBeInstanceOf(VirtuousApiError);
      expect((error as VirtuousApiError).attempts).toBe(3);
      expect((error as VirtuousApiError).status).toBe(503);
    }
    expect(seen).toHaveLength(3);
  });

  it('does not retry POST /Gift, and does retry POST /Gift/Query', async () => {
    const writeSeen: string[] = [];
    const writeClient = new VirtuousClient({
      baseURL: 'https://api.virtuoussoftware.com/api/',
      apiKey: 'test-key',
      retry: { retries: 3, baseDelayMs: 0, maxDelayMs: 0 },
    });
    const writeAx = (writeClient as unknown as { client: import('axios').AxiosInstance }).client;
    writeAx.defaults.adapter = scriptedAdapter(
      [{ status: 503, data: { error_description: 'down' } }],
      writeSeen,
    );
    await expect(
      writeClient.gift.createGift({
        contactId: 1,
        giftType: 'Cash',
        amount: 10,
        giftDate: '2026-01-01',
      } as never),
    ).rejects.toBeInstanceOf(VirtuousApiError);
    expect(writeSeen).toEqual(['POST /Gift']);

    const readSeen: string[] = [];
    const readClient = new VirtuousClient({
      baseURL: 'https://api.virtuoussoftware.com/api/',
      apiKey: 'test-key',
      retry: { retries: 2, baseDelayMs: 0, maxDelayMs: 0 },
    });
    const readAx = (readClient as unknown as { client: import('axios').AxiosInstance }).client;
    readAx.defaults.adapter = scriptedAdapter(
      [
        { status: 502, data: { error_description: 'bad gateway' } },
        { status: 200, data: { list: [], total: 0 } },
      ],
      readSeen,
    );
    const page = await readClient.gift.queryGiftsWithAbbreviatedDetails({ groups: [] });
    expect(page.total).toBe(0);
    expect(readSeen).toEqual(['POST /Gift/Query', 'POST /Gift/Query']);
  });

  it('retry false and omitted retry send the request once', async () => {
    for (const retry of [undefined, false] as const) {
      const seen: string[] = [];
      const client = new VirtuousClient({
        baseURL: 'https://api.virtuoussoftware.com/api/',
        apiKey: 'test-key',
        retry,
      });
      const ax = (client as unknown as { client: import('axios').AxiosInstance }).client;
      ax.defaults.adapter = scriptedAdapter(
        [{ status: 429, data: { error_description: 'slow' }, headers: { 'Retry-After': '1' } }],
        seen,
      );
      await expect(client.account.getCurrentOrganization()).rejects.toMatchObject({
        status: 429,
        attempts: 1,
      });
      expect(seen).toHaveLength(1);
    }
  });
});
