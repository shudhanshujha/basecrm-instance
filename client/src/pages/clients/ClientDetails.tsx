import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  TrendingUp, FileText, CreditCard, 
  ExternalLink, Calendar, ChevronRight, ArrowRight,
  Edit3, X, Check, Building
} from 'lucide-react';
import KPICard from '../../components/ui/KPICard';
import toast from 'react-hot-toast';

const ClientDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'invoices' | 'payments'>('campaigns');
  const [isEditing, setIsEditing] = useState(false);

  const [client, setClient] = useState({
    name: 'Reliance Retail Ltd',
    gstin: '06AAACR5055K1ZZ',
    contact: 'Sandeep Sharma',
    email: 'sandeep@relianceretail.com',
    phone: '+91 98765 43210',
    address: 'Maker Chambers IV, Nariman Point, Mumbai, Maharashtra 400021',
    billed: '₹42,50,000',
    received: '₹38,00,000',
    outstanding: '₹4,50,000'
  });

  const campaigns = [
    { id: '1', name: 'Roads Q2', status: 'Active', sites: 12, value: '₹28,00,000' },
    { id: '2', name: 'Winter Special', status: 'Completed', sites: 8, value: '₹14,50,000' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Client details updated successfully!');
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/clients')} className="p-2 bg-bg-surface border border-border rounded-xl hover:text-accent-orange transition-colors shadow-sm">
             <ArrowLeft size={20} />
          </button>
          <div>
             <div className="flex items-center gap-3">
                {isEditing ? (
                  <input 
                    className="bg-bg-surface-2 border border-accent-orange rounded-lg px-3 py-1 text-2xl font-bold text-text-primary outline-none"
                    value={client.name}
                    onChange={(e) => setClient({...client, name: e.target.value})}
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-text-primary">{client.name}</h1>
                )}
                <span className="bg-success text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm shadow-success/20">Premium Partner</span>
             </div>
             <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold">Client ID: {id?.toUpperCase()}</p>
          </div>
        </div>
        <div className="flex gap-2">
           {isEditing ? (
             <>
               <button onClick={() => setIsEditing(false)} className="btn-outline px-4 py-1.5 flex items-center gap-2 text-[12px]"><X size={14} /> Cancel</button>
               <button onClick={handleSave} className="btn-primary px-6 py-1.5 flex items-center gap-2 text-[12px]"><Check size={14} /> Save Partner</button>
             </>
           ) : (
             <button onClick={() => setIsEditing(true)} className="btn-outline px-4 py-1.5 flex items-center gap-2 text-[12px] hover:text-accent-orange"><Edit3 size={14} /> Edit Client</button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="col-span-1 card bg-bg-surface-2 border-dashed flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2 text-text-muted text-[11px]">
               <Mail size={14} className="text-accent-blue" />
               {isEditing ? (
                 <input className="bg-bg-surface border border-border rounded px-2 py-0.5 w-full outline-none" value={client.email} onChange={e => setClient({...client, email: e.target.value})} />
               ) : <span>{client.email}</span>}
            </div>
            <div className="flex items-center gap-2 text-text-muted text-[11px]">
               <Phone size={14} className="text-accent-orange" />
               {isEditing ? (
                 <input className="bg-bg-surface border border-border rounded px-2 py-0.5 w-full outline-none" value={client.phone} onChange={e => setClient({...client, phone: e.target.value})} />
               ) : <span>{client.phone}</span>}
            </div>
            <div className="flex items-start gap-2 text-text-muted text-[11px]">
               <MapPin size={14} className="text-danger shrink-0 mt-0.5" />
               {isEditing ? (
                 <textarea className="bg-bg-surface border border-border rounded px-2 py-0.5 w-full outline-none h-16 text-[10px]" value={client.address} onChange={e => setClient({...client, address: e.target.value})} />
               ) : <span className="leading-tight">{client.address}</span>}
            </div>
         </div>
         <KPICard label="Total Billed" value={client.billed} trend="Lifetime" trendType="up" />
         <KPICard label="Received" value={client.received} trend="89% Collection" trendType="up" />
         <div className="card border-danger/20 bg-danger/5">
            <div className="text-[10px] text-danger uppercase tracking-widest font-black">Outstanding</div>
            <div className="text-2xl font-black text-danger mt-2">{client.outstanding}</div>
            <div className="text-[10px] text-danger/60 font-bold mt-2">3 Overdue Invoices</div>
         </div>
      </div>

      <div className="card p-0 overflow-hidden bg-bg-surface border-border/40 shadow-xl">
         <div className="flex border-b border-border bg-bg-surface-2">
            {['campaigns', 'invoices', 'payments'].map((tab: any) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-accent-orange' : 'text-text-muted hover:text-text-primary'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-orange rounded-t-full shadow-[0_-4px_12px_#f97316]"></div>}
              </button>
            ))}
         </div>

         <div className="p-6">
            {activeTab === 'campaigns' && (
               <div className="space-y-3">
                  {campaigns.map(c => (
                     <div key={c.id} className="p-4 bg-bg-surface-2 rounded-xl border border-border flex items-center justify-between group hover:border-accent-orange transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-bg-surface border border-border rounded-lg flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                              <TrendingUp size={20} />
                           </div>
                           <div>
                              <p className="text-[13px] font-bold text-text-primary">{c.name}</p>
                              <p className="text-[10px] text-text-muted mt-0.5">{c.sites} Sites Booked</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8 text-right">
                           <div>
                              <p className="text-[13px] font-black text-text-primary">{c.value}</p>
                              <p className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Contract Value</p>
                           </div>
                           <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white ${c.status === 'Active' ? 'bg-success' : 'bg-accent-blue'}`}>
                             {c.status}
                           </span>
                           <ArrowRight size={16} className="text-text-muted group-hover:text-accent-orange" />
                        </div>
                     </div>
                  ))}
               </div>
            )}
            
            {activeTab === 'invoices' && (
               <div className="p-8 text-center text-text-muted italic text-[12px]">Financial history for invoices is syncing...</div>
            )}
            {activeTab === 'payments' && (
               <div className="p-8 text-center text-text-muted italic text-[12px]">Payment ledger records are being calculated...</div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ClientDetails;
