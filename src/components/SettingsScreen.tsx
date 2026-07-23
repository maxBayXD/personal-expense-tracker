import React, { useRef, useState } from 'react';
import { AppSettings } from '../types';
import {
  Settings,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  FileSpreadsheet,
  Check,
  AlertOctagon,
  ShieldCheck,
} from 'lucide-react';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onSeedSampleData: () => void;
  onClearDatabase: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => boolean;
}

const CURRENCY_OPTIONS = [
  { symbol: '₹', code: 'INR', label: 'Indian Rupee (₹)' },
  { symbol: '$', code: 'USD', label: 'US Dollar ($)' },
  { symbol: '€', code: 'EUR', label: 'Euro (€)' },
  { symbol: '£', code: 'GBP', label: 'British Pound (£)' },
  { symbol: '¥', code: 'JPY', label: 'Japanese Yen (¥)' },
  { symbol: 'A$', code: 'AUD', label: 'Australian Dollar (A$)' },
  { symbol: 'C$', code: 'CAD', label: 'Canadian Dollar (C$)' },
  { symbol: 'AED', code: 'AED', label: 'UAE Dirham (AED)' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onSeedSampleData,
  onClearDatabase,
  onExportJSON,
  onImportJSON,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = onImportJSON(content);
        setImportSuccess(ok);
        setTimeout(() => setImportSuccess(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div id="settings-screen-container" className="space-y-6 pb-12">
      {/* Settings Header */}
      <div id="settings-header" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">App Settings & Offline Backup</h2>
          <p className="text-xs text-slate-400">
            All your cash flow records stay 100% on your device with zero cloud dependency.
          </p>
        </div>
      </div>

      {/* 1. Currency Settings */}
      <div id="settings-currency-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <span>Currency Display</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CURRENCY_OPTIONS.map((cur) => {
            const isSelected = settings.currencySymbol === cur.symbol;
            return (
              <button
                key={cur.code}
                onClick={() =>
                  onUpdateSettings({ currencySymbol: cur.symbol, currencyCode: cur.code })
                }
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <span className="text-lg font-bold block">{cur.symbol}</span>
                <span className="text-xs text-slate-400 block">{cur.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Data Management & Backup */}
      <div id="settings-data-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Offline Backup & Restore</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export JSON */}
          <button
            id="settings-export-json-btn"
            onClick={onExportJSON}
            className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
              <Download className="w-4 h-4" />
              <span>Export Full Backup (JSON)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Download all months, transactions, and debts as a single offline backup file.
            </p>
          </button>

          {/* Import JSON */}
          <button
            id="settings-import-json-btn"
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
              <Upload className="w-4 h-4" />
              <span>Import / Restore Backup</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Load a previously exported Expense Tracker JSON backup file.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </button>
        </div>

        {importSuccess !== null && (
          <div
            className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              importSuccess
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}
          >
            {importSuccess ? <Check className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
            <span>
              {importSuccess
                ? 'Backup successfully imported!'
                : 'Failed to parse backup file. Make sure it is a valid JSON file.'}
            </span>
          </div>
        )}

        <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
          {/* Seed Defaults */}
          <button
            id="settings-seed-sample-btn"
            onClick={onSeedSampleData}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Load Sample Excel Demo Data</span>
          </button>

          {/* Reset All Data */}
          <button
            id="settings-reset-db-btn"
            onClick={() => setShowClearConfirmModal(true)}
            className="px-3.5 py-2 bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 text-xs font-medium rounded-xl border border-rose-800/50 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Database</span>
          </button>
        </div>
      </div>

      {/* 3. Excel Logic Reference */}
      <div id="settings-excel-guide" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Excel Cash Flow Workflow Architecture</span>
        </h3>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 space-y-2 font-mono">
          <p className="text-emerald-400 font-bold">1. Monthly Equation:</p>
          <p className="pl-3">Closing Balance = Opening Balance + Total Income - Total Expenses</p>

          <p className="text-emerald-400 font-bold pt-1">2. Automatic Balance Carry Forward:</p>
          <p className="pl-3">Next Month Opening Balance = Previous Month Closing Balance</p>

          <p className="text-emerald-400 font-bold pt-1">3. Automated Debt EMI Engine:</p>
          <p className="pl-3">
            Every active debt automatically generates an Expense transaction on month creation.
            Remaining Amount = Remaining Amount - EMI, Remaining Months = Remaining Months - 1.
          </p>
        </div>
      </div>

      {/* Clear Database Confirmation Modal */}
      {showClearConfirmModal && (
        <div id="clear-db-confirm-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-rose-900/60 rounded-2xl w-full max-w-md p-6 shadow-2xl text-slate-100 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Clear Entire Database?</h3>
                <p className="text-xs text-slate-400">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
              Are you sure you want to delete all months, transactions, debts, and custom settings? All stored local browser data will be completely wiped.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="clear-db-confirm-btn"
                onClick={() => {
                  onClearDatabase();
                  setShowClearConfirmModal(false);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-900/30 flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Clear Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
