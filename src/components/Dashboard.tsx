import React, { useState } from 'react';
import { Debt, Month, Transaction } from '../types';
import {
  calculateExpense,
  calculateIncome,
  calculateTotalDebt,
  calculateTotalMonthlyEMI,
  formatCurrency,
  formatMonthLabel,
} from '../utils/calculations';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Receipt,
  CheckCircle2,
} from 'lucide-react';

interface DashboardProps {
  currentMonth: Month | null;
  transactions: Transaction[];
  debts: Debt[];
  currencySymbol: string;
  onOpenQuickAdd: (type: 'income' | 'expense' | 'debt') => void;
  onCreateNextMonth: () => void;
  onDeleteTransaction: (id: string) => void;
  onNavigateToMonths: () => void;
  onNavigateToDebts: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentMonth,
  transactions,
  debts,
  currencySymbol,
  onOpenQuickAdd,
  onCreateNextMonth,
  onDeleteTransaction,
  onNavigateToMonths,
  onNavigateToDebts,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  if (!currentMonth) {
    return (
      <div id="dashboard-empty-state" className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 my-6">
        <Receipt className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-200">No Months Created Yet</h3>
        <p className="text-sm text-slate-400 mb-4 max-w-md mx-auto">
          Start by creating your first cash flow month to begin tracking income, expenses, and automated debt EMIs.
        </p>
        <button
          id="dashboard-start-first-month-btn"
          onClick={onCreateNextMonth}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Start First Month
        </button>
      </div>
    );
  }

  // Calculate current month's financials
  const totalIncome = calculateIncome(transactions);
  const totalExpense = calculateExpense(transactions);
  const closingBalance = currentMonth.closingBalance;

  // Active debts stats
  const activeDebts = debts.filter((d) => d.active && d.remainingMonths > 0);
  const totalOutstandingDebt = calculateTotalDebt(debts);
  const totalMonthlyEmi = calculateTotalMonthlyEMI(debts);

  // Filter transactions
  const filteredTxs = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  return (
    <div id="dashboard-container" className="space-y-6 pb-12">
      {/* 1. Primary Cash Flow Header Card */}
      <div id="dashboard-cashflow-card" className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              Current Cash Flow
            </span>
            <h2 className="text-2xl font-bold text-white mt-2">
              {formatMonthLabel(currentMonth.id)}
            </h2>
          </div>

          <button
            id="dashboard-create-next-month-btn"
            onClick={onCreateNextMonth}
            className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Create Next Month</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Closing Balance Showcase */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Projected Closing Balance
            </span>
            <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
              Excel Formula: Opening + Income - Expense
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {formatCurrency(closingBalance, currencySymbol)}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              → Next Month's Opening Balance
            </span>
          </div>
        </div>

        {/* Formula Grid: Opening + Income - Expense */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Opening Balance */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <span className="text-xs font-medium text-slate-400 block mb-1">Opening Balance</span>
            <span className="text-lg font-bold text-slate-100">
              {formatCurrency(currentMonth.openingBalance, currencySymbol)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Carried forward from previous month</span>
          </div>

          {/* Total Income */}
          <div className="bg-emerald-950/20 border border-emerald-800/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-emerald-400">Total Income</span>
              <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg font-bold text-emerald-300">
              +{formatCurrency(totalIncome, currencySymbol)}
            </span>
            <span className="text-[11px] text-emerald-500/80 block mt-1">
              {transactions.filter((t) => t.type === 'income').length} credit entry(ies)
            </span>
          </div>

          {/* Total Expenses */}
          <div className="bg-rose-950/20 border border-rose-800/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-rose-400">Total Expenses</span>
              <ArrowUpCircle className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-lg font-bold text-rose-300">
              -{formatCurrency(totalExpense, currencySymbol)}
            </span>
            <span className="text-[11px] text-rose-400/80 block mt-1">
              Includes auto EMI deductions
            </span>
          </div>
        </div>
      </div>

      {/* 2. Outstanding Debt & Active EMIs Banner */}
      <div id="dashboard-debt-banner" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Outstanding Debt Tracker</h3>
              <p className="text-xs text-slate-400">Automated monthly EMI deduction engine</p>
            </div>
          </div>

          <button
            id="dashboard-manage-debts-btn"
            onClick={onNavigateToDebts}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 transition-colors"
          >
            <span>Manage Debts ({activeDebts.length} Active)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">Total Outstanding Amount</span>
            <span className="text-xl font-bold text-amber-300">
              {formatCurrency(totalOutstandingDebt, currencySymbol)}
            </span>
          </div>

          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-0.5">Monthly Auto EMI Commitment</span>
            <span className="text-xl font-bold text-rose-300">
              {formatCurrency(totalMonthlyEmi, currencySymbol)}
              <span className="text-xs font-normal text-slate-400 ml-1">/ month</span>
            </span>
          </div>
        </div>

        {/* Active Debts Mini Pill List */}
        {activeDebts.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400 mr-1 font-medium">Auto-Deducted EMIs:</span>
            {activeDebts.map((d) => (
              <span
                key={d.id}
                className="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700/80 text-slate-200 text-xs px-2.5 py-1 rounded-lg"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span className="font-medium">{d.name}</span>
                <span className="text-rose-400 font-semibold">{formatCurrency(d.emi, currencySymbol)}</span>
                <span className="text-[10px] text-slate-400">({d.remainingMonths} mo rem)</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. Quick Action Buttons */}
      <div id="dashboard-quick-actions" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          id="quick-add-income-btn"
          onClick={() => onOpenQuickAdd('income')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-xs shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" /> Add Income
        </button>

        <button
          id="quick-add-expense-btn"
          onClick={() => onOpenQuickAdd('expense')}
          className="bg-rose-500 hover:bg-rose-600 text-white p-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-xs shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </button>

        <button
          id="quick-add-debt-btn"
          onClick={() => onOpenQuickAdd('debt')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-md transition-all active:scale-98"
        >
          <Plus className="w-4 h-4" /> Add Debt Loan
        </button>

        <button
          id="quick-new-month-btn"
          onClick={onCreateNextMonth}
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 p-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold text-xs transition-all active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" /> Start Next Month
        </button>
      </div>

      {/* 4. Transactions Ledger */}
      <div id="dashboard-transactions-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Month Transactions ({filteredTxs.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="filter-all-btn"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              id="filter-income-btn"
              onClick={() => setFilterType('income')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'income' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
            <button
              id="filter-expense-btn"
              onClick={() => setFilterType('expense')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterType === 'expense' ? 'bg-rose-500/20 text-rose-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>

        {/* Transactions List */}
        {filteredTxs.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No transactions found for this month filter. Click above to add an entry.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTxs.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3.5 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'income'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? (
                      <ArrowDownCircle className="w-5 h-5" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-100">
                        {tx.category || (tx.type === 'income' ? 'Income' : 'Expense')}
                      </span>
                      {tx.isAuto && (
                        <span className="text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md">
                          Auto EMI
                        </span>
                      )}
                    </div>
                    {tx.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{tx.description}</p>
                    )}
                    <span className="text-[10px] text-slate-400 block mt-0.5">{tx.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-bold ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount, currencySymbol)}
                  </span>

                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="opacity-60 group-hover:opacity-100 p-1.5 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded-lg transition-all"
                    title="Delete Transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
