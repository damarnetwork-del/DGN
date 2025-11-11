
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum PaymentMethod {
    TRANSFER = 'Transfer',
    CASH = 'Tunai',
}

// FIX: Add ExpenseCategory enum as it was missing and causing an error in ExpenseChart.tsx.
export enum ExpenseCategory {
  OPERATIONAL = 'Operasional',
  SALARY = 'Gaji',
  RENT = 'Sewa',
  UTILITIES = 'Listrik & Internet',
  OTHER = 'Lain-lain',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO 8601 format
  paymentMethod: PaymentMethod;
  // FIX: Add optional category field to Transaction interface to support expense categorization.
  category?: ExpenseCategory;
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

export type View = 'dashboard' | 'transactions' | 'customers';