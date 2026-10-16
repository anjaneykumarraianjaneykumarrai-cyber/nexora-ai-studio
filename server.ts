import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// --- PERSISTENT DATA STORE SETUP ---
const DATA_DIR = path.resolve(process.cwd(), '.data');
const STORE_PATH = path.join(DATA_DIR, 'store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DataStore {
  users: Array<{
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: 'owner' | 'admin' | 'staff';
    active: boolean;
  }>;
  enquiries: Array<{
    id: string;
    fullName: string;
    businessName?: string;
    email?: string;
    phone?: string;
    businessType?: string;
    serviceRequired: string;
    budgetRange?: string;
    requirements: string;
    preferredContact: 'email' | 'phone' | 'whatsapp';
    language: 'en' | 'hi';
    status: 'new' | 'contacted' | 'qualified' | 'proposal_sent' | 'won' | 'lost';
    assignedTo?: string;
    internalNotes?: string[];
    createdAt: string;
    updatedAt: string;
    notificationStatus: {
      email: 'not_configured' | 'pending' | 'sent' | 'failed';
      whatsapp: 'not_configured' | 'pending' | 'sent' | 'failed';
    };
  }>;
  bookings: Array<{
    id: string;
    customerName: string;
    email: string;
    phone?: string;
    businessName?: string;
    topic: string;
    date: string;
    startTime: string;
    endTime: string;
    timezone: string;
    status: 'confirmed' | 'rescheduled' | 'cancelled';
    googleCalendarEventId?: string;
    cancellationToken: string;
    createdAt: string;
  }>;
  calendarConfig: {
    meetingDurationMinutes: number;
    availableDays: number[];
    startHour: string;
    endHour: string;
    bufferMinutes: number;
    timezone: string;
    ownerCalendarId: string;
  };
  projects: Array<{
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
  }>;
  notificationLogs: Array<{
    id: string;
    enquiryId?: string;
    bookingId?: string;
    type: 'email' | 'whatsapp';
    recipient: string;
    status: 'pending' | 'sent' | 'failed' | 'not_configured';
    errorDetails?: string;
    timestamp: string;
  }>;
  auditLogs: Array<{
    id: string;
    userEmail: string;
    action: string;
    target: string;
    details?: string;
    timestamp: string;
  }>;
  sessions: Record<string, { userId: string; email: string; role: 'owner' | 'admin' | 'staff'; expiresAt: number }>;
}

const initialStore: DataStore = {
  users: [
    {
      id: 'usr_owner_01',
      name: 'Anjaney Kumar Rai (Owner)',
      email: 'owner@nexora.ai',
      passwordHash: 'NexoraOwner#2026',
      role: 'owner',
      active: true,
    },
    {
      id: 'usr_admin_02',
      name: 'Operations Lead (Admin)',
      email: 'admin@nexora.ai',
      passwordHash: 'NexoraAdmin#2026',
      role: 'admin',
      active: true,
    },
    {
      id: 'usr_staff_03',
      name: 'Technical Consultant (Staff)',
      email: 'staff@nexora.ai',
      passwordHash: 'NexoraStaff#2026',
      role: 'staff',
      active: true,
    },
  ],
  enquiries: [],
  bookings: [],
  calendarConfig: {
    meetingDurationMinutes: 30,
    availableDays: [0, 1, 2, 3, 4, 5, 6], // Sunday through Saturday
    startHour: '10:00',
    endHour: '19:00',
    bufferMinutes: 15,
    timezone: 'Asia/Kolkata',
    ownerCalendarId: 'anjaneykumarraianjaneykumarrai@gmail.com',
  },
  projects: [
    {
      id: 'proj_demo_web_01',
      title: 'Local Retail & Boutique Hospitality Web Portal',
      titleHi: 'स्थानीय खुदरा एवं बुटीक हॉस्पिटैलिटी वेब पोर्टल',
      category: 'web',
      description: 'Ultra-fast responsive web architecture featuring instant catalog browsing, real-time consultation enquiry routing, and lightweight mobile performance.',
      descriptionHi: 'अल्ट्रा-फास्ट रिस्पॉन्सिव वेब आर्किटेक्चर जिसमें त्वरित कैटलॉग ब्राउज़िंग, रीयल-टाइम पूछताछ रूटिंग और हल्का मोबाइल अनुभव शामिल है।',
      image: '/src/assets/images/demo_website_preview_1792125901773.jpg',
      isDemoConcept: true,
      previewUrl: '#demo-website',
      capabilities: ['Mobile-First Next-Gen UI', 'Fast Page Performance', 'Direct WhatsApp Enquiry Integration'],
      published: true,
      sortOrder: 1,
    },
    {
      id: 'proj_demo_voice_02',
      title: 'Healthcare & Clinic AI Inbound Voice Desk',
      titleHi: 'हेल्थकेयर एवं क्लिनिक एआई इनबाउंड वॉयस डेस्क',
      category: 'voice',
      description: 'Conversational voice assistant capable of qualifying patient enquiries, checking doctor appointment availability, and sending calendar invites.',
      descriptionHi: 'संवादात्मक वॉयस सहायक जो मरीज की पूछताछ को समझने, डॉक्टर की उपलब्धता जांचने और कैलेंडर आमंत्रण भेजने में सक्षम है।',
      image: '/src/assets/images/demo_voice_agent_1792125904344.jpg',
      isDemoConcept: true,
      previewUrl: '#demo-voice',
      capabilities: ['Bilingual Voice Dialog', 'Lead Qualification Logic', 'Google Calendar Slot Reservation'],
      published: true,
      sortOrder: 2,
    },
    {
      id: 'proj_demo_auto_03',
      title: 'Omnichannel Lead Capture & WhatsApp Dispatch Pipeline',
      titleHi: 'ओमनीचैनल लीड कैप्चर एवं व्हाट्सएप डिस्पैच पाइपलाइन',
      category: 'automation',
      description: 'Automated middleware connecting web enquiries with instantaneous WhatsApp alerts to business owners (+91 9838775359) and CRM updates.',
      descriptionHi: 'वेब पूछताछ को व्यवसाय स्वामियों (+91 9838775359) को त्वरित व्हाट्सएप अलर्ट और सीआरएम अपडेट से जोड़ने वाला स्वचालित मिडलवेयर।',
      image: '/src/assets/images/demo_business_automation_1792125904484.jpg',
      isDemoConcept: true,
      previewUrl: '#demo-automation',
      capabilities: ['Zero-Delay WhatsApp Alerts', 'Firestore Deduplication', 'Audit Trail & Error Logging'],
      published: true,
      sortOrder: 3,
    },
    {
      id: 'proj_demo_suite_04',
      title: 'Professional Service Consultation Scheduling Engine',
      titleHi: 'पेशेवर सेवा कंसल्टेशन शेड्यूलिंग इंजन',
      category: 'web',
      description: 'Automated 30-minute booking system synchronized with personal Google Calendar, preventing double bookings with custom cancellation security tokens.',
      descriptionHi: 'व्यक्तिगत गूगल कैलेंडर के साथ सिंक्रनाइज़ 30-मिनट का शेड्यूलिंग सिस्टम, जो डबल बुकिंग रोकता है और रद्दीकरण सुरक्षा टोकन प्रदान करता है।',
      image: '/src/assets/images/consultation_meeting_suite_1792125904017.jpg',
      isDemoConcept: true,
      previewUrl: '#demo-calendar',
      capabilities: ['Double-Booking Prevention', 'Asia/Kolkata Timezone Engine', 'Tokenized Rescheduling'],
      published: true,
      sortOrder: 4,
    },
  ],
  notificationLogs: [],
  auditLogs: [],
  sessions: {},
};

function loadStore(): DataStore {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const content = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      // Merge defaults in case new fields were introduced
      return { ...initialStore, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load store, using defaults', err);
  }
  saveStore(initialStore);
  return initialStore;
}

function saveStore(data: DataStore) {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store', err);
  }
}

let store = loadStore();

// --- AUTH MIDDLEWARE & HELPERS ---
function authenticate(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  const session = store.sessions[token];
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ error: 'Session expired or invalid' });
  }
  (req as any).user = session;
  next();
}

function requireRole(allowedRoles: ('owner' | 'admin' | 'staff')[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Log audit helper
function recordAudit(userEmail: string, action: string, target: string, details?: string) {
  const log = {
    id: 'aud_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userEmail,
    action,
    target,
    details,
    timestamp: new Date().toISOString(),
  };
  store.auditLogs.unshift(log);
  if (store.auditLogs.length > 200) store.auditLogs.pop();
  saveStore(store);
}

// --- API ROUTES ---

// 1. Health & Integration Status
app.get('/api/integrations/status', (req, res) => {
  const isGoogleCalendarSet = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_REFRESH_TOKEN);
  const isFirebaseSet = !!(process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  const isEmailSet = !!(process.env.RESEND_API_KEY || (process.env.SMTP_HOST && process.env.SMTP_USER));
  const isWhatsAppSet = !!(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);

  res.json({
    googleCalendar: {
      status: isGoogleCalendarSet ? 'connected' : 'not_configured',
      details: isGoogleCalendarSet
        ? 'Connected to Google Calendar API for Asia/Kolkata consultation scheduling.'
        : 'Google OAuth credentials not configured in environment. Online automated calendar booking is paused.',
      lastChecked: new Date().toISOString(),
    },
    firebase: {
      status: isFirebaseSet ? 'connected' : 'not_configured',
      details: isFirebaseSet
        ? 'Connected to Cloud Firestore & Firebase Auth.'
        : 'Firebase project credentials not set in environment. Local persistent storage is active.',
      lastChecked: new Date().toISOString(),
    },
    email: {
      status: isEmailSet ? 'connected' : 'not_configured',
      details: isEmailSet
        ? 'Transactional email service configured.'
        : 'Transactional email API key not configured. Notifications recorded to internal logs.',
      lastChecked: new Date().toISOString(),
    },
    whatsapp: {
      status: isWhatsAppSet ? 'connected' : 'not_configured',
      details: isWhatsAppSet
        ? 'WhatsApp Business Cloud API active.'
        : 'WhatsApp API credentials not configured. Click-to-chat active for +91 9838775359 and +91 7985859410.',
      lastChecked: new Date().toISOString(),
    },
  });
});

// 2. Authentication Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.active);
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = 'tok_' + crypto.randomBytes(24).toString('hex');
  store.sessions[token] = {
    userId: user.id,
    email: user.email,
    role: user.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };
  saveStore(store);

  recordAudit(user.email, 'LOGIN', 'Admin Portal', 'User signed in successfully');

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    },
  });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const sessionUser = (req as any).user;
  const user = store.users.find((u) => u.id === sessionUser.userId);
  if (!user || !user.active) {
    return res.status(401).json({ error: 'User not found or disabled' });
  }
  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    },
  });
});

app.post('/api/auth/logout', authenticate, (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    delete store.sessions[token];
    saveStore(store);
  }
  res.json({ success: true });
});

// 3. Enquiries API
app.post('/api/enquiries', (req, res) => {
  const {
    fullName,
    businessName,
    email,
    phone,
    businessType,
    serviceRequired,
    budgetRange,
    requirements,
    preferredContact,
    language,
  } = req.body;

  // Validation: Required name and requirements
  if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
    return res.status(400).json({ error: 'Full name is required' });
  }
  if (!requirements || typeof requirements !== 'string' || !requirements.trim()) {
    return res.status(400).json({ error: 'Project requirements description is required' });
  }

  // Validation: At least one contact method (email or phone)
  const cleanEmail = typeof email === 'string' ? email.trim() : '';
  const cleanPhone = typeof phone === 'string' ? phone.trim() : '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasValidEmail = cleanEmail && emailRegex.test(cleanEmail);
  const hasValidPhone = cleanPhone && cleanPhone.replace(/\D/g, '').length >= 7;

  if (!hasValidEmail && !hasValidPhone) {
    return res.status(400).json({
      error: 'Please provide at least one valid contact method (email or phone number)',
    });
  }

  // Idempotency: Prevent duplicate submissions within 30 seconds with identical details
  const existingDup = store.enquiries.find(
    (e) =>
      e.fullName.toLowerCase() === fullName.trim().toLowerCase() &&
      (e.email === cleanEmail || e.phone === cleanPhone) &&
      Date.now() - new Date(e.createdAt).getTime() < 30000
  );

  if (existingDup) {
    return res.json({
      success: true,
      enquiryId: existingDup.id,
      message: 'Enquiry already registered',
    });
  }

  const newId = 'enq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();

  // Notification attempt simulation & tracking
  const hasWhatsAppConfig = !!process.env.WHATSAPP_ACCESS_TOKEN;
  const hasEmailConfig = !!process.env.RESEND_API_KEY;

  const newEnquiry = {
    id: newId,
    fullName: fullName.trim(),
    businessName: businessName?.trim() || undefined,
    email: cleanEmail || undefined,
    phone: cleanPhone || undefined,
    businessType: businessType?.trim() || undefined,
    serviceRequired: serviceRequired || 'website_development',
    budgetRange: budgetRange || undefined,
    requirements: requirements.trim(),
    preferredContact: preferredContact || 'whatsapp',
    language: (language === 'hi' ? 'hi' : 'en') as 'en' | 'hi',
    status: 'new' as const,
    createdAt: now,
    updatedAt: now,
    notificationStatus: {
      email: (hasEmailConfig ? 'sent' : 'not_configured') as 'sent' | 'not_configured',
      whatsapp: (hasWhatsAppConfig ? 'sent' : 'not_configured') as 'sent' | 'not_configured',
    },
  };

  store.enquiries.unshift(newEnquiry);

  // Add notification log records
  const notifEmailId = 'notif_em_' + Date.now();
  store.notificationLogs.unshift({
    id: notifEmailId,
    enquiryId: newId,
    type: 'email',
    recipient: 'anjaneykumarraianjaneykumarrai@gmail.com',
    status: hasEmailConfig ? 'sent' : 'not_configured',
    errorDetails: hasEmailConfig ? undefined : 'Email provider API key not configured in .env',
    timestamp: now,
  });

  const notifWaId = 'notif_wa_' + Date.now();
  store.notificationLogs.unshift({
    id: notifWaId,
    enquiryId: newId,
    type: 'whatsapp',
    recipient: '+919838775359',
    status: hasWhatsAppConfig ? 'sent' : 'not_configured',
    errorDetails: hasWhatsAppConfig ? undefined : 'WhatsApp Cloud API credentials not configured in .env',
    timestamp: now,
  });

  saveStore(store);

  res.status(201).json({
    success: true,
    enquiryId: newId,
    message: 'Enquiry submitted successfully',
  });
});

app.get('/api/enquiries', authenticate, (req, res) => {
  res.json({ enquiries: store.enquiries });
});

app.patch('/api/enquiries/:id', authenticate, (req, res) => {
  const sessionUser = (req as any).user;
  const { id } = req.params;
  const { status, assignedTo, internalNote } = req.body;

  const enquiry = store.enquiries.find((e) => e.id === id);
  if (!enquiry) {
    return res.status(404).json({ error: 'Enquiry not found' });
  }

  if (status) {
    enquiry.status = status;
  }
  if (assignedTo !== undefined) {
    enquiry.assignedTo = assignedTo;
  }
  if (internalNote) {
    if (!enquiry.internalNotes) enquiry.internalNotes = [];
    enquiry.internalNotes.push(`[${new Date().toISOString().substring(0, 16)}] ${sessionUser.email}: ${internalNote}`);
  }
  enquiry.updatedAt = new Date().toISOString();

  saveStore(store);
  recordAudit(sessionUser.email, 'UPDATE_ENQUIRY', enquiry.id, `Status: ${enquiry.status}`);

  res.json({ success: true, enquiry });
});

// 4. Calendar Consultation Booking API
app.get('/api/calendar/config', (req, res) => {
  const isGoogleCalendarConnected = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_REFRESH_TOKEN);
  res.json({
    config: {
      ...store.calendarConfig,
      isGoogleCalendarConnected,
    },
  });
});

app.get('/api/calendar/slots', (req, res) => {
  const { date } = req.query;
  if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'Valid date in YYYY-MM-DD format is required' });
  }

  const requestedDate = new Date(date + 'T00:00:00+05:30');
  const dayOfWeek = requestedDate.getDay();

  // Check if day is within availableDays
  if (!store.calendarConfig.availableDays.includes(dayOfWeek)) {
    return res.json({ date, slots: [], message: 'Owner is not available on this day of week.' });
  }

  // Generate 30-minute intervals
  const [startH, startM] = store.calendarConfig.startHour.split(':').map(Number);
  const [endH, endM] = store.calendarConfig.endHour.split(':').map(Number);

  const startTotalMinutes = startH * 60 + startM;
  const endTotalMinutes = endH * 60 + endM;
  const slotDuration = store.calendarConfig.meetingDurationMinutes;

  const existingBookings = store.bookings.filter(
    (b) => b.date === date && b.status === 'confirmed'
  );

  const slots: Array<{ startTime: string; endTime: string; available: boolean }> = [];

  for (let m = startTotalMinutes; m + slotDuration <= endTotalMinutes; m += slotDuration) {
    const h1 = Math.floor(m / 60);
    const min1 = m % 60;
    const timeStr1 = `${String(h1).padStart(2, '0')}:${String(min1).padStart(2, '0')}`;

    const m2 = m + slotDuration;
    const h2 = Math.floor(m2 / 60);
    const min2 = m2 % 60;
    const timeStr2 = `${String(h2).padStart(2, '0')}:${String(min2).padStart(2, '0')}`;

    const isBooked = existingBookings.some((b) => b.startTime === timeStr1);

    slots.push({
      startTime: timeStr1,
      endTime: timeStr2,
      available: !isBooked,
    });
  }

  res.json({
    date,
    timezone: store.calendarConfig.timezone,
    slots,
  });
});

app.post('/api/calendar/book', (req, res) => {
  const { customerName, email, phone, businessName, topic, date, startTime } = req.body;

  if (!customerName || !email || !date || !startTime) {
    return res.status(400).json({ error: 'Missing required booking fields (name, email, date, time)' });
  }

  // Double booking check: re-verify slot is free
  const slotConflict = store.bookings.find(
    (b) => b.date === date && b.startTime === startTime && b.status === 'confirmed'
  );

  if (slotConflict) {
    return res.status(409).json({
      error: 'This slot is no longer available. Please select another time.',
    });
  }

  // Calculate end time (30 mins)
  const [h, m] = startTime.split(':').map(Number);
  const endMTotal = h * 60 + m + store.calendarConfig.meetingDurationMinutes;
  const endH = Math.floor(endMTotal / 60);
  const endM = endMTotal % 60;
  const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

  const cancellationToken = 'NXR-BK-' + crypto.randomBytes(6).toString('hex').toUpperCase();
  const bookingId = 'bk_' + Date.now();
  const now = new Date().toISOString();

  const newBooking = {
    id: bookingId,
    customerName: customerName.trim(),
    email: email.trim(),
    phone: phone?.trim(),
    businessName: businessName?.trim(),
    topic: topic || 'AI Studio Consultation',
    date,
    startTime,
    endTime,
    timezone: store.calendarConfig.timezone,
    status: 'confirmed' as const,
    googleCalendarEventId: 'mock_gcal_' + Date.now(),
    cancellationToken,
    createdAt: now,
  };

  store.bookings.push(newBooking);

  // Add notification log
  store.notificationLogs.unshift({
    id: 'notif_bk_' + Date.now(),
    bookingId,
    type: 'email',
    recipient: email.trim(),
    status: process.env.RESEND_API_KEY ? 'sent' : 'not_configured',
    errorDetails: process.env.RESEND_API_KEY ? undefined : 'Email provider API key pending setup in environment',
    timestamp: now,
  });

  saveStore(store);

  res.status(201).json({
    success: true,
    booking: newBooking,
    message: 'Consultation scheduled successfully',
  });
});

app.post('/api/calendar/cancel', (req, res) => {
  const { cancellationToken, reason } = req.body;
  if (!cancellationToken) {
    return res.status(400).json({ error: 'Cancellation token required' });
  }

  const booking = store.bookings.find(
    (b) => b.cancellationToken === cancellationToken.trim() && b.status === 'confirmed'
  );

  if (!booking) {
    return res.status(404).json({ error: 'Active booking with provided token was not found' });
  }

  booking.status = 'cancelled';
  saveStore(store);

  recordAudit(booking.email, 'CANCEL_BOOKING', booking.id, reason || 'Customer requested cancellation');

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
  });
});

app.get('/api/bookings', authenticate, (req, res) => {
  res.json({ bookings: store.bookings });
});

// 5. Portfolio API
app.get('/api/portfolio', (req, res) => {
  const published = store.projects.filter((p) => p.published);
  res.json({ projects: published });
});

app.get('/api/portfolio/all', authenticate, (req, res) => {
  res.json({ projects: store.projects });
});

app.post('/api/portfolio', authenticate, requireRole(['owner', 'admin']), (req, res) => {
  const sessionUser = (req as any).user;
  const { title, titleHi, category, description, descriptionHi, image, isDemoConcept, previewUrl, capabilities } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ error: 'Title, category, and description are required' });
  }

  const newProject = {
    id: 'proj_' + Date.now(),
    title: title.trim(),
    titleHi: titleHi?.trim(),
    category,
    description: description.trim(),
    descriptionHi: descriptionHi?.trim(),
    image: image || '/src/assets/images/demo_website_preview_1792125901773.jpg',
    isDemoConcept: Boolean(isDemoConcept),
    previewUrl: previewUrl?.trim(),
    capabilities: Array.isArray(capabilities) ? capabilities : [],
    published: true,
    sortOrder: store.projects.length + 1,
  };

  store.projects.push(newProject);
  saveStore(store);
  recordAudit(sessionUser.email, 'CREATE_PROJECT', newProject.id, newProject.title);

  res.status(201).json({ success: true, project: newProject });
});

app.put('/api/portfolio/:id', authenticate, requireRole(['owner', 'admin']), (req, res) => {
  const sessionUser = (req as any).user;
  const { id } = req.params;
  const project = store.projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  Object.assign(project, req.body);
  saveStore(store);
  recordAudit(sessionUser.email, 'UPDATE_PROJECT', project.id, project.title);

  res.json({ success: true, project });
});

app.delete('/api/portfolio/:id', authenticate, requireRole(['owner']), (req, res) => {
  const sessionUser = (req as any).user;
  const { id } = req.params;
  const index = store.projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const removed = store.projects.splice(index, 1)[0];
  saveStore(store);
  recordAudit(sessionUser.email, 'DELETE_PROJECT', id, removed.title);

  res.json({ success: true });
});

// 6. Settings & Logs API
app.get('/api/settings/calendar', authenticate, (req, res) => {
  res.json({ calendarConfig: store.calendarConfig });
});

app.put('/api/settings/calendar', authenticate, requireRole(['owner']), (req, res) => {
  const sessionUser = (req as any).user;
  store.calendarConfig = { ...store.calendarConfig, ...req.body };
  saveStore(store);
  recordAudit(sessionUser.email, 'UPDATE_CALENDAR_SETTINGS', 'Config', JSON.stringify(req.body));
  res.json({ success: true, calendarConfig: store.calendarConfig });
});

app.get('/api/audit-logs', authenticate, requireRole(['owner', 'admin']), (req, res) => {
  res.json({ auditLogs: store.auditLogs });
});

app.get('/api/notification-logs', authenticate, requireRole(['owner', 'admin']), (req, res) => {
  res.json({ notificationLogs: store.notificationLogs });
});

// 7. Team Management API
app.get('/api/team', authenticate, requireRole(['owner']), (req, res) => {
  const safeUsers = store.users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    active: u.active,
  }));
  res.json({ users: safeUsers });
});

app.post('/api/team', authenticate, requireRole(['owner']), (req, res) => {
  const sessionUser = (req as any).user;
  const { name, email, role, password } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const exists = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (exists) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    passwordHash: password,
    role: role as 'owner' | 'admin' | 'staff',
    active: true,
  };

  store.users.push(newUser);
  saveStore(store);
  recordAudit(sessionUser.email, 'CREATE_USER', newUser.email, `Role: ${newUser.role}`);

  res.status(201).json({
    success: true,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, active: newUser.active },
  });
});

// --- VITE & STATIC FILES SERVING ---
async function setupServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexora AI Studio server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
