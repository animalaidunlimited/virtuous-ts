import { writeFileSync } from 'fs';
import { join } from 'path';
import { createTestClient, generateTestEmail } from './test-helpers';
import { DEFAULT_CONTACT_NAME, DEFAULT_CONTACT_PHONE } from './shared-test-data';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Global setup that runs once before all tests.
 * Creates the shared contact and stores it in a JSON file so it persists
 * across Vitest's module isolation boundaries.
 */
export default async function globalSetup() {
  if (process.env.VITEST_UNIT_ONLY === '1') {
    return;
  }

  const client = createTestClient();
  const testContactEmail = generateTestEmail();
  const testContactName = DEFAULT_CONTACT_NAME;
  const testContactPhone = DEFAULT_CONTACT_PHONE;
  const testContactId = Math.floor(Math.random() * 1000000); // Generate a random ID for reference
  
  console.log('Creating shared contact for all tests...');
  
  const contact = await client.contact.createContact({
    contactType: 'Household',
    name: testContactName,
    referenceSource: 'API Testing',
    referenceId: `test-${testContactId}`,
    isPrivate: false,
    isArchived: false,
    contactAddresses: [
      {
        label: 'Home',
        address1: '123 Main St',
        city: 'Anytown',
        stateCode: 'CA',
        postal: '12345',
        countryCode: 'US',
        isPrimary: true,
      },
    ],
    contactIndividuals: [
      {
        firstName: 'API',
        lastName: 'Testing',
        prefix: 'Mr.',
        gender: 'Male',
        isPrimary: true,
        isSecondary: false,
        isDeceased: false,
        passion: 'Test',
        birthMonth: 1,
        birthDay: 1,
        birthYear: 1990,
        approximateAge: 35,
        contactMethods: [
          {
            type: 'Work Email',
            value: testContactEmail,
            isPrimary: true,
            isOptedIn: true,
          },
          {
            type: 'Mobile Phone',
            value: testContactPhone,
            isPrimary: true,
            isOptedIn: true,
          },
        ],
      },
    ],
  });
  
  // Store the contact in a JSON file that all test files can read
  const storagePath = join(__dirname, '.shared-contact.json');
  writeFileSync(storagePath, JSON.stringify(contact, null, 2), 'utf-8');
  
  console.log(`Created shared contact: ${contact.id}`);
  console.log(`Stored contact data in: ${storagePath}`);
}

