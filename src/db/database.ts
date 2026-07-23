import { AppSettings, Debt, Month, Transaction } from '../types';
import { calculateClosingBalance, calculateExpense, calculateIncome, getNextMonthId } from '../utils/calculations';

const STORAGE_KEY_MONTHS = 'expense_tracker_months_v1';
const STORAGE_KEY_TRANSACTIONS = 'expense_tracker_transactions_v1';
const STORAGE_KEY_DEBTS = 'expense_tracker_debts_v1';
const STORAGE_KEY_SETTINGS = 'expense_tracker_settings_v1';

const now = new Date();
const currentMonthNum = now.getMonth() + 1;
const currentMonthStr = currentMonthNum < 10 ? `0${currentMonthNum}` : `${currentMonthNum}`;
const defaultMonthId = `${now.getFullYear()}-${currentMonthStr}`;

export const DEFAULT_SETTINGS: AppSettings = {
  currencySymbol: '₹',
  currencyCode: 'INR',
  currentMonthId: defaultMonthId,
};

// Start blank with no pre-seeded records
const INITIAL_MONTHS: Month[] = [];
const INITIAL_DEBTS: Debt[] = [];
const INITIAL_TRANSACTIONS: Transaction[] = [];

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
