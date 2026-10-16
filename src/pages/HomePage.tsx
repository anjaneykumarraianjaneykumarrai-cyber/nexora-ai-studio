import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveWebsiteDemo } from '../components/InteractiveWebsiteDemo';
import { InteractiveVoiceDemo } from '../components/InteractiveVoiceDemo';
import { InteractiveAutomationFlow } from '../components/InteractiveAutomationFlow';
import { EnquiryForm } from '../components/EnquiryForm';
import {
  Globe,
  Mic,
  GitBranch,
  ArrowRight,
  MessageSquare,
  Calendar,
  Instagram,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { t } = useLanguage();
  const [actionTab, setActionTab] = useState<'web' | 'voice' | 'automation'>('web');

  const handleWhatsApp = (number: string) => {
    const text = encodeURIComponent(
      'Hello Nexora AI Studio, I would like to discuss an AI solution for my business.'
    );
    window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* SECTION A: HERO */}
      <section className="pt-8 sm:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 tracking-wide">
              <span>{t.hero.trustMarkers[0]}</span>
              <span aria-hidden="true">·</span>
              <span>{t.hero.trustMarkers[1]}</span>
              <span aria-hidden="true">·</span>
              <span>{t.hero.trustMarkers[2]}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-stone-900 leading-[1.08] text-balance">
              {t.hero.headline}
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
              {t.hero.subhead}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('book')}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide text-stone-900 bg-[#BEF264] hover:bg-[#A3E635] transition-colors rounded-xl shadow-xs flex items-center gap-2"
              >
                <span>{t.hero.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('portfolio')}
                className="px-6 py-3.5 text-xs sm:text-sm font-semibold text-stone-800 hover:text-stone-950 bg-white hover:bg-stone-50 border border-stone-200 transition-colors rounded-xl"
              >
                {t.hero.secondaryCta}
              </button>
            </div>

            {/* Quiet Quick WhatsApp Links */}
            <div className="pt-4 flex items-center gap-4 text-xs text-stone-500">
              <span className="font-medium text-stone-700">Quick WhatsApp:</span>
              <button
                onClick={() => handleWhatsApp(t.brand.whatsapp1)}
                className="hover:text-stone-900 underline underline-offset-4"
              >
                {t.brand.whatsappDisplay1}
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() => handleWhatsApp(t.brand.whatsapp2)}
                className="hover:text-stone-900 underline underline-offset-4"
              >
                {t.brand.whatsappDisplay2}
              </button>
            </div>
          </div>

          {/* Right Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm bg-stone-100 aspect-4/3 lg:aspect-square">
              <img
                src="/src/assets/images/hero_ai_studio_workspace_1792125902239.jpg"
                alt="Nexora AI Studio Modern Architecture"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <div className="text-xs font-bold text-[#BEF264] uppercase tracking-wider">
                  Nexora AI Studio
                </div>
                <div className="text-sm font-semibold mt-1">
                  Modern Web, Voice AI, & Intelligent Automation
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Our Disciplines
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900">
            {t.services.title}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {t.services.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1: Web Development */}
          <div className="p-8 bg-white rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
                <Globe className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-stone-400">01</div>
                <h3 className="text-xl font-bold text-stone-900">{t.services.web.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t.services.web.desc}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 mt-6">
              <button
                onClick={() => navigate('service-web')}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1 group"
              >
                <span>{t.services.web.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Service 2: Voice Agents */}
          <div className="p-8 bg-white rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
                <Mic className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-stone-400">02</div>
                <h3 className="text-xl font-bold text-stone-900">{t.services.voice.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t.services.voice.desc}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 mt-6">
              <button
                onClick={() => navigate('service-voice')}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1 group"
              >
                <span>{t.services.voice.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Service 3: Business Automation */}
          <div className="p-8 bg-white rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between hover:border-stone-400 transition-colors">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900">
                <GitBranch className="w-5 h-5 text-lime-700" />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-mono text-stone-400">03</div>
                <h3 className="text-xl font-bold text-stone-900">{t.services.automation.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {t.services.automation.desc}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 mt-6">
              <button
                onClick={() => navigate('service-automation')}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center gap-1 group"
              >
                <span>{t.services.automation.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: SELECTED WORK / DEMO CONCEPTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Work & Architecture
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900">
              {t.portfolio.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {t.portfolio.subtitle}
            </p>
          </div>
          <button
            onClick={() => navigate('portfolio')}
            className="text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1 whitespace-nowrap"
          >
            <span>View All Work</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Demo Item 1 */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="relative aspect-4/3 bg-stone-100">
              <img
                src="/src/assets/images/demo_website_preview_1792125901773.jpg"
                alt="Local Retail & Hospitality Web Portal"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm">
                Demo Concept
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-stone-900">Local Retail & Hospitality Web Portal</h3>
              <p className="text-xs text-stone-600">
                Ultra-responsive web architecture for local businesses with WhatsApp integration.
              </p>
            </div>
          </div>

          {/* Demo Item 2 */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="relative aspect-4/3 bg-stone-100">
              <img
                src="/src/assets/images/demo_voice_agent_1792125904344.jpg"
                alt="Healthcare & Clinic AI Inbound Voice Desk"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm">
                Interactive Demo
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-stone-900">Healthcare AI Voice Desk</h3>
              <p className="text-xs text-stone-600">
                Inbound voice assistant qualifying patient inquiries and reserving appointment slots.
              </p>
            </div>
          </div>

          {/* Demo Item 3 */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="relative aspect-4/3 bg-stone-100">
              <img
                src="/src/assets/images/demo_business_automation_1792125904484.jpg"
                alt="Omnichannel Lead Capture & WhatsApp Dispatch Pipeline"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm">
                Interactive Demo
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-stone-900">WhatsApp Dispatch Pipeline</h3>
              <p className="text-xs text-stone-600">
                Automated event bus routing inquiries to owner numbers and locking calendar availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: SEE IT IN ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Interactive Test Bench
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900">
              {t.actionSection.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              {t.actionSection.subtitle}
            </p>
          </div>

          {/* Interactive Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl">
            <button
              onClick={() => setActionTab('web')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                actionTab === 'web' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.actionSection.tabWeb}
            </button>
            <button
              onClick={() => setActionTab('voice')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                actionTab === 'voice' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.actionSection.tabVoice}
            </button>
            <button
              onClick={() => setActionTab('automation')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                actionTab === 'automation' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.actionSection.tabAutomation}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {actionTab === 'web' && <InteractiveWebsiteDemo />}
          {actionTab === 'voice' && <InteractiveVoiceDemo />}
          {actionTab === 'automation' && <InteractiveAutomationFlow />}
        </div>
      </section>

      {/* SECTION E: HOW WE WORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-2">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Process & Methodology
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900">
            {t.process.title}
          </h2>
          <p className="text-sm text-stone-600">
            {t.process.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="p-8 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold text-stone-400">STAGE 01</div>
            <h3 className="text-lg font-bold text-stone-900">{t.process.step1Title}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.process.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-8 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold text-stone-400">STAGE 02</div>
            <h3 className="text-lg font-bold text-stone-900">{t.process.step2Title}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.process.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-8 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <div className="text-xs font-mono font-bold text-stone-400">STAGE 03</div>
            <h3 className="text-lg font-bold text-stone-900">{t.process.step3Title}</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {t.process.step3Desc}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION F: CONSULTATION CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-stone-900 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#BEF264] uppercase tracking-wider">
              <span>Direct Strategy Session</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              {t.consultationCta.headline}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              {t.consultationCta.subhead}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={() => navigate('book')}
              className="px-6 py-3.5 text-xs sm:text-sm font-semibold bg-[#BEF264] text-stone-900 hover:bg-[#A3E635] rounded-xl transition-colors shadow-xs whitespace-nowrap"
            >
              {t.consultationCta.button}
            </button>
            <button
              onClick={() => handleWhatsApp(t.brand.whatsapp1)}
              className="px-5 py-3.5 text-xs sm:text-sm font-medium text-stone-300 hover:text-white border border-stone-700 hover:border-stone-500 rounded-xl transition-colors whitespace-nowrap"
            >
              Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* SECTION G: CONTACT & ENQUIRY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            {t.contact.title}
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Connect Directly with the Nexora Team.
          </h2>
          <p className="text-xs sm:text-sm text-stone-600">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left contact channels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>{t.contact.whatsappTitle}</span>
              </div>
              <p className="text-xs text-stone-600">
                Prefilled message ready to send. Edit anytime before dispatching.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleWhatsApp(t.brand.whatsapp1)}
                  className="w-full py-2.5 px-3.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg transition-colors border border-emerald-200 text-left flex justify-between items-center"
                >
                  <span>Anjaney: {t.brand.whatsappDisplay1}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleWhatsApp(t.brand.whatsapp2)}
                  className="w-full py-2.5 px-3.5 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg transition-colors border border-emerald-200 text-left flex justify-between items-center"
                >
                  <span>Support: {t.brand.whatsappDisplay2}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Instagram ID card as requested */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Instagram className="w-4 h-4 text-rose-500" />
                <span>Official Instagram</span>
              </div>
              <p className="text-xs text-stone-600">
                Follow @{t.brand.instagram} for project updates and technology drops.
              </p>
              <a
                href={t.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-900 hover:underline pt-1"
              >
                <span>instagram.com/{t.brand.instagram}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Email card */}
            <div className="p-6 bg-white rounded-2xl border border-stone-200 shadow-xs space-y-2">
              <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
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
          </div>

          {/* Right Enquiry Form */}
          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
};
