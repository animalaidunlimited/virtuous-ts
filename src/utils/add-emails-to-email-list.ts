import type { VirtuousClient } from '../virtuous-client';
import { VirtuousApiError } from '../errors/virtuous-api-error';
import type { AddEmailsToEmailListResult, AudienceSkip } from './add-emails-to-audience';
import { prepareAudienceEmails } from './add-emails-to-audience';

type EmailListAudienceClient = {
  contactIndividual: Pick<VirtuousClient['contactIndividual'], 'findIndividualByEmail'>;
  emailList: Pick<VirtuousClient['emailList'], 'addIndividualsToEmailList'>;
};

/**
 * Find each email's individual and bulk-queue them onto an existing email list.
 *
 * Missing individuals are skipped (this helper never creates contacts). Found
 * ids are sent in **one** `POST /EmailList` — do not call this helper inside a
 * per-email loop. The add is queued (202 Accepted) and can take up to 4 hours.
 *
 * Create the email list in the Virtuous UI first, then `searchEmailLists` to
 * get `emailListId`.
 *
 * @see https://docs.virtuoussoftware.com/#afe46206-15b4-4f20-914e-1cae07d83246
 * @example
 * const lists = await virtuous.emailList.searchEmailLists({ search: 'August briefing' });
 * const report = await addEmailsToEmailList(virtuous, lists.list[0].emailListId, emailsFromSpreadsheet);
 * // wait up to 4 hours before sending from the Virtuous UI
 */
export const addEmailsToEmailList = async (
  virtuous: EmailListAudienceClient,
  emailListId: number,
  emails: readonly string[],
): Promise<AddEmailsToEmailListResult> => {
  const { unique, skipped } = prepareAudienceEmails(emails);
  const queued: AddEmailsToEmailListResult['queued'] = [];
  const allSkipped: AudienceSkip[] = [...skipped];

  for (const { email } of unique) {
    try {
      const individual = await virtuous.contactIndividual.findIndividualByEmail(email);
      queued.push({ email, contactIndividualId: individual.id });
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
    }
  }

  if (queued.length === 0) {
    return { emailListId, queued, skipped: allSkipped, accepted: false };
  }

  await virtuous.emailList.addIndividualsToEmailList({
    emailListIds: [emailListId],
    contactIndividualIds: queued.map((row) => row.contactIndividualId),
  });

  return { emailListId, queued, skipped: allSkipped, accepted: true };
};
