import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, Calendar, MapPin, 
  ChevronRight, ArrowRight, Download, ArrowUp, ArrowDown,
  Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV } from '../lib/export';
import ExportButton from '../components/ui/ExportButton';

const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchState] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [campaigns, setCampaigns] = useState([
    { id: '1', name: 'Haryana Roads Q2', client: 'Reliance Retail Ltd', sites: 12, dates: '2026-04-01 – 2026-06-30', occupancy: '92%', status: 'Active', bg: 'bg-success', value: 4250000 },
    { id: '2', name: 'ATM Network May', client: 'Axis Bank Ltd', sites: 8, dates: '2026-05-01 – 2026-05-31', occupancy: '100%', status: 'Active', bg: 'bg-success', value: 1800000 },
    { id: '3', name: 'Summer Push', client: 'Havells India', sites: 4, dates: '2026-04-15 – 2026-06-15', occupancy: '75%', status: 'Running', bg: 'bg-warning', value: 900000 },
    { id: '4', name: 'Brand Launch', client: 'New Client', sites: 2, dates: '2026-06-01 – 2026-07-31', occupancy: '0%', status: 'Planning', bg: 'bg-text-muted', value: 450000 },
  ]);

  const filteredCampaigns = useMemo(() => {
    return [...campaigns]
      .filter(c => 
        (statusFilter === 'All' || c.status === statusFilter) &&
        (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.client.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortOrder === 'asc') return a.value - b.value;
        return b.value - a.value;
      });
  }, [campaigns, searchTerm, statusFilter, sortOrder]);

  const handleExportCSV = () => {
    exportToCSV(filteredCampaigns, 'campaigns_list');
  };

  const updateStatus = (id: string, newStatus: string) => {
    const bgMap: any = { 'Active': 'bg-success', 'Running': 'bg-warning', 'Planning': 'bg-text-muted', 'Completed': 'bg-accent-blue', 'Cancelled': 'bg-danger' };
    setCampaigns(campaigns.map(c => c.id === id ? { ...c, status: newStatus, bg: bgMap[newStatus] || 'bg-text-muted' } : c));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Campaigns</h1>
          <p className="text-[11px] text-text-muted mt-1">24 active campaigns · Tracking & Occupancy</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={filteredCampaigns} filename="campaigns_list" />
          <button onClick={() => navigate('/campaigns/new')} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>

      <div className="card grid grid-cols-4 gap-4 bg-bg-surface-2 border-dashed border-border/50">
         <div className="flex flex-col">
            <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Total Sites Booked</span>
            <span className="text-xl font-black text-text-primary mt-1">114</span>
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Avg Duration</span>
            <span className="text-xl font-black text-text-primary mt-1">45 Days</span>
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Active Value</span>
            <span className="text-xl font-black text-accent-blue mt-1">₹42.5L</span>
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Capacity Used</span>
            <span className="text-xl font-black text-success mt-1">88%</span>
         </div>
      </div>

      <div className="card flex flex-wrap gap-4 items-center">
         <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={14} />
            <input 
              type="text" 
              placeholder="Search campaign or client..." 
              className="w-full bg-bg-surface-2 border border-border rounded-lg pl-9 pr-3 py-2 text-[12px] focus:outline-none focus:border-accent-orange"
              value={searchTerm}
              onChange={(e) => setSearchState(e.target.value)}
            />
         </div>
         <div className="flex gap-2">
            {['All', 'Active', 'Running', 'Planning'].map(s => (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase transition-all ${statusFilter === s ? 'bg-accent-orange text-white' : 'bg-bg-surface-2 text-text-muted border border-border'}`}
              >
                {s}
              </button>
            ))}
         </div>
         <button 
           onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} 
           className="btn-outline flex items-center gap-2 text-[12px] group hover:border-accent-orange active:scale-95 transition-all"
         >
            <motion.div
              animate={{ rotate: sortOrder === 'asc' ? 0 : 180 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </motion.div>
            <span className="font-bold">Value: {sortOrder === 'asc' ? 'Low-High' : 'High-Low'}</span>
         </button>
      </div>

      <motion.div layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredCampaigns.map((camp) => (
            <motion.div 
              key={camp.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="card hover:border-accent-orange transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{camp.name}</h3>
                      <div className="relative group/status">
                         <span className={`text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white cursor-pointer ${camp.bg}`}>
                           {camp.status}
                         </span>
                         <div className="absolute hidden group-hover/status:flex flex-col gap-1 bg-bg-surface border border-border p-2 rounded-lg shadow-2xl z-10 top-6 left-0 min-w-[100px]">
                            {['Active', 'Running', 'Planning', 'Completed', 'Cancelled'].map(s => (
                               <button key={s} onClick={() => updateStatus(camp.id, s)} className="text-[10px] text-left hover:text-accent-orange text-text-muted font-bold py-1 uppercase">{s}</button>
                            ))}
                         </div>
                      </div>
                   </div>
                   <p className="text-[12px] font-medium text-text-muted">{camp.client}</p>
                </div>
                <div className="text-right">
                   <div className="text-[14px] font-black text-text-primary">{camp.occupancy}</div>
                   <div className="text-[10px] text-text-muted uppercase tracking-tighter font-bold">Occupancy</div>
                   <div className="text-[12px] font-bold text-accent-blue mt-1">₹{(camp.value / 100000).toFixed(1)}L</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-6 pt-4 border-t border-border border-opacity-50">
                 <div className="flex items-center gap-2 text-text-muted">
                    <MapPin size={14} className="text-accent-orange" />
                    <span className="text-[11px] font-medium">{camp.sites} Hoarding Sites</span>
                 </div>
                 <div className="flex items-center gap-2 text-text-muted">
                    <Calendar size={14} className="text-accent-blue" />
                    <span className="text-[11px] font-medium">{camp.dates}</span>
                 </div>
                 <div className="flex justify-end">
                    <button onClick={() => navigate(`/campaigns/${camp.id}`)} className="flex items-center gap-1.5 text-[11px] font-bold text-accent-orange hover:gap-2.5 transition-all">
                      View Full Details <ArrowRight size={14} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Campaigns;
