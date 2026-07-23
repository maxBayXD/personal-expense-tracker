import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, AlertTriangle, HelpCircle, ShieldAlert, CheckCircle2, ArrowRight, RefreshCw, X } from 'lucide-react';

interface PinLockScreenProps {
  securityQuestion: string;
  onUnlock: (pin: string) => boolean;
  onResetWithAnswer: (answer: string, newPin: string) => boolean;
  onEmergencyReset: () => void;
}

export const PinLockScreen: React.FC<PinLockScreenProps> = ({
  securityQuestion,
  onUnlock,
  onResetWithAnswer,
  onEmergencyReset,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isShaking, setIsShaking] = useState<boolean>(false);

  // Recovery modal state
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [recoveryAnswer, setRecoveryAnswer] = useState<string>('');
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [confirmNewPinInput, setConfirmNewPinInput] = useState<string>('');
  const [recoveryError, setRecoveryError] = useState<string>('');
  const [recoverySuccess, setRecoverySuccess] = useState<boolean>(false);

  // Emergency reset modal state
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

  // Handle number click
  const handleNumClick = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');

      // Auto submit when 4 digits reached
      if (nextPin.length === 4) {
        setTimeout(() => {
          const success = onUnlock(nextPin);
          if (!success) {
            setErrorMsg('Incorrect PIN code. Please try again.');
            setIsShaking(true);
            setTimeout(() => {
              setIsShaking(false);
              setPin('');
            }, 500);
          }
        }, 150);
      }
    }
  };

  // Handle Backspace
  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  // Handle physical keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showForgotModal || showEmergencyModal) return;
      if (e.key >= '0' && e.key <= '9') {
        handleNumClick(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, showForgotModal, showEmergencyModal]);

  // Handle recovery form submission
  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    if (!recoveryAnswer.trim()) {
      setRecoveryError('Please enter your recovery answer.');
      return;
    }
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setRecoveryError('New PIN must be exactly 4 digits.');
      return;
    }
    if (newPinInput !== confirmNewPinInput) {
      setRecoveryError('New PINs do not match. Please re-enter.');
      return;
    }

    const success = onResetWithAnswer(recoveryAnswer, newPinInput);
    if (success) {
      setRecoverySuccess(true);
      setTimeout(() => {
        setShowForgotModal(false);
        setRecoverySuccess(false);
      }, 1000);
    } else {
      setRecoveryError('Incorrect recovery answer. Please try again.');
    }
  };

  return (
    <div
      id="pin-lock-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-2xl text-slate-100 p-4 select-none animate-fade-in"
    >
      <div
        className={`w-full max-w-sm bg-slate-900/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 transition-transform ${
          isShaking ? 'animate-bounce text-rose-400' : ''
        }`}
      >
        {/* Header Icon & Title */}
        <div className="space-y-2 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Expense Tracker Locked</h2>
          <p className="text-xs text-slate-400">Enter your 4-digit PIN to continue</p>
        </div>

        {/* 4 Digit Dots Indicator */}
        <div className="flex justify-center items-center gap-4 py-2">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 border ${
                  filled
                    ? 'bg-emerald-400 border-emerald-300 scale-110 shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800 border-slate-700'
                }`}
              />
            );
          })}
        </div>

        {/* Error message */}
        {errorMsg ? (
          <p className="text-xs font-semibold text-rose-400 animate-pulse">{errorMsg}</p>
        ) : (
          <p className="text-[11px] text-slate-500">Secured with Local PIN Protection</p>
        )}

        {/* Keypad Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleNumClick(num)}
              className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 active:scale-95 text-xl font-semibold text-slate-100 transition-all flex items-center justify-center cursor-pointer shadow-sm"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            onClick={() => setPin('')}
            className="h-14 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-400 transition-all flex items-center justify-center cursor-pointer"
          >
            Clear
          </button>

          {/* 0 Button */}
          <button
            type="button"
            onClick={() => handleNumClick('0')}
            className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 active:scale-95 text-xl font-semibold text-slate-100 transition-all flex items-center justify-center cursor-pointer shadow-sm"
          >
            0
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-400 transition-all flex items-center justify-center cursor-pointer"
          >
            Delete
          </button>
        </div>

        {/* Recovery / Forgot PIN links */}
        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="hover:text-emerald-400 underline underline-offset-4 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Forgot PIN?</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEmergencyModal(true)}
            className="hover:text-rose-400 underline underline-offset-4 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400/80" />
            <span>Emergency Reset</span>
          </button>
        </div>
      </div>

      {/* Recovery Question Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-left relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Security PIN Recovery</h3>
                <p className="text-xs text-slate-400">Answer your security question to set a new PIN</p>
              </div>
            </div>

            {/* Explicit Security Warning */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Important Warning</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed">
                If you lose both your PIN and your recovery answer, use the Emergency Reset option to unblock your app session.
              </p>
            </div>

            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Security Question</label>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-medium">
                  {securityQuestion || 'What was your security question?'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">Your Recovery Answer</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your security answer..."
                  value={recoveryAnswer}
                  onChange={(e) => setRecoveryAnswer(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">New 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="e.g. 1234"
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 tracking-widest text-center"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Confirm New PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    required
                    placeholder="e.g. 1234"
                    value={confirmNewPinInput}
                    onChange={(e) => setConfirmNewPinInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 tracking-widest text-center"
                  />
                </div>
              </div>

              {recoveryError && (
                <p className="text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                  {recoveryError}
                </p>
              )}

              {recoverySuccess && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PIN successfully updated! Unlocking...</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-1/2 p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 p-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <span>Reset & Unlock</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Emergency Reset Confirmation Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-5 text-left relative">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Emergency PIN Security Reset</h3>
                <p className="text-xs text-rose-300">Remove PIN lock security to regain app access</p>
              </div>
            </div>

            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-200 space-y-2">
              <p className="font-semibold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>What does Emergency Reset do?</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-200/90 leading-relaxed">
                <li>Removes the 4-digit PIN lock security setting.</li>
                <li>Allows immediate access to your Expense Tracker dashboard.</li>
                <li>Your financial transaction history and debts remain intact.</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="w-1/2 p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl cursor-pointer"
              >
                Keep Locked
              </button>
              <button
                type="button"
                onClick={() => {
                  onEmergencyReset();
                  setShowEmergencyModal(false);
                }}
                className="w-1/2 p-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset PIN Lock</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
