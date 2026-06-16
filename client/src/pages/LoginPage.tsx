import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, ShieldCheck, Zap, Lock, Terminal, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
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
        localStorage.setItem('bc_token', data.token);
        localStorage.setItem('bc_user', JSON.stringify(data.user));
        localStorage.setItem('bc_auth', 'true');
        toast.success(`Access Granted. Welcome, ${data.user.fullName || 'Operator'}`);
        onLogin();
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = 'System Error: Authentication Protocol Failed.';
      if (err.response?.data?.error) errorMessage = err.response.data.error;
      setError(errorMessage);
      toast.error('Identity Verification Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4 relative overflow-hidden font-mono">
      {/* Dynamic Cyber Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 242, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent" />
      </div>

      {/* Floating Particle Orbs */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          opacity: [0.05, 0.15, 0.05],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-accent-orange/5 rounded-full blur-[120px] pointer-events-none" 
      />

      <div className="w-full max-w-[450px] relative z-10">
        {/* Futuristic Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6 group">
             <div className="absolute inset-0 bg-accent-blue/20 blur-xl group-hover:bg-accent-blue/40 transition-all rounded-full" />
             <div className="relative w-20 h-20 bg-[#0d1117] border border-accent-blue/30 rounded-3xl flex items-center justify-center shadow-2xl group-hover:border-accent-blue transition-all">
                <Zap size={32} className="text-accent-blue animate-pulse" />
             </div>
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-2 border border-dashed border-accent-blue/20 rounded-full pointer-events-none"
             />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-[-1px]">
             Base<span className="text-accent-blue">CRM</span>.sys
          </h1>
          <div className="flex items-center justify-center gap-3 mt-2 text-text-muted">
             <div className="h-[1px] w-8 bg-white/10" />
             <p className="text-[10px] uppercase tracking-[4px] font-black opacity-60">Neural Network Access</p>
             <div className="h-[1px] w-8 bg-white/10" />
          </div>
        </motion.div>

        {/* Cyber Login Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Card Border Glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-accent-blue/50 via-accent-purple/50 to-accent-orange/50 rounded-[32px] blur-[2px] opacity-30" />
          
          <div className="relative bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-[30px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Top Right Scanner Animation */}
            <div className="absolute top-0 right-0 p-4 opacity-20">
               <Terminal size={12} className="text-accent-blue mb-1" />
               <div className="w-10 h-[1px] bg-accent-blue animate-pulse" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[9px] font-black text-accent-blue uppercase tracking-widest flex items-center gap-2">
                      <Globe size={10} /> Identity Token
                   </label>
                </div>
                <div className="relative group">
                   <input
                     type="email"
                     autoFocus
                     value={email}
                     onChange={e => setEmail(e.target.value)}
                     placeholder="OPERATOR@SYSTEM.IO"
                     className="w-full bg-[#02040a] border border-white/5 rounded-2xl px-5 py-4 text-[13px] text-white outline-none focus:border-accent-blue/50 focus:ring-4 focus:ring-accent-blue/5 transition-all placeholder:text-white/10 uppercase font-bold"
                     disabled={loading}
                     required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                   <label className="text-[9px] font-black text-accent-blue uppercase tracking-widest flex items-center gap-2">
                      <Lock size={10} /> Security Key
                   </label>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#02040a] border border-white/5 rounded-2xl px-5 py-4 text-[13px] text-white outline-none focus:border-accent-blue/50 focus:ring-4 focus:ring-accent-blue/5 transition-all placeholder:text-white/10 font-bold"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-accent-blue transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl text-[10px] text-danger font-black uppercase tracking-wider flex items-center gap-2"
                  >
                    <div className="w-1 h-1 bg-danger rounded-full animate-ping" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="relative w-full group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple group-hover:scale-105 transition-transform duration-500 rounded-2xl" />
                <div className="relative flex items-center justify-center gap-3 py-4 text-[11px] font-black text-white uppercase tracking-[4px] bg-transparent">
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Decrypting...
                    </>
                  ) : (
                    <>
                      Execute Login
                      <Zap size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </motion.div>

        {/* Footer Terminal Log */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
           <p className="text-[9px] text-accent-blue uppercase font-black tracking-[2px] mb-2 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Mainframe Connection Established
           </p>
           <p className="text-[8px] text-text-muted font-bold opacity-40">
              V1.0.4-PROD // ENCRYPTION: AES-256-GCM // NODE: SH-BASE-01
           </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;