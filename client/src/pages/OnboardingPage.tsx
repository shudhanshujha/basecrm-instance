import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Phone, MapPin, FileText, Landmark,
  ChevronRight, ChevronLeft, CheckCircle2, Zap,
  CreditCard, Loader2, Users, ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';

interface OnboardingPageProps {
  onComplete: () => void;
}

interface OrgDetails {
  orgName: string;
  phone: string;
  address: string;
  gstin: string;
  panNumber: string;
  taxMode: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

const STEPS = [
  { id: 1, label: 'Business', icon: Building2 },
  { id: 2, label: 'Tax & GST', icon: FileText },
  { id: 3, label: 'Banking', icon: Landmark },
  { id: 4, label: 'Done', icon: CheckCircle2 },
];

const inputClass =
  'w-full bg-[#02040a] border border-white/5 rounded-2xl px-5 py-4 text-[15px] text-white outline-none focus:border-accent-blue/50 focus:ring-4 focus:ring-accent-blue/5 transition-all placeholder:text-white/15 font-medium';
const labelClass =
  'text-[11px] font-black text-accent-blue uppercase tracking-widest flex items-center gap-2 mb-2';

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<OrgDetails>({
    orgName: '',
    phone: '',
    address: '',
    gstin: '',
    panNumber: '',
    taxMode: 'GST',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('bc_user') || '{}'); }
    catch { return {}; }
  })();

  const set = (field: keyof OrgDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDetails(prev => ({ ...prev, [field]: e.target.value }));

  const canNext = () => {
    if (step === 1) return details.orgName.trim().length > 0;
    return true; // other steps are optional
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/onboarding/complete', details);
      if (data.token) {
        localStorage.setItem('bc_token', data.token);
        localStorage.setItem('bc_user', JSON.stringify(data.user));
        localStorage.removeItem('bc_needs_onboarding');
      }
      toast.success('Setup complete! Welcome to BaseCRM 🚀');
      onComplete();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const [direction, setDirection] = useState(1);
  const goNext = () => { setDirection(1); setStep(s => s + 1); };
  const goBack = () => { setDirection(-1); setStep(s => s - 1); };

  return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center p-4 relative overflow-hidden font-mono">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(0, 242, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-transparent to-transparent" />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent-blue/10 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.04, 0.12, 0.04] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="w-full max-w-[520px] relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4 group">
            <div className="absolute inset-0 bg-accent-blue/20 blur-xl group-hover:bg-accent-blue/40 transition-all rounded-full" />
            <div className="relative w-16 h-16 bg-[#0d1117] border border-accent-blue/30 rounded-2xl flex items-center justify-center shadow-2xl">
              <Zap size={24} className="text-accent-blue animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-[-1px]">
            Base<span className="text-accent-blue">CRM</span> Setup
          </h1>
          <p className="text-text-muted text-xs uppercase tracking-wider mt-1">
            Hi {user.fullName || 'there'} — let's get your workspace ready
          </p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isDone = step > s.id;
            const isCurrent = step === s.id;
            return (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-accent-blue/10 border border-accent-blue/30'
                    : isDone
                    ? 'bg-accent-blue/5 border border-accent-blue/10'
                    : 'bg-white/2 border border-white/5'
                }`}>
                  <Icon
                    size={13}
                    className={isCurrent ? 'text-accent-blue' : isDone ? 'text-accent-blue/60' : 'text-white/20'}
                  />
                  <span className={`text-[10px] font-black uppercase tracking-wider ${
                    isCurrent ? 'text-accent-blue' : isDone ? 'text-accent-blue/60' : 'text-white/20'
                  }`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-6 h-[1px] ${step > s.id ? 'bg-accent-blue/40' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div className="relative">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-accent-blue/30 via-accent-purple/30 to-accent-blue/30 rounded-[32px] blur-[2px] opacity-40" />
          <div className="relative bg-bg-primary/80 backdrop-blur-xl border border-border rounded-[30px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden min-h-[360px]">

            <AnimatePresence mode="wait" custom={direction}>
              {/* ── STEP 1: Business Details ── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-white font-black text-lg uppercase tracking-tight">Business Details</h2>
                    <p className="text-text-muted text-xs mt-1">Tell us about your organization</p>
                  </div>

                  <div>
                    <label className={labelClass}><Building2 size={11} /> Company / Freelance Name <span className="text-danger">*</span></label>
                    <input
                      className={inputClass}
                      placeholder="Acme Corp / Your Name"
                      value={details.orgName}
                      onChange={set('orgName')}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><Phone size={11} /> Phone</label>
                      <input
                        className={inputClass}
                        placeholder="+91 98765 43210"
                        value={details.phone}
                        onChange={set('phone')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}><Users size={11} /> Tax Mode</label>
                      <select
                        className={inputClass}
                        value={details.taxMode}
                        onChange={set('taxMode')}
                      >
                        <option value="GST">GST (India)</option>
                        <option value="IGST">IGST (Inter-state)</option>
                        <option value="NONE">No Tax</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}><MapPin size={11} /> Address</label>
                    <input
                      className={inputClass}
                      placeholder="123, Street, City, State - PIN"
                      value={details.address}
                      onChange={set('address')}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 2: Tax & GST ── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-white font-black text-lg uppercase tracking-tight">Tax Information</h2>
                    <p className="text-text-muted text-xs mt-1">Required for GST invoices (can be skipped)</p>
                  </div>

                  <div>
                    <label className={labelClass}><FileText size={11} /> GSTIN</label>
                    <input
                      className={inputClass}
                      placeholder="22AAAAA0000A1Z5"
                      value={details.gstin}
                      onChange={set('gstin')}
                      maxLength={15}
                    />
                  </div>

                  <div>
                    <label className={labelClass}><FileText size={11} /> PAN Number</label>
                    <input
                      className={inputClass}
                      placeholder="AAAAA0000A"
                      value={details.panNumber}
                      onChange={set('panNumber')}
                      maxLength={10}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 3: Banking ── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-white font-black text-lg uppercase tracking-tight">Payment Details</h2>
                    <p className="text-text-muted text-xs mt-1">Shown on invoices — all fields optional</p>
                  </div>

                  <div>
                    <label className={labelClass}><Landmark size={11} /> Bank Name</label>
                    <input
                      className={inputClass}
                      placeholder="HDFC Bank"
                      value={details.bankName}
                      onChange={set('bankName')}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}><CreditCard size={11} /> Account Number</label>
                      <input
                        className={inputClass}
                        placeholder="1234567890"
                        value={details.accountNumber}
                        onChange={set('accountNumber')}
                      />
                    </div>
                    <div>
                      <label className={labelClass}><CreditCard size={11} /> IFSC Code</label>
                      <input
                        className={inputClass}
                        placeholder="HDFC0001234"
                        value={details.ifscCode}
                        onChange={set('ifscCode')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}><CreditCard size={11} /> UPI ID</label>
                    <input
                      className={inputClass}
                      placeholder="yourname@upi"
                      value={details.upiId}
                      onChange={set('upiId')}
                    />
                  </div>
                </motion.div>
              )}

              {/* ── STEP 4: Done ── */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="flex flex-col items-center justify-center text-center space-y-6 py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-accent-blue/30 blur-2xl rounded-full" />
                    <div className="relative w-24 h-24 bg-[#0d1117] border border-accent-blue/30 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={40} className="text-accent-blue" />
                    </div>
                  </motion.div>

                  <div>
                    <h2 className="text-white font-black text-2xl uppercase tracking-tight">All Set!</h2>
                    <p className="text-text-muted text-sm mt-2 leading-relaxed">
                      Your workspace is ready.<br />
                      You can update these details anytime in <span className="text-accent-blue">Settings</span>.
                    </p>
                  </div>

                  <div className="w-full space-y-3 text-left bg-white/3 rounded-2xl p-4 border border-white/5">
                    {[
                      ['Company', details.orgName],
                      ['GST Mode', details.taxMode],
                      ['GSTIN', details.gstin || '—'],
                      ['Bank', details.bankName || '—'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-xs">
                        <span className="text-text-muted uppercase tracking-wider">{k}</span>
                        <span className="text-white font-bold">{v}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className={`flex mt-8 gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
              {step > 1 && step < 4 && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all text-[13px] font-bold uppercase tracking-wider"
                >
                  <ChevronLeft size={15} /> Back
                </button>
              )}

              {step < 3 && (
                <button
                  onClick={goNext}
                  disabled={!canNext()}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-[13px] font-black uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed ml-auto"
                >
                  Next <ChevronRight size={15} />
                </button>
              )}

              {step === 3 && (
                <button
                  onClick={goNext}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-accent-blue to-accent-purple text-white text-[13px] font-black uppercase tracking-wider hover:opacity-90 transition-all ml-auto"
                >
                  Review <ChevronRight size={15} />
                </button>
              )}

              {step === 4 && (
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="relative w-full group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple group-hover:scale-105 transition-transform duration-500 rounded-2xl" />
                  <div className="relative flex items-center justify-center gap-3 py-4 text-[14px] font-black text-white uppercase tracking-[3px]">
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Saving...</>
                    ) : (
                      <>Launch BaseCRM <ArrowRight size={16} /></>
                    )}
                  </div>
                </button>
              )}
            </div>

            {/* Skip link */}
            {step < 4 && (
              <div className="text-center mt-4">
                <button
                  onClick={() => setStep(4)}
                  className="text-[11px] text-text-muted hover:text-white/50 uppercase tracking-wider transition-colors"
                >
                  Skip setup — I'll configure later
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
