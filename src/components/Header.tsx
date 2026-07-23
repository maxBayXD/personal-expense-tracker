import React from 'react';
import { Month } from '../types';
import { formatMonthLabel } from '../utils/calculations';
import {
  Wallet,
  LayoutDashboard,
  Calendar,
  CreditCard,
  Settings,
  Plus,
  WifiOff,
  ChevronDown,
  BookOpen,
  Sun,
  Moon,
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'months' | 'debts' | 'guide' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'months' | 'debts' | 'guide' | 'settings') => void;
  months: Month[];
  currentMonth: Month | null;
  setCurrentMonthId: (id: string) => void;
  onOpenQuickAdd: (type: 'income' | 'expense' | 'debt') => void;
  onCreateNextMonth: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  months,
  currentMonth,
  setCurrentMonthId,
  onOpenQuickAdd,
  onCreateNextMonth,
  theme,
  toggleTheme,
}) => {
  return (
    <header id="app-header" className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3">
        {/* Top bar: Title, Month Selector & Quick Action */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Offline badge */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
                Expense Tracker
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <WifiOff className="w-2.5 h-2.5" /> Offline First
                </span>
              </h1>
              <p className="text-xs text-slate-400">Excel Cash Flow & Debt EMI Engine</p>
            </div>
          </div>

          {/* Current Month Picker & Quick Add */}
          <div className="flex items-center space-x-2">
            {months.length > 0 && currentMonth ? (
              <div className="relative">
                <select
                  id="header-month-selector"
                  value={currentMonth.id}
                  onChange={(e) => setCurrentMonthId(e.target.value)}
                  className="appearance-none bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-medium rounded-lg px-3 py-2 pr-8 cursor-pointer focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {months.map((m) => (
                    <option key={m.id} value={m.id}>
                      {formatMonthLabel(m.id)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ) : (
              <button
                id="header-start-month-btn"
                onClick={onCreateNextMonth}
                className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Start Month</span>
              </button>
            )}

            {/* Add Transaction drop button & Theme Toggle */}
            <div className="flex items-center gap-1.5">
              <button
                id="header-add-expense-btn"
                onClick={() => onOpenQuickAdd('expense')}
                className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                title="Add Expense"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Expense</span>
              </button>
              <button
                id="header-add-income-btn"
                onClick={() => onOpenQuickAdd('income')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                title="Add Income"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Income</span>
              </button>

              <button
                id="theme-toggle-btn"
                onClick={toggleTheme}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center shrink-0"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav id="app-nav-tabs" className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            id="nav-tab-months"
            onClick={() => setActiveTab('months')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'months'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Monthly Cash Flow</span>
          </button>

          <button
            id="nav-tab-debts"
            onClick={() => setActiveTab('debts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'debts'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Debts & EMIs</span>
          </button>

          <button
            id="nav-tab-guide"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>User Guide</span>
          </button>

          <button
            id="nav-tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
