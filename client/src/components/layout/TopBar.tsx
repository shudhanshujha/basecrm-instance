import React, { useState, useEffect, useRef } from 'react';
import { useNotificationStore } from '../../store/useNotificationStore';
import { Bell, CheckCircle2, AlertCircle, LogOut, Clock } from 'lucide-react';

const TopBar: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
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
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchNotifications]);

  return (
    <div className="app-topbar h-[60px] bg-bg-surface border-b border-border flex items-center justify-between px-6 shrink-0 relative z-50">
      <div className="flex items-center gap-3">
        <img src="/flowcrmm.png" alt="FlowCRM" className="w-8 h-8 rounded-xl object-contain" />
        <div>
          <div className="text-[15px] font-semibold text-text-primary tracking-tight">FlowCRM</div>
          <div className="text-[11px] text-text-muted font-normal leading-none mt-0.5">Business Management</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative" ref={notificationRef}>
          <div 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all duration-150 ${showNotifications ? 'bg-accent-blue/10 border-accent-blue/40 text-accent-blue' : 'bg-transparent border-border text-text-muted hover:text-text-primary hover:border-accent-blue/20'}`}
          >
            <Bell size={15} />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-white text-[10px] font-semibold rounded-full border border-bg-surface flex items-center justify-center">
              {unreadCount}
            </span>
          )}

          {showNotifications && (
            <div className="absolute top-[46px] right-0 w-80 bg-bg-surface border border-border rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex justify-between items-center">
                <span className="text-[13px] font-semibold text-text-primary">Notifications</span>
                <button onClick={clearAll} className="text-[12px] text-text-muted hover:text-text-primary transition-colors">Clear all</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-text-muted text-[13px]">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`px-4 py-3 border-b border-border/50 hover:bg-bg-surface-2 transition-colors cursor-pointer flex gap-3 ${!n.isRead ? 'bg-accent-blue/5' : ''}`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {n.type === 'DEAL_END' && <AlertCircle size={14} className="text-warning" />}
                        {n.type === 'INVOICE_DUE' && <AlertCircle size={14} className="text-danger" />}
                        {n.type === 'PAYMENT_RECEIVED' && <CheckCircle2 size={14} className="text-success" />}
                        {n.type === 'SYSTEM' && <Bell size={14} className="text-accent-blue" />}
                        {n.type === 'TASK_REMINDER' && <Clock size={14} className="text-accent-purple" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] text-text-primary leading-snug">{n.message}</p>
                        <p className="text-[11px] text-text-muted mt-1">{new Date(n.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                      </div>
                      {!n.isRead && <div className="w-1.5 h-1.5 bg-accent-blue rounded-full mt-1.5 shrink-0" />}
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
            className="w-8 h-8 rounded-lg bg-transparent border border-border text-text-muted hover:text-danger hover:border-danger/30 hover:bg-danger/5 flex items-center justify-center transition-all duration-150"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
