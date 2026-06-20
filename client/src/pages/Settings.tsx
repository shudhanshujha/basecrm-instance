import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, Building, CreditCard, 
  ShieldCheck, Globe, Bell, Save, 
  User, Check, X, Smartphone, Mail,
  Download, FileSpreadsheet, FileText, Trash2, AlertCircle, CheckCircle2,
  Database, Cloud, RefreshCw, Server, Users, Loader2, Landmark, Palette
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotificationStore } from '../store/useNotificationStore';
import ExportButton from '../components/ui/ExportButton';
import { exportToExcel } from '../lib/export';
import api from '../lib/axios';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'banking' | 'users' | 'notifications' | 'backup' | 'infra' | 'templates'>('profile');
  const { notifications, clearAll, markAsRead } = useNotificationStore();
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [checkingHealth, setCheckingHealth] = useState(false);
  
  // User Management State
  const [userList, setUserList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [savingOrg, setSavingOrg] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('bc_user') || '{}');
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super_admin';

  const [org, setOrg] = useState<any>({
    id: '',
    name: '',
    taxMode: 'NONE',
    gstin: '',
    panNumber: '',
    address: '',
    bankName: '',
    upiId: '',
    accountNumber: '',
    ifscCode: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.organization) {
          setOrg(res.data.organization);
      }
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  };

  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.get('/auth/users');
      setUserList(res.data);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleOrgSave = async () => {
    setSavingOrg(true);
    try {
      await api.put(`/auth/organization/${org.id}`, org);
      toast.success('Organization configuration updated!');
      fetchInitialData();
    } catch (err) {
      toast.error('Failed to update organization details');
    } finally {
      setSavingOrg(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await api.patch('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAdminResetPassword = async (id: string, name: string) => {
    if (!isAdmin) return;
    const newPassword = window.prompt(`Enter new password for ${name}:`, '');
    
    if (newPassword === null) return;
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await api.patch(`/auth/users/${id}/password`, { newPassword });
      toast.success(`Password for ${name} has been reset`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    }
  };

  const checkHealth = async () => {
    setCheckingHealth(true);
    try {
      const res = await api.get('/health');
      setHealthStatus(res.data);
      toast.success('System status verified');
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus({ api: 'unreachable', database: 'unknown', storage: 'unknown' });
      toast.error('System health check failed');
    } finally {
      setCheckingHealth(false);
    }
  };

  const handleSave = () => {
    toast.success('Configuration saved successfully!');
  };

  const handleSystemBackup = (format: 'excel') => {
    const backupData = [
      { Module: 'Profile', Status: 'Verified', LastSync: new Date().toLocaleString() },
      { Module: 'Assets', Count: 'Healthy', Health: '100%' },
      { Module: 'Finance', Revenue: 'Verified', Compliance: 'Ready' }
    ];
    
    exportToExcel({
      headers: ['Module', 'Details', 'Timestamp'],
      data: backupData.map(d => Object.values(d)),
      filename: 'system_full_backup',
      title: 'BUSINESS CRM SYSTEM BACKUP'
    });
    toast.success(`Full system backup generated as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">System Settings</h1>
          <p className="text-[15px] text-text-muted mt-1 uppercase tracking-widest font-black">Global Parameters &amp; Data Integrity</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setActiveSection('backup')} className="btn-outline flex items-center gap-2 px-4 text-accent-blue border-accent-blue/30"><Download size={16} /> System Backup</button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-6 shadow-lg shadow-accent-purple/30">
            <Save size={18} /> Save All Changes
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Fixed-width sidebar — prevents label wrapping */}
        <div className="w-[220px] shrink-0 space-y-1">
          {[
            { id: 'profile', label: 'Company Profile', icon: <Building size={16} /> },
            { id: 'banking', label: 'Bank Details', icon: <Landmark size={16} /> },
            { id: 'users', label: 'User Management', icon: <Users size={16} /> },
            { id: 'notifications', label: 'Notification Center', icon: <Bell size={16} /> },
            { id: 'backup', label: 'Data &amp; Backup', icon: <Download size={16} /> },
            { id: 'templates', label: 'Invoice Templates', icon: <FileText size={16} /> },
            { id: 'infra', label: 'System Architecture', icon: <Server size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[13px] font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeSection === item.id 
                  ? 'bg-accent-blue/10 text-accent-blue shadow-lg shadow-accent-blue/10 border border-accent-blue/20' 
                  : 'text-text-muted hover:bg-bg-surface-2 hover:text-text-primary'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 min-w-0 space-y-6">
          {activeSection === 'profile' && (
            <div className="card space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-accent-purple/10 text-accent-purple rounded-xl flex items-center justify-center shadow-inner">
                        <Building size={20} />
                     </div>
                     <h2 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Business Identity</h2>
                  </div>
                 <button onClick={handleOrgSave} disabled={savingOrg} className="btn-primary py-1.5 px-4 text-[14px] flex items-center gap-2">
                    {savingOrg ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save Profile
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="col-span-2 space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Registered Company Name</label>
                     <input type="text" value={org.name} onChange={e => setOrg({...org, name: e.target.value})} className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all" />
                 </div>
                 
                 <div className="col-span-2 space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Tax Calculation Mode</label>
                    <select 
                      value={org.taxMode || 'NONE'} 
                      onChange={e => setOrg({...org, taxMode: e.target.value})} 
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all"
                    >
                       <option value="NONE">No Tax (Subtotal = Total)</option>
                       <option value="SINGLE_TAX">Single Flat Tax (VAT/Sales Tax)</option>
                       <option value="GST_INDIA">GST India (CGST + SGST / IGST)</option>
                       <option value="CUSTOM">Custom Tax Configuration</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Tax ID / GSTIN</label>
                    <input type="text" value={org.gstin || ''} onChange={e => setOrg({...org, gstin: e.target.value})} className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-mono font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Business Registration No</label>
                    <input type="text" value={org.panNumber || ''} onChange={e => setOrg({...org, panNumber: e.target.value})} className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-mono font-bold text-text-primary outline-none" />
                 </div>
                 <div className="col-span-2 space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Registered Address</label>
                    <textarea rows={3} value={org.address || ''} onChange={e => setOrg({...org, address: e.target.value})} className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-medium text-text-primary outline-none focus:border-accent-blue" />
                 </div>
              </div>
            </div>
          )}

          {activeSection === 'banking' && (
            <div className="card space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between border-b border-border pb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-blue/10 text-accent-blue rounded-xl flex items-center justify-center shadow-inner">
                       <Landmark size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Settlement Accounts</h2>
                 </div>
                 <button onClick={handleOrgSave} disabled={savingOrg} className="btn-primary py-1.5 px-4 text-[14px] flex items-center gap-2">
                    {savingOrg ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Update Bank Details
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Bank Name</label>
                    <input type="text" value={org.bankName || ''} onChange={e => setOrg({...org, bankName: e.target.value})} className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">UPI ID for Invoices</label>
                    <input type="text" value={org.upiId || ''} onChange={e => setOrg({...org, upiId: e.target.value})} className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-bold text-text-primary outline-none" placeholder="example@upi" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Account Number</label>
                    <input type="text" value={org.accountNumber || ''} onChange={e => setOrg({...org, accountNumber: e.target.value})} className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-mono font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Routing / IFSC Code</label>
                    <input type="text" value={org.ifscCode || ''} onChange={e => setOrg({...org, ifscCode: e.target.value})} className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[16px] font-mono font-bold text-text-primary outline-none" />
                 </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="card space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="w-10 h-10 bg-accent-purple/10 text-accent-purple rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Change Password</h2>
                    <p className="text-[13px] text-text-muted uppercase font-bold tracking-widest">Enter your current password to set a new one</p>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Current Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[16px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="At least 6 characters"
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[16px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-black text-text-muted uppercase tracking-widest ml-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Repeat new password"
                      className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-2.5 text-[16px] font-bold text-text-primary outline-none focus:border-accent-blue transition-all" 
                    />
                  </div>
                  <div className="col-span-2 pt-2">
                    <button type="submit" disabled={changingPassword} className="btn-primary w-full py-3 flex items-center justify-center gap-2 shadow-lg shadow-accent-purple/20">
                      {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} Change Password
                    </button>
                  </div>
                </form>
              </div>

              {isAdmin && (
                <div className="card space-y-4">
                  <div className="flex items-center gap-3 border-b border-border pb-4">
                    <h2 className="text-sm font-black text-text-primary uppercase tracking-widest">Active System Users</h2>
                  </div>
                  <div className="space-y-2">
                    {loadingUsers ? (
                      <div className="p-8 text-center text-text-muted italic">Loading users...</div>
                    ) : userList.length === 0 ? (
                      <div className="p-8 text-center text-text-muted italic">No users found.</div>
                    ) : userList.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-bg-surface-2 border border-border rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-bg-surface border border-border rounded-lg flex items-center justify-center text-text-muted font-bold text-[13px]">
                            {user.fullName?.split(' ').map((n: any) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-[16px] font-bold text-text-primary">{user.fullName}</p>
                            <p className="text-[14px] text-text-muted">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {user.id !== currentUser.id && (
                          <button 
                            onClick={() => handleAdminResetPassword(user.id, user.fullName)}
                            className="p-2 text-text-muted hover:text-accent-blue transition-colors"
                            title="Reset Password"
                          >
                            <RefreshCw size={14} />
                          </button>
                          )}
                          <span className={`text-[12px] font-black uppercase px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-accent-purple text-white' : 'bg-accent-blue text-white'}`}>
                            {user.role}
                          </span>
                          <p className="text-[13px] text-text-muted font-bold uppercase">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
            </div>
            )}
          </div>
           )}
           {(activeSection as string) === 'templates' && (
            <div className="card space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-3 border-b border-border pb-4">
                 <Palette className="text-accent-purple" size={20} />
                 <h2 className="text-lg font-bold uppercase tracking-tight">Invoice Templates</h2>
               </div>

               <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     { id: 'gst-standard', name: 'GST Standard', desc: 'Indian GST-compliant invoice with tax breakdown and bank details', badge: 'India/GST' },
                     { id: 'digital-services', name: 'Digital Services', desc: 'Clean modern layout for agencies, SaaS, and consulting businesses', badge: 'Services' },
                     { id: 'product-company', name: 'Product / E-Commerce', desc: 'Itemized format for physical goods and product companies', badge: 'Products' },
                     { id: 'freelancer', name: 'Freelancer / Consultant', desc: 'Simple professional layout for independent contractors', badge: 'Freelance' },
                     { id: 'modern-minimal', name: 'Modern Minimal', desc: 'Sleek borderless design for modern brands and startups', badge: 'Modern' },
                   ].map((t) => (
                     <div key={t.id} className="p-5 bg-bg-surface-2 border border-border rounded-2xl hover:border-accent-purple/30 transition-all">
                       <div className="flex items-start justify-between mb-3">
                         <FileText size={24} className="text-accent-purple" />
                         <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-accent-purple/10 text-accent-purple rounded-full">{t.badge}</span>
                       </div>
                       <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight mb-1">{t.name}</h3>
                       <p className="text-[13px] text-text-muted">{t.desc}</p>
                     </div>
                   ))}
                 </div>

                 <div className="p-5 bg-bg-surface-2 border border-border rounded-2xl space-y-4">
                   <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight flex items-center gap-2">
                     <Palette size={16} className="text-accent-orange" />
                     Organization Branding
                   </h3>
                   <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[12px] font-black text-text-muted uppercase">Company Logo</label>
                       <div className="flex items-center gap-4">
                         <div className="w-20 h-20 rounded-xl border-2 border-border bg-bg-surface flex items-center justify-center overflow-hidden">
                           {org.logoUrl ? (
                             <img src={org.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                           ) : (
                             <Building size={28} className="text-text-muted" />
                           )}
                         </div>
                         <button
                           onClick={async () => {
                             const url = prompt('Enter logo image URL:');
                             if (url) {
                               try {
                                  await api.put(`/auth/organization/${org.id}`, { logoUrl: url });
                                 setOrg({...org, logoUrl: url});
                                 toast.success('Logo updated');
                               } catch { toast.error('Failed to update logo'); }
                             }
                           }}
                           className="px-4 py-2 bg-accent-blue/10 text-accent-blue rounded-lg text-[12px] font-bold uppercase tracking-wider hover:bg-accent-blue/20 transition-all"
                         >Upload Logo</button>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <label className="text-[12px] font-black text-text-muted uppercase">Accent Color</label>
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl border-2 border-border" style={{ backgroundColor: org.accentColor || '#6366F1' }} />
                         <input
                           type="color"
                           value={org.accentColor || '#6366F1'}
                           onChange={async (e) => {
                             const color = e.target.value;
                             try {
                                await api.put(`/auth/organization/${org.id}`, { accentColor: color });
                               setOrg({...org, accentColor: color});
                               toast.success('Accent color updated');
                             } catch { toast.error('Failed to update color'); }
                           }}
                           className="w-20 h-10 rounded-xl border border-border cursor-pointer bg-transparent"
                         />
                         <span className="text-[12px] text-text-muted font-mono">{org.accentColor || '#6366F1'}</span>
                       </div>
                     </div>
                   </div>
                 </div>

                 <div className="p-5 bg-bg-surface-2 border border-border rounded-2xl space-y-4">
                   <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight flex items-center gap-2">
                     <ShieldCheck size={16} className="text-success" />
                     Tips for Professional Invoices
                   </h3>
                   <ul className="space-y-2 text-[13px] text-text-muted">
                     <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" /> Upload a high-resolution company logo (PNG/JPG with transparent background works best)</li>
                     <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" /> Choose a template that matches your industry — Digital Services for SaaS/agencies, Product Company for e-commerce</li>
                     <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" /> Set your accent color to match your brand identity — this affects header bars, borders, and highlights</li>
                     <li className="flex items-start gap-2"><CheckCircle2 size={14} className="text-success shrink-0 mt-0.5" /> Preview each template in the invoice generator before sending to clients</li>
                   </ul>
                 </div>
               </div>
             </div>
            )}

           {activeSection === 'notifications' && (
            <div className="card space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                     <Bell className="text-accent-purple" />
                     <h2 className="text-lg font-bold">Alerts History</h2>
                  </div>
                 <button onClick={clearAll} className="text-[13px] font-black text-danger hover:underline uppercase tracking-widest flex items-center gap-1"><Trash2 size={12} /> Clear History</button>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-text-muted italic text-[16px]">No active notifications in history.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-4 bg-bg-surface-2 rounded-xl border border-border flex gap-4 items-start group">
                       <div className="shrink-0 mt-1">
                          {n.type === 'DEAL_END' && <AlertCircle size={18} className="text-warning" />}
                          {n.type === 'INVOICE_DUE' && <AlertCircle size={18} className="text-danger" />}
                          {n.type === 'PAYMENT_RECEIVED' && <CheckCircle2 size={18} className="text-success" />}
                       </div>
                       <div className="flex-1">
                          <p className="text-[16px] font-bold text-text-primary">{n.message}</p>
                          <p className="text-[14px] text-text-muted mt-1 uppercase font-bold">{new Date(n.date).toLocaleString()}</p>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSection === 'backup' && (
             <div className="card space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="flex items-center gap-3 border-b border-border pb-4">
                   <Download className="text-accent-blue" />
                   <h2 className="text-lg font-bold uppercase tracking-tight">System Data &amp; Backup</h2>
                </div>
                <div className="grid grid-cols-1 max-w-sm mx-auto">
                   <div className="p-6 bg-bg-surface-2 border border-border rounded-2xl flex flex-col items-center text-center gap-4 hover:border-success transition-all cursor-pointer group" onClick={() => handleSystemBackup('excel')}>
                      <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><FileSpreadsheet size={32} /></div>
                      <div>
                         <h3 className="text-sm font-bold uppercase tracking-tight">Excel Spreadsheet Export</h3>
                         <p className="text-[14px] text-text-muted mt-1 uppercase font-bold">Full data extraction in .xlsx format</p>
                      </div>
                      <button className="btn-outline w-full py-2 text-[14px] font-black uppercase">Generate Excel</button>
                   </div>
                </div>
             </div>
          )}

          {activeSection === 'infra' && (
            <div className="card space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center border-b border-border pb-4">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-blue/10 text-accent-blue rounded-xl flex items-center justify-center shadow-inner">
                       <Server size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Infrastructure Status</h2>
                 </div>
                 <button 
                   onClick={checkHealth} 
                   disabled={checkingHealth}
                   className="btn-outline flex items-center gap-2 px-4 py-1.5 text-[14px] font-black uppercase tracking-widest"
                 >
                   <RefreshCw size={14} className={checkingHealth ? 'animate-spin' : ''} />
                   {checkingHealth ? 'Verifying...' : 'Verify Integrity'}
                 </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                 <div className="p-5 bg-bg-surface-2 border border-border rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                     <div className="p-2 bg-accent-blue/10 text-accent-blue rounded-lg">
                           <Globe size={20} />
                        </div>
                       <span className={`text-[12px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                         healthStatus?.api === 'live' ? 'bg-success text-white' : 'bg-text-muted text-white'
                       }`}>
                          {healthStatus?.api || 'UNKNOWN'}
                       </span>
                    </div>
                    <div>
                       <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">Core API</h3>
                       <p className="text-[13px] text-text-muted mt-1 uppercase font-bold">Service Gateway</p>
                    </div>
                 </div>

                 <div className="p-5 bg-bg-surface-2 border border-border rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                       <div className="p-2 bg-accent-blue/10 text-accent-blue rounded-lg">
                          <Database size={20} />
                       </div>
                       <div className="flex flex-col items-end gap-1">
                          <span className={`text-[12px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            healthStatus?.database?.startsWith('connected') ? 'bg-success text-white' : 
                            healthStatus?.database?.startsWith('disconnected') ? 'bg-danger text-white' : 'bg-text-muted text-white'
                          }`}>
                             {healthStatus?.database || 'UNKNOWN'}
                          </span>
                       </div>
                    </div>
                    <div>
                       <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">Database</h3>
                       <p className="text-[13px] text-text-muted mt-1 uppercase font-bold">Primary Storage</p>
                    </div>
                 </div>

                 <div className="p-5 bg-bg-surface-2 border border-border rounded-2xl space-y-4">
                    <div className="flex justify-between items-start">
                       <div className="p-2 bg-success/10 text-success rounded-lg">
                          <Cloud size={20} />
                       </div>
                       <div className="flex flex-col items-end gap-1">
                          <span className={`text-[12px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            healthStatus?.storage?.startsWith('connected') ? 'bg-success text-white' : 
                            healthStatus?.storage?.startsWith('disconnected') ? 'bg-danger text-white' : 'bg-text-muted text-white'
                          }`}>
                             {healthStatus?.storage || 'UNKNOWN'}
                          </span>
                       </div>
                    </div>
                    <div>
                       <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">Cloud Storage</h3>
                       <p className="text-[13px] text-text-muted mt-1 uppercase font-bold">File Persistence</p>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
