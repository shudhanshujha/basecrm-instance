import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  TrendingUp, FileText, CreditCard, 
  ExternalLink, Calendar, ChevronRight, ArrowRight,
  Edit3, X, Check, Building, Trash2, Briefcase, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import KPICard from '../../components/ui/KPICard';
import ActivityTimeline from '../../components/common/ActivityTimeline';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const ClientDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'timeline' | 'deals' | 'invoices' | 'payments'>('timeline');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<any[]>([]);

  const [client, setClient] = useState<any>({
    name: '',
    gstin: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    deals: [],
    invoices: [],
    payments: []
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, tRes] = await Promise.all([
        api.get(`/clients/${id}`),
        api.get(`/clients/${id}/timeline`)
      ]);
      setClient(cRes.data);
      setTimeline(tRes.data);
    } catch (error) {
      console.error('Failed to fetch client:', error);
      toast.error('Failed to load client information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/clients/${id}`, {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        gstin: client.gstin
      });
      setIsEditing(false);
      toast.success('Client details updated successfully!');
      fetchData();
    } catch (error) {
      console.error('Failed to update client:', error);
      toast.error('Failed to save changes.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${client.name}? This will remove all associated invoices and records.`)) {
      try {
        await api.delete(`/clients/${id}`);
        toast.success('Client deleted successfully');
        navigate('/clients');
      } catch (error) {
        console.error('Failed to delete client:', error);
        toast.error('Failed to delete client.');
      }
    }
  };

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-accent-orange" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[3px] text-text-muted">Syncing System Entity...</p>
    </div>
  );

  const totalBilled = client.invoices?.reduce((acc: number, inv: any) => acc + inv.totalAmount, 0) || 0;
  const totalReceived = client.payments?.reduce((acc: number, p: any) => acc + p.amount, 0) || 0;
  const outstanding = totalBilled - totalReceived;

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
                  <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">{client.name}</h1>
                )}
                <span className="bg-success text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm shadow-success/20">{client.clientType || 'REGULAR'} Partner</span>
             </div>
             <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-accent-orange rounded-full animate-pulse" />
                Entity Node: {id?.substring(0, 8).toUpperCase()} · Status Operational
             </p>
          </div>
        </div>
        <div className="flex gap-2">
           {isEditing ? (
             <>
               <button onClick={() => setIsEditing(false)} className="btn-outline px-4 py-1.5 flex items-center gap-2 text-[12px]"><X size={14} /> Cancel</button>
               <button onClick={handleSave} className="btn-primary px-6 py-1.5 flex items-center gap-2 text-[12px]"><Check size={14} /> Save Profile</button>
             </>
           ) : (
             <>
               <button onClick={handleDelete} className="p-2.5 text-text-muted hover:text-danger hover:bg-danger/10 border border-border rounded-xl transition-all"><Trash2 size={18} /></button>
               <button onClick={() => setIsEditing(true)} className="btn-outline px-4 py-1.5 flex items-center gap-2 text-[12px] hover:text-accent-orange"><Edit3 size={14} /> Edit Information</button>
             </>
           )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="col-span-1 card bg-bg-surface/30 border-white/5 flex flex-col justify-center gap-3">
            <div className="flex items-center gap-3 text-text-muted text-[11px]">
               <Mail size={14} className="text-accent-blue" />
               {isEditing ? (
                 <input className="bg-bg-surface border border-border rounded px-2 py-0.5 w-full outline-none" value={client.email || ''} onChange={e => setClient({...client, email: e.target.value})} />
               ) : <span className="font-bold truncate">{client.email || 'No email registered'}</span>}
            </div>
            <div className="flex items-center gap-3 text-text-muted text-[11px]">
               <Phone size={14} className="text-accent-orange" />
               {isEditing ? (
                 <input className="bg-bg-surface border border-border rounded px-2 py-0.5 w-full outline-none" value={client.phone || ''} onChange={e => setClient({...client, phone: e.target.value})} />
               ) : <span className="font-bold">{client.phone || 'No phone registered'}</span>}
            </div>
            <div className="flex items-start gap-3 text-text-muted text-[11px]">
               <MapPin size={14} className="text-danger shrink-0 mt-0.5" />
               {isEditing ? (
                 <textarea className="bg-bg-surface border border-border rounded px-2 py-0.5 w-full outline-none h-16 text-[10px]" value={client.address || ''} onChange={e => setClient({...client, address: e.target.value})} />
               ) : <span className="leading-tight font-medium opacity-70 italic">{client.address || 'No address registered'}</span>}
            </div>
         </div>
         <KPICard label="Total Billed" value={`₹${totalBilled.toLocaleString()}`} trend="Lifetime" trendType="up" />
         <KPICard label="Received" value={`₹${totalReceived.toLocaleString()}`} trend="Collections" trendType="up" />
         <div className="card border-danger/20 bg-danger/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:scale-110 transition-transform">
               <TrendingUp size={40} className="text-danger rotate-180" />
            </div>
            <div className="text-[10px] text-danger uppercase tracking-widest font-black">Outstanding Node</div>
            <div className="text-2xl font-black text-danger mt-2">
              ₹{outstanding.toLocaleString()}
            </div>
            <div className="text-[10px] text-danger/60 font-bold mt-2 uppercase">{client.invoices?.filter((i: any) => i.status === 'PENDING').length || 0} Open Invoices</div>
         </div>
      </div>

      <div className="card p-0 overflow-hidden bg-bg-surface/30 border-white/5 shadow-2xl">
         <div className="flex border-b border-white/5 bg-white/5">
            {['timeline', 'deals', 'invoices', 'payments'].map((tab: any) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-accent-orange bg-white/5' : 'text-text-muted hover:text-text-primary'}`}
              >
                {tab}
                {activeTab === tab && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-accent-orange rounded-t-full shadow-[0_-4px_12px_#f97316]"></motion.div>}
              </button>
            ))}
         </div>

         <div className="p-8">
            <AnimatePresence mode="wait">
               {activeTab === 'timeline' && (
                  <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                     <ActivityTimeline activities={timeline} />
                  </motion.div>
               )}

               {activeTab === 'deals' && (
                  <motion.div key="deals" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                     {client.deals?.length > 0 ? client.deals.map((d: any) => (
                        <div key={d.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-accent-orange/30 transition-all cursor-pointer" onClick={() => navigate(`/deals/${d.id}`)}>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-bg-surface border border-white/5 rounded-xl flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                                 <Briefcase size={20} />
                              </div>
                              <div>
                                  <p className="text-[13px] font-bold text-text-primary uppercase tracking-tight">{d.title}</p>
                                  <p className="text-[10px] text-text-muted mt-0.5 uppercase font-black tracking-widest">{format(new Date(d.startDate), 'dd MMM yy')} — {format(new Date(d.endDate), 'dd MMM yy')}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-8 text-right">
                               <div>
                                  <p className="text-[14px] font-black text-text-primary">₹{d.value?.toLocaleString() || 0}</p>
                                 <p className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Agreement Value</p>
                              </div>
                              <span className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded-lg text-white border ${d.status === 'ACTIVE' ? 'bg-success/10 text-success border-success/20' : 'bg-accent-blue/10 text-accent-blue border-accent-blue/20'}`}>
                                {d.status}
                              </span>
                              <ArrowRight size={16} className="text-text-muted group-hover:text-accent-orange transition-colors" />
                           </div>
                        </div>
                     )) : (
                       <div className="py-20 text-center text-text-muted italic text-[12px] border-2 border-dashed border-white/5 rounded-3xl uppercase tracking-widest font-black">No system engagement nodes found.</div>
                     )}
                  </motion.div>
               )}
               
               {activeTab === 'invoices' && (
                  <motion.div key="invoices" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                     {client.invoices?.length > 0 ? client.invoices.map((inv: any) => (
                        <div key={inv.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-accent-orange/30 cursor-pointer" onClick={() => navigate(`/invoices/${inv.id}`)}>
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-accent-orange/10 rounded-xl text-accent-orange">
                                 <FileText size={18} />
                              </div>
                              <div>
                                  <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">#{inv.invoiceNumber}</p>
                                  <p className="text-[10px] text-text-muted mt-1 uppercase font-bold">{format(new Date(inv.invoiceDate), 'dd MMMM yyyy')}</p>
                               </div>
                            </div>
                            <div className="text-right flex items-center gap-10">
                               <div>
                                  <p className="text-[14px] font-black text-text-primary">₹{inv.totalAmount.toLocaleString()}</p>
                                 <p className="text-[9px] text-text-muted uppercase font-black tracking-widest mt-1">Total Due</p>
                              </div>
                              <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg border ${inv.status === 'PAID' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                                 {inv.status}
                              </span>
                           </div>
                        </div>
                     )) : (
                        <div className="py-20 text-center text-text-muted italic text-[12px] border-2 border-dashed border-white/5 rounded-3xl">No invoice records found.</div>
                     )}
                  </motion.div>
               )}

               {activeTab === 'payments' && (
                  <motion.div key="payments" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                     {client.payments?.length > 0 ? client.payments.map((p: any) => (
                        <div key={p.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-success/10 rounded-xl text-success">
                                 <CreditCard size={18} />
                              </div>
                              <div>
                                  <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">Payment Receipt</p>
                                 <p className="text-[10px] text-text-muted mt-1 uppercase font-bold">{format(new Date(p.paymentDate), 'dd MMMM yyyy')} · {p.paymentMode}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[15px] font-black text-success tracking-tight">₹{p.amount.toLocaleString()}</p>
                              <p className="text-[9px] text-text-muted uppercase font-black tracking-widest mt-1">Node Settled</p>
                           </div>
                        </div>
                     )) : (
                        <div className="py-20 text-center text-text-muted italic text-[12px] border-2 border-dashed border-white/5 rounded-3xl">No payment history compiled.</div>
                     )}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};

export default ClientDetails;