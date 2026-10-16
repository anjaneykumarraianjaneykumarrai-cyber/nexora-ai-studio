import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { EnquiryForm } from '../components/EnquiryForm';
import { MessageSquare, Mail, Instagram, Calendar, ArrowUpRight } from 'lucide-react';

interface ContactPageProps {
  navigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const { t } = useLanguage();

  const handleWhatsApp = (number: string) => {
    const text = encodeURIComponent(
      'Hello Nexora AI Studio, I would like to discuss an AI solution for my business.'
    );
    window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="py-12 sm:py-20 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          {t.contact.title}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Direct Channels & Project Inquiries.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Official Contact Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800">
              {t.contact.officialChannels}
            </h2>

            {/* WhatsApp Cards */}
            <div className="p-5 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>{t.contact.whatsappTitle}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t.contact.whatsappDesc}
              </p>
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => handleWhatsApp(t.brand.whatsapp1)}
                  className="w-full py-2.5 px-3 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg transition-colors flex items-center justify-between border border-emerald-200"
                >
                  <span>{t.contact.whatsappAction1}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleWhatsApp(t.brand.whatsapp2)}
                  className="w-full py-2.5 px-3 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg transition-colors flex items-center justify-between border border-emerald-200"
                >
                  <span>{t.contact.whatsappAction2}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Instagram Card */}
            <div className="p-5 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <Instagram className="w-4 h-4 text-rose-500" />
                <span>{t.contact.instagramTitle}</span>
              </div>
              <p className="text-xs text-stone-600">
                Follow updates, behind-the-scenes engineering, and product demos.
              </p>
              <a
                href={t.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:text-stone-700 pt-1"
              >
                <span>{t.contact.instagramHandle}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Email Card */}
            <div className="p-5 bg-white rounded-xl border border-stone-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <Mail className="w-4 h-4 text-stone-600" />
                <span>{t.contact.emailTitle}</span>
              </div>
              <a
                href={`mailto:${t.brand.email}`}
                className="text-xs font-mono text-stone-800 hover:text-stone-950 break-all block"
              >
                {t.brand.email}
              </a>
            </div>

            {/* Direct Google Calendar Link */}
            <div className="p-5 bg-stone-900 rounded-xl text-white space-y-3">
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Calendar className="w-4 h-4 text-[#BEF264]" />
                <span>Prefer a Scheduled Meeting?</span>
              </div>
              <p className="text-xs text-stone-400">
                Book a 30-minute one-on-one session via Google Meet to review your architecture.
              </p>
              <button
                onClick={() => navigate('book')}
                className="w-full py-2.5 text-xs font-semibold bg-[#BEF264] text-stone-900 rounded-lg hover:bg-[#A3E635] transition-colors"
              >
                Open Calendar Booking
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Standard Enquiry Form */}
        <div className="lg:col-span-7">
          <EnquiryForm />
        </div>
      </div>
    </div>
  );
};
