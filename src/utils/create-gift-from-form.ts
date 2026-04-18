// src/utils/createGiftFromForm.ts

import { GiftType } from '../types/gift/gift-constants';
import { GiftFrequency } from '../types/shared/gift-frequency';
import type { CreateGiftTransactionRequest } from '../types/gift/gift-transaction-create';
import zod from 'zod';

export interface SimpleDonationForm {
  // Contact
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  postal?: string | null;
  country?: string | null;

  // Gift
  amount: number | string;
  giftType?: GiftType;
  frequency?: GiftFrequency;

  projectId: number;
  additionalProjects?: Array<{
    projectId: number;
    amount: number | string;
  }>;

  // Optional
  isAnonymous?: boolean;
  notes?: string | null;
  tributeName?: string | null;
  inMemoryOf?: string | null;

  // UTM
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;

  // System
  referenceId?: string;
  submissionUrl?: string;
}

// ── Safe string trimming & nullification ───────────────────────────────
const safeString = (input: string | undefined | null, parameter: string): string | null => {
  try {
    const result = zod.string().parse(input);
    return result === '' ? null : result;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid ${parameter}: ${input} -- ` + error.issues);
    }
    throw error;
  }
};

const safeEmail = (input: string | undefined | null, parameter: string): string | null => {
  try {
    const result = zod.email().parse(input);
    return result === '' ? null : result;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid ${parameter}: ${input} -- ` + error.issues);
    }
    throw error;
  }
};

const safeNumber = (input: number | string | undefined | null, parameter: string, fallback: number = 0): number => {
  try {
    const result = zod.coerce.number().parse(input);
    return Number.isNaN(result) ? fallback : result;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid ${parameter}: ${input} -- ` + error.issues);
    }
    throw error;
  }
};

const safeBoolean = (input: boolean | string | undefined | null, parameter: string): boolean => {
  try {
    const result = zod.boolean().parse(input);
    return result;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid ${parameter}: ${input} -- ` + error.issues);
    }
    throw error;
  }
};

const safeDate = (input: string | undefined | null, parameter: string): string => {
  try {
    const result = zod.iso.date().parse(input);
    return result;
  } catch (error) {
    if (error instanceof zod.ZodError) {
    throw new Error(`Invalid ${parameter}: ${input} -- ` + error.issues);
    }
    throw error;
  }
};

const safeGiftType = (input: GiftType | string | undefined | null, parameter: string): GiftType => {
  try {
    const result = zod.string().parse(input);
    return result as GiftType;
  } catch (error) {
    if (error instanceof zod.ZodError) {
    throw new Error(`Invalid ${parameter}: ${input} -- ` + error.issues);
    }
    throw error;
  }
};

const safeFrequency = (input: GiftFrequency | string | undefined | null, parameter: string): GiftFrequency => {
  try {
    const result = zod.string().parse(input);
    return result as GiftFrequency;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid ${parameter}: ${input} -- ` + error.issues);
    }
    throw error;
  }
};


export const createGiftFromForm = (
  form: SimpleDonationForm,
  options: {
    transactionSource: string;
    defaultSegment?: string;
    defaultMediaOutlet?: string;
  },
): CreateGiftTransactionRequest => {
 
  const totalAmount = safeNumber(form.amount, 'amount');
  if (totalAmount <= 0) {
    throw new Error('Donation amount must be greater than zero');
  }

  const mainAmount =
    totalAmount - (form.additionalProjects?.reduce((sum, p) => sum + safeNumber(p.amount, 'amount'), 0) ?? 0);
  if (mainAmount < 0) {
    throw new Error('Additional project amounts exceed total donation');
  }

  // ── Build safe contact object ───────────────────────────────────────
  const contactAddress = form.address1
    ? {
        address1: safeString(form.address1, 'address1'),
        address2: safeString(form.address2, 'address2'),
        city: safeString(form.city, 'city'),
        state: safeString(form.state, 'state'),
        postal: safeString(form.postal, 'postal'),
        country: safeString(form.country, 'country') ?? 'US',
      }
    : null;

  const schema = zod.object({
    address1: zod.string(),
    address2: zod.string(),
    city: zod.string(),
    state: zod.string(),
    postal: zod.string(),
    country: zod.string(),
  });
  try {
    schema.parse(contactAddress);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      throw new Error(`Invalid contact address: ${contactAddress} -- ` + error.issues);
    }
    throw error;
  }

  
  const notesParts = [
    safeString(form.notes, 'notes'),
    form.tributeName ? `In honor of ${safeString(form.tributeName, 'tribute name')}` : null,
    form.inMemoryOf ? `In memory of ${safeString(form.inMemoryOf, 'in memory of')}` : null,
  ].filter(Boolean);

  return {
    transactionSource: options.transactionSource,
    transactionId: safeString(form.referenceId, 'reference id') ?? undefined,

    contact: {
      email: safeEmail(form.email, 'email'),
      firstname: safeString(form.firstName, 'first name'),
      lastname: safeString(form.lastName, 'last name'),
      phone: safeString(form.phone, 'phone'),
      address: contactAddress,
    },

    giftDate: safeDate(new Date().toISOString().split('T')[0], 'gift date'),
    giftType: safeGiftType(form.giftType, 'gift type') ?? 'Cash',
    amount: totalAmount.toFixed(2),
    frequency: safeFrequency(form.frequency, 'frequency') ?? 'OneTime',

    isPrivate: !! safeBoolean(form.isAnonymous, 'is anonymous'),

    notes: notesParts.length ? notesParts.join(' | ') : null,
    segment: options.defaultSegment ?? null,
    mediaOutlet: options.defaultMediaOutlet ?? null,

    designations: [
      { id: form.projectId, amountDesignated: mainAmount.toFixed(2) },
      ...(form.additionalProjects?.map((p) => ({
            id: p.projectId,
            amountDesignated: safeNumber(p.amount, 'amount').toFixed(2),
      })) ?? []),
    ],

    customFields: {
      ...(form.utmSource && { UTM_Source: safeString(form.utmSource, 'utm source') }),
      ...(form.utmMedium && { UTM_Medium: safeString(form.utmMedium, 'utm medium') }),
      ...(form.utmCampaign && { UTM_Campaign: safeString(form.utmCampaign, 'utm campaign') }),
      ...(form.utmTerm && { UTM_Term: safeString(form.utmTerm, 'utm term') }),
      ...(form.utmContent && { UTM_Content: safeString(form.utmContent, 'utm content') }),
    },

    submissionUrl: safeString(form.submissionUrl, 'submission url') ?? undefined,
  };
};
