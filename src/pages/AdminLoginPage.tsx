import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, Loader2, ShieldCheck, KeyRound } from 'lucide-react';

interface AdminLoginPageProps {
  navigate: (route: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await login(email, password);
    if (result.success) {
      navigate('admin-dashboard');
    } else {
      setError(result.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleQuickLogin = async (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setError(null);
    const result = await login(presetEmail, presetPass);
    if (result.success) {
      navigate('admin-dashboard');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="py-16 sm:py-24 max-w-md mx-auto px-4">
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-stone-900 text-[#BEF264] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Nexora Admin Portal</h1>
          <p className="text-xs text-stone-600">
            Secure multi-user administration for enquiries, bookings, and integrations.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nexora.ai"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-800">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-900 bg-white"
              />
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 text-xs sm:text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Authenticate & Sign In'}
          </button>
        </form>

        {/* Multi-role demo accounts switcher for reviewer convenience */}
        <div className="pt-4 border-t border-stone-200 space-y-2">
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-center">
            Role-Based Preconfigured Accounts
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('owner@nexora.ai', 'NexoraOwner#2026')}
              className="p-2 text-center rounded-lg border border-stone-200 hover:border-stone-400 text-[11px] font-medium bg-stone-50 text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <div className="font-bold text-stone-900">Owner</div>
              <div className="text-[10px] text-stone-500">Full Access</div>
            </button>
            <button
              onClick={() => handleQuickLogin('admin@nexora.ai', 'NexoraAdmin#2026')}
              className="p-2 text-center rounded-lg border border-stone-200 hover:border-stone-400 text-[11px] font-medium bg-stone-50 text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <div className="font-bold text-stone-900">Admin</div>
              <div className="text-[10px] text-stone-500">Ops / Content</div>
            </button>
            <button
              onClick={() => handleQuickLogin('staff@nexora.ai', 'NexoraStaff#2026')}
              className="p-2 text-center rounded-lg border border-stone-200 hover:border-stone-400 text-[11px] font-medium bg-stone-50 text-stone-800 hover:bg-stone-100 transition-colors"
            >
              <div className="font-bold text-stone-900">Staff</div>
              <div className="text-[10px] text-stone-500">Enquiries</div>
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => navigate('home')}
            className="text-xs text-stone-500 hover:text-stone-900"
          >
            ← Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
