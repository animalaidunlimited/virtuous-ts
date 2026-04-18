import { describe, it, expect } from 'vitest';
import {
  getSharedContactName,
  getSharedContactId,
  getSharedContactEmail,
} from './shared-test-data';
import { createTestClient } from './test-helpers';

describe('Contact Tests', () => {
  const client = createTestClient();

  // Note: The shared contact is created in global-setup.ts before all tests run.
  // It saved to file and loaded each time the 'get' is called to get round vitest's module isolation.
  // This ensures it's available to all test files and persists across Vitest's module isolation.

  it('creates a contact for shared use', () => {
    const testContactId = getSharedContactId();
    expect(testContactId).toBeGreaterThan(0);
  });

  it('should get a contact by id', async () => {
    const testContactId = getSharedContactId();
    const contact = await client.contact.getContactById(testContactId);
    expect(contact).toBeDefined();
    expect(contact.id).toBe(testContactId);
  }, 10000);

  it('should get contact types', async () => {
    const contactTypes = await client.contact.getContactTypes();
    expect(contactTypes).toBeDefined();
    expect(contactTypes.length).toBeGreaterThan(0);
  }, 10000);
  
  it('should find a contact by email or reference source and id', async () => {
    const testContactEmail = getSharedContactEmail();
    const testContactId = getSharedContactId();
    const contact = await client.contact.findContactByEmailOrReference({ email: testContactEmail });
    expect(contact).toBeDefined();
    expect(contact.id).toBe(testContactId);
  }, 10000);

  it('should search contacts by name, email, phone, or address', async () => {
    const testContactName = getSharedContactName();
    const contacts = await client.contact.searchContacts({ search: testContactName });
    expect(contacts).toBeDefined();
    expect(contacts.total).toBeGreaterThan(0);
    expect(contacts.list.length).toBeGreaterThan(0);
  }, 10000);
});
