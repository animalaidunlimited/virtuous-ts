import zod from 'zod';

export type AudienceSkipReason =
  | 'invalid_email'
  | 'not_found'
  | 'already_applied'
  | 'error';

export interface AudienceSkip {
  email: string;
  reason: AudienceSkipReason;
  detail?: string;
}

export interface AddEmailsToTagResult {
  tagId: number;
  applied: Array<{ email: string; contactId: number; contactTagId: number }>;
  skipped: AudienceSkip[];
}

export interface AddEmailsToEmailListResult {
  emailListId: number;
  queued: Array<{ email: string; contactIndividualId: number }>;
  skipped: AudienceSkip[];
  /** POST /EmailList is 202 Accepted; membership may take up to 4 hours. */
  accepted: boolean;
}

export interface PreparedAudienceEmail {
  email: string;
}

const emailSchema = zod.email();

/**
 * Trim, drop blanks, validate, and dedupe emails case-insensitively
 * (keeps the first spelling). Invalid addresses become skip rows.
 */
export const prepareAudienceEmails = (
  emails: readonly string[],
): { unique: PreparedAudienceEmail[]; skipped: AudienceSkip[] } => {
  const skipped: AudienceSkip[] = [];
  const unique: PreparedAudienceEmail[] = [];
  const seen = new Set<string>();

  for (const raw of emails) {
    const email = raw.trim();
    if (!email) {
      continue;
    }

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      skipped.push({
        email,
        reason: 'invalid_email',
        detail: parsed.error.issues.map((issue) => issue.message).join('; '),
      });
      continue;
    }

    const key = parsed.data.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push({ email: parsed.data });
  }

  return { unique, skipped };
};
