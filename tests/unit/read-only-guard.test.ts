import axios from 'axios';
import { describe, expect, it } from 'vitest';
import {
  assertReadOnlyHttpRequest,
  attachReadOnlyGuard,
  isReadOnlyHttpRequest,
  requestPath,
} from '../read-only/read-only-guard';

const API = 'https://api.virtuoussoftware.com/api/';

describe('read-only HTTP allowlist', () => {
  it('normalizes relative and absolute paths', () => {
    expect(requestPath('/Contact/Query', API)).toBe('/Contact/Query');
    expect(requestPath('Gift/Query', API)).toBe('/Gift/Query');
    expect(requestPath('https://api.virtuoussoftware.com/api/Campaign/Query')).toBe(
      '/Campaign/Query',
    );
  });

  it.each([
    ['GET', '/Contact/1'],
    ['get', '/Gift/QueryOptions'],
    ['HEAD', '/Organization/Current'],
    ['POST', '/Contact/Query'],
    ['POST', '/Gift/Query/FullGift'],
    ['POST', '/Contact/Query/FullContact'],
    ['POST', '/Search'],
    ['POST', '/Contact/Search'],
    ['POST', '/Email/Search'],
    ['POST', '/Project/Search'],
    ['POST', '/Contact/Proximity'],
    ['POST', '/Tag/Search'],
  ])('allows %s %s', (method, url) => {
    expect(isReadOnlyHttpRequest(method, url, API)).toBe(true);
  });

  it('interceptor rejects write methods before they are sent', async () => {
    const instance = axios.create({ baseURL: API, timeout: 1 });
    attachReadOnlyGuard(instance);
    await expect(instance.put('/Contact/1', {})).rejects.toThrow(/blocked PUT \/Contact\/1/i);
    await expect(instance.post('/v2/Gift/Transaction', {})).rejects.toThrow(
      /blocked POST \/v2\/Gift\/Transaction/i,
    );
    await expect(instance.post('/Email/Send', {})).rejects.toThrow(/blocked POST \/Email\/Send/i);
  });

  it.each([
    ['PUT', '/Contact/1'],
    ['PATCH', '/Gift'],
    ['DELETE', '/Webhook/1'],
    ['POST', '/Contact'],
    ['POST', '/v2/Gift/Transaction'],
    ['POST', '/v2/Gift/Transactions'],
    ['POST', '/Contact/Transaction'],
    ['POST', '/Contact/Batch'],
    ['POST', '/Email/Send'],
    ['POST', '/Project/Expenses/Batch'],
    ['POST', '/Contact/ToggleFollow/1'],
    ['POST', '/Token'],
    ['POST', '/Task'],
    ['POST', 'https://api.virtuoussoftware.com/Token'],
  ])('blocks %s %s', (method, url) => {
    expect(isReadOnlyHttpRequest(method, url, API)).toBe(false);
    expect(() => assertReadOnlyHttpRequest(method, url, API)).toThrow(/blocked/i);
  });
});
