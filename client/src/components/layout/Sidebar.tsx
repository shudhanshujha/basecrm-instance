import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  BarChart3, 
  LineChart, 
  Settings,
  Truck,
  Package,
  CalendarDays,
  Handshake,
  Activity,
  Zap
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="app-sidebar w-[220px] bg-bg-surface border-r border-border h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-3 py-6 space-y-6">
        <div>
          <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[2px] px-3 mb-3">Main</div>
          <div className="flex flex-col gap-0.5">
            <NavItem to="/" icon={<LayoutDashboard size={16} />} label="Dashboard" />
            <NavItem to="/deals" icon={<Handshake size={16} />} label="Deals" />
            <NavItem to="/clients" icon={<Users size={16} />} label="Clients" />
            <NavItem to="/vendors" icon={<Truck size={16} />} label="Vendors" />
            <NavItem to="/assets" icon={<Package size={16} />} label="Assets" />
            <NavItem to="/tasks" icon={<CalendarDays size={16} />} label="Tasks" />
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[2px] px-3 mb-3">Finance</div>
          <div className="flex flex-col gap-0.5">
            <NavItem to="/invoices" icon={<FileText size={16} />} label="Invoices" />
            <NavItem to="/expenses" icon={<Activity size={16} />} label="Expenses" />
            <NavItem to="/payments" icon={<CreditCard size={16} />} label="Payments" />
            <NavItem to="/pl-report" icon={<BarChart3 size={16} />} label="P&L Report" />
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-text-muted uppercase tracking-[2px] px-3 mb-3">Insights</div>
          <div className="flex flex-col gap-0.5">
            <NavItem to="/analytics" icon={<LineChart size={16} />} label="Analytics" />
          </div>
        </div>
      </div>
      
      <div className="px-3 py-4 border-t border-border shrink-0">
        <NavItem to="/settings" icon={<Settings size={16} />} label="Settings" />
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150
        ${isActive 
          ? 'bg-accent-blue/10 text-accent-blue' 
          : 'text-text-muted hover:text-text-primary hover:bg-bg-surface-2'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <span className={`transition-colors duration-150 ${isActive ? 'text-accent-blue' : ''}`}>
            {icon}
          </span>
          <span className="text-[13px]">{label}</span>
          {isActive && (
            <div className="ml-auto w-1 h-1 bg-accent-blue rounded-full" />
          )}
        </>
      )}
    </NavLink>
  );
};

export default React.memo(Sidebar);
