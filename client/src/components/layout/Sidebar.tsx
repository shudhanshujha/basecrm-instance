import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Megaphone, 
  Users, 
  Database, 
  FileText, 
  CreditCard, 
  BarChart3, 
  LineChart, 
  Settings,
  Repeat,
  Truck,
  HardDrive,
} from 'lucide-react';
import api from '../../lib/axios';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] transition-all
      ${isActive 
        ? 'bg-accent-orange text-white font-bold shadow-lg shadow-accent-orange/20' 
        : 'text-text-muted hover:bg-bg-surface-2 hover:text-text-primary'}
    `}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

// ─── Storage Widget ────────────────────────────────────────────────────────────
const StorageBar: React.FC = () => {
  const [storage, setStorage] = useState<{ label: string; percent: number; limitGB: number } | null>(null);

  useEffect(() => {
    api.get('/storage')
      .then(r => setStorage(r.data))
      .catch(() => {/* silently fail */});
    
    // Refresh every 5 minutes
    const interval = setInterval(() => {
      api.get('/storage').then(r => setStorage(r.data)).catch(() => {});
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!storage) return null;

  const pct = Math.min(storage.percent, 100);
  const color = pct > 85 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#f97316';

  return (
    <div className="mx-4 mb-4 p-3 bg-bg-surface-2 border border-border rounded-xl space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-black text-text-muted uppercase tracking-wider">
          <HardDrive size={11} className="text-accent-orange" />
          Storage
        </div>
        <span className="text-[9px] font-black text-text-muted">{storage.label} / {storage.limitGB} GB</span>
      </div>

      {/* Bar track */}
      <div className="w-full h-1.5 bg-bg-surface rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.max(pct, 0.3)}%`, backgroundColor: color }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-[9px] text-text-muted">{pct < 0.1 ? '<0.1' : pct.toFixed(2)}% used</span>
        <span className="text-[9px] text-text-muted font-bold">{(storage.limitGB - (storage.percent / 100) * storage.limitGB).toFixed(2)} GB free</span>
      </div>
    </div>
  );
};

// ─── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar: React.FC = () => {
  return (
    <div className="w-[240px] bg-bg-surface border-r border-border h-full flex flex-col py-6 shrink-0 overflow-y-auto shadow-xl">
      <div className="px-4 mb-8">
        <div className="text-[10px] font-black text-text-muted uppercase tracking-[1.5px] px-2 mb-4 border-l-2 border-accent-orange pl-3">Main Navigation</div>
        <div className="flex flex-col gap-1">
          <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem to="/campaigns" icon={<Megaphone size={18} />} label="Campaigns" />
          <NavItem to="/clients" icon={<Users size={18} />} label="Clients" />
          <NavItem to="/vendors" icon={<Truck size={18} />} label="Vendors" />
          <NavItem to="/sites" icon={<Database size={18} />} label="Site Database" />
        </div>
      </div>

      <div className="px-4 mb-8">
        <div className="text-[10px] font-black text-text-muted uppercase tracking-[1.5px] px-2 mb-4 border-l-2 border-accent-blue pl-3">Finance</div>
        <div className="flex flex-col gap-1">
          <NavItem to="/invoices" icon={<FileText size={18} />} label="Invoices" />
          <NavItem to="/expenses" icon={<CreditCard size={18} />} label="Expense Tracker" />
          <NavItem to="/payments" icon={<CreditCard size={18} />} label="Payments" />
          <NavItem to="/pl-report" icon={<BarChart3 size={18} />} label="P&L Report" />
          <NavItem to="/gst" icon={<FileText size={18} />} label="GST & Balance" />
        </div>
      </div>

      <div className="px-4 mb-8 flex-1">
        <div className="text-[10px] font-black text-text-muted uppercase tracking-[1.5px] px-2 mb-4 border-l-2 border-purple-500 pl-3">Intelligence</div>
        <div className="flex flex-col gap-1">
          <NavItem to="/analytics" icon={<LineChart size={18} />} label="Analytics" />
          <NavItem to="/recurring" icon={<Repeat size={18} />} label="Recurring Sites" />
        </div>
      </div>
      
      {/* Storage Bar */}
      <StorageBar />

      <div className="px-4 mb-4">
        <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
      </div>
    </div>
  );
};

export default Sidebar;
