export interface Vendor {
  id: string;
  vendorName: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  startDate: string;
  endDate: string;
  value: number;
  status: string;
}

export interface Asset {
  id: string;
  name: string;
  category: string;
  description: string;
  status: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  totalAmount: number;
  invoiceDate: string;
  dueDate: string;
  status: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface AnalyticsData {
  revenue: number;
  expenses: number;
  profit: number;
}

export interface Task {
  id: string;
  orgId: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  category?: string;
  reminderAt?: string;
  dealId?: string;
  clientId?: string;
  invoiceId?: string;
  assignedTo?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
