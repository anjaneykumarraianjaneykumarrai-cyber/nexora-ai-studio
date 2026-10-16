import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Mic, Volume2, VolumeX, Send, RefreshCw, CheckCircle2 } from 'lucide-react';

interface TranscriptItem {
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export const InteractiveVoiceDemo: React.FC = () => {
  const { t } = useLanguage();
  const [persona, setPersona] = useState<'clinic' | 'realestate' | 'service'>('clinic');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [transcript, setTranscript] = useState<TranscriptItem[]>([
    {
      sender: 'agent',
      text: 'Hello! Thank you for calling Kumar Healthcare Clinic. I am Nexora Voice Assistant. How may I assist you today?',
      time: 'Just now',
    },
  ]);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Voice Persona Prompts
  const personaGreetings = {
    clinic:
      'Hello! Thank you for calling Kumar Healthcare Clinic. I am Nexora Voice Assistant. How may I assist you today?',
    realestate:
      'Good day! You have reached Royal Heights Realty. I can help schedule property viewings or answer pricing details. How can I assist?',
    service:
      'Welcome to Apex Auto Service Center. I can schedule your vehicle routine service or inspection. Which vehicle model do you have?',
  };

  const handlePersonaChange = (newPersona: 'clinic' | 'realestate' | 'service') => {
    setPersona(newPersona);
    const greeting = personaGreetings[newPersona];
    setTranscript([
      {
        sender: 'agent',
        text: greeting,
        time: 'Just now',
      },
    ]);
    speak(greeting);
  };

  const speak = (text: string) => {
    if (isMuted) return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleSendQuery = (userQuery: string) => {
    if (!userQuery.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newItems: TranscriptItem[] = [
      ...transcript,
      { sender: 'user', text: userQuery, time: now },
    ];
    setTranscript(newItems);
    setCustomInput('');

    // Generate contextually aware response
    let agentResponse = '';
    const q = userQuery.toLowerCase();

    if (persona === 'clinic') {
      if (q.includes('book') || q.includes('appointment') || q.includes('tomorrow')) {
        agentResponse =
          'I have checked Dr. Sharma’s schedule for tomorrow. We have 02:30 PM and 04:00 PM available. Would you like me to reserve 02:30 PM for you?';
      } else if (q.includes('hour') || q.includes('timing') || q.includes('charge') || q.includes('fee')) {
        agentResponse =
          'Our clinic is open Monday to Saturday, 09:00 AM to 08:00 PM. General doctor consultations start at ₹500, and imaging tests are priced as per standardized catalog.';
      } else if (q.includes('reschedule') || q.includes('cancel')) {
        agentResponse =
          'Certainly. I can reschedule your appointment to Friday at 4:00 PM. I have updated the calendar slot and sent an SMS confirmation.';
      } else {
        agentResponse =
          'Understood. I have logged your request. Would you like me to connect you with our duty coordinator, or schedule a doctor call?';
      }
    } else if (persona === 'realestate') {
      if (q.includes('book') || q.includes('viewing') || q.includes('visit')) {
        agentResponse =
          'We have an executive viewing open this Saturday at 11:30 AM for the 3BHK Parkview tower. May I take your full name to generate the visitor pass?';
      } else {
        agentResponse =
          'The project features 2 and 3 BHK luxury residences with possession starting next quarter. Would you like a brochure sent to your WhatsApp?';
      }
    } else {
      if (q.includes('book') || q.includes('service')) {
        agentResponse =
          'We can book your periodic 10,000 km maintenance service for Thursday morning at 10:00 AM. Free pickup can also be arranged.';
      } else {
        agentResponse =
          'Our service facility handles engine diagnostics, wheel alignment, brake inspection, and full detailing. How can we help today?';
      }
    }

    setTimeout(() => {
      setTranscript((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: agentResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      speak(agentResponse);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
      {/* Top Bar */}
      <div className="bg-stone-50 border-b border-stone-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {t.actionSection.voiceSimulator.selectPersona}:
          </span>
          <div className="flex items-center gap-1 bg-stone-200/60 p-1 rounded-lg">
            <button
              onClick={() => handlePersonaChange('clinic')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                persona === 'clinic' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Clinic Desk
            </button>
            <button
              onClick={() => handlePersonaChange('realestate')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                persona === 'realestate' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Real Estate
            </button>
            <button
              onClick={() => handlePersonaChange('service')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                persona === 'service' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Auto Service
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
              setIsMuted(!isMuted);
            }}
            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Voice Enabled'}</span>
          </button>
          <span className="text-xs text-stone-500">{t.portfolio.interactiveDemoBadge}</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Waveform & Sample Queries */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="p-6 rounded-xl bg-stone-900 text-white flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-stone-800 border border-stone-700">
              <Mic className={`w-8 h-8 ${isSpeaking ? 'text-[#BEF264]' : 'text-stone-400'}`} />
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full border-2 border-[#BEF264] animate-ping opacity-75" />
              )}
            </div>

            <div className="space-y-1">
              <div className="text-sm font-semibold text-white">
                {isSpeaking
                  ? t.actionSection.voiceSimulator.agentSpeaking
                  : t.actionSection.voiceSimulator.agentListening}
              </div>
              <div className="text-xs text-stone-400">
                {t.actionSection.voiceSimulator.personas[persona]}
              </div>
            </div>

            {/* Dynamic Waveform Bars */}
            <div className="flex items-center gap-1.5 h-10 px-4">
              {[4, 12, 24, 36, 28, 16, 32, 20, 8, 22, 14, 30].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isSpeaking ? 'bg-[#BEF264]' : 'bg-stone-700'
                  }`}
                  style={{
                    height: isSpeaking ? `${Math.max(6, (h * (i % 3 + 1)) % 36)}px` : '4px',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sample Prompts */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Click to Test Sample Query
            </div>
            <div className="space-y-1.5">
              {[
                t.actionSection.voiceSimulator.sampleQuery1,
                t.actionSection.voiceSimulator.sampleQuery2,
                t.actionSection.voiceSimulator.sampleQuery3,
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(query)}
                  className="w-full text-left p-2.5 rounded-lg border border-stone-200 hover:border-stone-400 text-xs text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Transcript */}
        <div className="lg:col-span-7 flex flex-col h-[380px] bg-stone-50 rounded-xl border border-stone-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs font-medium text-stone-600">
            <span>{t.actionSection.voiceSimulator.transcriptLabel}</span>
            <button
              onClick={() => handlePersonaChange(persona)}
              className="hover:text-stone-900 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {transcript.map((item, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${item.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    item.sender === 'user'
                      ? 'bg-stone-900 text-white rounded-br-none'
                      : 'bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-xs'
                  }`}
                >
                  {item.text}
                </div>
                <span className="text-[10px] text-stone-400 mt-1 px-1">{item.time}</span>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* User Input field */}
          <div className="p-3 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery(customInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type customer question to test voice response..."
                className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900"
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="px-3.5 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
