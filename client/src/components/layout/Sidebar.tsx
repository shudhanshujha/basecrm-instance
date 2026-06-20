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
  Truck,
  Repeat,
  Package,
  Activity,
  Zap,
  Cpu,
  CalendarDays
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="app-sidebar w-[240px] bg-bg-surface/40 border-r border-border h-full flex flex-col backdrop-blur-xl relative">
      {/* Decorative background element */}
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-accent-purple/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8">
        <div>
          <div className="text-[13px] font-black text-accent-blue uppercase tracking-[3px] px-2 mb-6 animate-pulse">Command Center</div>
          <div className="flex flex-col gap-1.5">
            <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
            <NavItem to="/deals" icon={<Zap size={18} />} label="Deals" />
            <NavItem to="/clients" icon={<Users size={18} />} label="Clients" />
            <NavItem to="/vendors" icon={<Truck size={18} />} label="Vendors" />
            <NavItem to="/assets" icon={<Package size={18} />} label="Assets" />
            <NavItem to="/tasks" icon={<CalendarDays size={18} />} label="Tasks" />
          </div>
        </div>

        <div>
          <div className="text-[13px] font-black text-accent-purple uppercase tracking-[3px] px-2 mb-6 border-l-2 border-accent-purple/50 pl-3">Treasury</div>
          <div className="flex flex-col gap-1.5">
            <NavItem to="/invoices" icon={<FileText size={18} />} label="Invoices" />
            <NavItem to="/expenses" icon={<Activity size={18} />} label="Expenses" />
            <NavItem to="/payments" icon={<CreditCard size={18} />} label="Payments" />
            <NavItem to="/pl-report" icon={<BarChart3 size={18} />} label="P&L Report" />
          </div>
        </div>

        <div>
          <div className="text-[13px] font-black text-success uppercase tracking-[3px] px-2 mb-6 border-l-2 border-success/50 pl-3">Intelligence</div>
          <div className="flex flex-col gap-1.5">
            <NavItem to="/analytics" icon={<LineChart size={18} />} label="Analytics" />
          </div>
        </div>
      </div>
      
      <div className="px-4 py-4 border-t border-border/40 shrink-0 bg-bg-surface/60">
        <NavItem to="/settings" icon={<Cpu size={18} />} label="Settings" />
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-bold transition-all duration-300 group relative
        ${isActive 
          ? 'bg-accent-blue/10 text-accent-blue shadow-[0_0_15px_rgba(0,242,255,0.1)] border border-accent-blue/20' 
          : 'text-text-muted hover:text-text-primary hover:bg-white/5 hover:translate-x-1'
        }
      `}
    >
      {({ isActive }) => (
        <>
          <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-accent-blue glow-cyan' : ''}`}>
            {icon}
          </span>
          <span className="tracking-wide uppercase text-[13px] font-black">{label}</span>
          {isActive && (
            <div className="absolute right-3 w-1.5 h-1.5 bg-accent-blue rounded-full shadow-[0_0_8px_#00f2ff] animate-neon" />
          )}
        </>
      )}
    </NavLink>
  );
};

export default Sidebar;
