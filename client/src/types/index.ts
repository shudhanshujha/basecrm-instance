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
