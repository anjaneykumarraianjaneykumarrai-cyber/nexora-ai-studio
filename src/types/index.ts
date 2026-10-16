export type Language = 'en' | 'hi';

export type UserRole = 'owner' | 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
}

export type EnquiryStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'won'
  | 'lost';

export type ServiceType =
  | 'website_development'
  | 'ai_voice_agents'
  | 'business_automation'
  | 'multiple_services';

export interface Enquiry {
  id: string;
  fullName: string;
  businessName?: string;
  email?: string;
  phone?: string;
  businessType?: string;
  serviceRequired: ServiceType;
  budgetRange?: string;
  requirements: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
  language: Language;
  status: EnquiryStatus;
  assignedTo?: string;
  internalNotes?: string[];
  createdAt: string;
  updatedAt: string;
  notificationStatus: {
    email: 'not_configured' | 'pending' | 'sent' | 'failed';
    whatsapp: 'not_configured' | 'pending' | 'sent' | 'failed';
  };
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  businessName?: string;
  topic: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  timezone: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  googleCalendarEventId?: string;
  cancellationToken: string;
  createdAt: string;
}

export interface CalendarConfig {
  meetingDurationMinutes: number;
  availableDays: number[]; // 0 = Sunday, 1 = Monday, ...
  startHour: string; // "10:00"
  endHour: string; // "19:00"
  bufferMinutes: number;
  timezone: string;
  isGoogleCalendarConnected: boolean;
  ownerCalendarId: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  titleHi?: string;
  category: 'web' | 'voice' | 'automation';
  description: string;
  descriptionHi?: string;
  image: string;
  isDemoConcept: boolean;
  previewUrl?: string;
  capabilities: string[];
  published: boolean;
  sortOrder: number;
}

export interface IntegrationStatus {
  googleCalendar: {
    status: 'connected' | 'not_configured' | 'auth_required' | 'error';
    details: string;
    lastChecked: string;
  };
  firebase: {
    status: 'connected' | 'not_configured' | 'auth_required' | 'error';
    details: string;
    lastChecked: string;
  };
  email: {
    status: 'connected' | 'not_configured' | 'auth_required' | 'error';
    details: string;
    lastChecked: string;
  };
  whatsapp: {
    status: 'connected' | 'not_configured' | 'auth_required' | 'error';
    details: string;
    lastChecked: string;
  };
}

export interface NotificationLog {
  id: string;
  enquiryId?: string;
  bookingId?: string;
  type: 'email' | 'whatsapp';
  recipient: string;
  status: 'pending' | 'sent' | 'failed';
  errorDetails?: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  action: string;
  target: string;
  details?: string;
  timestamp: string;
}
