export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  amount: number;
  date: string;
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
  labels: string[];
  data: number[];
}
