import React, { useState } from 'react';
import { 
  Repeat, Calendar, ArrowRight, Plus, 
  Search, Filter, Clock, AlertCircle,
  Building, MapPin, DollarSign, CheckCircle2
} from 'lucide-react';
import ExportButton from '../components/ui/ExportButton';
import toast from 'react-hot-toast';

const RecurringSites: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const recurringData = [
    { id: '1', site: 'GT Road Panipat Unipole', client: 'Reliance Retail', city: 'Panipat', cycle: 'Monthly', nextBilling: '01 Jun 2026', amount: '₹28,000', status: 'Active', bg: 'bg-success' },
    { id: '2', site: 'Sector 12 Karnal Gantry', client: 'Axis Bank', city: 'Karnal', cycle: 'Quarterly', nextBilling: '15 Jul 2026', amount: '₹66,000', status: 'Active', bg: 'bg-success' },
    { id: '3', site: 'NH-44 Ambala Billboard', client: 'Havells India', city: 'Ambala', cycle: 'Monthly', nextBilling: '05 Jun 2026', amount: '₹45,000', status: 'Renewing', bg: 'bg-warning' },
    { id: '4', site: 'Railway Road Flex', client: 'Local Business', city: 'Kurukshetra', cycle: 'Yearly', nextBilling: '01 Jan 2027', amount: '₹1,44,000', status: 'Paused', bg: 'bg-danger' },
  ];

  const filteredData = recurringData.filter(d => 
    d.site.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Recurring Sites</h1>
          <p className="text-[11px] text-text-muted mt-1 uppercase tracking-widest font-black">Long-term Leases · Automated Billing Cycles</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={filteredData} filename="drishtivision_recurring_inventory" />
          <button onClick={() => toast.success('Setup recurring billing wizard initiated...')} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
            <Repeat size={16} /> Setup Recurring
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
         <div className="card flex flex-col justify-center border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Active Subscriptions</div>
            <div className="text-xl font-black text-text-primary mt-2">14</div>
         </div>
         <div className="card flex flex-col justify-center border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Expected Monthly (Rec)</div>
            <div className="text-xl font-black text-accent-blue mt-2">₹4.2L</div>
         </div>
         <div className="card flex flex-col justify-center border-border/40">
            <div className="text-[9px] text-text-muted uppercase font-black tracking-widest">Due for Renewal</div>
            <div className="text-xl font-black text-warning mt-2">3 Sites</div>
         </div>
         <div className="card bg-success/5 border-success/20 flex flex-col justify-center">
            <div className="text-[9px] text-success uppercase font-black tracking-widest">Collection Rate</div>
            <div className="text-xl font-black text-text-primary mt-2">98.2%</div>
         </div>
      </div>

      <div className="card">
        <div className="relative max-w-md">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
           <input 
             type="text" 
             placeholder="Search by site or client..." 
             className="w-full bg-bg-surface-2 border border-border rounded-xl pl-9 pr-3 py-2.5 text-[12px] focus:outline-none focus:border-accent-orange transition-colors"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
         {filteredData.map((item) => (
            <div key={item.id} className="card hover:border-accent-orange transition-all cursor-pointer group flex items-center justify-between bg-bg-surface border-border/50">
               <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-bg-surface-2 rounded-2xl border border-border flex items-center justify-center text-accent-orange shadow-inner">
                     <Repeat size={20} className="group-hover:rotate-180 transition-all duration-700" />
                  </div>
                  <div>
                     <div className="flex items-center gap-2">
                        <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{item.site}</h3>
                        <span className={`status-tag ${item.bg}`}>{item.status}</span>
                     </div>
                     <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase tracking-tighter">
                           <Building size={10} className="text-accent-blue" /> {item.client}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-bold uppercase tracking-tighter border-l border-border pl-3">
                           <MapPin size={10} className="text-danger" /> {item.city}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-12 text-right pr-2">
                  <div>
                     <div className="text-[14px] font-black text-text-primary">{item.amount}</div>
                     <div className="text-[9px] text-text-muted uppercase font-bold tracking-tighter">{item.cycle} Billing</div>
                  </div>
                  <div className="min-w-[100px]">
                     <div className="text-[11px] font-bold text-text-primary flex items-center justify-end gap-1.5">
                        <Clock size={12} className="text-accent-orange" /> {item.nextBilling}
                     </div>
                     <div className="text-[9px] text-text-muted uppercase font-black mt-0.5">Next Invoice</div>
                  </div>
                  <div className="pl-4">
                     <button className="p-2 text-text-muted group-hover:text-accent-orange transition-colors border border-transparent group-hover:border-border rounded-lg">
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
