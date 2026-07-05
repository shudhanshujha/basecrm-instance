import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User, ArrowRight, TrendingUp, MoreVertical, Eye, Trash2 } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

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
  onDealDeleted?: () => void;
}

const COLUMNS = [
  { id: 'LEAD', label: 'Lead', color: 'border-text-muted/40', dot: 'bg-text-muted' },
  { id: 'PROPOSAL', label: 'Proposal', color: 'border-accent-blue/40', dot: 'bg-accent-blue' },
  { id: 'ACTIVE', label: 'Active', color: 'border-success/40', dot: 'bg-success' },
  { id: 'WON', label: 'Won', color: 'border-accent-purple/40', dot: 'bg-accent-purple' },
];

// Dropdown menu component for deal card
const DealMenu: React.FC<{
  deal: Deal;
  onViewDetails: () => void;
  onDeleted: () => void;
}> = ({ deal, onViewDetails, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${deal.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/deals/${deal.id}`);
      toast.success('Deal deleted');
      onDeleted();
    } catch {
      toast.error('Failed to delete deal');
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        className="p-1 rounded-md hover:bg-white/10 text-text-muted hover:text-text-primary transition-colors"
      >
        <MoreVertical size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-7 z-50 bg-bg-surface border border-border rounded-xl shadow-2xl w-40 py-1 overflow-hidden">
          <button
            onClick={(e) => { e.stopPropagation(); setOpen(false); onViewDetails(); }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-text-primary hover:bg-bg-surface-2 transition-colors"
          >
            <Eye size={13} className="text-accent-blue" />
            View Details
          </button>
          <div className="h-px bg-border mx-2 my-0.5" />
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            disabled={deleting}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] text-danger hover:bg-danger/10 transition-colors disabled:opacity-50"
          >
            <Trash2 size={13} />
            {deleting ? 'Deleting...' : 'Delete Deal'}
          </button>
        </div>
      )}
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ deals, onStatusChange, onViewDetails, onDealDeleted }) => {
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
                      <h4 className="text-[14px] font-semibold text-text-primary truncate pr-1 leading-tight flex-1">
                        {deal.title}
                      </h4>
                      <DealMenu
                        deal={deal}
                        onViewDetails={() => onViewDetails(deal.id)}
                        onDeleted={() => onDealDeleted?.()}
                      />
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