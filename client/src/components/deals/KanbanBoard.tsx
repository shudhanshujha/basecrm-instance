import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';

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
  { id: 'LEAD', label: 'Lead', color: 'border-text-muted/40', dot: 'bg-text-muted' },
  { id: 'PROPOSAL', label: 'Proposal', color: 'border-accent-blue/40', dot: 'bg-accent-blue' },
  { id: 'ACTIVE', label: 'Active', color: 'border-success/40', dot: 'bg-success' },
  { id: 'WON', label: 'Won', color: 'border-accent-purple/40', dot: 'bg-accent-purple' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ deals, onStatusChange, onViewDetails }) => {
  return (
    <div className="grid grid-cols-4 gap-4 min-h-[520px]">
      {COLUMNS.map((col) => {
        const colDeals = deals.filter((d) => d.status.toUpperCase() === col.id);
        const totalValue = colDeals.reduce((sum, d) => sum + (d.value || 0), 0);

        return (
          <div key={col.id} className="flex flex-col">
            <div className={`flex justify-between items-center mb-3 pb-2 border-b ${col.color}`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                <h3 className="text-[13px] font-semibold text-text-primary">
                  {col.label} <span className="text-text-muted font-normal">({colDeals.length})</span>
                </h3>
              </div>
              <span className="text-[12px] text-text-muted">₹{(totalValue / 100000).toFixed(1)}L</span>
            </div>

            <div className="space-y-3 flex-1">
              <AnimatePresence mode="popLayout">
                {colDeals.map((deal) => (
                  <motion.div
                    key={deal.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-bg-surface border border-border p-4 rounded-xl hover:border-accent-blue/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-[14px] font-semibold text-text-primary truncate pr-2 leading-tight">
                        {deal.title}
                      </h4>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <User size={11} className="shrink-0" />
                        <span className="text-[12px] truncate">
                          {deal.client?.name || 'Unassigned'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-accent-blue font-semibold text-[13px]">
                          <TrendingUp size={11} />
                          ₹{((deal.value || 0) / 100000).toFixed(1)}L
                        </div>
                        <button
                          onClick={() => onViewDetails(deal.id)}
                          className="p-1.5 bg-bg-surface-2 hover:bg-accent-blue/10 text-text-muted hover:text-accent-blue rounded-lg transition-all"
                        >
                          <ArrowRight size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Move to buttons — shown on hover */}
                    <div className="mt-3 grid grid-cols-3 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {COLUMNS.filter(c => c.id !== col.id).map(c => (
                        <button
                          key={c.id}
                          onClick={() => onStatusChange(deal.id, c.id)}
                          className="py-1 text-[10px] font-medium rounded bg-bg-surface-2 hover:bg-accent-blue/10 text-text-muted hover:text-accent-blue border border-border transition-all"
                        >
                          → {c.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {colDeals.length === 0 && (
                <div className="py-8 border border-dashed border-border rounded-xl flex items-center justify-center text-text-muted text-[12px]">
                  No deals
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