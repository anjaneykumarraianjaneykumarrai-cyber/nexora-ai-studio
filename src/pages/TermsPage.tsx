import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const TermsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-stone-900">Terms and Conditions</h1>
        <p className="text-xs text-stone-500">Effective Date: March 2026</p>
      </div>

      <div className="prose prose-stone text-xs sm:text-sm text-stone-700 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">1. Acceptance of Terms</h2>
          <p>
            By accessing the website and services provided by Nexora AI Studio, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">2. Nature of Demonstrations & Concept Projects</h2>
          <p>
            All projects, interactive voice simulations, and workflows marked with "Demo Concept" or "Interactive Demo" are illustrative prototypes constructed to demonstrate technical capabilities. They do not constitute endorsements by external third parties, nor do they guarantee identical financial or operational metrics for all businesses.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">3. Custom Quotations & Service Contracts</h2>
          <p>
            All development, voice agent deployment, and automation engagements are executed via individualized proposals and Statements of Work (SOW) detailing precise milestones, deliverable specifications, and payment terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">4. Consultations & Rescheduling</h2>
          <p>
            Consultation slots booked via our calendar integration are offered on a 30-minute basis. Clients may cancel or reschedule their appointment at any time using their provided cancellation token.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900">5. Governing Law</h2>
          <p>
            These terms are governed by the applicable laws of India. For any disputes or formal notices, contact us at anjaneykumarraianjaneykumarrai@gmail.com.
          </p>
        </section>
      </div>
    </div>
  );
};
