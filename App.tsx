
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Receipt, PieChart as ChartIcon, Plus, Menu, X, Wallet, Settings, Camera as CameraIcon } from 'lucide-react';
import { Expense, Category, ViewType, CustomCategory, AISettings, AIProvider } from './types';
import { INITIAL_EXPENSES } from './constants';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import ExpenseForm from './components/ExpenseForm';
import { CategoryManager } from './components/CategoryManager';
import CameraScanner from './components/CameraScanner';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('lumina_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem('fintrack_custom_categories');
    return saved ? JSON.parse(saved) : [];
  });
  const [aiSettings, setAISettings] = useState<AISettings>(() => {
    const saved = localStorage.getItem('fintrack_ai_settings');
    return saved ? JSON.parse(saved) : {
      activeProvider: 'gemini' as AIProvider,
      providers: {
        gemini: null,
        chatgpt: null,
        deepseek: null,
        claude: null,
        groq: null,
      },
    };
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletedExpenses, setDeletedExpenses] = useState<Expense[]>([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('lumina_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('fintrack_custom_categories', JSON.stringify(customCategories));
  }, [customCategories]);

  useEffect(() => {
    localStorage.setItem('fintrack_ai_settings', JSON.stringify(aiSettings));
  }, [aiSettings]);

  const handleUpdateAISettings = (newSettings: AISettings) => {
    setAISettings(newSettings);
  };

  const handleAddExpense = (newExpense: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      // Update existing expense
      setExpenses(prev => prev.map(e => e.id === editingExpense.id ? { ...newExpense, id: editingExpense.id } : e));
      setEditingExpense(null);
    } else {
      // Add new expense
      const expense: Expense = {
        ...newExpense,
        id: Math.random().toString(36).substr(2, 9),
      };
      setExpenses(prev => [expense, ...prev]);
    }
  };

  const handleDeleteExpense = (id: string) => {
    const expense = expenses.find(e => e.id === id);
    if (expense) {
      setDeletedExpenses(prev => [...prev, expense]);
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleUndoDelete = () => {
    if (deletedExpenses.length > 0) {
      const lastDeleted = deletedExpenses[deletedExpenses.length - 1];
      setExpenses(prev => [lastDeleted, ...prev]);
      setDeletedExpenses(prev => prev.slice(0, -1));
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const handleAddCustomCategory = (categoryName: string) => {
    const newCategory: CustomCategory = {
      id: Math.random().toString(36).substr(2, 9),
      name: categoryName,
      color: ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9'][Math.floor(Math.random() * 5)]
    };
    setCustomCategories(prev => [...prev, newCategory]);
  };

  const handleDeleteCustomCategory = (id: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'expenses', label: 'Transactions', icon: <Receipt size={20} /> },
    { id: 'reports', label: 'Reports', icon: <ChartIcon size={20} /> },
    { id: 'settings', label: 'Categories', icon: <Settings size={20} /> },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard expenses={expenses} onAddClick={() => setIsFormOpen(true)} onNavigate={setActiveView} aiSettings={aiSettings} />;
      case 'expenses':
        return <Expenses expenses={expenses} onDelete={handleDeleteExpense} onEdit={handleEditExpense} onUndo={handleUndoDelete} hasDeletedItems={deletedExpenses.length > 0} />;
      case 'reports':
        return <Reports expenses={expenses} />;
      case 'settings':
        return (
          <CategoryManager
            customCategories={customCategories}
            onAddCategory={handleAddCustomCategory}
            onDeleteCategory={handleDeleteCustomCategory}
            aiSettings={aiSettings}
            onUpdateAISettings={handleUpdateAISettings}
          />
        );
      default:
        return <Dashboard expenses={expenses} onAddClick={() => setIsFormOpen(true)} onNavigate={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-slate-900 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-gradient-to-b from-emerald-950 to-green-950 border-r border-emerald-800/50 p-6 space-y-8 sticky top-0 h-screen shadow-2xl">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/50">
            <Wallet size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">FinTrack Pro</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeView === item.id 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/50' 
                  : 'text-slate-300 hover:bg-emerald-900/30 hover:text-emerald-300'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="bg-gradient-to-br from-emerald-900/40 to-green-900/40 p-4 rounded-xl border border-emerald-700/50">
          <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-2">Creator</p>
          <p className="text-sm font-medium text-slate-200 leading-tight">Built with ❤️ by Mark Nissanka</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-gradient-to-r from-emerald-950 to-green-900 border-b border-emerald-800/50 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/50">
            <Wallet size={18} />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-300 to-green-400 bg-clip-text text-transparent">FinTrack Pro</span>
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
        <div className="md:hidden fixed inset-0 z-40 bg-gradient-to-br from-emerald-900 to-green-950 p-6 pt-20 animate-in slide-in-from-top duration-300">
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
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/50' 
                    : 'bg-slate-800 text-slate-300 hover:bg-emerald-900/50'
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
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/50"
            >
              <Plus size={20} />
              Add Transaction
            </button>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full bg-gradient-to-br from-green-900 via-emerald-900 to-green-950">
        {renderView()}
      </main>

      {/* Global Add Button (Mobile Floating) */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="md:hidden fixed right-6 bottom-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-30"
      >
        <Plus size={24} />
      </button>

      {/* Camera Scanner Button (Mobile Floating - Secondary) */}
      <button 
        onClick={() => setIsScannerOpen(true)}
        className="md:hidden fixed right-6 bottom-24 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-30"
        title="Scan bill with camera"
      >
        <CameraIcon size={24} />
      </button>

      {/* Expense Modal */}
      <ExpenseForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        onSubmit={handleAddExpense}
        editingExpense={editingExpense}
        customCategories={customCategories}
      />

      {/* Camera Scanner Modal */}
      <CameraScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAddExpense={handleAddExpense}
        aiProvider={aiSettings.activeProvider}
        aiConfig={aiSettings.providers[aiSettings.activeProvider]}
        customCategories={customCategories}
      />
    </div>
  );
};

export default App;
