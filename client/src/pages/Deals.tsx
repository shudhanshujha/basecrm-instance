import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Search, Filter, Calendar, Box, 
  ChevronRight, ArrowRight, Download, ArrowUp, ArrowDown,
  Tag, Loader2, Briefcase, LayoutGrid, List as ListIcon, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ExportButton from '../components/ui/ExportButton';
import KanbanBoard from '../components/deals/KanbanBoard';
import api from '../lib/axios';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Deals: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchState] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const [isLoading, setIsLoading] = useState(true);
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/deals');
      setDeals(res.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to load deals');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBg = (status: string) => {
    const bgMap: any = { 
      'ACTIVE': 'bg-success', 
      'LEAD': 'bg-text-muted', 
      'PROPOSAL': 'bg-accent-blue', 
      'WON': 'bg-success',
      'LOST': 'bg-danger',
      'COMPLETED': 'bg-accent-blue', 
      'CANCELLED': 'bg-danger' 
    };
    return bgMap[status.toUpperCase()] || 'bg-text-muted';
  };

  const filteredDeals = useMemo(() => {
    return [...deals]
      .filter(d => 
        (statusFilter === 'All' || d.status.toUpperCase() === statusFilter.toUpperCase()) &&
        ((d.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
         (d.client?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        const valA = a.value || 0;
        const valB = b.value || 0;
        if (sortOrder === 'asc') return valA - valB;
        return valB - valA;
      });
  }, [deals, searchTerm, statusFilter, sortOrder]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/deals/${id}`, { status: newStatus.toUpperCase() });
      toast.success(`Status updated to ${newStatus}`);
      fetchDeals();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tight">Deal Pipeline</h1>
          <p className="text-[13px] text-text-muted mt-2 uppercase font-bold tracking-[3px] flex items-center gap-2">
             <div className="w-1.5 h-1.5 bg-accent-blue rounded-full animate-pulse" />
             {deals.filter(d => d.status === 'ACTIVE').length} ACTIVE NODES · SYSTEM OPERATIONAL
          </p>
        </div>
        <div className="flex gap-3">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button 
                onClick={() => setViewMode('kanban')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'text-text-muted hover:text-text-primary'}`}
               >
                  <LayoutGrid size={18} />
               </button>
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'text-text-muted hover:text-text-primary'}`}
              >
                 <ListIcon size={18} />
              </button>
           </div>
          <ExportButton data={deals} filename="deals_list" />
          <button onClick={() => navigate('/deals/new')} className="btn-primary text-[14px] px-6 flex items-center gap-2 shadow-xl shadow-accent-purple/20">
            <Plus size={16} /> New Deal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
         {[
            { label: 'Total Inflow', val: deals.length, color: 'text-text-primary' },
           { label: 'Active Stream', val: deals.filter(d => d.status === 'ACTIVE').length, color: 'text-accent-blue' },
           { label: 'Pipeline Value', val: `₹${(deals.reduce((acc, d) => acc + (d.value || 0), 0) / 100000).toFixed(1)}L`, color: 'text-accent-blue' },
           { label: 'Lead Generation', val: deals.filter(d => d.status === 'LEAD').length, color: 'text-success' }
         ].map((stat, i) => (
           <div key={i} className="card border-white/5 bg-bg-surface/30">
              <span className="text-[12px] text-text-muted uppercase font-black tracking-[2px]">{stat.label}</span>
              <span className={`text-2xl font-black mt-2 block ${stat.color}`}>{stat.val}</span>
           </div>
         ))}
      </div>

      <div className="flex gap-4 items-center">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Filter deals or clients..." 
              className="w-full bg-bg-surface border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-[16px] text-text-primary focus:outline-none focus:border-accent-blue/50 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchState(e.target.value)}
            />
         </div>
         {viewMode === 'list' && (
           <div className="flex gap-2">
              {['All', 'Active', 'Lead', 'Proposal', 'Won'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-[13px] font-bold uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' : 'bg-white/5 text-text-muted border border-white/5 hover:text-text-primary'}`}
                >
                  {s}
                </button>
              ))}
           </div>
         )}
         <button 
           onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} 
           className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[13px] font-black uppercase tracking-widest text-text-muted flex items-center gap-3 hover:text-text-primary transition-all"
         >
            <motion.div animate={{ rotate: sortOrder === 'asc' ? 0 : 180 }}>
              {sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </motion.div>
            Value: {sortOrder === 'asc' ? 'Low-High' : 'High-Low'}
         </button>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="py-40 text-center"
          >
            <Loader2 className="animate-spin mx-auto text-accent-blue" size={40} />
            <p className="text-[13px] font-black uppercase tracking-[3px] text-text-muted mt-4">Syncing Pipeline Data...</p>
          </motion.div>
        ) : viewMode === 'kanban' ? (
          <motion.div
            key="kanban"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <KanbanBoard 
              deals={deals} 
              onStatusChange={updateStatus} 
              onViewDetails={(id) => navigate(`/deals/${id}`)} 
            />
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {filteredDeals.map((deal) => (
              <motion.div 
                key={deal.id}
                layout
                className="card border-white/5 bg-bg-surface/30 hover:border-accent-blue/30 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                     <div className="flex items-center gap-3">
                          <h3 className="text-[18px] font-bold text-text-primary group-hover:text-accent-blue transition-colors">{deal.title}</h3>
                        <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded shadow-inner text-white ${getStatusBg(deal.status)}`}>
                          {deal.status}
                        </span>
                     </div>
                     <p className="text-[15px] font-medium text-text-muted flex items-center gap-2">
                        <User size={12} className="text-accent-blue" />
                        {deal.client?.name || 'Manual Entity'}
                     </p>
                  </div>
                  <div className="text-right">
                     <div className="text-[19px] font-black text-text-primary">₹{((deal.value || 0) / 100000).toFixed(2)}L</div>
                     <div className="text-[12px] text-text-muted uppercase font-black tracking-widest mt-1">Contract Value</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-8 pt-5 border-t border-white/5">
                   <div className="flex items-center gap-3 text-text-muted">
                      <div className="p-1.5 bg-accent-orange/10 rounded-lg text-accent-orange"><Box size={14} /></div>
                      <span className="text-[14px] font-black uppercase tracking-tight">{deal.activityLogs?.length || 0} Assets Deployed</span>
                   </div>
                   <div className="flex items-center gap-3 text-text-muted">
                      <div className="p-1.5 bg-accent-blue/10 rounded-lg text-accent-blue"><Calendar size={14} /></div>
                      <span className="text-[14px] font-black uppercase tracking-tight">
                        {deal.startDate ? format(new Date(deal.startDate), 'dd MMM yy') : '-'} — {deal.endDate ? format(new Date(deal.endDate), 'dd MMM yy') : '-'}
                      </span>
                   </div>
                   <div className="flex justify-end">
                      <button onClick={() => navigate(`/deals/${deal.id}`)} className="text-[13px] font-black text-accent-orange uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all group-hover:bg-accent-orange/10 px-4 py-2 rounded-xl">
                        View Node <ArrowRight size={14} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Deals;
