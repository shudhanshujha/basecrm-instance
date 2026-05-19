import { create } from 'zustand';
import api from '../lib/axios';

export interface Notification {
  id: string;
  type: 'CAMPAIGN_END' | 'INVOICE_DUE' | 'PAYMENT_RECEIVED' | 'SYSTEM';
  message: string;
  date: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      const apiNotifs = res.data;
      
      // Preserve read state from the current store based on IDs
      const current = get().notifications;
      const readIds = current.filter(n => n.isRead).map(n => n.id);
      
      const merged = apiNotifs.map((n: Notification) => ({
        ...n,
        isRead: readIds.includes(n.id)
      }));
      
      set({ notifications: merged });
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  },
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  clearAll: () => set((state) => ({ 
    notifications: state.notifications.map(n => ({ ...n, isRead: true })) 
  })),
}));
