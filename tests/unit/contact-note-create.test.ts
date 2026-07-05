import { describe, expect, it } from 'vitest';
import {
  buildGeneralContactNoteInput,
  toCreateContactNoteWireBody,
} from '../../src/types/contact-note/create-contact-note';

describe('contact note create', () => {
  it('maps isPrivate to wire private', () => {
    const wire = toCreateContactNoteWireBody({
      contactId: 42,
      type: 'General',
      note: 'hello',
      noteDateTime: '2026-01-01T00:00:00Z',
      isPrivate: true,
    });
    expect(wire.private).toBe(true);
    expect(wire.important).toBe(false);
    expect(wire.timeSpent).toBe(0);
  });

  it('buildGeneralContactNoteInput applies general-note defaults', () => {
    const input = buildGeneralContactNoteInput({
      contactId: 1,
      note: 'Shop note',
      noteDateTime: '2026-07-01T12:00:00Z',
    });
    const wire = toCreateContactNoteWireBody(input);
    expect(wire.type).toBe('General');
    expect(wire.private).toBe(false);
    expect(wire.important).toBe(false);
    expect(wire.timeSpent).toBe(0);
  });
});