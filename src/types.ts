export type TransactionType = 'income' | 'expense';

export interface Month {
  id: string; // e.g. "2026-07"
  month: number; // 1-12
  year: number; // e.g. 2026
  openingBalance: number;
  closingBalance: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  monthId: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  isAuto?: boolean; // true if auto-generated EMI
}

export interface Debt {
  id: string;
  name: string;
  emi: number;
  remainingMonths: number;
  remainingAmount: number;
  active: boolean;
  createdAt: string;
}

export interface AppSettings {
  currencySymbol: string;
  currencyCode: string;
  currentMonthId: string;
}

export interface DatabaseExport {
  months: Month[];
  transactions: Transaction[];
  debts: Debt[];
  settings: AppSettings;
  version: string;
  exportedAt: string;
}
