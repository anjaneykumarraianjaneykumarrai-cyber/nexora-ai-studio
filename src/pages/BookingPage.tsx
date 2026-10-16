import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calendar as CalendarIcon, Clock, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { Booking } from '../types';

export const BookingPage: React.FC = () => {
  const { t } = useLanguage();

  // Tab: New Booking vs Manage Existing
  const [tab, setTab] = useState<'new' | 'manage'>('new');

  // Date selection: default tomorrow
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTomorrowDate());
  const [slots, setSlots] = useState<Array<{ startTime: string; endTime: string; available: boolean }>>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState<boolean>(false);

  // Form inputs
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [topic, setTopic] = useState('');

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Manage existing state
  const [manageToken, setManageToken] = useState('');
  const [cancelStatus, setCancelStatus] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Load calendar config & slots
  useEffect(() => {
    const fetchConfigAndSlots = async () => {
      try {
        const configRes = await fetch('/api/calendar/config');
        if (configRes.ok) {
          const configData = await configRes.json();
          setIsGoogleCalendarConnected(Boolean(configData.config?.isGoogleCalendarConnected));
        }

        setIsLoadingSlots(true);
        const slotsRes = await fetch(`/api/calendar/slots?date=${selectedDate}`);
        if (slotsRes.ok) {
          const slotsData = await slotsRes.json();
          setSlots(slotsData.slots || []);
        }
      } catch (err) {
        console.error('Failed to load slots', err);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchConfigAndSlots();
  }, [selectedDate]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!selectedSlot) {
      setBookingError('Please choose an available 30-minute time slot.');
      return;
    }
    if (!customerName.trim() || !email.trim()) {
      setBookingError('Name and Email are required for the calendar invite.');
      return;
    }

    setIsBooking(true);

    try {
      const res = await fetch('/api/calendar/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          businessName,
          topic,
          date: selectedDate,
          startTime: selectedSlot,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmedBooking(data.booking);
      } else {
        setBookingError(data.error || 'Failed to book slot. Please select another time.');
      }
    } catch (err) {
      setBookingError('Server connection error. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handleCancelBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageToken.trim()) return;

    setIsCancelling(true);
    setCancelStatus(null);

    try {
      const res = await fetch('/api/calendar/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancellationToken: manageToken.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCancelStatus('Your consultation has been successfully cancelled.');
        setManageToken('');
      } else {
        setCancelStatus(data.error || 'Booking not found with this code.');
      }
    } catch (err) {
      setCancelStatus('Connection error. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-xs font-semibold text-stone-700">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>{t.booking.durationBadge}</span>
            <span aria-hidden="true">·</span>
            <span>Asia/Kolkata (IST)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            {t.booking.title}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {t.booking.subtitle}
          </p>
        </div>

        {/* Integration Status Notice */}
        {!isGoogleCalendarConnected && (
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold">{t.booking.integrationPendingTitle}: </span>
              <span>{t.booking.integrationPendingMessage}</span>
            </div>
          </div>
        )}

        {/* Tab switch */}
        <div className="flex justify-center">
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl">
            <button
              onClick={() => setTab('new')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                tab === 'new' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Schedule New Consultation
            </button>
            <button
              onClick={() => setTab('manage')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                tab === 'manage' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.booking.manageTabTitle}
            </button>
          </div>
        </div>

        {/* Tab 1: New Booking */}
        {tab === 'new' && (
          <>
            {confirmedBooking ? (
              <div className="bg-white rounded-2xl border border-stone-200/90 p-8 shadow-xs text-center space-y-5">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900">{t.booking.bookingSuccessTitle}</h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                  {t.booking.bookingSuccessMessage}
                </p>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 max-w-md mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Date & Time:</span>
                    <span className="font-semibold text-stone-900">
                      {confirmedBooking.date} at {confirmedBooking.startTime} – {confirmedBooking.endTime} IST
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Attendee:</span>
                    <span className="font-medium text-stone-900">{confirmedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Email:</span>
                    <span className="font-medium text-stone-900">{confirmedBooking.email}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                    <span className="text-stone-500">{t.booking.cancellationTokenLabel}:</span>
                    <span className="font-mono font-bold text-stone-900 bg-stone-200 px-2 py-0.5 rounded-sm">
                      {confirmedBooking.cancellationToken}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {t.booking.cancellationNotice}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setConfirmedBooking(null);
                      setSelectedSlot(null);
                    }}
                    className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors"
                  >
                    Book Another Slot
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-8">
                {/* Step 1: Date & Time Picker */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Date picker */}
                  <div className="md:col-span-5 space-y-3">
                    <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                      <CalendarIcon className="w-4 h-4 text-stone-500" />
                      <span>{t.booking.selectDate}</span>
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setSelectedSlot(null);
                      }}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
                    />
                    <p className="text-[11px] text-stone-500">{t.booking.timezoneNotice}</p>
                  </div>

                  {/* Slot selection */}
                  <div className="md:col-span-7 space-y-3">
                    <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-stone-500" />
                      <span>{t.booking.selectSlot}</span>
                    </label>

                    {isLoadingSlots ? (
                      <div className="flex items-center justify-center p-8 text-stone-500 gap-2 text-xs">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Checking availability...</span>
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="p-6 bg-stone-50 rounded-xl text-center text-xs text-stone-500">
                        {t.booking.noSlotsAvailable}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto p-1">
                        {slots.map((slot) => (
                          <button
                            type="button"
                            key={slot.startTime}
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot.startTime)}
                            className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                              !slot.available
                                ? 'opacity-30 border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed line-through'
                                : selectedSlot === slot.startTime
                                ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                                : 'border-stone-200 hover:border-stone-400 bg-white text-stone-800'
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Consultation Details */}
                <div className="pt-6 border-t border-stone-200 space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                    {t.booking.enterDetails}
                  </h3>

                  {bookingError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  <form onSubmit={handleBook} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-800 flex items-center gap-1">
                          <span>{t.booking.customerName}</span>
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Anand Rai"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-800 flex items-center gap-1">
                          <span>{t.booking.customerEmail}</span>
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-800">
                          {t.booking.customerPhone}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+91 98387 75359"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-stone-800">
                          Business / Organization Name
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="e.g. Apex Diagnostics"
                          className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-stone-800">
                        {t.booking.consultationTopic}
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. AI Voice Agent for patient booking & WhatsApp automation"
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isBooking || !selectedSlot}
                        className="w-full py-3 text-xs sm:text-sm font-semibold text-stone-900 bg-[#BEF264] hover:bg-[#A3E635] disabled:opacity-50 transition-colors rounded-xl shadow-xs flex items-center justify-center gap-2"
                      >
                        {isBooking ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>{t.booking.bookingInProgress}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{t.booking.confirmBooking}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab 2: Manage Existing Booking */}
        {tab === 'manage' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-stone-700" />
                <span>{t.booking.manageTabTitle}</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600">
                {t.booking.enterTokenPrompt}
              </p>
            </div>

            {cancelStatus && (
              <div className="p-3 rounded-lg bg-stone-100 border border-stone-300 text-xs text-stone-800">
                {cancelStatus}
              </div>
            )}

            <form onSubmit={handleCancelBooking} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-800">
                  {t.booking.cancellationTokenLabel}
                </label>
                <input
                  type="text"
                  required
                  value={manageToken}
                  onChange={(e) => setManageToken(e.target.value)}
                  placeholder="e.g. NXR-BK-3E2A91F0BC"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 uppercase"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isCancelling || !manageToken.trim()}
                  className="px-5 py-2.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isCancelling ? 'Processing...' : t.booking.cancelBookingButton}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
