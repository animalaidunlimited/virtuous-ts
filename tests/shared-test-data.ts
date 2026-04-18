import { readFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import type { Contact } from 'virtuous-ts';

/**
 * Shared test data for all test files.
 * 
 * This module provides a simple way to share a single contact across all tests.
 * The contact is created once in global-setup.ts before all tests run and
 * stored in a JSON file to persist across Vitest's module isolation boundaries.
 */

const STORAGE_FILE = join(__dirname, '.shared-contact.json');

let cachedContact: Contact | null = null;

/**
 * Reads the shared contact from the JSON file.
 */
const getSharedContactState = (): Contact | null => {
  // Return cached value if available
  if (cachedContact) {
    return cachedContact;
  }

  // Try to read from file
  if (existsSync(STORAGE_FILE)) {
    try {
      const fileContent = readFileSync(STORAGE_FILE, 'utf-8');
      cachedContact = JSON.parse(fileContent) as Contact;
      return cachedContact;
    } catch (error) {
      console.error('Error reading shared contact file:', error);
      throw new Error('Error reading shared contact file');
    }
  }

  throw new Error('Shared contact file not found');
};



// Default values used when creating the shared contact
export const DEFAULT_CONTACT_NAME = 'API Testing1764750106';
export const DEFAULT_CONTACT_PHONE = '+66811454063';


/**
 * Gets the shared contact.
 * Throws an error if the contact hasn't been created yet.
 */
export const getSharedContact = (): Contact => {
  const contact = getSharedContactState();
  if (!contact) {
    throw new Error('Shared contact not created yet. Make sure global-setup.ts runs first.');
  }
  return contact;
};

/**
 * Gets the shared contact ID.
 * Throws an error if the contact hasn't been created yet.
 */
export const getSharedContactId = (): number => {
  return getSharedContact().id;
};

/**
 * Gets the shared contact name.
 * Throws an error if the contact hasn't been created yet.
 */
export const getSharedContactName = (): string => {
  return getSharedContact().name;
};

/**
 * Gets the shared contact's primary individual ID.
 * Throws an error if the contact hasn't been created yet.
 */
export const getSharedContactIndividualId = (): number => {
  const contact = getSharedContact();
  if (!contact.contactIndividuals || contact.contactIndividuals.length === 0) {
    throw new Error('Shared contact has no contact individuals');
  }
  return contact.contactIndividuals[0].id;
};

/**
 * Gets the shared contact's primary email address.
 * Throws an error if the contact hasn't been created yet.
 */
export const getSharedContactEmail = (): string => {
  const contact = getSharedContact();
  if (!contact.contactIndividuals || contact.contactIndividuals.length === 0) {
    throw new Error('Shared contact has no contact individuals');
  }
  const individual = contact.contactIndividuals[0];
  const emailMethod = individual.contactMethods?.find(m => 
    m.type?.toLowerCase().includes('Work Email')
  );
  if (!emailMethod) {
    throw new Error('Shared contact has no email contact method');
  }
  return emailMethod.value;
};

/**
 * Gets the shared contact's primary phone number.
 * Throws an error if the contact hasn't been created yet.
 */
export const getSharedContactPhone = (): string => {
  const contact = getSharedContact();
  if (!contact.contactIndividuals || contact.contactIndividuals.length === 0) {
    throw new Error('Shared contact has no contact individuals');
  }
  const individual = contact.contactIndividuals[0];
  const phoneMethod = individual.contactMethods?.find(m => 
    m.type?.toLowerCase().includes('Mobile Phone')
  );
  if (!phoneMethod) {
    throw new Error('Shared contact has no phone contact method');
  }
  return phoneMethod.value;
};

/**
 * Clears the shared contact (for cleanup if needed).
 * Clears both the cache and the stored file.
 */
export const clearSharedContact = (): void => {
  cachedContact = null;
  if (existsSync(STORAGE_FILE)) {
    unlinkSync(STORAGE_FILE);
  }
};
