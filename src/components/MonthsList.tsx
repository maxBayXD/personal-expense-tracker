import React from 'react';
import { Month, Transaction } from '../types';
import {
  calculateExpense,
  calculateIncome,
  formatCurrency,
  formatMonthLabel,
} from '../utils/calculations';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';

interface MonthsListProps {
  months: Month[];
  transactions: Transaction[];
  currentMonthId: string;
  currencySymbol: string;
  setCurrentMonthId: (id: string) => void;
  onCreateNextMonth: () => void;
  onOpenQuickAdd: (type: 'income' | 'expense' | 'debt') => void;
}

export const MonthsList: React.FC<MonthsListProps> = ({
  months,
  transactions,
  currentMonthId,
  currencySymbol,
  setCurrentMonthId,
  onCreateNextMonth,
  onOpenQuickAdd,
}) => {
  // Sort months chronologically
  const sortedMonths = [...months].sort((a, b) => a.id.localeCompare(b.id));

  return (
    <div id="months-screen-container" className="space-y-6 pb-12">
      {/* Top Banner */}
      <div id="months-screen-banner" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white">Monthly Cash Flow Timeline</h2>
          </div>
          <p className="text-xs text-slate-400">
            Each month carries forward its closing balance to become the opening balance of the next month.
          </p>
        </div>

        <button
          id="months-create-next-btn"
          onClick={onCreateNextMonth}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Next Month</span>
        </button>
      </div>

      {/* Monthly Timeline Cards */}
      <div className="space-y-4">
        {sortedMonths.map((m, index) => {
          const monthTxs = transactions.filter((t) => t.monthId === m.id);
          const incomeTotal = calculateIncome(monthTxs);
          const expenseTotal = calculateExpense(monthTxs);
          const isSelected = m.id === currentMonthId;
          const nextMonth = sortedMonths[index + 1];

          return (
            <div key={m.id} className="relative">
              <div
                className={`bg-slate-900 border rounded-2xl p-5 transition-all shadow-md ${
                  isSelected
                    ? 'border-emerald-500/60 ring-2 ring-emerald-500/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header info */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white px-3 py-1 rounded-lg bg-slate-800 border border-slate-700">
                      {formatMonthLabel(m.id)}
                    </span>
                    {isSelected && (
                      <span className="text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Active View
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentMonthId(m.id)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                      }`}
                    >
                      {isSelected ? 'Currently Selected' : 'View Month'}
                    </button>
                  </div>
                </div>

                {/* Cash Flow Equation Display */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Opening */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block mb-1">Opening Balance</span>
                    <span className="text-base font-bold text-slate-200">
                      {formatCurrency(m.openingBalance, currencySymbol)}
                    </span>
                  </div>

                  {/* Income */}
                  <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-800/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-emerald-400 font-medium">Income (+)</span>
                      <ArrowDownCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span className="text-base font-bold text-emerald-300">
                      +{formatCurrency(incomeTotal, currencySymbol)}
                    </span>
                  </div>

                  {/* Expenses */}
                  <div className="bg-rose-950/20 p-3 rounded-xl border border-rose-800/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-rose-400 font-medium">Expenses (-)</span>
                      <ArrowUpCircle className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <span className="text-base font-bold text-rose-300">
                      -{formatCurrency(expenseTotal, currencySymbol)}
                    </span>
                  </div>

                  {/* Closing */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-700">
                    <span className="text-[11px] text-slate-400 block mb-1">Closing Balance (=)</span>
                    <span className="text-base font-extrabold text-white">
                      {formatCurrency(m.closingBalance, currencySymbol)}
                    </span>
                  </div>
                </div>

                {/* Quick Add buttons inside month */}
                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs text-slate-400">Add transactions to this month:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenQuickAdd('income')}
                        className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Income
                      </button>
                      <button
                        onClick={() => onOpenQuickAdd('expense')}
                        className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Expense
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Automatic Balance Carry-Forward Arrow connector */}
              {nextMonth && (
                <div className="flex items-center justify-center my-2 text-slate-500 text-xs font-mono gap-1">
                  <div className="h-4 w-0.5 bg-slate-800" />
                  <span className="bg-slate-900 border border-slate-800 px-3 py-0.5 rounded-full text-[10px] text-emerald-400 flex items-center gap-1">
                    Auto Carry Forward: Closing ({formatCurrency(m.closingBalance, currencySymbol)}) → Next Opening
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <div className="h-4 w-0.5 bg-slate-800" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
