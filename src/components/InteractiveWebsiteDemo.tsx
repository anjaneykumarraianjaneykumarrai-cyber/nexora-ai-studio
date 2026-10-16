import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Laptop, Tablet, Smartphone, ExternalLink, Calendar, MessageCircle, Star } from 'lucide-react';

export const InteractiveWebsiteDemo: React.FC = () => {
  const { t } = useLanguage();
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'booking'>('overview');

  const containerWidths = {
    desktop: 'w-full max-w-4xl',
    tablet: 'w-full max-w-xl',
    mobile: 'w-full max-w-sm',
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
      {/* Device Toolbar */}
      <div className="bg-stone-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-lg">
          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              device === 'desktop' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.actionSection.webPreview.deviceDesktop}</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              device === 'tablet' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.actionSection.webPreview.deviceTablet}</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              device === 'mobile' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.actionSection.webPreview.deviceMobile}</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-stone-500 font-mono bg-white px-3 py-1 rounded-md border border-stone-200">
          <span>{t.actionSection.webPreview.addressBar}</span>
        </div>

        <div className="text-xs font-medium text-stone-500 flex items-center gap-1">
          <span>{t.portfolio.interactiveDemoBadge}</span>
        </div>
      </div>

      {/* Frame Container */}
      <div className="p-4 sm:p-8 bg-stone-100/70 flex justify-center min-h-[460px]">
        <div
          className={`${containerWidths[device]} transition-all duration-300 bg-white rounded-xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col`}
        >
          {/* Mock Brand Header */}
          <div className="px-4 py-3 border-b border-stone-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-stone-900" />
              <span className="text-sm font-bold text-stone-900 tracking-tight">KUMAR CLINICAL CARE</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'overview' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-500'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'services' ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-500'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab('booking')}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                  activeTab === 'booking' ? 'bg-[#BEF264] text-stone-900 font-semibold' : 'text-stone-500'
                }`}
              >
                Book Visit
              </button>
            </div>
          </div>

          {/* Mock Body Content */}
          <div className="p-6 flex-1 space-y-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                    Specialized Medical & Diagnostics Care
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                    Precision Diagnostics & Caring Doctor Consultations.
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Serving local patients with state-of-the-art pathology, imaging, and seamless appointment booking.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-xs text-stone-500">Working Hours</div>
                    <div className="text-sm font-semibold text-stone-900 mt-0.5">09:00 AM – 08:00 PM</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-xs text-stone-500">Location</div>
                    <div className="text-sm font-semibold text-stone-900 mt-0.5">Civil Lines, Gorakhpur</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-xs text-stone-500">Direct Support</div>
                    <div className="text-sm font-semibold text-stone-900 mt-0.5">WhatsApp Connected</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab('booking')}
                    className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
                  >
                    Schedule Consultation
                  </button>
                  <button
                    onClick={() => setActiveTab('services')}
                    className="px-4 py-2 text-xs font-medium border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    View Diagnostic Tests
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900">Clinical Disciplines & Procedures</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-sm font-semibold text-stone-900">Advanced Ultrasound & Imaging</div>
                    <p className="text-xs text-stone-600 mt-1">High-definition sonography with certified radiologist reports.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-sm font-semibold text-stone-900">Full Metabolic Blood Panel</div>
                    <p className="text-xs text-stone-600 mt-1">Automated analyzer results delivered digitally via WhatsApp.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-sm font-semibold text-stone-900">Cardiology & ECG Screening</div>
                    <p className="text-xs text-stone-600 mt-1">Instant digital ECG with cardiologist tele-consultation.</p>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div className="text-sm font-semibold text-stone-900">Home Sample Collection</div>
                    <p className="text-xs text-stone-600 mt-1">Trained phlebotomists scheduled through online booking.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'booking' && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-stone-900">Select Doctor Appointment Slot</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM', '07:15 PM'].map((slot, i) => (
                    <button
                      key={slot}
                      className={`p-2 text-xs font-semibold rounded-md border text-center transition-colors ${
                        i === 1 ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800">
                  Instant confirmation code sent to patient mobile number.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
