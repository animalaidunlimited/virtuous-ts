import axios, { type AxiosAdapter, type AxiosResponse } from 'axios';
import { describe, expect, it } from 'vitest';
import { VirtuousApiError, VirtuousClient } from '../../src/index';

/**
 * Proves `{ baseURL, apiKey }` still means one request and the same error type.
 * No retry interceptor, no reserve rejection, no QueryOptions prefetch.
 */
describe('legacy client config', () => {
  it('sends one request and wraps errors the same way', async () => {
    let calls = 0;
    const client = new VirtuousClient({
      baseURL: 'https://api.virtuoussoftware.com/api/',
      apiKey: 'test-key',
    });
    const ax = (client as unknown as { client: { defaults: { adapter: AxiosAdapter } } }).client;
    ax.defaults.adapter = async (config) => {
      calls += 1;
      const response = {
        data: { error: 'NotFound', error_description: 'Contact with id 99999 could not be found' },
        status: 404,
        statusText: 'Not Found',
        headers: { 'X-RateLimit-Remaining': '4999', 'X-RateLimit-Limit': '5000' },
        config,
      } as AxiosResponse;
      throw new axios.AxiosError(
        'Request failed with status code 404',
        axios.AxiosError.ERR_BAD_REQUEST,
        config,
        {},
        response,
      );
    };

    try {
      await client.contact.getContactById(99999);
      throw new Error('expected VirtuousApiError');
    } catch (error) {
      expect(error).toBeInstanceOf(VirtuousApiError);
      const apiError = error as VirtuousApiError;
      expect(apiError.message).toBe('Contact with id 99999 could not be found');
      expect(apiError.status).toBe(404);
      expect(apiError.code).toBe('NotFound');
      expect(apiError.isNotFound).toBe(true);
      expect(apiError.attempts).toBe(1);
    }
    expect(calls).toBe(1);
    expect(client.getRateLimitStatus().remaining).toBe(4999);
    expect(client.getRateLimitStatus().requestsThisProcess).toBe(1);
  });

  it('does not prefetch query options when validateQueries is omitted', async () => {
    const urls: string[] = [];
    const client = new VirtuousClient({
      baseURL: 'https://api.virtuoussoftware.com/api/',
      apiKey: 'test-key',
    });
    const ax = (client as unknown as { client: { defaults: { adapter: AxiosAdapter } } }).client;
    ax.defaults.adapter = async (config) => {
      urls.push(config.url ?? '');
      return {
        data: { list: [], total: 0 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
      } as AxiosResponse;
    };

    await client.gift.queryGiftsWithAbbreviatedDetails({
      groups: [{ conditions: [{ parameter: 'Gift date', operator: 'Is', value: 'today' }] }],
    });
    expect(urls).toEqual(['/Gift/Query']);
  });
});
