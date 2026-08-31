import { describe, expect, it, vi } from 'vitest';
import type { AxiosError } from 'axios';
import { VirtuousApiError } from '../../src/errors/virtuous-api-error';
import { prepareAudienceEmails } from '../../src/utils/add-emails-to-audience';
import { addEmailsToTag } from '../../src/utils/add-emails-to-tag';
import { addEmailsToEmailList } from '../../src/utils/add-emails-to-email-list';

const apiError = (status: number, message: string, extra?: { error?: string; error_description?: string }) => {
  const axiosError = {
    isAxiosError: true,
    message,
    response: {
      status,
      data: {
        error: extra?.error,
        error_description: extra?.error_description ?? message,
      },
    },
  } as AxiosError;
  return new VirtuousApiError(message, axiosError);
};

describe('prepareAudienceEmails', () => {
  it('trims, drops blanks, skips invalid, and dedupes case-insensitively', () => {
    const { unique, skipped } = prepareAudienceEmails([
      '  a@example.org ',
      '',
      'not-an-email',
      'A@example.org',
      'b@example.org',
    ]);

    expect(unique.map((row) => row.email)).toEqual(['a@example.org', 'b@example.org']);
    expect(skipped).toEqual([
      expect.objectContaining({ email: 'not-an-email', reason: 'invalid_email' }),
    ]);
  });
});

describe('addEmailsToTag', () => {
  it('applies a tag per found contact and reports missing/invalid/duplicate emails', async () => {
    const findContactByEmailOrReference = vi.fn(async ({ email }: { email?: string }) => {
      if (email === 'missing@example.org') {
        throw apiError(404, 'Contact not found', { error: 'NotFound' });
      }
      if (email === 'boom@example.org') {
        throw apiError(500, 'upstream');
      }
      return { id: email === 'a@example.org' ? 11 : 12 };
    });
    const createContactTag = vi.fn(async ({ contactId }: { contactId: number }) => {
      if (contactId === 12) {
        throw apiError(400, 'Tag already applied to contact', {
          error_description: 'Tag already applied to contact',
        });
      }
      return { contactTagId: 900 + contactId, tagId: 9, name: 'Briefing', total: 1 };
    });

    const report = await addEmailsToTag(
      { contact: { findContactByEmailOrReference }, contactTag: { createContactTag } },
      9,
      ['a@example.org', 'missing@example.org', 'bad', 'A@example.org', 'already@example.org', 'boom@example.org'],
    );

    expect(findContactByEmailOrReference).toHaveBeenCalledTimes(4);
    expect(createContactTag).toHaveBeenCalledTimes(2);
    expect(createContactTag).toHaveBeenCalledWith({ tagId: 9, contactId: 11 });
    expect(report.applied).toEqual([{ email: 'a@example.org', contactId: 11, contactTagId: 911 }]);
    expect(report.skipped.map((row) => ({ email: row.email, reason: row.reason }))).toEqual([
      { email: 'bad', reason: 'invalid_email' },
      { email: 'missing@example.org', reason: 'not_found' },
      { email: 'already@example.org', reason: 'already_applied' },
      { email: 'boom@example.org', reason: 'error' },
    ]);
  });

  it('does not create contacts when find returns 404', async () => {
    const findContactByEmailOrReference = vi.fn(async () => {
      throw apiError(404, 'not found', { error: 'NotFound' });
    });
    const createContactTag = vi.fn();

    const report = await addEmailsToTag(
      { contact: { findContactByEmailOrReference }, contactTag: { createContactTag } },
      9,
      ['ghost@example.org'],
    );

    expect(createContactTag).not.toHaveBeenCalled();
    expect(report.applied).toEqual([]);
    expect(report.skipped).toEqual([{ email: 'ghost@example.org', reason: 'not_found' }]);
  });
});

describe('addEmailsToEmailList', () => {
  it('finds individuals then bulk-adds once; skips missing; does not POST when none found', async () => {
    const findIndividualByEmail = vi.fn(async (email: string) => {
      if (email === 'missing@example.org') {
        throw apiError(404, 'not found', { error: 'NotFound' });
      }
      return { id: email === 'a@example.org' ? 101 : 102 };
    });
    const addIndividualsToEmailList = vi.fn(async () => ({ accepted: true as const }));

    const report = await addEmailsToEmailList(
      { contactIndividual: { findIndividualByEmail }, emailList: { addIndividualsToEmailList } },
      42,
      ['a@example.org', 'missing@example.org', 'b@example.org', 'a@example.org'],
    );

    expect(findIndividualByEmail).toHaveBeenCalledTimes(3);
    expect(addIndividualsToEmailList).toHaveBeenCalledTimes(1);
    expect(addIndividualsToEmailList).toHaveBeenCalledWith({
      emailListIds: [42],
      contactIndividualIds: [101, 102],
    });
    expect(report.accepted).toBe(true);
    expect(report.queued).toEqual([
      { email: 'a@example.org', contactIndividualId: 101 },
      { email: 'b@example.org', contactIndividualId: 102 },
    ]);
    expect(report.skipped).toEqual([{ email: 'missing@example.org', reason: 'not_found' }]);
  });

  it('does not POST /EmailList when every email is missing and never creates contacts', async () => {
    const findIndividualByEmail = vi.fn(async () => {
      throw apiError(404, 'not found', { error: 'NotFound' });
    });
    const addIndividualsToEmailList = vi.fn();

    const report = await addEmailsToEmailList(
      { contactIndividual: { findIndividualByEmail }, emailList: { addIndividualsToEmailList } },
      42,
      ['ghost@example.org'],
    );

    expect(addIndividualsToEmailList).not.toHaveBeenCalled();
    expect(report.accepted).toBe(false);
    expect(report.queued).toEqual([]);
    expect(report.skipped).toEqual([{ email: 'ghost@example.org', reason: 'not_found' }]);
  });
});
