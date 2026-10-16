import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveAutomationFlow } from '../components/InteractiveAutomationFlow';
import { GitBranch, MessageSquare, Database, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ServicePageProps {
  navigate: (route: string) => void;
}

export const AutomationPage: React.FC<ServicePageProps> = ({ navigate }) => {
  const { t } = useLanguage();

  const workflows = [
    {
      title: 'WhatsApp Instant Lead Routing',
      desc: 'When a new visitor requests a quotation, our webhook immediately delivers their requirements to the owner (+91 9838775359) with one-tap reply links.',
    },
    {
      title: 'Two-Way Google Calendar Synchronization',
      desc: 'Eliminates scheduling conflicts across your entire team. Slots are locked across all personal and operational calendars simultaneously.',
    },
    {
      title: 'Multi-System Data Normalization',
      desc: 'Consolidates incoming inquiries from your website, WhatsApp, and email into Firestore or your primary CRM, eliminating copy-paste errors.',
    },
    {
      title: 'Automated Status & Follow-Up Updates',
      desc: 'Sends timely SMS or WhatsApp notifications to clients when their proposal is ready or their consultation slot is confirmed.',
    },
  ];

  const faqs = [
    {
      q: 'Which platforms can you integrate?',
      a: 'We design custom webhooks and REST integrations for WhatsApp Cloud API, Google Workspace (Calendar, Sheets, Gmail), PostgreSQL, and Firebase Firestore.',
    },
    {
      q: 'Do you require our master passwords to set up integrations?',
      a: 'Never. We implement standard OAuth 2.0 and API token authorizations, ensuring your credentials remain private to your organization.',
    },
    {
      q: 'What happens if a third-party API has an outage?',
      a: 'Every workflow includes server-side retry queues and error notification logs. An API failure will never erase a customer inquiry.',
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Engineering Discipline 03
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Reliable Business Automation to Eliminate Repetitive Work.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Connect your website, messaging channels, calendar scheduling, and internal database into a unified operational engine. Save hours of manual coordination every single week.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('book')}
            className="px-5 py-2.5 text-xs font-semibold bg-[#BEF264] text-stone-900 hover:bg-[#A3E635] rounded-lg transition-colors shadow-xs"
          >
            Schedule Automation Consultation
          </button>
          <a
            href="#automation-demo"
            className="px-5 py-2.5 text-xs font-medium border border-stone-300 text-stone-800 hover:bg-stone-50 rounded-lg transition-colors"
          >
            Explore Interactive Workflow
          </a>
        </div>
      </div>

      {/* Interactive Workflow Demo */}
      <div id="automation-demo" className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-stone-900">Interactive Automation Pipeline</h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Click the test trigger to view event propagation from form submission to WhatsApp notification and calendar lock.
          </p>
        </div>
        <InteractiveAutomationFlow />
      </div>

      {/* Workflow Examples */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-stone-900">Custom Engineering Workflows</h2>
          <p className="text-sm text-stone-600">Tailored to your specific software stack and team processes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workflows.map((wf, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2">
              <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{wf.title}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{wf.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-stone-900">Automation FAQs</h2>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="p-5 rounded-xl bg-white border border-stone-200 space-y-1.5">
              <h4 className="text-sm font-semibold text-stone-900">{f.q}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">Let’s streamline your daily operations</h3>
          <p className="text-xs text-stone-400">Tell us what manual tasks cost your team the most time.</p>
        </div>
        <button
          onClick={() => navigate('contact')}
          className="px-6 py-3 text-xs font-semibold bg-[#BEF264] text-stone-900 rounded-lg hover:bg-[#A3E635] transition-colors whitespace-nowrap shrink-0"
        >
          Submit Project Scope
        </button>
      </div>
    </div>
  );
};
