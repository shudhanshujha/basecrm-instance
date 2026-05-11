import React, { useState } from 'react';
import { 
  Building, CreditCard, ShieldCheck, Bell, Save, Download, 
  Database, Smartphone, Mail, Globe, Check, X 
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'banking' | 'billing' | 'notifications' | 'backup'>('profile');

  const handleSave = () => {
    toast.success('Configuration saved successfully!');
  };

  const handleBackup = async () => {
    const loadingToast = toast.loading('Preparing system backup...');
    try {
      const response = await api.get('/backup/export');
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `drishtivision_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Backup created successfully!', { id: loadingToast });
    } catch (error) {
      console.error(error);
      toast.error('Backup failed. Check server connection.', { id: loadingToast });
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Global Settings</h1>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-widest font-black">CRM Configuration · Company Identity</p>
        </div>
        <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-6 shadow-lg shadow-accent-orange/30">
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 space-y-1">
          {[
            { id: 'profile', label: 'Company Profile', icon: <Building size={16} /> },
            { id: 'banking', label: 'Bank Details', icon: <CreditCard size={16} /> },
            { id: 'billing', label: 'Tax & Billing', icon: <ShieldCheck size={16} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
            { id: 'backup', label: 'System Backup', icon: <Database size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12px] font-bold transition-all ${
                activeSection === item.id 
                  ? 'bg-accent-orange text-white shadow-lg shadow-accent-orange/20' 
                  : 'text-text-muted hover:bg-bg-surface-2 hover:text-text-primary'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div className="col-span-3 space-y-6">
          {activeSection === 'profile' && (
            <div className="card space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                 <div className="w-10 h-10 bg-accent-orange/10 text-accent-orange rounded-xl flex items-center justify-center shadow-inner">
                    <Building size={20} />
                 </div>
                 <h2 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Business Identity</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Registered Company Name</label>
                    <input type="text" defaultValue="DrishtiVision Advertising Services" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-bold text-text-primary outline-none focus:border-accent-orange transition-all" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">GSTIN Number</label>
                    <input type="text" defaultValue="06AAACD1234F1Z5" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-mono font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">PAN Number</label>
                    <input type="text" defaultValue="AAACD1234F" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-mono font-bold text-text-primary outline-none" />
                 </div>
                 <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Corporate Address</label>
                    <textarea rows={3} defaultValue="123, Dynamic Business Hub, MG Road, Gurugram, Haryana - 122002" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-medium text-text-primary outline-none focus:border-accent-orange" />
                 </div>
              </div>
            </div>
          )}

          {activeSection === 'banking' && (
            <div className="card space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 border-b border-border pb-4">
                 <div className="w-10 h-10 bg-accent-blue/10 text-accent-blue rounded-xl flex items-center justify-center shadow-inner">
                    <CreditCard size={20} />
                 </div>
                 <h2 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Settlement Accounts</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Bank Name</label>
                    <input type="text" defaultValue="HDFC Bank Ltd" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Account Holder Name</label>
                    <input type="text" defaultValue="DrishtiVision Advertising Services" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Account Number</label>
                    <input type="text" defaultValue="50100234567890" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-mono font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">IFSC Code</label>
                    <input type="text" defaultValue="HDFC0001234" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-mono font-bold text-text-primary outline-none" />
                 </div>
              </div>
              <div className="p-4 bg-accent-blue/5 border border-dashed border-accent-blue/30 rounded-xl flex items-center gap-3">
                 <ShieldCheck className="text-accent-blue" size={20} />
                 <p className="text-[11px] text-text-muted italic leading-tight">These details will be automatically printed on all client invoices for direct bank settlements.</p>
              </div>
            </div>
          )}

          {activeSection === 'billing' && (
            <div className="card space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center shadow-inner">
                     <ShieldCheck size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Taxation Logic</h2>
               </div>

               <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-bg-surface-2 rounded-xl border border-border">
                     <div>
                        <p className="text-[13px] font-bold text-text-primary">Standard GST Rate</p>
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-0.5">Applied to all campaigns</p>
                     </div>
                     <div className="flex items-center gap-2">
                        <input type="number" defaultValue={18} className="w-16 bg-bg-surface border border-border rounded-lg px-2 py-1 text-center font-black text-accent-orange outline-none" />
                        <span className="text-[13px] font-black text-text-primary">%</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-surface-2 rounded-xl border border-border">
                     <div>
                        <p className="text-[13px] font-bold text-text-primary">Invoice Prefix</p>
                        <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-0.5">Unique identifier start</p>
                     </div>
                     <input type="text" defaultValue="DV-2026-" className="w-32 bg-bg-surface border border-border rounded-lg px-3 py-1 text-right font-mono font-bold text-accent-blue outline-none" />
                  </div>
               </div>
            </div>
          )}

          {activeSection === 'backup' && (
            <div className="card space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex items-center gap-3 border-b border-border pb-4">
                  <div className="w-10 h-10 bg-accent-orange/10 text-accent-orange rounded-xl flex items-center justify-center shadow-inner">
                     <Database size={20} />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary uppercase tracking-tighter">Data Management</h2>
               </div>

               <div className="space-y-4">
                  <p className="text-[13px] text-text-muted leading-relaxed">
                    Download a full local backup of your CRM database. This includes all Clients, Campaigns, Inventory, Vendors, and Financial records. 
                    The data is exported in a secure JSON format for local storage.
                  </p>

                  <div className="p-6 bg-bg-surface-2 border border-border rounded-2xl border-dashed flex flex-col items-center gap-4">
                     <div className="w-12 h-12 bg-accent-orange/5 text-accent-orange rounded-full flex items-center justify-center">
                        <Download size={24} />
                     </div>
                     <div className="text-center">
                        <p className="text-[14px] font-bold text-text-primary">Create Local System Backup</p>
                        <p className="text-[11px] text-text-muted mt-1 uppercase font-black tracking-widest">Recommended every 30 days</p>
                     </div>
                     <button 
                        onClick={handleBackup}
                        className="btn-primary mt-2 flex items-center gap-2 px-8"
                     >
                        <Database size={16} /> Download Backup (.json)
                     </button>
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
