import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { MessageSquare, Mail, Instagram, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { t } = useLanguage();

  const handleWhatsApp = (number: string) => {
    const text = encodeURIComponent(
      'Hello Nexora AI Studio, I would like to discuss an AI solution for my business.'
    );
    window.open(`https://wa.me/${number.replace(/\D/g, '')}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1: Brand & Positioning */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#BEF264]" />
              <span className="text-xl font-bold tracking-tight text-white">Nexora AI Studio</span>
            </div>
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              {t.brand.positioning}
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 pt-2">
              <span>India & Global Operations</span>
              <span aria-hidden="true">·</span>
              <span>IST Timezone</span>
              <span aria-hidden="true">·</span>
              <span>Custom Quotations</span>
            </div>
          </div>

          {/* Col 2: Direct Contact Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-sm">
              <button
                onClick={() => handleWhatsApp(t.brand.whatsapp1)}
                className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors group text-left"
              >
                <MessageSquare className="w-4 h-4 text-[#BEF264] shrink-0" />
                <span>{t.brand.whatsappDisplay1}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => handleWhatsApp(t.brand.whatsapp2)}
                className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors group text-left"
              >
                <MessageSquare className="w-4 h-4 text-[#BEF264] shrink-0" />
                <span>{t.brand.whatsappDisplay2}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <a
                href={`mailto:${t.brand.email}`}
                className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span className="truncate">{t.brand.email}</span>
              </a>

              <a
                href={t.brand.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors group"
              >
                <Instagram className="w-4 h-4 text-[#BEF264] shrink-0" />
                <span>@{t.brand.instagram}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Col 3: Navigation & Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
              Solutions
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate('service-web')}
                  className="hover:text-white transition-colors text-stone-400"
                >
                  {t.services.web.title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('service-voice')}
                  className="hover:text-white transition-colors text-stone-400"
                >
                  {t.services.voice.title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('service-automation')}
                  className="hover:text-white transition-colors text-stone-400"
                >
                  {t.services.automation.title}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('portfolio')}
                  className="hover:text-white transition-colors text-stone-400"
                >
                  {t.nav.portfolio}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('book')}
                  className="hover:text-white transition-colors text-stone-400"
                >
                  {t.nav.bookConsultation}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} Nexora AI Studio. {t.footer.rights}
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate('privacy')}
              className="hover:text-stone-300 transition-colors"
            >
              {t.footer.privacy}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigate('terms')}
              className="hover:text-stone-300 transition-colors"
            >
              {t.footer.terms}
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => navigate('admin-login')}
              className="text-stone-400 hover:text-white font-medium transition-colors"
            >
              {t.footer.adminLogin}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
