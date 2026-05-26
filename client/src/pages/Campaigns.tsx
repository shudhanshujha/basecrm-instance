import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Search, Filter, Calendar, MapPin, 
  ChevronRight, ArrowRight, Download, ArrowUp, ArrowDown,
  Tag, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ExportButton from '../components/ui/ExportButton';
import api from '../lib/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Campaigns: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchState] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/campaigns');
      setCampaigns(res.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBg = (status: string) => {
    const bgMap: any = { 
      'ACTIVE': 'bg-success', 
      'PLANNING': 'bg-text-muted', 
      'COMPLETED': 'bg-accent-blue', 
      'CANCELLED': 'bg-danger' 
    };
    return bgMap[status.toUpperCase()] || 'bg-text-muted';
  };

  const filteredCampaigns = useMemo(() => {
    return [...campaigns]
      .filter(c => 
        (statusFilter === 'All' || c.status.toUpperCase() === statusFilter.toUpperCase()) &&
        ((c.campaignName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
         (c.client?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const valA = a.totalBudget || 0;
        const valB = b.totalBudget || 0;
        if (sortOrder === 'asc') return valA - valB;
        return valB - valA;
      });
  }, [campaigns, searchTerm, statusFilter, sortOrder]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/campaigns/${id}`, { status: newStatus.toUpperCase() });
      toast.success(`Status updated to ${newStatus}`);
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Campaigns</h1>
          <p className="text-[11px] text-text-muted mt-1">{campaigns.filter(c => c.status === 'ACTIVE').length} active campaigns · Tracking & Occupancy</p>
        </div>
        <div className="flex gap-2">
          <ExportButton data={campaigns} filename="campaigns_list" />
          <button onClick={() => navigate('/campaigns/new')} className="btn-primary text-[12px] py-1.5 flex items-center gap-2 shadow-lg shadow-accent-orange/30">
            <Plus size={16} /> New Campaign
          </button>
        </div>
      </div>

      <div className="card grid grid-cols-4 gap-4 bg-bg-surface-2 border-dashed border-border/50">
         <div className="flex flex-col">
            <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Total Active Sites</span>
            <span className="text-xl font-black text-text-primary mt-1">
              {campaigns.reduce((acc, c) => acc + (c.campaignSites?.length || 0), 0)}
            </span>
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Campaigns Count</span>
            <span className="text-xl font-black text-text-primary mt-1">{campaigns.length}</span>
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Active Portfolio Value</span>
            <span className="text-xl font-black text-accent-blue mt-1">
              ₹{(campaigns.reduce((acc, c) => acc + (c.totalBudget || 0), 0) / 100000).toFixed(1)}L
            </span>
         </div>
         <div className="flex flex-col">
            <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">Planning Sites</span>
            <span className="text-xl font-black text-success mt-1">
              {campaigns.filter(c => c.status === 'PLANNING').length}
            </span>
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.1 }}
              className="card hover:border-accent-orange transition-all group"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                   <div className="flex items-center gap-2">
                      <h3 className="text-[14px] font-bold text-text-primary group-hover:text-accent-orange transition-colors">{camp.campaignName}</h3>
                      <div className="relative group/status" onClick={(e) => e.stopPropagation()}>
                         <select 
                           value={camp.status?.toUpperCase()} 
                           onChange={(e) => updateStatus(camp.id, e.target.value)}
                           className={`appearance-none text-center text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white cursor-pointer outline-none border border-transparent focus:border-border transition-all ${getStatusBg(camp.status)}`}
                         >
                            {['ACTIVE', 'RUNNING', 'PLANNING', 'COMPLETED', 'CANCELLED'].map(s => (
                               <option key={s} value={s} className="bg-bg-surface text-text-primary uppercase font-bold text-[10px]">{s}</option>
                            ))}
                         </select>
                      </div>
                   </div>
                   <p className="text-[12px] font-medium text-text-muted">{camp.client?.name || 'No Client'}</p>
                </div>
                <div className="text-right">
                   <div className="text-[14px] font-black text-text-primary">{camp.campaignSites?.length || 0}</div>
                   <div className="text-[10px] text-text-muted uppercase tracking-tighter font-bold">Sites</div>
                   <div className="text-[12px] font-bold text-accent-blue mt-1">₹{((camp.totalBudget || 0) / 100000).toFixed(1)}L</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-6 pt-4 border-t border-border border-opacity-50">
                 <div className="flex items-center gap-2 text-text-muted">
                    <MapPin size={14} className="text-accent-orange" />
                    <span className="text-[11px] font-medium">{camp.campaignSites?.length || 0} Hoarding Sites</span>
                 </div>
                 <div className="flex items-center gap-2 text-text-muted">
                    <Calendar size={14} className="text-accent-blue" />
                    <span className="text-[11px] font-medium">{camp.startDate ? format(new Date(camp.startDate), 'dd MMM') : '-'} to {camp.endDate ? format(new Date(camp.endDate), 'dd MMM') : '-'}</span>
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
