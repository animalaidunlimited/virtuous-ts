import axios, { type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { describe, expect, it } from 'vitest';
import { VirtuousClient, VirtuousRateLimitError } from '../../src/index';
import { parseResetAt, RateLimitTracker } from '../../src/http/rate-limit';

function jsonAdapter(
  handler: (config: InternalAxiosRequestConfig) => {
    status: number;
    data?: unknown;
    headers?: Record<string, string>;
  },
): AxiosAdapter {
  return async (config) => {
    const result = handler(config);
    const response = {
      data: result.data ?? {},
      status: result.status,
      statusText: String(result.status),
      headers: result.headers ?? {},
      config,
    };
    if (result.status >= 400) {
      const error = new axios.AxiosError(
        `Request failed with status code ${result.status}`,
        axios.AxiosError.ERR_BAD_RESPONSE,
        config,
        {},
        response as AxiosResponse,
      );
      throw error;
    }
    return response as AxiosResponse;
  };
}

describe('rate-limit headers', () => {
  it('parses epoch-second and HTTP-date reset values', () => {
    const epoch = parseResetAt('1710000000');
    expect(epoch?.toISOString()).toBe(new Date(1710000000 * 1000).toISOString());

    const dated = parseResetAt('Wed, 21 Oct 2015 07:28:00 GMT');
    expect(dated?.toISOString()).toBe('2015-10-21T07:28:00.000Z');
    expect(parseResetAt('not-a-date')).toBeNull();
  });

  it('updates the tracker from success and error responses', async () => {
    let calls = 0;
    const client = new VirtuousClient({
      baseURL: 'https://api.virtuoussoftware.com/api/',
      apiKey: 'test-key',
    });
    const axiosClient = (client as unknown as { client: { defaults: { adapter: AxiosAdapter } } }).client;
    axiosClient.defaults.adapter = jsonAdapter(() => {
      calls += 1;
      if (calls === 1) {
        return {
          status: 200,
          data: { organizationName: 'AAU' },
          headers: {
            'X-RateLimit-Limit': '5000',
            'X-RateLimit-Remaining': '4990',
            'X-RateLimit-Reset': '1710000000',
          },
        };
      }
      return {
        status: 429,
        data: { error_description: 'slow down' },
        headers: {
          'X-RateLimit-Limit': '5000',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': 'Wed, 21 Oct 2015 07:28:00 GMT',
        },
      };
    });

    await client.account.getCurrentOrganization();
    const afterOk = client.getRateLimitStatus();
    expect(afterOk.limit).toBe(5000);
    expect(afterOk.remaining).toBe(4990);
    expect(afterOk.resetAt?.toISOString()).toBe(new Date(1710000000 * 1000).toISOString());
    expect(afterOk.lastUpdated).toBeInstanceOf(Date);
    expect(afterOk.requestsThisProcess).toBe(1);

    await expect(client.account.getCurrentOrganization()).rejects.toMatchObject({ status: 429 });
    const afterError = client.getRateLimitStatus();
    expect(afterError.remaining).toBe(0);
    expect(afterError.resetAt?.toISOString()).toBe('2015-10-21T07:28:00.000Z');
    expect(afterError.requestsThisProcess).toBe(2);
    expect(calls).toBe(2);
  });

  it('reserve guard throws before the next send and does not add a request', async () => {
    let calls = 0;
    const client = new VirtuousClient({
      baseURL: 'https://api.virtuoussoftware.com/api/',
      apiKey: 'test-key',
      rateLimitReserve: 50,
    });
    const internal = client as unknown as {
      client: { defaults: { adapter: AxiosAdapter } };
      rateLimitTracker: RateLimitTracker;
    };
    internal.rateLimitTracker.update({
      'X-RateLimit-Limit': '5000',
      'X-RateLimit-Remaining': '40',
    });
    internal.client.defaults.adapter = jsonAdapter(() => {
      calls += 1;
      return { status: 200, data: {} };
    });

    await expect(client.account.getCurrentOrganization()).rejects.toBeInstanceOf(VirtuousRateLimitError);
    expect(calls).toBe(0);
    expect(client.getRateLimitStatus().requestsThisProcess).toBe(0);
  });
});
