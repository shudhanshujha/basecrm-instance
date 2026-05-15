import React, { useState, useEffect } from 'react';
import { 
  Repeat, Calendar, ArrowRight, Plus, 
  Search, Filter, Clock, AlertCircle,
  Building, MapPin, DollarSign, CheckCircle2
} from 'lucide-react';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';
import api from '../lib/axios';

const RecurringSites: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecurringSites();
  }, []);

  const fetchRecurringSites = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sites');
      // Filter for recurring sites only
      const recurring = res.data.filter((s: any) => s.isRecurring === true);
      setSites(recurring);
    } catch (error) {
      console.error('Failed to fetch recurring sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = sites.filter(d => 
    d.siteName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-text-muted">Loading subscription data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary uppercase tracking-tight">Subscription Inventory</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Recurring Leases · Long-term Automated Billing</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={filteredData} filename="drishtivision_recurring_sites" />
          <button onClick={() => toast.success('Recurring wizard initiated...')} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
            <Repeat size={16} /> Setup New Recurring
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="card flex flex-col justify-center border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Active Subscriptions</div>
            <div className="text-xl font-black text-text-primary mt-2">{sites.length}</div>
         </div>
         <div className="card flex flex-col justify-center border-border/40 text-accent-blue">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Total Monthly Value</div>
            <div className="text-xl font-black mt-2">₹{sites.reduce((acc, s) => acc + s.monthlyRate, 0).toLocaleString()}</div>
         </div>
         <div className="card flex flex-col justify-center border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Renewal Window</div>
            <div className="text-xl font-black text-warning mt-2">Check Logs</div>
         </div>
         <div className="card bg-success/5 border-success/20 flex flex-col justify-center">
            <div className="text-[9px] text-success uppercase font-black tracking-widest">Financial Health</div>
            <div className="text-xl font-black text-text-primary mt-2">Optimal</div>
         </div>
      </div>

      <div className="card">
        <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
           <input 
             type="text" 
             placeholder="Search active subscriptions..." 
             className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-[12px] outline-none"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
         {filteredData.length === 0 ? (
           <div className="p-12 text-center text-text-muted italic border border-dashed border-border rounded-2xl bg-bg-surface-2/30">No recurring sites found in your inventory database. Mark sites as 'Recurring' to see them here.</div>
         ) : filteredData.map((item) => (
            <div key={item.id} className="card hover:border-accent-orange transition-all cursor-pointer group flex items-center justify-between bg-bg-surface border-border/50 shadow-md">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-bg-surface-2 rounded-2xl border border-border flex items-center justify-center text-accent-orange shadow-inner">
                     <Repeat size={20} className="group-hover:rotate-180 transition-all duration-1000" />
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{item.siteName}</h3>
                        <span className={`status-tag bg-success`}>{item.status}</span>
                     </div>
                     <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase tracking-tighter">
                           <MapPin size={10} className="text-danger" /> {item.city}, {item.state}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase tracking-tighter border-l border-border pl-3">
                           <Building size={10} className="text-accent-blue" /> {item.ownershipType}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-12 text-right pr-2">
                  <div>
                     <div className="text-[15px] font-black text-text-primary">₹{item.monthlyRate.toLocaleString()}</div>
                     <div className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">Monthly Billing</div>
                  </div>
                  <div className="min-w-[120px]">
                     <div className="text-[11px] font-bold text-text-primary flex items-center justify-end gap-1.5">
                        <Calendar size={12} className="text-accent-orange" /> {new Date(item.updatedAt).toLocaleDateString()}
                     </div>
                     <div className="text-[9px] text-text-muted uppercase font-black mt-0.5">Last Modification</div>
                  </div>
                  <div className="pl-4">
                     <button className="p-2 text-text-muted group-hover:text-accent-orange transition-colors border border-transparent group-hover:border-border rounded-lg shadow-sm">
                        <ArrowRight size={18} />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default RecurringSites;
