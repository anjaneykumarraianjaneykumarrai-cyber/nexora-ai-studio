import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const PrivacyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-stone-900">Privacy Policy</h1>
        <p className="text-xs text-stone-500">Last updated: March 2026</p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-stone-700 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">1. Information We Collect</h2>
          <p>
            Nexora AI Studio collects only the necessary information provided voluntarily by you through our project enquiry forms, consultation booking system, and direct WhatsApp or email correspondence. This includes your full name, business name, contact email, phone number, and brief descriptions of your project requirements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">2. How We Use Your Data</h2>
          <p>
            Your information is used strictly to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Respond to your direct inquiries and evaluate project feasibility.</li>
            <li>Schedule and manage 30-minute consultation appointments via Google Calendar.</li>
            <li>Send transaction-specific confirmation messages via email or WhatsApp.</li>
            <li>Provide customer support and project delivery updates.</li>
          </ul>
          <p>We never sell, rent, or trade your personal data to third-party marketing companies.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">3. Calendar & Telephony Integrations</h2>
          <p>
            When booking a consultation, your email and requested slot are processed to coordinate with our team's Google Calendar. Telephony and conversational voice demos do not record or retain voice audio without explicit prior authorization.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">4. Contact Information</h2>
          <p>
            For questions regarding data access or deletion requests, contact us at:
            <br />
            <strong>Official Email:</strong> anjaneykumarraianjaneykumarrai@gmail.com
            <br />
            <strong>WhatsApp:</strong> +91 9838775359 / +91 7985859410
          </p>
        </section>
      </div>
    </div>
  );
};
