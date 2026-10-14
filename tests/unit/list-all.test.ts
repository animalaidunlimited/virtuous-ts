import { describe, expect, it } from 'vitest';
import { listAll } from '../../src/utils/list-all';

describe('listAll', () => {
  it('pages past the 10-row default by sending take', async () => {
    const takes: number[] = [];
    const result = await listAll(
      async (params) => {
        takes.push(params.take ?? 0);
        const skip = params.skip ?? 0;
        const take = params.take ?? 10;
        const total = 25;
        const list = Array.from({ length: Math.min(take, total - skip) }, (_, index) => skip + index);
        return { list, total };
      },
      { pageSize: 10, maxRecords: 100 },
    );
    expect(takes.every((take) => take === 10)).toBe(true);
    expect(result.list).toHaveLength(25);
    expect(result.list[0]).toBe(0);
    expect(result.list[24]).toBe(24);
    expect(result.truncated).toBe(false);
    expect(result.total).toBe(25);
  });
});
