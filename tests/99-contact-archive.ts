import { describe, it } from 'vitest';
import { getSharedContact } from "./shared-test-data";


describe('Contact Archive Tests', () => {
    
    it('should archive a contact', async () => {
        const sharedContact = getSharedContact();
        if(!sharedContact) {
            throw new Error('Shared contact not found');
        }
        
        //const contact = await client.contact.archiveContact(sharedContact.id, { reason: 'Test Archive' });
        
        //expect(contact).toBeUndefined();
    });
});