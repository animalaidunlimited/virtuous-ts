import { VirtuousClient } from 'virtuous-ts';

/**
 * Test helper utilities.
 * 
 * Provides common setup functions and configurations for tests.
 */

/**
 * Creates a configured VirtuousClient instance for testing.
 * Uses environment variables for configuration. Tests run without debug logging.
 */
export const createTestClient = (): VirtuousClient => {
  return new VirtuousClient({
    baseURL: 'https://api.virtuoussoftware.com/api/',
    apiKey: process.env.VIRTUOUS_API_KEY!,
    timeout: 10000,
  });
};

/**
 * Generates a unique email address for testing.
 * Uses timestamp to ensure uniqueness.
 */
export const generateTestEmail = (): string => {
  return `spencer${Math.floor(new Date().getTime() / 1000)}@animalaidunlimited.org`;
};

/**
 * Generates a unique transaction ID for testing.
 * Uses timestamp to ensure uniqueness.
 */
export const generateTransactionId = (): string => {
  return `API Test ${Math.floor(new Date().getTime() / 1000)}`;
};

