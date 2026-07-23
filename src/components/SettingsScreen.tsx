import React, { useRef, useState } from 'react';
import { AppSettings, Debt, Month, Transaction } from '../types';
import { ColorTheme } from '../hooks/useTheme';
import { exportDebtsToCSV, exportTransactionsToCSV } from '../utils/csvExport';
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
  Sun,
  Moon,
  Sparkles,
  Palette,
  Lock,
  Unlock,
  KeyRound,
  AlertTriangle,
  FileText,
  X,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface SettingsScreenProps {
  settings: AppSettings;
  months: Month[];
  transactions: Transaction[];
  debts: Debt[];
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onSeedSampleData: () => void;
  onClearDatabase: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => boolean;
  theme?: 'dark' | 'light';
  toggleTheme?: () => void;
  colorTheme?: ColorTheme;
  setColorTheme?: (color: ColorTheme) => void;
  isGlass?: boolean;
  toggleGlass?: () => void;
  pinLock?: {
    pinEnabled: boolean;
    securityQuestion: string;
    onEnablePin: (pin: string, question: string, answer: string) => void;
    onDisablePin: () => void;
    onLockApp: () => void;
  };
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

const RECOVERY_QUESTIONS = [
  'What was your childhood nickname?',
  'In what city were you born?',
  'What was the name of your first pet?',
  'What is your favorite book or movie?',
  'What was the make of your first car?',
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  months,
  transactions,
  debts,
  onUpdateSettings,
  onSeedSampleData,
  onClearDatabase,
  onExportJSON,
  onImportJSON,
  theme,
  toggleTheme,
  colorTheme = 'emerald',
  setColorTheme,
  isGlass = true,
  toggleGlass,
  pinLock,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);

  // PIN Setup Modal state
  const [showPinSetupModal, setShowPinSetupModal] = useState(false);
  const [setupPin, setSetupPin] = useState('');
  const [setupConfirmPin, setSetupConfirmPin] = useState('');
  const [setupQuestion, setSetupQuestion] = useState(RECOVERY_QUESTIONS[0]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [setupAnswer, setSetupAnswer] = useState('');
  const [setupError, setSetupError] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = onImportJSON(content);
        setImportSuccess(ok);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleSavePinSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setSetupError('');

    if (setupPin.length !== 4 || !/^\d{4}$/.test(setupPin)) {
      setSetupError('PIN code must be exactly 4 numeric digits.');
      return;
    }
    if (setupPin !== setupConfirmPin) {
      setSetupError('PIN confirmation does not match. Please try again.');
      return;
    }
    const finalQuestion = setupQuestion === 'custom' ? customQuestion : setupQuestion;
    if (!finalQuestion.trim()) {
      setSetupError('Please select or provide a security recovery question.');
      return;
    }
    if (!setupAnswer.trim()) {
      setSetupError('Please provide a security recovery answer.');
      return;
    }

    if (pinLock) {
      pinLock.onEnablePin(setupPin, finalQuestion, setupAnswer);
      setShowPinSetupModal(false);
      setSetupPin('');
      setSetupConfirmPin('');
      setSetupAnswer('');
    }
  };

  return (
    <div id="settings-screen-container" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Settings Screen Header */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">App Settings & Preferences</h2>
            <p className="text-xs text-slate-400">Configure currency, CSV exports, themes, and app security</p>
          </div>
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
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
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

      {/* 2. Appearance & Visual Themes */}
      <div id="settings-theme-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-400" />
            <span>Appearance & Glass Theme</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Mode & Glass Toggle */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">Base Lighting & Surface</label>
            <div className="grid grid-cols-2 gap-2">
              {toggleTheme && (
                <>
                  <button
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Dark Slate</span>
                      <span className="text-[10px] text-slate-400">Eye-safe canvas</span>
                    </div>
                  </button>

                  <button
                    onClick={() => theme !== 'light' && toggleTheme()}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                      theme === 'light'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-bold'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-xs font-bold block">Light Theme</span>
                      <span className="text-[10px] text-slate-400">Crisp high-contrast</span>
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Glassmorphism Toggle Button */}
            {toggleGlass && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={toggleGlass}
                  className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isGlass
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 text-left">
                    <Sparkles className={`w-4 h-4 ${isGlass ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <div>
                      <span className="text-xs font-bold block text-slate-200">iOS Liquid Glass Effect</span>
                      <span className="text-[10px] text-slate-400">Translucent SF-style cards & glossy glow</span>
                    </div>
                  </div>
                  <div className={`w-9 h-5 rounded-full p-0.5 transition-colors relative ${isGlass ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isGlass ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Color Accent Themes */}
          {setColorTheme && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">Primary Accent Theme</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'emerald', label: 'Emerald Cash', color: '#10b981', border: 'border-emerald-500' },
                  { id: 'indigo', label: 'Ocean Indigo', color: '#6366f1', border: 'border-indigo-500' },
                  { id: 'purple', label: 'Royal Purple', color: '#a855f7', border: 'border-purple-500' },
                  { id: 'amber', label: 'Sunset Amber', color: '#f59e0b', border: 'border-amber-500' },
                  { id: 'rose', label: 'Crimson Rose', color: '#f43f5e', border: 'border-rose-500' },
                ].map((palette) => {
                  const isSelected = colorTheme === palette.id;
                  return (
                    <button
                      key={palette.id}
                      type="button"
                      onClick={() => setColorTheme(palette.id as ColorTheme)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500 font-bold text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-white/20 shadow-xs"
                        style={{ backgroundColor: palette.color }}
                      />
                      <span className="text-xs">{palette.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. App Security & PIN Lock Section */}
      {pinLock && (
        <div id="settings-pin-security-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>App Security & PIN Lock</span>
            </h3>

            <div
              className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
                pinLock.pinEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              {pinLock.pinEnabled ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              <span>{pinLock.pinEnabled ? 'PIN Lock Active' : 'PIN Lock Off'}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Protect your financial privacy with a 4-digit PIN lock when launching the application.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {pinLock.pinEnabled ? (
              <>
                <button
                  type="button"
                  onClick={pinLock.onLockApp}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Lock Session Now</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPinSetupModal(true)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Change PIN / Recovery</span>
                </button>

                <button
                  type="button"
                  onClick={pinLock.onDisablePin}
                  className="px-4 py-2.5 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Unlock className="w-4 h-4 text-rose-400" />
                  <span>Disable PIN Protection</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setShowPinSetupModal(true)}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Enable 4-Digit PIN Lock</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Data Management & CSV / JSON Exports */}
      <div id="settings-data-card" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Offline CSV Export & Data Backups</span>
        </h3>

        {/* CSV Export Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            id="settings-export-transactions-csv-btn"
            onClick={() => exportTransactionsToCSV(transactions, months, settings.currencySymbol)}
            className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Transactions to CSV</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Download all income and expense transactions formatted for Microsoft Excel, Google Sheets, or Apple Numbers.
            </p>
          </button>

          <button
            id="settings-export-debts-csv-btn"
            onClick={() => exportDebtsToCSV(debts, settings.currencySymbol)}
            className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
              <FileText className="w-4 h-4" />
              <span>Export Debts & EMI to CSV</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Download active loan EMI schedules and debt balances as a clean CSV spreadsheet.
            </p>
          </button>
        </div>

        {/* JSON Backup & Restore Options */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export JSON */}
          <button
            id="settings-export-json-btn"
            onClick={onExportJSON}
            className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
              <Download className="w-4 h-4" />
              <span>Export Full Database (JSON)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Complete raw JSON database backup containing months, transactions, and app settings.
            </p>
          </button>

          {/* Import JSON */}
          <button
            id="settings-import-json-btn"
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs mb-1">
              <Upload className="w-4 h-4" />
              <span>Import / Restore JSON Backup</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Restore data from a previously saved JSON backup file.
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
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
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

      {/* PIN Setup Modal */}
      {showPinSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-left relative">
            <button
              onClick={() => setShowPinSetupModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Configure 4-Digit PIN Security</h3>
                <p className="text-xs text-slate-400">Set a PIN code and security question for app access</p>
              </div>
            </div>

            {/* Explicit Security Warning Box */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Important PIN Security Warning</span>
              </div>
              <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-medium">
                Please remember your 4-digit PIN code and set a recovery question below! If you lose your PIN, you will need your Security Answer to recover access. Export CSV or JSON data backups periodically to keep your financial records secure.
              </p>
            </div>

            <form onSubmit={handleSavePinSetup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">4-Digit PIN Code</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="e.g. 1234"
                    value={setupPin}
                    onChange={(e) => setSetupPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 tracking-widest text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Confirm PIN Code</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="e.g. 1234"
                    value={setupConfirmPin}
                    onChange={(e) => setSetupConfirmPin(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 tracking-widest text-center"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Security Recovery Question</label>
                <select
                  value={setupQuestion}
                  onChange={(e) => setSetupQuestion(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {RECOVERY_QUESTIONS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                  <option value="custom">-- Custom Question --</option>
                </select>

                {setupQuestion === 'custom' && (
                  <input
                    type="text"
                    required
                    placeholder="Type your custom security question..."
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mt-2"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Security Recovery Answer</label>
                <input
                  type="text"
                  required
                  placeholder="Your secret answer..."
                  value={setupAnswer}
                  onChange={(e) => setSetupAnswer(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {setupError && (
                <p className="text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                  {setupError}
                </p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPinSetupModal(false)}
                  className="w-1/2 p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 p-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <span>Save PIN Protection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-rose-900/30 flex items-center gap-1.5 cursor-pointer"
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
