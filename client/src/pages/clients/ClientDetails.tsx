import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, 
  TrendingUp, FileText, CreditCard, 
  ExternalLink, Calendar, ChevronRight, ArrowRight,
  Edit3, X, Check, Building, Trash2
} from 'lucide-react';
import KPICard from '../../components/ui/KPICard';
import toast from 'react-hot-toast';
import api from '../../lib/axios';

const ClientDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'invoices' | 'payments'>('campaigns');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [client, setClient] = useState<any>({
    name: '',
    gstin: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    billed: '₹0',
    received: '₹0',
    outstanding: '₹0'
  });

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/clients/${id}`);
      setClient(res.data);
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
      fetchClient();
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
        toast.error('Failed to delete client. Ensure they have no active dependencies.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Loading client data...</div>;

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
                <span className="bg-success text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm shadow-success/20">{client.clientType || 'REGULAR'} Partner</span>
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
             <>
               <button onClick={handleDelete} className="p-2.5 text-text-muted hover:text-danger hover:bg-danger/10 border border-border rounded-xl transition-all"><Trash2 size={18} /></button>
               <button onClick={() => setIsEditing(true)} className="btn-outline px-4 py-1.5 flex items-center gap-2 text-[12px] hover:text-accent-orange"><Edit3 size={14} /> Edit Client</button>
             </>
           )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="col-span-1 card bg-bg-surface-2 border-dashed flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2 text-text-muted text-[11px]">
               <Mail size={14} className="text-accent-blue" />
               {isEditing ? (
                 <input className="bg-bg-surface border border-border rounded px-2 py-0.5 w-full outline-none" value={client.email || ''} onChange={e => setClient({...client, email: e.target.value})} />
               ) : <span>{client.email || 'No email set'}</span>}
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
         <KPICard label="Total Billed" value={`₹${client.invoices?.reduce((acc: number, inv: any) => acc + inv.totalAmount, 0).toLocaleString() || 0}`} trend="Lifetime" trendType="up" />
         <KPICard label="Received" value={`₹${client.payments?.reduce((acc: number, p: any) => acc + p.amount, 0).toLocaleString() || 0}`} trend="Collections" trendType="up" />
         <div className="card border-danger/20 bg-danger/5">
            <div className="text-[10px] text-danger uppercase tracking-widest font-black">Outstanding</div>
            <div className="text-2xl font-black text-danger mt-2">
              ₹{(client.invoices?.reduce((acc: number, inv: any) => acc + inv.totalAmount, 0) - client.payments?.reduce((acc: number, p: any) => acc + p.amount, 0)).toLocaleString() || 0}
            </div>
            <div className="text-[10px] text-danger/60 font-bold mt-2">{client.invoices?.filter((i: any) => i.status === 'PENDING').length || 0} Pending Invoices</div>
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
                  {client.campaigns?.length > 0 ? client.campaigns.map((c: any) => (
                     <div key={c.id} className="p-4 bg-bg-surface-2 rounded-xl border border-border flex items-center justify-between group hover:border-accent-orange transition-all cursor-pointer">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-bg-surface border border-border rounded-lg flex items-center justify-center text-accent-blue group-hover:scale-110 transition-transform">
                              <TrendingUp size={20} />
                           </div>
                           <div>
                              <p className="text-[13px] font-bold text-text-primary">{c.campaignName}</p>
                              <p className="text-[10px] text-text-muted mt-0.5">{new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-8 text-right">
                           <div>
                              <p className="text-[13px] font-black text-text-primary">₹{c.totalBudget?.toLocaleString() || 0}</p>
                              <p className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Budget</p>
                           </div>
                           <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white ${c.status === 'ACTIVE' ? 'bg-success' : 'bg-accent-blue'}`}>
                             {c.status}
                           </span>
                           <ArrowRight size={16} className="text-text-muted group-hover:text-accent-orange" />
                        </div>
                     </div>
                  )) : (
                    <div className="p-8 text-center text-text-muted italic text-[12px]">No campaigns found for this client.</div>
                  )}
               </div>
            )}
            
            {activeTab === 'invoices' && (
               <div className="p-8 text-center text-text-muted italic text-[12px]">Invoice management is syncing...</div>
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
