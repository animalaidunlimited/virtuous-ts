import type { VirtuousClient } from '../virtuous-client';
import { VirtuousApiError } from '../errors/virtuous-api-error';
import type { AddEmailsToTagResult, AudienceSkip } from './add-emails-to-audience';
import { prepareAudienceEmails } from './add-emails-to-audience';

type TagAudienceClient = {
  contact: Pick<VirtuousClient['contact'], 'findContactByEmailOrReference'>;
  contactTag: Pick<VirtuousClient['contactTag'], 'createContactTag'>;
};

const alreadyAppliedPattern = /already/i;

const isAlreadyApplied = (error: VirtuousApiError): boolean => {
  const blob = `${error.message} ${error.details ?? ''} ${error.code ?? ''}`;
  return (error.status === 400 || error.isValidationError) && alreadyAppliedPattern.test(blob);
};

/**
 * Find each email's contact and apply an existing catalog tag.
 *
 * Missing contacts are skipped (this helper never creates contacts). There is
 * no bulk tag-apply endpoint; each found contact is tagged with `POST /ContactTag`.
 *
 * Create the tag in the Virtuous UI first, then `searchTags` / `listAllTags`
 * to get `tagId`.
 *
 * @see https://docs.virtuoussoftware.com/#c3156a7f-2480-48ac-8f6a-0a21b58defc5
 * @example
 * const tags = await virtuous.contactTag.searchTags({ search: 'August briefing' });
 * const report = await addEmailsToTag(virtuous, tags.list[0].id, emailsFromSpreadsheet);
 */
export const addEmailsToTag = async (
  virtuous: TagAudienceClient,
  tagId: number,
  emails: readonly string[],
): Promise<AddEmailsToTagResult> => {
  const { unique, skipped } = prepareAudienceEmails(emails);
  const applied: AddEmailsToTagResult['applied'] = [];
  const allSkipped: AudienceSkip[] = [...skipped];

  for (const { email } of unique) {
    let contactId: number;
    try {
      const contact = await virtuous.contact.findContactByEmailOrReference({ email });
      contactId = contact.id;
    } catch (error) {
      if (error instanceof VirtuousApiError && error.isNotFound) {
        allSkipped.push({ email, reason: 'not_found' });
        continue;
      }
      allSkipped.push({
        email,
        reason: 'error',
        detail: error instanceof Error ? error.message : String(error),
      });
      continue;
    }

    try {
      const contactTag = await virtuous.contactTag.createContactTag({ tagId, contactId });
      applied.push({ email, contactId, contactTagId: contactTag.contactTagId });
    } catch (error) {
      if (error instanceof VirtuousApiError && isAlreadyApplied(error)) {
        allSkipped.push({
          email,
          reason: 'already_applied',
          detail: error.details ?? error.message,
        });
        continue;
      }
      allSkipped.push({
        email,
        reason: 'error',
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { tagId, applied, skipped: allSkipped };
};
