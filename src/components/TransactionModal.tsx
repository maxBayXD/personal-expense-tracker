import React, { useState } from 'react';
import { Month, TransactionType } from '../types';
import { X, ArrowDownCircle, ArrowUpCircle, CreditCard } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: 'income' | 'expense' | 'debt';
  currentMonth: Month | null;
  currencySymbol: string;
  onAddIncome: (params: { monthId: string; category: string; description: string; amount: number; date: string }) => void;
  onAddExpense: (params: { monthId: string; category: string; description: string; amount: number; date: string }) => void;
  onAddDebt: (params: { name: string; emi: number; remainingMonths: number; remainingAmount: number }) => void;
}

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Business', 'Investments', 'Gift/Bonus', 'Other Income'];
const EXPENSE_CATEGORIES = ['House Rent', 'Groceries', 'Utilities', 'Dining/Food', 'Shopping', 'Entertainment', 'Healthcare', 'Transport', 'Debt EMI', 'Other Expense'];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  initialType,
  currentMonth,
  currencySymbol,
  onAddIncome,
  onAddExpense,
  onAddDebt,
}) => {
  const [modalType, setModalType] = useState<'income' | 'expense' | 'debt'>(initialType);

  // Income / Expense Form State
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(initialType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Debt Form State
  const [debtName, setDebtName] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [remainingMonths, setRemainingMonths] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');

  if (!isOpen) return null;

  // Auto calculate debt remaining amount if EMI and months entered
  const handleEmiChange = (val: string) => {
    setEmiAmount(val);
    if (val && remainingMonths) {
      setRemainingAmount((Number(val) * Number(remainingMonths)).toString());
    }
  };

  const handleMonthsChange = (val: string) => {
    setRemainingMonths(val);
    if (emiAmount && val) {
      setRemainingAmount((Number(emiAmount) * Number(val)).toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMonth && modalType !== 'debt') return;

    if (modalType === 'income') {
      if (!amount || Number(amount) <= 0) return;
      onAddIncome({
        monthId: currentMonth!.id,
        category,
        description,
        amount: Number(amount),
        date,
      });
    } else if (modalType === 'expense') {
      if (!amount || Number(amount) <= 0) return;
      onAddExpense({
        monthId: currentMonth!.id,
        category,
        description,
        amount: Number(amount),
        date,
      });
    } else if (modalType === 'debt') {
      if (!debtName || !emiAmount || !remainingMonths) return;
      const emi = Number(emiAmount);
      const months = Number(remainingMonths);
      const totalRem = remainingAmount ? Number(remainingAmount) : emi * months;

      onAddDebt({
        name: debtName,
        emi,
        remainingMonths: months,
        remainingAmount: totalRem,
      });
    }

    // Reset and close
    setAmount('');
    setDescription('');
    setDebtName('');
    setEmiAmount('');
    setRemainingMonths('');
    setRemainingAmount('');
    onClose();
  };

  return (
    <div id="transaction-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div id="transaction-modal-card" className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in duration-150">
        {/* Header Tabs */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
            <button
              id="modal-tab-income"
              type="button"
              onClick={() => {
                setModalType('income');
                setCategory(INCOME_CATEGORIES[0]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                modalType === 'income' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>Income</span>
            </button>
            <button
              id="modal-tab-expense"
              type="button"
              onClick={() => {
                setModalType('expense');
                setCategory(EXPENSE_CATEGORIES[0]);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                modalType === 'expense' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowUpCircle className="w-3.5 h-3.5" />
              <span>Expense</span>
            </button>
            <button
              id="modal-tab-debt"
              type="button"
              onClick={() => setModalType('debt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                modalType === 'debt' ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Debt Loan</span>
            </button>
          </div>

          <button
            id="modal-close-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {modalType !== 'debt' ? (
            <>
              {/* Amount */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Amount ({currencySymbol})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base font-bold">
                    {currencySymbol}
                  </span>
                  <input
                    id="modal-amount-input"
                    type="number"
                    step="any"
                    required
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 text-white font-semibold text-lg rounded-xl pl-8 pr-3 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select
                  id="modal-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  {(modalType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Description (Optional)</label>
                <input
                  id="modal-description-input"
                  type="text"
                  placeholder={modalType === 'income' ? 'e.g., Client Payment, July Salary' : 'e.g., DMart Groceries'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Date</label>
                <input
                  id="modal-date-input"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </>
          ) : (
            <>
              {/* Debt Name */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Loan / Debt Name</label>
                <input
                  id="modal-debt-name-input"
                  type="text"
                  required
                  placeholder="e.g., Personal Loan, Bike Loan"
                  value={debtName}
                  onChange={(e) => setDebtName(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Monthly EMI */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Monthly EMI ({currencySymbol})</label>
                  <input
                    id="modal-debt-emi-input"
                    type="number"
                    step="any"
                    required
                    placeholder="1820"
                    value={emiAmount}
                    onChange={(e) => handleEmiChange(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Remaining Months</label>
                  <input
                    id="modal-debt-months-input"
                    type="number"
                    required
                    placeholder="4"
                    value={remainingMonths}
                    onChange={(e) => handleMonthsChange(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              {/* Total Remaining Amount */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Total Remaining Amount ({currencySymbol})
                </label>
                <input
                  id="modal-debt-total-input"
                  type="number"
                  step="any"
                  placeholder="7280"
                  value={remainingAmount}
                  onChange={(e) => setRemainingAmount(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Calculated as: EMI × Remaining Months (Auto-deducted every month)
                </p>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            id="modal-submit-btn"
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors shadow-md mt-2 ${
              modalType === 'income'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                : modalType === 'expense'
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold'
            }`}
          >
            {modalType === 'income'
              ? `Save Income to ${currentMonth?.id || ''}`
              : modalType === 'expense'
              ? `Save Expense to ${currentMonth?.id || ''}`
              : 'Add New Debt'}
          </button>
        </form>
      </div>
    </div>
  );
};
