import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Building, Target, FileText, 
  CreditCard, TrendingUp, MapPin, ExternalLink,
  ShieldCheck, Info, Plus, Download, Briefcase,
  Phone, Mail, User
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import KPICard from '../components/ui/KPICard';
import ExportButton from '../components/ui/ExportButton';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const VendorDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'sites' | 'payouts' | 'contracts'>('sites');
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const fetchVendor = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/vendors/${id}`);
      setVendor(res.data);
    } catch (error) {
      console.error('Failed to fetch vendor:', error);
      toast.error('Failed to load vendor profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-text-muted">Syncing vendor data...</div>;
  if (!vendor) return <div className="p-8 text-center text-danger">Vendor partner not found.</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <button onClick={() => navigate('/vendors')} className="p-2 bg-bg-surface border border-border rounded-xl hover:text-accent-orange transition-colors">
               <ArrowLeft size={20} />
            </button>
            <div>
               <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary uppercase tracking-tight">{vendor.vendorName}</h1>
                  <span className={`status-tag ${vendor.status === 'ACTIVE' ? 'bg-success' : 'bg-danger'}`}>{vendor.status}</span>
               </div>
               <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-black">{vendor.vendorType} · ID: {id?.toUpperCase()}</p>
            </div>
         </div>
         <div className="flex gap-2">
            <ExportButton data={vendor.sites || []} filename={`vendor_${vendor.vendorName}_inventory`} />
            <button onClick={() => toast.success('Payout wizard initiated...')} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30"><Plus size={16} /> New Payout</button>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="card flex flex-col justify-center gap-2">
            <div className="text-[9px] text-text-muted font-black uppercase tracking-tighter">Primary Contact</div>
            <div className="flex items-center gap-2 text-[13px] font-bold text-text-primary"><User size={14} className="text-accent-orange" /> {vendor.contactPerson}</div>
            <div className="flex items-center gap-2 text-[11px] text-text-muted font-bold"><Phone size={12} className="text-accent-blue" /> {vendor.phone}</div>
         </div>
         <KPICard label="Leased Inventory" value={(vendor.sites?.length || 0).toString()} trend="Managed Sites" trendType="up" />
         <KPICard label="Total Payouts" value={`₹${vendor.payments?.reduce((acc: number, p: any) => acc + p.amount, 0).toLocaleString() || 0}`} trend="Lifetime" trendType="up" />
         <div className="card border-warning/20 bg-warning/5">
            <div className="text-[9px] text-warning uppercase font-black tracking-widest">Audit Balance</div>
            <div className="text-2xl font-black text-text-primary mt-2">Verified</div>
            <div className="text-[9px] text-text-muted font-bold mt-2 uppercase">Compliant Partner</div>
         </div>
      </div>

      <div className="card p-0 overflow-hidden border-border/50 shadow-xl">
         <div className="flex border-b border-border bg-bg-surface-2">
            {['sites', 'payouts', 'contracts'].map((tab: any) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-accent-orange bg-accent-orange/5' : 'text-text-muted hover:text-text-primary'}`}>
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-orange rounded-t-full shadow-[0_-4px_12px_#f97316]"></div>}
              </button>
            ))}
         </div>
         <div className="p-6">
            {activeTab === 'sites' && (
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[10px] text-text-muted uppercase font-black border-b border-border">
                           <th className="pb-4 px-4">Site Name / ID</th>
                           <th className="pb-4 px-4">Location</th>
                           <th className="pb-4 px-4 text-right">Agreed Rate</th>
                           <th className="pb-4 px-4 text-right">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {vendor.sites?.length > 0 ? vendor.sites.map((s: any) => (
                           <tr key={s.id} className="group hover:bg-bg-surface-2 transition-colors cursor-pointer" onClick={() => navigate(`/sites/${s.id}`)}>
                              <td className="py-4 px-4">
                                 <div className="text-[13px] font-bold text-text-primary group-hover:text-accent-orange">{s.siteName}</div>
                                 <div className="text-[10px] text-text-muted font-mono mt-0.5 uppercase tracking-tighter">{s.id.slice(0, 8)}</div>
                              </td>
                              <td className="py-4 px-4 text-[12px] text-text-muted font-medium uppercase">{s.city}, {s.state}</td>
                              <td className="py-4 px-4 font-mono text-[13px] font-black text-accent-blue text-right">₹{s.monthlyRate.toLocaleString()}</td>
                              <td className="py-4 px-4 text-right">
                                 <span className={`status-tag ${s.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning'}`}>{s.status}</span>
                              </td>
                           </tr>
                        )) : (
                          <tr><td colSpan={4} className="p-12 text-center text-text-muted italic">No sites allocated to this vendor partner.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            )}
            {activeTab !== 'sites' && <div className="p-20 text-center text-text-muted italic text-[12px] uppercase tracking-widest font-black">{activeTab} ledger data is being synchronized with the main treasury...</div>}
         </div>
      </div>
    </div>
  );
};

export default VendorDetails;
