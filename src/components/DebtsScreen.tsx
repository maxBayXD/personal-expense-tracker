import React, { useState } from 'react';
import { Debt } from '../types';
import { calculateTotalDebt, calculateTotalMonthlyEMI, formatCurrency } from '../utils/calculations';
import {
  CreditCard,
  Plus,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Edit2,
  AlertTriangle,
} from 'lucide-react';

interface DebtsScreenProps {
  debts: Debt[];
  currencySymbol: string;
  onAddDebt: (params: { name: string; emi: number; remainingMonths: number; remainingAmount: number }) => void;
  onUpdateDebt: (debt: Debt) => void;
  onDeleteDebt: (id: string) => void;
  onOpenAddModal: () => void;
}

export const DebtsScreen: React.FC<DebtsScreenProps> = ({
  debts,
  currencySymbol,
  onUpdateDebt,
  onDeleteDebt,
  onOpenAddModal,
}) => {
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const activeDebts = debts.filter((d) => d.active && d.remainingMonths > 0);
  const inactiveDebts = debts.filter((d) => !d.active || d.remainingMonths <= 0);

  const totalOutstanding = calculateTotalDebt(debts);
  const totalEmi = calculateTotalMonthlyEMI(debts);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDebt) return;
    onUpdateDebt(editingDebt);
    setEditingDebt(null);
  };

  return (
    <div id="debts-screen-container" className="space-y-6 pb-12">
      {/* Debt Overview Header */}
      <div id="debts-header-card" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Debt & EMI Tracker</h2>
          </div>
          <p className="text-xs text-slate-400">
            Active loans automatically generate EMI expense transactions each new month and deduct remaining balance.
          </p>
        </div>

        <button
          id="debts-add-new-btn"
          onClick={onOpenAddModal}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Loan</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Total Outstanding Loans</span>
          <span className="text-2xl font-bold text-amber-400">
            {formatCurrency(totalOutstanding, currencySymbol)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Across {activeDebts.length} active loan(s)
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
          <span className="text-xs text-slate-400 block mb-1">Monthly Total EMI Obligation</span>
          <span className="text-2xl font-bold text-rose-400">
            {formatCurrency(totalEmi, currencySymbol)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            Auto-created as monthly expense
          </span>
        </div>
      </div>

      {/* Edit Debt Modal */}
      {editingDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">Edit Debt Details</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Loan Name</label>
                <input
                  type="text"
                  required
                  value={editingDebt.name}
                  onChange={(e) => setEditingDebt({ ...editingDebt, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">EMI ({currencySymbol})</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={editingDebt.emi}
                    onChange={(e) => setEditingDebt({ ...editingDebt, emi: Number(e.target.value) })}
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Remaining Months</label>
                  <input
                    type="number"
                    required
                    value={editingDebt.remainingMonths}
                    onChange={(e) =>
                      setEditingDebt({
                        ...editingDebt,
                        remainingMonths: Number(e.target.value),
                        active: Number(e.target.value) > 0,
                      })
                    }
                    className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Remaining Amount ({currencySymbol})</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={editingDebt.remainingAmount}
                  onChange={(e) => setEditingDebt({ ...editingDebt, remainingAmount: Number(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDebt(null)}
                  className="w-1/2 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-medium hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold hover:bg-amber-400"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Debts List */}
      <div id="debts-active-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-semibold text-slate-100">
            Active Loans ({activeDebts.length})
          </h3>
        </div>

        {activeDebts.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            🎉 No active debts or loans recorded! Click above to add a new loan.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeDebts.map((d) => (
              <div
                key={d.id}
                className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3 relative overflow-hidden group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-white">{d.name}</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-1">
                      <Clock className="w-2.5 h-2.5" /> Auto Monthly EMI
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingDebt(d)}
                      className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Edit Debt"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteDebt(d.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete Debt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Monthly EMI</span>
                    <span className="font-bold text-rose-400">{formatCurrency(d.emi, currencySymbol)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rem. Months</span>
                    <span className="font-bold text-amber-300">{d.remainingMonths} mo</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rem. Amount</span>
                    <span className="font-bold text-white">{formatCurrency(d.remainingAmount, currencySymbol)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inactive / Completed Debts */}
      {inactiveDebts.length > 0 && (
        <div id="debts-completed-section" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-slate-100">
              Paid Off / Inactive Loans ({inactiveDebts.length})
            </h3>
          </div>

          <div className="space-y-2">
            {inactiveDebts.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-800/60 rounded-xl"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-300 line-through">{d.name}</span>
                  <span className="ml-2 text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>

                <button
                  onClick={() => onDeleteDebt(d.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
