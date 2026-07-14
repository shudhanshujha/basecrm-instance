import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Building2, Lock, Mail, Globe, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/axios';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        const { data } = await api.post('/auth/signup', {
          email,
          password,
          fullName,
          companyName,
        });
        if (data.token) {
          localStorage.setItem('bc_token', data.token);
          localStorage.setItem('bc_user', JSON.stringify(data.user));
          localStorage.setItem('bc_auth', 'true');
          if (data.needsOnboarding) {
            localStorage.setItem('bc_needs_onboarding', 'true');
          }
          toast.success(`Welcome, ${data.user.fullName || 'User'}`);
          onLogin();
        }
      } else {
        const { data } = await api.post('/auth/login', {
          email,
          password,
        });
        if (data.token) {
          localStorage.setItem('bc_token', data.token);
          localStorage.setItem('bc_user', JSON.stringify(data.user));
          localStorage.setItem('bc_auth', 'true');
          if (data.needsOnboarding) {
            localStorage.setItem('bc_needs_onboarding', 'true');
          } else {
            localStorage.removeItem('bc_needs_onboarding');
          }
          toast.success(`Welcome back, ${data.user.fullName || 'User'}`);
          onLogin();
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let errorMessage = isSignup ? 'Registration failed. Please try again.' : 'Invalid credentials. Please try again.';
      if (err.response?.data?.error) errorMessage = err.response.data.error;
      setError(errorMessage);
      toast.error(isSignup ? 'Registration failed' : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent-blue/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-purple/3 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex w-14 h-14 bg-accent-blue rounded-2xl items-center justify-center mb-5 shadow-lg shadow-accent-blue/20">
            <Building2 size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            FlowCRM
          </h1>
          <p className="text-[13px] text-text-muted mt-1.5">
            {isSignup ? 'Create your account to get started' : 'Sign in to your workspace'}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-bg-surface border border-border rounded-2xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-text-muted flex items-center gap-1.5">
                    <Globe size={11} /> Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="Your company or freelance name"
                    className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14px] text-text-primary outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all placeholder:text-text-muted/40"
                    disabled={loading}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-text-muted flex items-center gap-1.5">
                    <User size={11} /> Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14px] text-text-primary outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all placeholder:text-text-muted/40"
                    disabled={loading}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-text-muted flex items-center gap-1.5">
                <Mail size={11} /> Email
              </label>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14px] text-text-primary outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all placeholder:text-text-muted/40"
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-text-muted flex items-center gap-1.5">
                <Lock size={11} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[14px] text-text-primary outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all placeholder:text-text-muted/40"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 bg-danger/8 border border-danger/20 rounded-xl text-[13px] text-danger flex items-center gap-2"
                >
                  <div className="w-1 h-1 bg-danger rounded-full shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-accent-blue hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-xl text-[14px] font-semibold transition-all duration-150 mt-2 shadow-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={15} className="animate-spin" />
                  {isSignup ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setError(''); }}
                className="text-[13px] text-text-muted hover:text-text-primary transition-colors"
              >
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;