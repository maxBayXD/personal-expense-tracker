import { AppSettings, Debt, Month, Transaction } from '../types';
import { calculateClosingBalance, calculateExpense, calculateIncome, getNextMonthId } from '../utils/calculations';

const STORAGE_KEY_MONTHS = 'expense_tracker_months_v1';
const STORAGE_KEY_TRANSACTIONS = 'expense_tracker_transactions_v1';
const STORAGE_KEY_DEBTS = 'expense_tracker_debts_v1';
const STORAGE_KEY_SETTINGS = 'expense_tracker_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  currencySymbol: '₹',
  currencyCode: 'INR',
  currentMonthId: '2026-08',
};

// Default seed data based on user specification
const INITIAL_MONTHS: Month[] = [
  {
    id: '2026-07',
    month: 7,
    year: 2026,
    openingBalance: 5000,
    closingBalance: 17000,
    createdAt: new Date('2026-07-01').toISOString(),
  },
  {
    id: '2026-08',
    month: 8,
    year: 2026,
    openingBalance: 17000, // Carried forward from July closing balance
    closingBalance: 17000, // Dynamic before transactions
    createdAt: new Date('2026-08-01').toISOString(),
  },
];

const INITIAL_DEBTS: Debt[] = [
  {
    id: 'debt-1',
    name: 'Personal Loan',
    emi: 1820,
    remainingMonths: 4,
    remainingAmount: 7280,
    active: true,
    createdAt: new Date('2026-07-01').toISOString(),
  },
  {
    id: 'debt-2',
    name: 'Bike Loan',
    emi: 2450,
    remainingMonths: 10,
    remainingAmount: 24500,
    active: true,
    createdAt: new Date('2026-07-01').toISOString(),
  },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  // July Income & Expenses
  {
    id: 'tx-jul-1',
    monthId: '2026-07',
    type: 'income',
    category: 'Salary',
    description: 'Monthly Salary Credit',
    amount: 40000,
    date: '2026-07-01',
    isAuto: false,
  },
  {
    id: 'tx-jul-2',
    monthId: '2026-07',
    type: 'expense',
    category: 'House Rent',
    description: 'Apartment Rent',
    amount: 15000,
    date: '2026-07-05',
    isAuto: false,
  },
  {
    id: 'tx-jul-3',
    monthId: '2026-07',
    type: 'expense',
    category: 'Groceries',
    description: 'Monthly Supermarket',
    amount: 8730,
    date: '2026-07-10',
    isAuto: false,
  },
  {
    id: 'tx-jul-4',
    monthId: '2026-07',
    type: 'expense',
    category: 'Debt EMI',
    description: 'Personal Loan EMI',
    amount: 1820,
    date: '2026-07-12',
    isAuto: true,
  },
  {
    id: 'tx-jul-5',
    monthId: '2026-07',
    type: 'expense',
    category: 'Debt EMI',
    description: 'Bike Loan EMI',
    amount: 2450,
    date: '2026-07-12',
    isAuto: true,
  },
  // August Auto EMIs (Generated on month creation)
  {
    id: 'tx-aug-1',
    monthId: '2026-08',
    type: 'expense',
    category: 'Debt EMI',
    description: 'Personal Loan EMI',
    amount: 1820,
    date: '2026-08-01',
    isAuto: true,
  },
  {
    id: 'tx-aug-2',
    monthId: '2026-08',
    type: 'expense',
    category: 'Debt EMI',
    description: 'Bike Loan EMI',
    amount: 2450,
    date: '2026-08-01',
    isAuto: true,
  },
  {
    id: 'tx-aug-3',
    monthId: '2026-08',
    type: 'income',
    category: 'Salary',
    description: 'Monthly Salary Credit',
    amount: 45000,
    date: '2026-08-01',
    isAuto: false,
  },
  {
    id: 'tx-aug-4',
    monthId: '2026-08',
    type: 'expense',
    category: 'House Rent',
    description: 'Apartment Rent',
    amount: 15000,
    date: '2026-08-03',
    isAuto: false,
  },
];

export class LocalDatabase {
  public static loadMonths(): Month[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MONTHS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading months', e);
    }
    this.saveMonths(INITIAL_MONTHS);
    return INITIAL_MONTHS;
  }

  public static saveMonths(months: Month[]): void {
    localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(months));
  }

  public static loadTransactions(): Transaction[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TRANSACTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading transactions', e);
    }
    this.saveTransactions(INITIAL_TRANSACTIONS);
    return INITIAL_TRANSACTIONS;
  }

  public static saveTransactions(transactions: Transaction[]): void {
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  }

  public static loadDebts(): Debt[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEBTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading debts', e);
    }
    this.saveDebts(INITIAL_DEBTS);
    return INITIAL_DEBTS;
  }

  public static saveDebts(debts: Debt[]): void {
    localStorage.setItem(STORAGE_KEY_DEBTS, JSON.stringify(debts));
  }

  public static loadSettings(): AppSettings {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading settings', e);
    }
    this.saveSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  public static saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }

  public static seedDefaults(): {
    months: Month[];
    transactions: Transaction[];
    debts: Debt[];
    settings: AppSettings;
  } {
    this.saveMonths(INITIAL_MONTHS);
    this.saveTransactions(INITIAL_TRANSACTIONS);
    this.saveDebts(INITIAL_DEBTS);
    this.saveSettings(DEFAULT_SETTINGS);
    return {
      months: INITIAL_MONTHS,
      transactions: INITIAL_TRANSACTIONS,
      debts: INITIAL_DEBTS,
      settings: DEFAULT_SETTINGS,
    };
  }

  public static resetData(): void {
    localStorage.removeItem(STORAGE_KEY_MONTHS);
    localStorage.removeItem(STORAGE_KEY_TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEY_DEBTS);
    localStorage.removeItem(STORAGE_KEY_SETTINGS);
  }
}
