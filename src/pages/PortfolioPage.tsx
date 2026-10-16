import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PortfolioProject } from '../types';
import { ArrowUpRight, Check, Eye } from 'lucide-react';

interface PortfolioPageProps {
  navigate: (route: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ navigate }) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'web' | 'voice' | 'automation'>('all');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/portfolio');
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || []);
        }
      } catch (err) {
        console.error('Failed to load portfolio projects', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="py-12 sm:py-20 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          {t.portfolio.title}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Functional Demonstrations & Architectural Prototypes.
        </h1>
        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          {t.portfolio.subtitle}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl max-w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t.portfolio.all}
        </button>
        <button
          onClick={() => setFilter('web')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'web' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t.portfolio.filterWeb}
        </button>
        <button
          onClick={() => setFilter('voice')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'voice' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t.portfolio.filterVoice}
        </button>
        <button
          onClick={() => setFilter('automation')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            filter === 'automation' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t.portfolio.filterAutomation}
        </button>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-stone-500">Loading portfolio concepts...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-xl border border-stone-200">
          No projects found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((item) => {
            const displayTitle = language === 'hi' && item.titleHi ? item.titleHi : item.title;
            const displayDesc = language === 'hi' && item.descriptionHi ? item.descriptionHi : item.description;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                    <img
                      src={item.image}
                      alt={displayTitle}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/90 text-white backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide">
                      {item.isDemoConcept ? t.portfolio.demoBadge : 'Production Project'}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        {item.category === 'web'
                          ? 'Website Development'
                          : item.category === 'voice'
                          ? 'AI Voice Assistant'
                          : 'Workflow Automation'}
                      </div>
                      <h3 className="text-lg font-bold text-stone-900 leading-snug">
                        {displayTitle}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                        {displayDesc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 space-y-2">
                      <div className="text-xs font-semibold text-stone-700">
                        {t.portfolio.capabilitiesLabel}:
                      </div>
                      <ul className="space-y-1">
                        {item.capabilities.map((cap, i) => (
                          <li key={i} className="text-xs text-stone-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      if (item.category === 'web') navigate('service-web');
                      else if (item.category === 'voice') navigate('service-voice');
                      else navigate('service-automation');
                    }}
                    className="w-full py-2.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t.portfolio.viewDemo}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
