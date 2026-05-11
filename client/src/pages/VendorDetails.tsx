import React, { useState } from 'react';
import { 
  ArrowLeft, Building, Target, FileText, 
  CreditCard, TrendingUp, MapPin, ExternalLink,
  ShieldCheck, Info, Plus, Download, Briefcase
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import KPICard from '../components/ui/KPICard';
import ExportButton from '../components/ui/ExportButton';

const VendorDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sites' | 'payouts' | 'contracts'>('sites');

  const vendor = {
    name: 'Haryana Outdoor Media',
    type: 'Site Owner / Agency',
    contact: 'Rakesh Yadav',
    phone: '+91 98765 43210',
    email: 'rakesh@hom.com',
    sitesCount: 24,
    totalPayout: '₹12.4L',
    pending: '₹1.2L',
    status: 'Active',
    sites: [
      { id: '1', name: 'GT Road Unipole A-1', city: 'Panipat', rate: '₹22k', status: 'Occupied' },
      { id: '2', name: 'Bus Stand Gantry', city: 'Karnal', rate: '₹18k', status: 'Available' },
    ]
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/vendors')} className="p-2 bg-bg-surface border border-border rounded-xl hover:text-accent-orange transition-colors">
               <ArrowLeft size={20} />
            </button>
            <div>
               <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">{vendor.name}</h1>
                  <span className="status-tag bg-success">Verified Owner</span>
               </div>
               <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold">{vendor.type} · ID: {id?.toUpperCase()}</p>
            </div>
         </div>
         <div className="flex gap-2">
            <ExportButton data={vendor.sites} filename={`vendor_${id}_inventory`} />
            <button className="btn-primary text-[12px] py-1.5 flex items-center gap-2"><Plus size={16} /> New Payout</button>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="card flex flex-col justify-center gap-1.5">
            <div className="text-[10px] text-text-muted font-black uppercase tracking-tighter">Primary Contact</div>
            <div className="text-[13px] font-bold text-text-primary">{vendor.contact}</div>
            <div className="text-[11px] text-text-muted">{vendor.phone}</div>
         </div>
         <KPICard label="Leased Inventory" value={vendor.sitesCount.toString()} trend="Active Sites" trendType="up" />
         <KPICard label="Total Payouts" value={vendor.totalPayout} trend="FY 2025-26" trendType="up" />
         <div className="card bg-warning/5 border-warning/20">
            <div className="text-[10px] text-warning uppercase font-black tracking-widest">Pending Dues</div>
            <div className="text-2xl font-black text-text-primary mt-2">{vendor.pending}</div>
            <div className="text-[10px] text-warning font-bold mt-2">Next Cycle: 15 May</div>
         </div>
      </div>

      <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
         <div className="flex border-b border-border bg-bg-surface-2">
            {['sites', 'payouts', 'contracts'].map((tab: any) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-accent-orange' : 'text-text-muted hover:text-text-primary'}`}>
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-orange rounded-t-full"></div>}
              </button>
            ))}
         </div>
         <div className="p-6">
            {activeTab === 'sites' && (
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[10px] text-text-muted uppercase font-black border-b border-border">
                        <th className="pb-4 px-2">Site Name</th>
                        <th className="pb-4 px-2">Location</th>
                        <th className="pb-4 px-2">Agreement Rate</th>
                        <th className="pb-4 px-2 text-right">Inventory Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                     {vendor.sites.map(s => (
                        <tr key={s.id} className="group hover:bg-bg-surface-2 transition-colors">
                           <td className="py-4 px-2 text-[13px] font-bold text-text-primary group-hover:text-accent-orange">{s.name}</td>
                           <td className="py-4 px-2 text-[12px] text-text-muted">{s.city}</td>
                           <td className="py-4 px-2 font-mono text-[12px] font-black text-accent-blue">{s.rate}</td>
                           <td className="py-4 px-2 text-right">
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white ${s.status === 'Occupied' ? 'bg-success' : 'bg-warning'}`}>{s.status}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
            {activeTab !== 'sites' && <div className="p-12 text-center text-text-muted italic text-[12px]">{activeTab} management module is synchronizing...</div>}
         </div>
      </div>
    </div>
  );
};

export default VendorDetails;
