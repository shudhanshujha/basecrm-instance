import React from 'react';
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
  Truck
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink 
    to={to}
    className={({ isActive }) => `
      flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] transition-all
      ${isActive 
        ? 'bg-accent-orange text-white font-bold shadow-lg shadow-accent-orange/20' 
        : 'text-text-muted hover:bg-bg-surface-2 hover:text-text-primary'}
    `}
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

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
      
      <div className="px-4 mb-4">
        <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
      </div>
    </div>
  );
};

export default Sidebar;
