import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { t, language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t.nav.services, route: 'services' },
    { label: t.nav.portfolio, route: 'portfolio' },
    { label: t.nav.contact, route: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => {
            navigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity flex items-center gap-2 text-left"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#84CC16]" />
          <span>Nexora AI Studio</span>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
          <button
            onClick={() => navigate('home')}
            className={`transition-colors hover:text-stone-900 whitespace-nowrap shrink-0 ${
              currentRoute === 'home' ? 'text-stone-950 font-semibold' : ''
            }`}
          >
            {t.nav.home}
          </button>
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => navigate(link.route)}
              className={`transition-colors hover:text-stone-900 whitespace-nowrap shrink-0 ${
                currentRoute === link.route ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              {link.label}
            </button>
          ))}
          <a
            href={t.brand.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-stone-900 whitespace-nowrap shrink-0 flex items-center gap-1 text-stone-500"
          >
            <span>@{t.brand.instagram}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </nav>

        {/* Zone 3: 1 primary action + Language Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Subtle Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors border border-stone-200 rounded-md hover:bg-stone-100"
            title="Switch Language"
          >
            {language === 'en' ? 'हिंदी' : 'EN'}
          </button>

          {/* Primary Consultation CTA */}
          <button
            onClick={() => navigate('book')}
            className="hidden sm:inline-flex items-center px-4 py-2 text-xs font-semibold tracking-wide text-stone-900 bg-[#BEF264] hover:bg-[#A3E635] transition-colors rounded-lg shadow-xs whitespace-nowrap shrink-0"
          >
            {t.nav.bookConsultation}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              navigate('home');
              setMobileMenuOpen(false);
            }}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800"
          >
            {t.nav.home}
          </button>
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => {
                navigate(link.route);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm font-medium text-stone-800"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => {
                navigate('book');
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2.5 text-xs font-semibold text-stone-900 bg-[#BEF264] rounded-lg"
            >
              {t.nav.bookConsultation}
            </button>
            <a
              href={t.brand.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-center text-stone-500 py-1"
            >
              Instagram: @{t.brand.instagram}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
