import { describe, expect, it } from 'vitest';
import { buildAutoCreateProjectRequest } from '../src/utils/build-auto-create-project-request';

describe('buildAutoCreateProjectRequest', () => {
  it('applies integration defaults for auto-create project body', () => {
    const body = buildAutoCreateProjectRequest('shopifydonations');
    expect(body).toMatchObject({
      name: 'shopifydonations',
      revenueAccountingCode: 'shopifydonations',
      inventoryStatus: 'Unspecified',
      type: 'Default',
      onlineDisplayName: 'shopifydonations',
      durationType: 'Ongoing',
      financialNeedAmount: 0,
      financialNeedType: 2,
      financialNeedFrequency: 'Annually',
      location: 'US',
      isPublic: true,
      isActive: true,
      isAvailableOnline: true,
      enableSync: false,
    });
    expect(body.description).toContain('integration');
  });
});