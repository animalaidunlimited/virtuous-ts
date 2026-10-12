import { describe, expect, it } from 'vitest';
import { queryAll } from '../../src/utils/query-all';
import type { SkipTakeParams } from '../../src/types/shared/skip-take-params';

describe('queryAll', () => {
  it('concatenates pages and stops on a short page', async () => {
    const calls: SkipTakeParams[] = [];
    const result = await queryAll(
      async (params) => {
        calls.push(params);
        if ((params.skip ?? 0) === 0) {
          return { list: [1, 2], total: 5 };
        }
        if ((params.skip ?? 0) === 2) {
          return { list: [3, 4], total: 5 };
        }
        return { list: [5], total: 5 };
      },
      { pageSize: 2 },
    );
    expect(result.list).toEqual([1, 2, 3, 4, 5]);
    expect(result.total).toBe(5);
    expect(result.truncated).toBe(false);
    expect(calls.map((call) => call.take)).toEqual([2, 2, 2]);
  });

  it('stops when skip reaches total', async () => {
    let calls = 0;
    const result = await queryAll(
      async (params) => {
        calls += 1;
        return {
          list: [params.skip ?? 0],
          total: 2,
        };
      },
      { pageSize: 1, maxRecords: 10 },
    );
    expect(result.list).toEqual([0, 1]);
    expect(calls).toBe(2);
    expect(result.truncated).toBe(false);
  });

  it('returns truncated true at the cap instead of throwing', async () => {
    const result = await queryAll(
      async () => ({ list: [1, 2], total: 100 }),
      { pageSize: 2, maxRecords: 4 },
    );
    expect(result.list).toEqual([1, 2, 1, 2]);
    expect(result.truncated).toBe(true);
    expect(result.total).toBe(100);
  });

  it('clamps pageSize to 1000', async () => {
    const takes: number[] = [];
    await queryAll(
      async (params) => {
        takes.push(params.take ?? 0);
        return { list: [1], total: 1 };
      },
      { pageSize: 5000 },
    );
    expect(takes).toEqual([1000]);
  });
});
