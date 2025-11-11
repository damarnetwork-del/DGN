export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum ExpenseCategory {
  CUSTOMER_DUES = 'Iuran Pelanggan',
  ISP_DUES = 'Iuran Isp',
  MAINTENANCE = 'Mantenance',
  SALARY = 'Gaji',
}

export enum PaymentMethod {
    TRANSFER = 'Transfer',
    CASH = 'Tunai',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: ExpenseCategory | null;
  date: string; // ISO 8601 format
  paymentMethod: PaymentMethod;
}

export enum SubscriptionCategory {
  PPPOE = 'PPPoE',
  STATIC = 'Static',
  HOSTPOT = 'Hostpot',
  VOUCHER = 'Mitra Voucher',
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  subscriptionCategory: SubscriptionCategory;
  amount: number;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  id: string;
  username: string;
  password?: string; // Password is optional for security reasons when passing data around
  role: UserRole;
}

export type View = 'dashboard' | 'transactions' | 'customers' | 'settings';