import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Play, Check, ArrowRight, MessageSquare, Calendar, Database, FileText } from 'lucide-react';

export const InteractiveAutomationFlow: React.FC = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [payloadLog, setPayloadLog] = useState<string>('Ready to test automated workflow execution.');

  const runAutomation = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveStep(1);
    setPayloadLog(
      JSON.stringify(
        {
          event: 'enquiry.received',
          customer: 'Dr. Anand Verma',
          phone: '+91 9838775359',
          service: 'AI Voice Agents & Clinic Integration',
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    setTimeout(() => {
      setActiveStep(2);
      setPayloadLog(
        JSON.stringify(
          {
            event: 'whatsapp.dispatch_success',
            target: '+91 9838775359',
            status: 'delivered',
            message: 'New high-intent enquiry: Dr. Anand Verma requested AI Voice consultation.',
            latency: '142ms',
          },
          null,
          2
        )
      );
    }, 1200);

    setTimeout(() => {
      setActiveStep(3);
      setPayloadLog(
        JSON.stringify(
          {
            event: 'gcal.slot_reserved',
            calendar: 'primary (anjaneykumarraianjaneykumarrai@gmail.com)',
            slot: 'Tomorrow 15:30 - 16:00 IST',
            eventId: 'gcal_evt_998124',
            doubleBookingCheck: 'Passed (0 conflicts)',
          },
          null,
          2
        )
      );
    }, 2400);

    setTimeout(() => {
      setActiveStep(4);
      setPayloadLog(
        JSON.stringify(
          {
            event: 'crm.sync_completed',
            recordId: 'enq_auto_verified',
            status: 'Qualified / Appointment Confirmed',
            auditTrail: 'Logged to internal store & notification logs',
          },
          null,
          2
        )
      );
      setIsRunning(false);
    }, 3600);
  };

  const steps = [
    {
      num: 1,
      icon: FileText,
      title: '01. Inbound Enquiry',
      desc: 'Form or chat inquiry validated on server with contact verification.',
    },
    {
      num: 2,
      icon: MessageSquare,
      title: '02. WhatsApp Alert',
      desc: 'Instant dispatch to +91 9838775359 with actionable client details.',
    },
    {
      num: 3,
      icon: Calendar,
      title: '03. Calendar Lock',
      desc: 'Slot availability verified in Google Calendar and booked safely.',
    },
    {
      num: 4,
      icon: Database,
      title: '04. Record Sync',
      desc: 'Firestore updated with status and team assignment ready in Admin.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
      <div className="bg-stone-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-stone-600">
          {t.actionSection.automationPipeline.title}
        </div>
        <div className="text-xs text-stone-500">{t.portfolio.interactiveDemoBadge}</div>
      </div>

      <div className="p-6 space-y-6">
        {/* Node Pipeline View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.num;
            const isCompleted = activeStep > s.num;

            return (
              <div
                key={s.num}
                className={`p-4 rounded-xl border transition-all duration-300 relative ${
                  isCurrent
                    ? 'border-[#BEF264] bg-stone-900 text-white shadow-md'
                    : isCompleted
                    ? 'border-emerald-300 bg-emerald-50/50 text-stone-900'
                    : 'border-stone-200 bg-white text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isCurrent
                        ? 'bg-[#BEF264] text-stone-900'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-[11px] font-mono ${isCurrent ? 'text-stone-300' : 'text-stone-400'}`}>
                    Node 0{s.num}
                  </span>
                </div>
                <div className={`text-xs font-semibold ${isCurrent ? 'text-white' : 'text-stone-900'}`}>
                  {s.title}
                </div>
                <p className={`text-[11px] mt-1 line-clamp-2 ${isCurrent ? 'text-stone-300' : 'text-stone-500'}`}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Button & Payload Inspector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <button
            onClick={runAutomation}
            disabled={isRunning}
            className="px-5 py-2.5 text-xs font-semibold bg-[#BEF264] text-stone-900 hover:bg-[#A3E635] rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing Automated Steps...' : t.actionSection.automationPipeline.runTrigger}</span>
          </button>

          <span className="text-xs text-stone-500">
            Simulates instant event bus between website, WhatsApp, and Google Calendar.
          </span>
        </div>

        {/* Data Stream Payload Box */}
        <div className="bg-stone-950 rounded-xl p-4 border border-stone-800 text-xs font-mono text-stone-300">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 mb-2 flex items-center justify-between">
            <span>{t.actionSection.automationPipeline.payloadLabel}</span>
            <span className="text-stone-400">JSON</span>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-[#BEF264]/90 text-[11px]">
            {payloadLog}
          </pre>
        </div>
      </div>
    </div>
  );
};
