
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Receipt, PieChart as ChartIcon, Plus, Menu, X, Wallet } from 'lucide-react';
import { Expense, Category, ViewType } from './types';
import { INITIAL_EXPENSES } from './constants';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import ExpenseForm from './components/ExpenseForm';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('lumina_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lumina_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    const expense: Expense = {
      ...newExpense,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses(prev => [expense, ...prev]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'expenses', label: 'Transactions', icon: <Receipt size={20} /> },
    { id: 'reports', label: 'Reports', icon: <ChartIcon size={20} /> },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard expenses={expenses} onAddClick={() => setIsFormOpen(true)} onNavigate={setActiveView} />;
      case 'expenses':
        return <Expenses expenses={expenses} onDelete={handleDeleteExpense} />;
      case 'reports':
        return <Reports expenses={expenses} />;
      default:
        return <Dashboard expenses={expenses} onAddClick={() => setIsFormOpen(true)} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 p-6 space-y-8 sticky top-0 h-screen">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold text-slate-900">Lumina</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeView === item.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Upgrade</p>
          <p className="text-sm font-medium text-slate-700 leading-tight">Get Lumina Pro for multi-device sync.</p>
          <button className="mt-3 w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
            View Plans
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Wallet size={18} />
          </div>
          <span className="text-lg font-bold text-slate-900">Lumina</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white p-6 pt-20 animate-in slide-in-from-top duration-300">
          <nav className="space-y-4">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id as ViewType);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold transition-all ${
                  activeView === item.id 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-slate-50 text-slate-600'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button 
              onClick={() => {
                setIsFormOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg"
            >
              <Plus size={20} />
              Add Transaction
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {renderView()}
      </main>

      {/* Global Add Button (Mobile Floating) */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="md:hidden fixed right-6 bottom-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-30"
      >
        <Plus size={24} />
      </button>

      {/* Expense Modal */}
      <ExpenseForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleAddExpense} 
      />
    </div>
  );
};

export default App;
