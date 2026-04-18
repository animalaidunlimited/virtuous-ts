import { describe, it, expect } from 'vitest';
import { getSharedContactId } from './shared-test-data';
import { createTestClient } from './test-helpers';

describe('Contact Addresses Tests', () => {
  const client = createTestClient();

  it('should get addresses for a contact', async () => {
    const testContactId = getSharedContactId();
    const addresses = await client.contactAddresses.getAddressesForContact(testContactId);
    expect(addresses).toBeDefined();
    expect(addresses.length).equals(1);
  }, 10000);
});
