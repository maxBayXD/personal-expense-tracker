import React from 'react';
import {
  HelpCircle,
  Sparkles,
  Calendar,
  Wallet,
  CreditCard,
  Plus,
  ArrowRight,
  ShieldCheck,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

interface UserGuideProps {
  onNavigateToDashboard: () => void;
  onNavigateToMonths: () => void;
  onNavigateToDebts: () => void;
  onCreateFirstMonth: () => void;
}

export const UserGuide: React.FC<UserGuideProps> = ({
  onNavigateToDashboard,
  onNavigateToMonths,
  onNavigateToDebts,
  onCreateFirstMonth,
}) => {
  return (
    <div id="user-guide-screen" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>User Manual & Guide</span>
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
              Mastering Your Personal Cash Flow Tracker
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Designed as a modern, offline-first replacement for complex Excel cash flow workbooks. Here is everything you need to know to get started.
            </p>
          </div>

          <button
            onClick={onCreateFirstMonth}
            className="self-start md:self-center px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create First Month</span>
          </button>
        </div>
      </div>

      {/* 1. Quick Start Workflow */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Quick Start Workflow (3 Easy Steps)</h3>
            <p className="text-[11px] text-slate-400">How to kickstart your personal finance tracking from scratch</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Step 1: Start a Cash Flow Month</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Click <strong className="text-slate-200">"Start Month"</strong> in the top bar or Monthly view. Enter your target month (e.g. 2026-07) and your starting bank/cash balance.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Step 2: Add Active Debts (Optional)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In the <strong className="text-slate-200">Debts & EMIs</strong> tab, register ongoing loans (e.g. Personal Loan, Car Loan). Set the monthly EMI amount and remaining months.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-200">Step 3: Log Incomes & Expenses</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Log daily salary, rent, groceries, and utilities using quick action buttons. Watch your month’s real-time Closing Balance update instantly.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Core Excel Cash Flow Formula */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">How Cash Flow & Balance Carry Forward Works</h3>
            <p className="text-[11px] text-slate-400">Replicating precise spreadsheet logic without manual formulas</p>
          </div>
        </div>

        {/* Formula Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-center space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">The Core Equation</p>
          <div className="text-sm md:text-base font-mono font-bold text-emerald-400 flex flex-wrap items-center justify-center gap-2">
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">Closing Balance</span>
            <span>=</span>
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-200">Opening Balance</span>
            <span className="text-emerald-400">+</span>
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-emerald-400">Total Income</span>
            <span className="text-rose-400">-</span>
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-rose-400">Total Expenses</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="flex items-start gap-3 bg-slate-800/30 p-3.5 rounded-xl border border-slate-800">
            <RefreshCw className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Automatic Month Carry-Forward</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                When you transition to a new month (e.g. creating August after July), the exact Closing Balance of July is automatically set as the Opening Balance for August.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-800/30 p-3.5 rounded-xl border border-slate-800">
            <TrendingUp className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Dynamic Cash Flow Recalculation</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Adding, editing, or deleting any transaction immediately recalculates the net monthly cash flow and updates your overall net worth metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Automated Debt EMI Engine */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Automated Debt & EMI Engine</h3>
            <p className="text-[11px] text-slate-400">Hands-free tracking for personal, home, or vehicle loans</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 bg-slate-800/30 p-3.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Auto EMI Deduction on Month Creation:</strong> Whenever a new month is created, the system inspects all active loans and automatically logs a <span className="text-rose-400 font-semibold">"Debt EMI"</span> expense transaction for that month.
            </p>
          </div>

          <div className="flex items-start gap-3 bg-slate-800/30 p-3.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Automatic Loan Payoff Progress:</strong> Each generated EMI automatically reduces the loan’s remaining duration by 1 month and remaining principal balance by the EMI amount.
            </p>
          </div>

          <div className="flex items-start gap-3 bg-slate-800/30 p-3.5 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">Auto-Deactivation upon Completion:</strong> Once remaining months or balance hit zero, the loan is marked as fully paid and auto-EMI generation stops cleanly.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Privacy, Backups & Export */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Offline & Security */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">100% Offline & Private</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your financial data is saved locally inside your browser's encrypted storage (`localStorage`). No tracking scripts, no external analytics, and no remote database servers are involved.
          </p>
        </div>

        {/* Backups */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Download className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Export & Import JSON Backups</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In the <strong className="text-slate-200">Settings</strong> tab, you can export a single JSON backup file at any time to preserve your history or move data across laptops, tablets, or phones safely.
          </p>
        </div>
      </div>

      {/* Quick Navigation Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800">
        <button
          onClick={onNavigateToDashboard}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onNavigateToMonths}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>View Monthly Cash Flow</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onNavigateToDebts}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Manage Debts & EMIs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
