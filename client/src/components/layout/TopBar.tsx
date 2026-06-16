import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Sun, Moon, Bell, CheckCircle2, AlertCircle, IndianRupee, LogOut, Layout, Orbit } from 'lucide-react';

const TopBar: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { notifications, fetchNotifications, markAsRead, clearAll } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000); // refresh every 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[60px] bg-bg-surface/30 border-b border-border flex items-center justify-between px-6 shrink-0 relative z-50 backdrop-blur-md">
      <div className="flex items-center gap-4 group cursor-default">
        <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-blue rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(112,0,255,0.3)] group-hover:rotate-12 transition-transform duration-500">
          <Orbit size={22} className="animate-spin-slow" />
        </div>
        <div>
          <div className="text-[14px] font-black text-white uppercase tracking-[2px] bg-gradient-to-r from-white to-text-muted bg-clip-text text-transparent">Business CRM</div>
          <div className="text-[8px] text-accent-blue font-black uppercase tracking-[4px] leading-none mt-1 animate-neon">System Active</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleTheme}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-accent-blue hover:border-accent-blue/50 transition-all duration-300 group"
        >
          {isDarkMode ? <Sun size={18} className="group-hover:rotate-45 transition-transform" /> : <Moon size={18} className="group-hover:-rotate-12 transition-transform" />}
        </button>

        <div className="relative" ref={notificationRef}>
          <div 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all duration-300 ${showNotifications ? 'bg-accent-blue/10 border-accent-blue text-accent-blue shadow-lg shadow-accent-blue/20' : 'bg-white/5 border-white/10 text-text-muted hover:text-white hover:border-white/20'}`}
          >
            <Bell size={18} className={unreadCount > 0 ? 'animate-bounce' : ''} />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-black rounded-full border-2 border-bg-surface flex items-center justify-center shadow-lg animate-pulse">
              {unreadCount}
            </span>
          )}

          {showNotifications && (
            <div className="absolute top-[50px] right-0 w-80 bg-bg-surface/90 border border-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in slide-in-from-top-4 backdrop-blur-2xl">
              <div className="p-4 border-b border-border/50 flex justify-between items-center bg-white/5">
                <span className="text-[11px] font-black text-white uppercase tracking-widest">System Alerts</span>
                <button onClick={clearAll} className="text-[10px] font-bold text-accent-blue hover:underline uppercase">Mute All</button>
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center text-text-muted text-[11px] uppercase font-bold tracking-widest italic opacity-50">Secure: No Issues Found</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-4 border-b border-border/30 hover:bg-white/5 transition-colors cursor-pointer flex gap-4 ${!n.isRead ? 'bg-accent-blue/5' : ''}`}
                    >
                      <div className="shrink-0 mt-1">
                        {n.type === 'DEAL_END' && <AlertCircle size={16} className="text-warning glow-yellow" />}
                        {n.type === 'INVOICE_DUE' && <AlertCircle size={16} className="text-danger glow-red" />}
                        {n.type === 'PAYMENT_RECEIVED' && <CheckCircle2 size={16} className="text-success glow-green" />}
                        {n.type === 'SYSTEM' && <Bell size={16} className="text-accent-blue glow-cyan" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] text-text-primary leading-snug font-bold">{n.message}</p>
                        <p className="text-[9px] text-text-muted mt-2 font-black uppercase tracking-tighter opacity-70">{new Date(n.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · Trace ID: {n.id.split('-')[0]}</p>
                      </div>
                      {!n.isRead && <div className="w-2 h-2 bg-accent-blue rounded-full mt-2 shadow-[0_0_8px_#00f2ff]" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-9 h-9 rounded-xl bg-danger/5 border border-danger/10 text-text-muted hover:text-danger hover:bg-danger/10 hover:border-danger/30 flex items-center justify-center transition-all duration-300"
            title="Secure Logout"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
