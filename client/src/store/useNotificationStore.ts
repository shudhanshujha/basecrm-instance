import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'CAMPAIGN_END' | 'INVOICE_DUE' | 'PAYMENT_RECEIVED' | 'SYSTEM';
  message: string;
  date: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [
    { id: '1', type: 'CAMPAIGN_END', message: 'Campaign "Roads Q2" ending in 3 days for 5 sites', date: new Date().toISOString(), isRead: false },
    { id: '2', type: 'INVOICE_DUE', message: 'Invoice #DV-0042 is due tomorrow (Reliance)', date: new Date().toISOString(), isRead: false },
    { id: '3', type: 'PAYMENT_RECEIVED', message: 'Payment received: ₹1.8L from Axis Bank', date: new Date().toISOString(), isRead: false },
  ],
  addNotification: (n) => set((state) => ({
    notifications: [{ 
      ...n, 
      id: Math.random().toString(36).substr(2, 9), 
      date: new Date().toISOString(), 
      isRead: false 
    }, ...state.notifications]
  })),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  clearAll: () => set({ notifications: [] }),
}));
