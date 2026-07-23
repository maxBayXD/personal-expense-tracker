import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppSettings, Debt, Month, Transaction, TransactionType } from '../types';
import { LocalDatabase } from '../db/database';
import {
  calculateClosingBalance,
  calculateExpense,
  calculateIncome,
  getNextMonthId,
} from '../utils/calculations';

export function useDatabase() {
  const [months, setMonths] = useState<Month[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    currencySymbol: '₹',
    currencyCode: 'INR',
    currentMonthId: '2026-08',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load database on mount
  useEffect(() => {
    const loadedMonths = LocalDatabase.loadMonths();
    const loadedTransactions = LocalDatabase.loadTransactions();
    const loadedDebts = LocalDatabase.loadDebts();
    const loadedSettings = LocalDatabase.loadSettings();

    setMonths(loadedMonths);
    setTransactions(loadedTransactions);
    setDebts(loadedDebts);
    setSettings(loadedSettings);
    setIsLoaded(true);
  }, []);

  // Sync back to LocalDatabase whenever state updates
  useEffect(() => {
    if (!isLoaded) return;
    LocalDatabase.saveMonths(months);
  }, [months, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    LocalDatabase.saveTransactions(transactions);
  }, [transactions, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    LocalDatabase.saveDebts(debts);
  }, [debts, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    LocalDatabase.saveSettings(settings);
  }, [settings, isLoaded]);

  // Recalculate month closing balance whenever transactions or opening balance change
  const refreshMonthBalances = useCallback((updatedMonths: Month[], updatedTransactions: Transaction[]): Month[] => {
    return updatedMonths.map((m) => {
      const monthTxs = updatedTransactions.filter((t) => t.monthId === m.id);
      const inc = calculateIncome(monthTxs);
      const exp = calculateExpense(monthTxs);
      const closing = calculateClosingBalance(m.openingBalance, inc, exp);
      return {
        ...m,
        closingBalance: closing,
      };
    });
  }, []);

  // Currently active selected month object
  const currentMonth = useMemo(() => {
    const found = months.find((m) => m.id === settings.currentMonthId);
    if (found) return found;
    // Fallback to latest month or first month
    return months[months.length - 1] || null;
  }, [months, settings.currentMonthId]);

  // Current month's transactions
  const currentTransactions = useMemo(() => {
    if (!currentMonth) return [];
    return transactions.filter((t) => t.monthId === currentMonth.id);
  }, [transactions, currentMonth]);

  // Switch current active month view
  const setCurrentMonthId = useCallback((monthId: string) => {
    setSettings((prev) => ({ ...prev, currentMonthId: monthId }));
  }, []);

  // Add Income or Expense transaction
  const addTransaction = useCallback(
    ({
      monthId,
      type,
      category,
      description,
      amount,
      date,
      isAuto = false,
    }: {
      monthId: string;
      type: TransactionType;
      category: string;
      description: string;
      amount: number;
      date: string;
      isAuto?: boolean;
    }) => {
      const newTx: Transaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        monthId,
        type,
        category: category || (type === 'income' ? 'General Income' : 'General Expense'),
        description,
        amount: Number(amount),
        date: date || new Date().toISOString().split('T')[0],
        isAuto,
      };

      setTransactions((prevTxs) => {
        const nextTxs = [newTx, ...prevTxs];
        setMonths((prevMonths) => refreshMonthBalances(prevMonths, nextTxs));
        return nextTxs;
      });

      return newTx;
    },
    [refreshMonthBalances]
  );

  const addIncome = useCallback(
    (params: { monthId: string; category: string; description: string; amount: number; date: string }) => {
      return addTransaction({ ...params, type: 'income' });
    },
    [addTransaction]
  );

  const addExpense = useCallback(
    (params: { monthId: string; category: string; description: string; amount: number; date: string }) => {
      return addTransaction({ ...params, type: 'expense' });
    },
    [addTransaction]
  );

  // Delete transaction
  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prevTxs) => {
        const nextTxs = prevTxs.filter((t) => t.id !== id);
        setMonths((prevMonths) => refreshMonthBalances(prevMonths, nextTxs));
        return nextTxs;
      });
    },
    [refreshMonthBalances]
  );

  // Add a new debt
  const addDebt = useCallback(
    ({ name, emi, remainingMonths, remainingAmount }: { name: string; emi: number; remainingMonths: number; remainingAmount: number }) => {
      const newDebt: Debt = {
        id: `debt-${Date.now()}`,
        name,
        emi: Number(emi),
        remainingMonths: Number(remainingMonths),
        remainingAmount: Number(remainingAmount),
        active: Number(remainingMonths) > 0 && Number(remainingAmount) > 0,
        createdAt: new Date().toISOString(),
      };

      setDebts((prev) => [newDebt, ...prev]);
      return newDebt;
    },
    []
  );

  // Update existing debt
  const updateDebt = useCallback((updatedDebt: Debt) => {
    setDebts((prev) => prev.map((d) => (d.id === updatedDebt.id ? updatedDebt : d)));
  }, []);

  // Delete debt
  const deleteDebt = useCallback((debtId: string) => {
    setDebts((prev) => prev.filter((d) => d.id !== debtId));
  }, []);

  /**
   * Automatic Month Carry Forward + Automatic EMI Generation:
   * Creates the next sequential month automatically.
   * Works both when starting from scratch (months.length === 0) and when carrying forward from existing months.
   */
  const createNextMonth = useCallback(
    (initialOpeningBalance?: number, customMonthId?: string) => {
      let nextYear: number;
      let nextMonth: number;
      let nextMonthId: string;
      let openingBalance = 0;

      if (months.length === 0) {
        if (customMonthId) {
          const parts = customMonthId.split('-');
          nextYear = parseInt(parts[0], 10);
          nextMonth = parseInt(parts[1], 10);
          nextMonthId = customMonthId;
        } else {
          const now = new Date();
          nextYear = now.getFullYear();
          nextMonth = now.getMonth() + 1;
          const monthStr = nextMonth < 10 ? `0${nextMonth}` : `${nextMonth}`;
          nextMonthId = `${nextYear}-${monthStr}`;
        }
        openingBalance = initialOpeningBalance !== undefined ? Number(initialOpeningBalance) : 0;
      } else {
        // Find the chronologically latest month
        const sortedMonths = [...months].sort((a, b) => a.id.localeCompare(b.id));
        const lastMonth = sortedMonths[sortedMonths.length - 1];

        // Ensure last month closing balance is up to date
        const lastMonthTxs = transactions.filter((t) => t.monthId === lastMonth.id);
        const inc = calculateIncome(lastMonthTxs);
        const exp = calculateExpense(lastMonthTxs);
        const finalClosingBalance = calculateClosingBalance(lastMonth.openingBalance, inc, exp);

        openingBalance = initialOpeningBalance !== undefined ? Number(initialOpeningBalance) : finalClosingBalance;

        if (customMonthId) {
          const parts = customMonthId.split('-');
          nextYear = parseInt(parts[0], 10);
          nextMonth = parseInt(parts[1], 10);
          nextMonthId = customMonthId;
        } else {
          // Compute next month ID (e.g., 2026-08 -> 2026-09)
          const next = getNextMonthId(lastMonth.year, lastMonth.month);
          nextYear = next.nextYear;
          nextMonth = next.nextMonth;
          nextMonthId = next.nextMonthId;
        }
      }

      // Check if month already exists
      if (months.some((m) => m.id === nextMonthId)) {
        setCurrentMonthId(nextMonthId);
        return nextMonthId;
      }

      const newMonthDateStr = `${nextMonthId}-01`;

      // 1. Create New Month record
      const newMonthRecord: Month = {
        id: nextMonthId,
        month: nextMonth,
        year: nextYear,
        openingBalance,
        closingBalance: openingBalance,
        createdAt: new Date().toISOString(),
      };

      // 2. Generate Auto-EMI Transactions & Update Debts
      const autoEmiTransactions: Transaction[] = [];
      const updatedDebtsList: Debt[] = [];

      debts.forEach((debt) => {
        if (debt.active && debt.remainingMonths > 0) {
          // Auto EMI Expense transaction
          autoEmiTransactions.push({
            id: `tx-auto-${debt.id}-${nextMonthId}`,
            monthId: nextMonthId,
            type: 'expense',
            category: 'Debt EMI',
            description: `${debt.name} EMI`,
            amount: debt.emi,
            date: newMonthDateStr,
            isAuto: true,
          });

          // Deduct remaining debt stats
          const nextMonths = Math.max(0, debt.remainingMonths - 1);
          const nextAmount = Math.max(0, debt.remainingAmount - debt.emi);

          updatedDebtsList.push({
            ...debt,
            remainingMonths: nextMonths,
            remainingAmount: nextAmount,
            active: nextMonths > 0 && nextAmount > 0,
          });
        } else {
          updatedDebtsList.push(debt);
        }
      });

      // Calculate closing balance of new month with auto EMIs applied
      const autoExpensesTotal = calculateExpense(autoEmiTransactions);
      newMonthRecord.closingBalance = calculateClosingBalance(newMonthRecord.openingBalance, 0, autoExpensesTotal);

      // Update state
      setMonths((prev) => [...prev, newMonthRecord]);
      setTransactions((prev) => [...autoEmiTransactions, ...prev]);
      setDebts(updatedDebtsList);
      setSettings((prev) => ({ ...prev, currentMonthId: nextMonthId }));

      return nextMonthId;
    },
    [months, transactions, debts, setCurrentMonthId]
  );

  // Update opening balance of a month manually if needed
  const updateOpeningBalance = useCallback(
    (monthId: string, newOpeningBalance: number) => {
      setMonths((prevMonths) => {
        const updated = prevMonths.map((m) => {
          if (m.id === monthId) {
            const monthTxs = transactions.filter((t) => t.monthId === monthId);
            const inc = calculateIncome(monthTxs);
            const exp = calculateExpense(monthTxs);
            return {
              ...m,
              openingBalance: newOpeningBalance,
              closingBalance: calculateClosingBalance(newOpeningBalance, inc, exp),
            };
          }
          return m;
        });
        return updated;
      });
    },
    [transactions]
  );

  // Update Settings
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // Reset database to initial sample data
  const seedSampleData = useCallback(() => {
    const seeded = LocalDatabase.seedDefaults();
    setMonths(seeded.months);
    setTransactions(seeded.transactions);
    setDebts(seeded.debts);
    setSettings(seeded.settings);
  }, []);

  // Clear database completely
  const clearDatabase = useCallback(() => {
    LocalDatabase.resetData();
    setMonths([]);
    setTransactions([]);
    setDebts([]);
    setSettings({
      currencySymbol: '₹',
      currencyCode: 'INR',
      currentMonthId: '',
    });
  }, []);

  // Export database JSON
  const exportJSON = useCallback(() => {
    const data = {
      months,
      transactions,
      debts,
      settings,
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Expense_Tracker_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [months, transactions, debts, settings]);

  // Import database JSON
  const importJSON = useCallback((jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed.months) && Array.isArray(parsed.transactions) && Array.isArray(parsed.debts)) {
        setMonths(parsed.months);
        setTransactions(parsed.transactions);
        setDebts(parsed.debts);
        if (parsed.settings) setSettings(parsed.settings);
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  }, []);

  return {
    isLoaded,
    months,
    transactions,
    debts,
    settings,
    currentMonth,
    currentTransactions,
    setCurrentMonthId,
    addIncome,
    addExpense,
    addTransaction,
    deleteTransaction,
    addDebt,
    updateDebt,
    deleteDebt,
    createNextMonth,
    updateOpeningBalance,
    updateSettings,
    seedSampleData,
    clearDatabase,
    exportJSON,
    importJSON,
  };
}
