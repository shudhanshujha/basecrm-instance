import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Building, CreditCard, 
  ShieldCheck, Globe, Bell, Save, 
  User, Check, X, Smartphone, Mail,
  Download, FileSpreadsheet, FileText, Trash2, AlertCircle, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useNotificationStore } from '../store/useNotificationStore';
import ExportButton from '../components/ui/ExportButton';
import { exportToPDF, exportToExcel } from '../lib/export';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'profile' | 'banking' | 'billing' | 'notifications' | 'backup'>('profile');
  const { notifications, clearAll, markAsRead } = useNotificationStore();

  const handleSave = () => {
    toast.success('Configuration saved successfully!');
  };

  const handleSystemBackup = (format: 'pdf' | 'excel') => {
    const backupData = [
      { Module: 'Profile', Status: 'Verified', LastSync: new Date().toLocaleString() },
      { Module: 'Inventory', Count: 147, Health: '100%' },
      { Module: 'Finance', Revenue: '₹2.4Cr', Compliance: 'GST Ready' }
    ];
    
    if (format === 'pdf') {
      exportToPDF(['Module', 'Details', 'Timestamp'], backupData.map(d => Object.values(d)), 'dv_system_full_backup', 'DRISHTIVISION SYSTEM BACKUP');
    } else {
      exportToExcel(backupData, 'dv_system_full_backup');
    }
    toast.success(`Full system backup generated as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">System Configuration</h1>
          <p className="text-[12px] text-text-muted mt-1 uppercase tracking-widest font-black">Global Parameters & Data Integrity</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setActiveSection('backup')} className="btn-outline flex items-center gap-2 px-4 text-accent-blue border-accent-blue/30"><Download size={16} /> System Backup</button>
          <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-6 shadow-lg shadow-accent-orange/30">
            <Save size={18} /> Save All Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 space-y-1">
          {[
            { id: 'profile', label: 'Company Profile', icon: <Building size={16} /> },
            { id: 'banking', label: 'Bank Details', icon: <CreditCard size={16} /> },
            { id: 'billing', label: 'Tax & Billing', icon: <ShieldCheck size={16} /> },
            { id: 'notifications', label: 'Notification Center', icon: <Bell size={16} /> },
            { id: 'backup', label: 'Data & Backup', icon: <Download size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${
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
          {activeSection === 'notifications' && (
            <div className="card space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="flex justify-between items-center border-b border-border pb-4">
                 <div className="flex items-center gap-3">
                    <Bell className="text-accent-orange" />
                    <h2 className="text-lg font-bold">Recent Alerts History</h2>
                 </div>
                 <button onClick={clearAll} className="text-[10px] font-black text-danger hover:underline uppercase tracking-widest flex items-center gap-1"><Trash2 size={12} /> Clear All Notification History</button>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-12 text-center text-text-muted italic text-[13px]">No active notifications in history.</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="p-4 bg-bg-surface-2 rounded-xl border border-border flex gap-4 items-start group">
                       <div className="shrink-0 mt-1">
                          {n.type === 'CAMPAIGN_END' && <AlertCircle size={18} className="text-warning" />}
                          {n.type === 'INVOICE_DUE' && <AlertCircle size={18} className="text-danger" />}
                          {n.type === 'PAYMENT_RECEIVED' && <CheckCircle2 size={18} className="text-success" />}
                       </div>
                       <div className="flex-1">
                          <p className="text-[13px] font-bold text-text-primary">{n.message}</p>
                          <p className="text-[11px] text-text-muted mt-1 uppercase font-bold">{new Date(n.date).toLocaleString()}</p>
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
                   <h2 className="text-lg font-bold">Data Sovereignty & Backup</h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="p-6 bg-bg-surface-2 border border-border rounded-2xl flex flex-col items-center text-center gap-4 hover:border-accent-orange transition-all cursor-pointer group" onClick={() => handleSystemBackup('pdf')}>
                      <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><FileText size={32} /></div>
                      <div>
                         <h3 className="text-sm font-bold">PDF Format Backup</h3>
                         <p className="text-[11px] text-text-muted mt-1">Branded visual report of all system modules</p>
                      </div>
                      <button className="btn-outline w-full py-2 text-[11px]">Generate PDF</button>
                   </div>
                   <div className="p-6 bg-bg-surface-2 border border-border rounded-2xl flex flex-col items-center text-center gap-4 hover:border-success transition-all cursor-pointer group" onClick={() => handleSystemBackup('excel')}>
                      <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"><FileSpreadsheet size={32} /></div>
                      <div>
                         <h3 className="text-sm font-bold">Excel Ledger Backup</h3>
                         <p className="text-[11px] text-text-muted mt-1">Full data extraction in .xlsx format for Tally/Audit</p>
                      </div>
                      <button className="btn-outline w-full py-2 text-[11px]">Generate Excel</button>
                   </div>
                </div>
             </div>
          )}

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
                    <input type="text" defaultValue="06AONPP6480J1ZB" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-mono font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">PAN Number</label>
                    <input type="text" defaultValue="AONPP6480J" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-mono font-bold text-text-primary outline-none" />
                 </div>
                 <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Corporate Address</label>
                    <textarea rows={3} defaultValue="2/182, Arya Nagar, Sonepat, 131001, Haryana" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-medium text-text-primary outline-none focus:border-accent-orange" />
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
                    <input type="text" defaultValue="Punjab National Bank" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Account Holder Name</label>
                    <input type="text" defaultValue="DRISHTI VISION SOLUTION" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Account Number</label>
                    <input type="text" defaultValue="00561132000617" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-mono font-bold text-text-primary outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">IFSC Code</label>
                    <input type="text" defaultValue="PUNB0005610" className="w-full bg-bg-surface-2 border border-border rounded-xl px-4 py-3 text-[13px] font-mono font-bold text-text-primary outline-none" />
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
