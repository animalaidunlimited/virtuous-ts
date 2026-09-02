export interface ContactRelationship {
  id?: number;
  contactId?: number;
  contact?: string;
  contactIndividual?: string;
  relatedContactId?: number;
  relatedContact?: string;
  relatedContactIndividual?: string;
  relationshipType?: string;
  notes?: string;
  relatedContactViewUrl?: string;
}

export interface CreateRelationshipRequest {
  contactId?: number;
  relationshipType?: string;
  contactIndividualId?: number;
  relatedContactId?: number;
  relatedContactIndividualId?: number;
  notes?: string;
}

export interface UpdateRelationshipRequest {
  relationshipType?: string;
  notes?: string;
}

export interface RelationshipType {
  group?: string;
  relationship?: string;
  inverseRelationship?: string;
}
