import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Sun, Moon, Bell, CheckCircle2, AlertCircle, IndianRupee, LogOut } from 'lucide-react';

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
    <div className="h-[52px] bg-bg-surface border-b border-border flex items-center justify-between px-4 shrink-0 relative z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-accent-orange rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-accent-orange/20">
          DV
        </div>
        <div>
          <div className="text-[13px] font-semibold text-text-primary">DrishtiVision CRM</div>
          <div className="text-[9px] text-text-muted uppercase tracking-wider leading-none">Advertising Management</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notificationRef}>
          <div 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-8 h-8 rounded-lg hover:bg-bg-surface-2 flex items-center justify-center cursor-pointer transition-colors ${showNotifications ? 'bg-bg-surface-2 text-accent-orange' : 'text-text-muted hover:text-text-primary'}`}
          >
            <Bell size={18} />
          </div>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-accent-orange text-white text-[9px] font-bold rounded-full border-2 border-bg-surface flex items-center justify-center">
              {unreadCount}
            </span>
          )}

          {showNotifications && (
            <div className="absolute top-[44px] right-0 w-80 bg-bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-border flex justify-between items-center bg-bg-surface-2">
                <span className="text-[11px] font-bold text-text-primary uppercase tracking-wider">Notifications</span>
                <button onClick={clearAll} className="text-[10px] text-accent-blue hover:underline">Clear All</button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-text-muted text-[11px]">No notifications yet</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`p-3 border-b border-border hover:bg-bg-surface-2 transition-colors cursor-pointer flex gap-3 ${!n.isRead ? 'bg-accent-orange/5' : ''}`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {n.type === 'CAMPAIGN_END' && <AlertCircle size={14} className="text-warning" />}
                        {n.type === 'INVOICE_DUE' && <AlertCircle size={14} className="text-danger" />}
                        {n.type === 'PAYMENT_RECEIVED' && <CheckCircle2 size={14} className="text-success" />}
                        {n.type === 'SYSTEM' && <Bell size={14} className="text-accent-blue" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-text-primary leading-tight font-medium">{n.message}</p>
                        <p className="text-[9px] text-text-muted mt-1">{new Date(n.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      {!n.isRead && <div className="w-1.5 h-1.5 bg-accent-orange rounded-full mt-2"></div>}
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
            className="w-8 h-8 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger flex items-center justify-center transition-colors border border-transparent hover:border-danger/20"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
