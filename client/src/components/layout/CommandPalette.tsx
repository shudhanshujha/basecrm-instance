import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Command, FileText, Users, 
  Briefcase, BarChart3, Settings, Plus,
  X, Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const commands = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={16} />, action: () => navigate('/') },
    { id: 'clients', label: 'View Clients', icon: <Users size={16} />, action: () => navigate('/clients') },
    { id: 'deals', label: 'Deal Pipeline', icon: <Briefcase size={16} />, action: () => navigate('/deals') },
    { id: 'invoices', label: 'Invoice Management', icon: <FileText size={16} />, action: () => navigate('/invoices') },
    { id: 'new-invoice', label: 'Create New Invoice', icon: <Plus size={16} />, action: () => navigate('/invoices/new'), color: 'text-accent-orange' },
    { id: 'new-deal', label: 'Launch New Deal', icon: <Plus size={16} />, action: () => navigate('/deals/new'), color: 'text-accent-blue' },
    { id: 'settings', label: 'System Settings', icon: <Settings size={16} />, action: () => navigate('/settings') },
  ];

  const filteredCommands = commands.filter(c => 
    c.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999]"
          />
          <div className="fixed inset-0 flex items-start justify-center pt-[15vh] z-[1000] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-[600px] bg-bg-surface border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto"
            >
              <div className="p-6 border-b border-white/5 flex items-center gap-4">
                <Command className="text-accent-blue animate-pulse" size={20} />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Type a command or search..."
                  className="bg-transparent border-none outline-none text-white text-[19px] font-bold flex-1"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/5">
                   <span className="text-[13px] font-black text-text-muted">ESC</span>
                </div>
              </div>

              <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
                <div className="text-[12px] font-black uppercase tracking-[3px] text-text-muted px-4 mb-4">Quick Commands</div>
                <div className="space-y-1">
                  {filteredCommands.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleAction(cmd.action)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 bg-white/5 rounded-xl group-hover:bg-accent-blue/10 group-hover:text-accent-blue transition-all ${cmd.color || 'text-white'}`}>
                          {cmd.icon}
                        </div>
                        <span className="text-[17px] font-bold text-white tracking-tight">{cmd.label}</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <Zap size={14} className="text-accent-blue" />
                      </div>
                    </button>
                  ))}
                  {filteredCommands.length === 0 && (
                    <div className="py-10 text-center text-text-muted italic text-[15px]">
                       No commands matching "{search}"
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center px-8">
                 <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[12px] text-text-muted font-black">↑↓</kbd>
                       <span className="text-[12px] text-text-muted font-black uppercase">Navigate</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <kbd className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[12px] text-text-muted font-black">↵</kbd>
                       <span className="text-[12px] text-text-muted font-black uppercase">Select</span>
                    </div>
                 </div>
                 <div className="text-[12px] text-text-muted font-black uppercase tracking-widest">BaseCRM System OS v1.0</div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;