import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { WebDevPage } from './pages/WebDevPage';
import { VoiceAgentsPage } from './pages/VoiceAgentsPage';
import { AutomationPage } from './pages/AutomationPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { BookingPage } from './pages/BookingPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  // Extract initial route from window.location.hash or pathname
  const getInitialRoute = () => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (hash) return hash;
    const path = window.location.pathname.replace(/^\//, '');
    return path || 'home';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = `#/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isAdminDashboard = currentRoute === 'admin-dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-[#1C1917]">
      {/* Standard Header (hidden in full admin dashboard view for clean workspace) */}
      {!isAdminDashboard && <Header currentRoute={currentRoute} navigate={navigate} />}

      {/* Main Page Area */}
      <main className="flex-1">
        {currentRoute === 'home' && <HomePage navigate={navigate} />}
        {currentRoute === 'services' && <WebDevPage navigate={navigate} />}
        {currentRoute === 'service-web' && <WebDevPage navigate={navigate} />}
        {currentRoute === 'service-voice' && <VoiceAgentsPage navigate={navigate} />}
        {currentRoute === 'service-automation' && <AutomationPage navigate={navigate} />}
        {currentRoute === 'portfolio' && <PortfolioPage navigate={navigate} />}
        {currentRoute === 'book' && <BookingPage />}
        {currentRoute === 'contact' && <ContactPage navigate={navigate} />}
        {currentRoute === 'privacy' && <PrivacyPage />}
        {currentRoute === 'terms' && <TermsPage />}
        {currentRoute === 'admin-login' && <AdminLoginPage navigate={navigate} />}
        {currentRoute === 'admin-dashboard' && (
          user ? <AdminDashboard navigate={navigate} /> : <AdminLoginPage navigate={navigate} />
        )}
      </main>

      {/* Footer */}
      {!isAdminDashboard && <Footer navigate={navigate} />}
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
