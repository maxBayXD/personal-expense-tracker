import React, { useState, useEffect } from 'react';
import { MONTH_NAMES, formatMonthLabel } from '../utils/calculations';
import { X, Sparkles, Calendar, Wallet } from 'lucide-react';

interface CreateMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstMonth: boolean;
  currencySymbol: string;
  suggestedMonthId: string;
  suggestedOpeningBalance: number;
  onCreateMonth: (openingBalance: number, customMonthId?: string) => void;
}

export const CreateMonthModal: React.FC<CreateMonthModalProps> = ({
  isOpen,
  onClose,
  isFirstMonth,
  currencySymbol,
  suggestedMonthId,
  suggestedOpeningBalance,
  onCreateMonth,
}) => {
  const [openingBalance, setOpeningBalance] = useState<string>(suggestedOpeningBalance.toString());
  const [selectedMonthId, setSelectedMonthId] = useState<string>(suggestedMonthId);

  useEffect(() => {
    setOpeningBalance(suggestedOpeningBalance.toString());
    setSelectedMonthId(suggestedMonthId);
  }, [suggestedOpeningBalance, suggestedMonthId, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balanceNum = parseFloat(openingBalance) || 0;
    onCreateMonth(balanceNum, selectedMonthId);
    onClose();
  };

  // Generate month options (e.g. current year +/- 1)
  const now = new Date();
  const currentYear = now.getFullYear();
  const yearOptions = [currentYear - 1, currentYear, currentYear + 1];

  const monthOptions: { id: string; label: string }[] = [];
  yearOptions.forEach((y) => {
    for (let m = 1; m <= 12; m++) {
      const mStr = m < 10 ? `0${m}` : `${m}`;
      const id = `${y}-${mStr}`;
      monthOptions.push({
        id,
        label: `${MONTH_NAMES[m - 1]} ${y}`,
      });
    }
  });

  return (
    <div id="create-month-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div id="create-month-modal-card" className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isFirstMonth ? 'Start First Cash Flow Month' : 'Create Next Cash Flow Month'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isFirstMonth
                  ? 'Set your initial starting balance and month'
                  : 'Auto-carries forward previous closing balance'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Select Month */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Month</span>
            </label>
            <select
              value={selectedMonthId}
              onChange={(e) => setSelectedMonthId(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 text-sm font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {monthOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label} ({opt.id})
                </option>
              ))}
            </select>
          </div>

          {/* Opening Balance */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Opening Balance ({currencySymbol})</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base font-bold">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="any"
                required
                value={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 text-white font-bold text-lg rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {isFirstMonth
                ? 'Your starting cash in hand or bank balance for this initial month.'
                : 'Carried forward from previous month closing balance (editable if needed).'}
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-sm bg-emerald-500 hover:bg-emerald-600 text-white transition-colors shadow-md mt-2 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create {formatMonthLabel(selectedMonthId)}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
