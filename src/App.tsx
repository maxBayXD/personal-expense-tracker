import React, { useState } from 'react';
import { useDatabase } from './hooks/useDatabase';
import { useTheme } from './hooks/useTheme';
import { usePinLock } from './hooks/usePinLock';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { MonthsList } from './components/MonthsList';
import { DebtsScreen } from './components/DebtsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { UserGuide } from './components/UserGuide';
import { TransactionModal } from './components/TransactionModal';
import { CreateMonthModal } from './components/CreateMonthModal';
import { PinLockScreen } from './components/PinLockScreen';
import { getNextMonthId } from './utils/calculations';

export default function App() {
  const {
    isLoaded,
    months,
    transactions,
    debts,
    settings,
    currentMonth,
    currentTransactions,
    setCurrentMonthId,
    addIncome,
    addExpense,
    deleteTransaction,
    addDebt,
    updateDebt,
    deleteDebt,
    createNextMonth,
    updateSettings,
    seedSampleData,
    clearDatabase,
    exportJSON,
    importJSON,
  } = useDatabase();

  const { theme, toggleTheme, colorTheme, setColorTheme, isGlass, toggleGlass } = useTheme();

  const {
    pinEnabled,
    securityQuestion,
    isLocked,
    unlockApp,
    lockApp,
    enablePin,
    disablePin,
    resetPinWithAnswer,
    emergencyResetPin,
  } = usePinLock();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'months' | 'debts' | 'guide' | 'settings'>('dashboard');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'income' | 'expense' | 'debt'>('expense');
  const [createMonthModalOpen, setCreateMonthModalOpen] = useState(false);

  const handleOpenQuickAdd = (type: 'income' | 'expense' | 'debt') => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleOpenCreateMonth = () => {
    setCreateMonthModalOpen(true);
  };

  // Compute suggested initial values for create month modal
  const now = new Date();
  const currentMonthNum = now.getMonth() + 1;
  const currentMonthStr = currentMonthNum < 10 ? `0${currentMonthNum}` : `${currentMonthNum}`;
  const defaultCurrentMonthId = `${now.getFullYear()}-${currentMonthStr}`;

  const sortedMonths = [...months].sort((a, b) => a.id.localeCompare(b.id));
  const lastMonth = sortedMonths.length > 0 ? sortedMonths[sortedMonths.length - 1] : null;

  const suggestedMonthId = lastMonth
    ? getNextMonthId(lastMonth.year, lastMonth.month).nextMonthId
    : defaultCurrentMonthId;

  const suggestedOpeningBalance = lastMonth ? lastMonth.closingBalance : 0;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading Expense Database...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="app-root" className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* PIN Lock Screen Overlay when PIN is active and locked */}
      {isLocked && (
        <PinLockScreen
          securityQuestion={securityQuestion}
          onUnlock={unlockApp}
          onResetWithAnswer={resetPinWithAnswer}
          onEmergencyReset={emergencyResetPin}
        />
      )}

      {/* App Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        months={months}
        currentMonth={currentMonth}
        setCurrentMonthId={setCurrentMonthId}
        onOpenQuickAdd={handleOpenQuickAdd}
        onCreateNextMonth={handleOpenCreateMonth}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Body Content Container */}
      <main id="app-main-content" className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            currentMonth={currentMonth}
            transactions={currentTransactions}
            debts={debts}
            currencySymbol={settings.currencySymbol}
            onOpenQuickAdd={handleOpenQuickAdd}
            onCreateNextMonth={handleOpenCreateMonth}
            onDeleteTransaction={deleteTransaction}
            onNavigateToMonths={() => setActiveTab('months')}
            onNavigateToDebts={() => setActiveTab('debts')}
          />
        )}

        {activeTab === 'months' && (
          <MonthsList
            months={months}
            transactions={transactions}
            currentMonthId={settings.currentMonthId}
            currencySymbol={settings.currencySymbol}
            setCurrentMonthId={setCurrentMonthId}
            onCreateNextMonth={handleOpenCreateMonth}
            onOpenQuickAdd={handleOpenQuickAdd}
          />
        )}

        {activeTab === 'debts' && (
          <DebtsScreen
            debts={debts}
            currencySymbol={settings.currencySymbol}
            onAddDebt={addDebt}
            onUpdateDebt={updateDebt}
            onDeleteDebt={deleteDebt}
            onOpenAddModal={() => handleOpenQuickAdd('debt')}
          />
        )}

        {activeTab === 'guide' && (
          <UserGuide
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            onNavigateToMonths={() => setActiveTab('months')}
            onNavigateToDebts={() => setActiveTab('debts')}
            onCreateFirstMonth={handleOpenCreateMonth}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            months={months}
            transactions={transactions}
            debts={debts}
            onUpdateSettings={updateSettings}
            onSeedSampleData={seedSampleData}
            onClearDatabase={clearDatabase}
            onExportJSON={exportJSON}
            onImportJSON={importJSON}
            theme={theme}
            toggleTheme={toggleTheme}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            isGlass={isGlass}
            toggleGlass={toggleGlass}
            pinLock={{
              pinEnabled,
              securityQuestion,
              onEnablePin: enablePin,
              onDisablePin: disablePin,
              onLockApp: lockApp,
            }}
          />
        )}
      </main>

      {/* Quick Add Modal */}
      <TransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={modalType}
        currentMonth={currentMonth}
        currencySymbol={settings.currencySymbol}
        onAddIncome={addIncome}
        onAddExpense={addExpense}
        onAddDebt={addDebt}
      />

      {/* Create Month Modal */}
      <CreateMonthModal
        isOpen={createMonthModalOpen}
        onClose={() => setCreateMonthModalOpen(false)}
        isFirstMonth={months.length === 0}
        currencySymbol={settings.currencySymbol}
        suggestedMonthId={suggestedMonthId}
        suggestedOpeningBalance={suggestedOpeningBalance}
        onCreateMonth={(balance, customMonthId) => {
          createNextMonth(balance, customMonthId);
        }}
      />
    </div>
  );
}
