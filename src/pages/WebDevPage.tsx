import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, ShieldCheck, Zap, Smartphone, CheckCircle, ArrowRight } from 'lucide-react';

interface ServicePageProps {
  navigate: (route: string) => void;
}

export const WebDevPage: React.FC<ServicePageProps> = ({ navigate }) => {
  const { t } = useLanguage();

  const problems = [
    {
      problem: 'Outdated or Cluttered Websites',
      impact: 'Prospective clients bounce immediately when a site takes over 3 seconds to load or lacks clear navigation on mobile.',
    },
    {
      problem: 'Disconnect from Everyday Channels',
      impact: 'Visitors want instant answers via WhatsApp or quick appointments rather than filling out cumbersome, ignored web forms.',
    },
    {
      problem: 'Rigid CMS Platforms with High Maintenance',
      impact: 'Generic template builders become slow and insecure over time, requiring continuous expensive plugin patching.',
    },
  ];

  const solutions = [
    {
      title: 'Engineered for Sub-Second Performance',
      desc: 'Lightweight static and server architectures that render instantly across mobile 4G/5G networks, maximizing Google Lighthouse scores.',
    },
    {
      title: 'Seamless WhatsApp & Calendar Hooks',
      desc: 'Integrated click-to-chat triggers (+91 9838775359) and direct Google Calendar booking without clunky third-party embeds.',
    },
    {
      title: 'Bilingual & Localized Design',
      desc: 'Native support for English and Hindi audiences with smooth locale switching, ensuring clear messaging for local and international markets.',
    },
    {
      title: 'Accessible & Conversion-Disciplined Layouts',
      desc: 'Clean typographic scales, high-contrast readability, and single-click mobile phone actions designed to capture genuine client inquiries.',
    },
  ];

  const faqs = [
    {
      q: 'Do you charge a fixed template fee or provide custom quotations?',
      a: 'We provide transparent custom quotations based on your specific requirements, number of pages, and required integrations. No hidden recurring platform markups.',
    },
    {
      q: 'Can the website be updated easily by our internal team?',
      a: 'Yes. We provide an integrated admin portal where authorized team members can edit portfolio entries, service details, and business announcements safely.',
    },
    {
      q: 'How long does a typical website development project take?',
      a: 'Most boutique and local business websites are designed, tested, and deployed within 2 to 3 weeks following discovery.',
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="space-y-4 max-w-3xl">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Engineering Discipline 01
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Modern Website Development for High-Intent Businesses.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          We build responsive, ultra-fast websites for local service providers, healthcare clinics, retail boutiques, and online ventures. Crafted for clarity, accessibility, and high conversion.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => navigate('book')}
            className="px-5 py-2.5 text-xs font-semibold bg-[#BEF264] text-stone-900 hover:bg-[#A3E635] rounded-lg transition-colors shadow-xs"
          >
            Schedule a Website Consultation
          </button>
          <button
            onClick={() => navigate('portfolio')}
            className="px-5 py-2.5 text-xs font-medium border border-stone-300 text-stone-800 hover:bg-stone-50 rounded-lg transition-colors"
          >
            View Demo Concepts
          </button>
        </div>
      </div>

      {/* Media Visual */}
      <div className="rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-stone-100">
        <img
          src="/src/assets/images/demo_website_preview_1792125901773.jpg"
          alt="Modern Website Architecture Showcase"
          className="w-full h-80 sm:h-96 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="p-4 bg-white border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Demo Concept: Local Retail & Professional Service Web Platform</span>
          <span className="font-mono text-[11px]">Mobile + Desktop Responsive</span>
        </div>
      </div>

      {/* Business Problems Addressed */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-stone-900">Common Business Challenges Addressed</h2>
          <p className="text-sm text-stone-600">Why generic templates fail to convert modern consumers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((item, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2">
              <div className="text-sm font-bold text-stone-900">{item.problem}</div>
              <p className="text-xs text-stone-600 leading-relaxed">{item.impact}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Proposed Technical Solutions */}
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-stone-900">Our Architectural Standards</h2>
          <p className="text-sm text-stone-600">Built to modern web engineering principles without template bloat.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {solutions.map((item, idx) => (
            <div key={idx} className="p-6 rounded-xl bg-white border border-stone-200 shadow-xs space-y-2">
              <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-stone-900">Frequently Asked Questions</h2>
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
          <h3 className="text-xl font-bold text-white">Ready to elevate your online presence?</h3>
          <p className="text-xs text-stone-400">Let’s discuss your brand’s goals and draft an actionable project roadmap.</p>
        </div>
        <button
          onClick={() => navigate('contact')}
          className="px-6 py-3 text-xs font-semibold bg-[#BEF264] text-stone-900 rounded-lg hover:bg-[#A3E635] transition-colors whitespace-nowrap shrink-0"
        >
          Request Custom Proposal
        </button>
      </div>
    </div>
  );
};
