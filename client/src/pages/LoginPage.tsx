import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import api from '../lib/axios';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', {
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem('dv_token', data.token);
        localStorage.setItem('dv_auth', 'true');
        toast.success(`Welcome back, ${data.user.fullName || 'User'}`);
        onLogin();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (err.response) {
        // The server responded with a status code outside the 2xx range
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data && typeof data === 'object') {
          errorMessage = data.error || data.message || JSON.stringify(data);
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Check your internet connection.';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error('Authentication Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-orange/10 border border-accent-orange/30 mb-5 shadow-lg shadow-accent-orange/10">
            <img src="/dvs_logo.jpg" alt="DVS" className="w-10 h-10 object-contain rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <ShieldCheck size={28} className="text-accent-orange hidden" />
          </div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">DrishtiVision CRM</h1>
          <p className="text-[11px] text-text-muted mt-1.5 uppercase tracking-[2px] font-bold">
            Operations Intelligence Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-bg-surface border border-border rounded-2xl p-8 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-[14px] font-black text-text-primary uppercase tracking-widest">Sign In</h2>
            <p className="text-[11px] text-text-muted mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Email Address</label>
              <input
                type="text"
                autoFocus
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] outline-none focus:border-accent-orange transition-colors placeholder:text-text-muted/40"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 pr-11 text-[13px] outline-none focus:border-accent-orange transition-colors placeholder:text-text-muted/40"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-2.5 bg-danger/10 border border-danger/20 rounded-xl text-[11px] text-danger font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-accent-orange text-white py-3 rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent-orange/90 transition-all shadow-lg shadow-accent-orange/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</> : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-text-muted mt-6 uppercase tracking-widest">
          DrishtiVision Solution · Sonepat, Haryana
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
