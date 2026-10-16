import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveVoiceDemo } from '../components/InteractiveVoiceDemo';
import { Mic, PhoneCall, CalendarCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface ServicePageProps {
  navigate: (route: string) => void;
}

export const VoiceAgentsPage: React.FC<ServicePageProps> = ({ navigate }) => {
  const { t } = useLanguage();

  const useCases = [
    {
      title: 'Inbound Appointment & Viewing Scheduling',
      desc: 'Handles routine patient, dining, or property viewing requests. Checks doctor or sales calendar availability and reserves slots without staff intervention.',
    },
    {
      title: 'Lead Qualification & Intake Filtering',
      desc: 'Engages inbound callers, asks structured qualification questions (budget, location, timeline), and logs qualified leads into your CRM or WhatsApp.',
    },
    {
      title: 'After-Hours Enquiry Reception',
      desc: 'Captures caller messages and answers FAQs (timings, location, services) when your physical office or front desk is closed.',
    },
  ];

  const faqs = [
    {
      q: 'Does an AI voice agent replace our human receptionists completely?',
      a: 'No. Our voice agents are designed to assist by absorbing repetitive calls, checking availability, and handling peak-hour spillover. Complex or urgent matters are gracefully transferred to human staff.',
    },
    {
      q: 'Which languages and dialects are supported?',
      a: 'We configure models supporting Indian English and Hindi with natural phrasing and polite conversational cadence.',
    },
    {
      q: 'How does the voice agent connect to our phone lines?',
      a: 'We integrate with standard telephony providers (SIP trunks, Twilio, or Exotel). We test call routing and escalation rules before deploying live numbers.',
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Engineering Discipline 02
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Intelligent AI Voice Agents for Seamless Inbound Operations.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          Provide instant, courteous phone assistance 24/7. Handle appointment scheduling, client intake qualification, and common inquiries without overburdening your front-desk team.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('book')}
            className="px-5 py-2.5 text-xs font-semibold bg-[#BEF264] text-stone-900 hover:bg-[#A3E635] rounded-lg transition-colors shadow-xs"
          >
            Book a Voice Architecture Consultation
          </button>
          <a
            href="#voice-demo"
            className="px-5 py-2.5 text-xs font-medium border border-stone-300 text-stone-800 hover:bg-stone-50 rounded-lg transition-colors"
          >
            Try Interactive Voice Simulation
          </a>
        </div>
      </div>

      {/* Interactive Demonstration */}
      <div id="voice-demo" className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-stone-900">Interactive Voice Prototype</h2>
          <p className="text-xs sm:text-sm text-stone-600">
            Test simulated voice dialogues with distinct operational personas right in your browser.
          </p>
        </div>
        <InteractiveVoiceDemo />
      </div>

      {/* Realistic Use Cases */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-stone-900">Practical Real-World Implementations</h2>
          <p className="text-sm text-stone-600">Where conversational AI creates measurable efficiency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <div key={i} className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2">
              <div className="text-sm font-bold text-stone-900">{uc.title}</div>
              <p className="text-xs text-stone-600 leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Honesty & Limitations */}
      <div className="p-6 rounded-xl bg-stone-100 border border-stone-200 space-y-3 text-xs text-stone-700">
        <h3 className="font-bold text-stone-900 text-sm">Our Operational Principles on Voice AI</h3>
        <p className="leading-relaxed">
          We believe in honest technology: AI voice agents are best suited for structured, repetitive telephone inquiries (confirming timings, collecting patient intake details, checking open calendar slots). We never claim voice agents will solve complex diagnostic or legal judgment tasks. Every system we build includes fail-safe transfer logic to human operators.
        </p>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-stone-900">Voice Assistant FAQs</h2>
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
          <h3 className="text-xl font-bold text-white">Automate your business phone operations</h3>
          <p className="text-xs text-stone-400">Schedule a 30-minute technical consultation to discuss telephony setup.</p>
        </div>
        <button
          onClick={() => navigate('book')}
          className="px-6 py-3 text-xs font-semibold bg-[#BEF264] text-stone-900 rounded-lg hover:bg-[#A3E635] transition-colors whitespace-nowrap shrink-0"
        >
          Book Consultation
        </button>
      </div>
    </div>
  );
};
