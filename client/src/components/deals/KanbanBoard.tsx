import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface Deal {
  id: string;
  title: string;
  status: string;
  value: number;
  startDate?: string;
  client?: { name: string };
}

interface KanbanBoardProps {
  deals: Deal[];
  onStatusChange: (id: string, newStatus: string) => void;
  onViewDetails: (id: string) => void;
}

const COLUMNS = [
  { id: 'LEAD', label: 'Leads', color: 'border-text-muted', dot: 'bg-text-muted' },
  { id: 'PROPOSAL', label: 'Proposal', color: 'border-accent-blue', dot: 'bg-accent-blue' },
  { id: 'ACTIVE', label: 'Active', color: 'border-accent-orange', dot: 'bg-accent-orange' },
  { id: 'WON', label: 'Won', color: 'border-success', dot: 'bg-success' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ deals, onStatusChange, onViewDetails }) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar min-h-[600px]">
      {COLUMNS.map((col) => {
        const colDeals = deals.filter((d) => d.status.toUpperCase() === col.id);
        const totalValue = colDeals.reduce((sum, d) => sum + (d.value || 0), 0);

        return (
          <div key={col.id} className="flex-1 min-w-[320px] max-w-[400px]">
            <div className={`flex justify-between items-center mb-4 pb-2 border-b-2 ${col.color}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-[11px] font-black uppercase tracking-[2px] text-text-primary">
                  {col.label} <span className="ml-1 opacity-40">({colDeals.length})</span>
                </h3>
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase">₹{(totalValue / 100000).toFixed(1)}L</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {colDeals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-bg-surface/40 border border-white/5 p-4 rounded-2xl hover:border-white/20 transition-all cursor-grab active:cursor-grabbing shadow-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-[13px] font-bold text-text-primary group-hover:text-accent-orange transition-colors truncate pr-4">
                        {deal.title}
                      </h4>
                      <button className="text-text-muted hover:text-text-primary transition-colors">
                        <MoreVertical size={14} />
                      </button>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center gap-2 text-text-muted">
                          <User size={12} className="shrink-0" />
                          <span className="text-[10px] font-bold uppercase tracking-tight truncate">
                             {deal.client?.name || 'Unassigned'}
                          </span>
                       </div>
                       
                       <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-1.5 text-accent-blue font-black text-[12px]">
                             <TrendingUp size={12} />
                             ₹{(deal.value / 100000).toFixed(1)}L
                          </div>
                          <button 
                            onClick={() => onViewDetails(deal.id)}
                            className="p-1.5 bg-white/5 hover:bg-accent-orange/20 text-text-muted hover:text-accent-orange rounded-lg transition-all"
                          >
                             <ArrowRight size={14} />
                          </button>
                       </div>
                    </div>

                    {/* Quick Move Buttons */}
                    <div className="mt-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {COLUMNS.filter(c => c.id !== col.id).map(c => (
                          <button
                            key={c.id}
                            onClick={() => onStatusChange(deal.id, c.id)}
                            className="flex-1 py-1 text-[8px] font-black uppercase rounded bg-white/5 hover:bg-white/10 text-text-muted border border-white/5 transition-all"
                          >
                             Move to {c.label}
                          </button>
                       ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {colDeals.length === 0 && (
                <div className="py-10 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-text-muted italic text-[10px]">
                   No deals in this stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;