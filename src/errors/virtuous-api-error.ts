
import type { AxiosError } from 'axios';

/**
 * All Virtuous API errors look roughly like this:
 * {
 *   "error": "NotFound",
 *   "error_description": "Contact with id 99999 could not be found"
 * }
 *
 * Sometimes they also return a list of validation errors.
 * 
 * @example
* try {
 *   await virtuous.gift.getGift(99999);
 * } catch (error) {
 *   if (error instanceof VirtuousApiError) {
 *     console.error('Virtuous API Error:', {
 *       message: error.message,
 *       status: error.status,
 *       code: error.code,
 *       details: error.details,
 *       cause: error.cause,
 *     });
 *     if (error.isNotFound) {
 *       console.log('Gift not found');
 *     } else if (error.isUnauthorized) {
 *       // Handle auth issues
 *     } else if (error.isRateLimited) {
 *       // Handle rate limiting
 *     } else if (error.isValidationError) {
 *       console.log('Validation errors:', error.validationErrors);
 *     }
 *   }
 * }

 */
export interface VirtuousApiErrorResponse {
  error?: string;
  error_description?: string;
  errors?: Record<string, string[]>;
  data?: any;
  message?: string;
}

export class VirtuousApiError extends Error {
  public readonly status?: number;
  public readonly code?: string;          // e.g. "NotFound", "ValidationError"
  public readonly details?: string;
  public readonly data?: any;
  public readonly validationErrors?: Record<string, string[]>;
  public readonly cause?: AxiosError<VirtuousApiErrorResponse>;

  constructor(message: string, axiosError: AxiosError<VirtuousApiErrorResponse>) {
    super(message, { cause: axiosError });

    this.name = 'VirtuousApiError';
    this.status = axiosError.response?.status;
    this.cause = axiosError;

    const data = axiosError.response?.data;
    if (data) {
      this.code = data.error ?? axiosError.code;
      this.details = data.error_description ?? data.message ?? undefined;
      this.validationErrors = data.errors;
      this.data = data.data;
      // Prefer the message passed to super(); data.message rarely provides better info
    }
  }

  /** True if the contact/gift/etc. simply wasn’t found */
  get isNotFound() {
    return this.status === 404 || this.code === 'NotFound';
  }

  /** True for 401/403 */
  get isUnauthorized() {
    return this.status === 401 || this.status === 403;
  }

  /** True for 429 or if Virtuous starts adding a Retry-After header */
  get isRateLimited() {
    return this.status === 429;
  }

  /** True for validation problems when creating/updating */
  get isValidationError() {
    return !!this.validationErrors;
  }
}