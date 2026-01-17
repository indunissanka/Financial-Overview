
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category, PaymentMethod, Expense, CustomCategory } from '../types';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  editingExpense?: Expense | null;
  customCategories?: CustomCategory[];
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ isOpen, onClose, onSubmit, editingExpense, customCategories = [] }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>(Category.Food);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.DebitCard);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setNote(editingExpense.note);
      setPaymentMethod(editingExpense.paymentMethod);
      setIsRecurring(editingExpense.isRecurring || false);
      setRecurringFrequency(editingExpense.recurringFrequency || 'monthly');
    } else {
      setAmount('');
      setCategory(Category.Food);
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      setPaymentMethod(PaymentMethod.DebitCard);
      setIsRecurring(false);
      setRecurringFrequency('monthly');
    }
  }, [editingExpense, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    onSubmit({
      amount: Number(amount),
      category,
      date,
      note,
      paymentMethod,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
    });
    
    // Reset
    setAmount('');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-800/95 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-slate-100">{editingExpense ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} className="text-slate-300" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Amount ($)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all outline-none text-lg font-semibold placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
              >
                <optgroup label="Predefined Categories">
                  {Object.values(Category).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </optgroup>
                {customCategories.length > 0 && (
                  <optgroup label="Custom Categories">
                    {customCategories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PaymentMethod).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                    paymentMethod === method 
                      ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300 font-semibold' 
                      : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Notes</label>
            <textarea
              placeholder="Add a note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none resize-none placeholder-slate-400"
              rows={2}
            />
          </div>

          <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-4 h-4 rounded border-slate-500"
              />
              <span className="text-sm font-medium text-slate-200">Mark as recurring</span>
            </label>
            {isRecurring && (
              <select
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value as any)}
                className="w-full mt-2 px-3 py-2 text-sm rounded-lg border border-slate-600 bg-slate-700 text-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            {editingExpense ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
