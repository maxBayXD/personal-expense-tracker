import { Debt, Month, Transaction } from '../types';

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Calculates total income for a set of transactions
 */
export function calculateIncome(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

/**
 * Calculates total expenses for a set of transactions
 */
export function calculateExpense(transactions: Transaction[]): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

/**
 * Calculates closing balance: Opening Balance + Income - Expenses
 */
export function calculateClosingBalance(
  openingBalance: number,
  income: number,
  expense: number
): number {
  return (Number(openingBalance) || 0) + (Number(income) || 0) - (Number(expense) || 0);
}

/**
 * Formats amount with currency symbol
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  const rounded = Math.round(amount * 100) / 100;
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(rounded);
  
  return `${symbol}${formattedNumber}`;
}

/**
 * Gets month name from month number (1-12)
 */
export function getMonthName(monthNumber: number): string {
  return MONTH_NAMES[monthNumber - 1] || `Month ${monthNumber}`;
}

/**
 * Formats month ID into human readable label (e.g., "2026-07" => "July 2026")
 */
export function formatMonthLabel(monthId: string): string {
  const parts = monthId.split('-');
  if (parts.length === 2) {
    const year = parts[0];
    const monthNum = parseInt(parts[1], 10);
    return `${getMonthName(monthNum)} ${year}`;
  }
  return monthId;
}

/**
 * Computes total outstanding debt across all active debts
 */
export function calculateTotalDebt(debts: Debt[]): number {
  return debts
    .filter((d) => d.active && d.remainingMonths > 0)
    .reduce((sum, d) => sum + (Number(d.remainingAmount) || 0), 0);
}

/**
 * Computes total monthly EMI obligations across active debts
 */
export function calculateTotalMonthlyEMI(debts: Debt[]): number {
  return debts
    .filter((d) => d.active && d.remainingMonths > 0)
    .reduce((sum, d) => sum + (Number(d.emi) || 0), 0);
}

/**
 * Determines next month string ID given a year and month
 */
export function getNextMonthId(year: number, month: number): { nextYear: number; nextMonth: number; nextMonthId: string } {
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }
  const monthStr = nextMonth < 10 ? `0${nextMonth}` : `${nextMonth}`;
  return {
    nextYear,
    nextMonth,
    nextMonthId: `${nextYear}-${monthStr}`,
  };
}
