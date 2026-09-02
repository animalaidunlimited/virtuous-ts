export interface Volunteer {
  id: number;
  volunteerUrl?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
  contactId?: number;
  contactUrl?: string;
  displayName?: string;
  firstName?: string;
  avatarUrl?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  totalHours?: number;
  timesVolunteered?: number;
  volunteerAttendanceUrl?: string;
  volunteerOpportunityId?: number;
  volunteerOpportunityUrl?: string;
}

export interface CreateVolunteerRequest {
  contactIndividualId: number;
}

export interface VolunteerAttendance {
  id: number;
  volunteerAttendanceUrl?: string;
  volunteerId?: number;
  volunteerUrl?: string;
  volunteerOpportunityId?: number;
  volunteerOpportunityUrl?: string;
  hours?: number;
  startDateTimeUtc?: string;
  startDateTime?: string;
  endDateTimeUtc?: string;
  endDateTime?: string;
  timeZone?: string;
  createDateTimeUtc?: string;
  createdByUser?: string;
  modifiedDateTimeUtc?: string;
  modifiedByUser?: string;
}

export interface CreateVolunteerAttendanceRequest {
  timeZone?: string;
  hours?: number;
  startDateTimeUtc?: string;
  endDateTimeUtc?: string;
}

export interface UpdateVolunteerAttendanceRequest {
  timeZone?: string;
  hours?: number;
  startDateTimeUtc?: string;
  endDateTimeUtc?: string;
}

export interface VolunteerOrganizer {
  id: number;
  volunteerOrganizerUrl?: string;
  contactId?: number;
  displayName?: string;
  firstName?: string;
  avatarUrl?: string;
  primaryPhone?: string;
  primaryEmail?: string;
  contactUrl?: string;
  volunteerOpportunityUrl?: string;
}

export interface CreateVolunteerOrganizerRequest {
  contactIndividualId: number;
}
