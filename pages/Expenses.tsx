
import React, { useState } from 'react';
import { Search, Filter, Trash2, Edit3, ArrowUpDown, RotateCcw } from 'lucide-react';
import { Expense, Category } from '../types';
import CategoryBadge from '../components/CategoryBadge';

interface ExpensesProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit?: (expense: Expense) => void;
  onUndo?: () => void;
  hasDeletedItems?: boolean;
}

const Expenses: React.FC<ExpensesProps> = ({ expenses, onDelete, onEdit, onUndo, hasDeletedItems }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const filteredExpenses = expenses
    .filter(e => {
      const matchesSearch = (e.note || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                            e.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
      const matchesDateRange = (!dateRange.start || e.date >= dateRange.start) && 
                               (!dateRange.end || e.date <= dateRange.end);
      return matchesSearch && matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent tracking-tight">Transaction History</h1>
        <p className="text-slate-300 mt-1">Detailed list of all your logs.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between bg-slate-900/50 p-4 rounded-2xl shadow-sm border border-slate-700/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search notes or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm text-white placeholder-slate-400"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="all">All Categories</option>
            {Object.values(Category).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="px-4 py-2 bg-slate-800 text-slate-200 rounded-xl flex items-center gap-2 text-sm hover:bg-slate-700 transition-all border border-slate-700"
          >
            <ArrowUpDown size={16} />
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </button>
          {hasDeletedItems && onUndo && (
            <button
              onClick={onUndo}
              className="px-4 py-2 bg-amber-900/50 text-amber-200 rounded-xl flex items-center gap-2 text-sm hover:bg-amber-900/70 transition-all border border-amber-700/50"
              title="Undo last deletion"
            >
              <RotateCcw size={16} />
              Undo
            </button>
          )}
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-2xl shadow-sm border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/70">
                <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Note</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredExpenses.map(e => (
                <tr key={e.id} className="hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-300 font-medium">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <CategoryBadge category={e.category} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-200 font-medium">
                    {e.note || <span className="text-slate-400 italic">No note</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {e.paymentMethod}
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold text-right ${e.category === Category.Income ? 'text-green-400' : 'text-slate-200'}`}>
                    {e.category === Category.Income ? '+' : '-'}${e.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(e)}
                          className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 rounded-lg transition-all"
                          title="Edit this expense"
                        >
                          <Edit3 size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => onDelete(e.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all"
                        title="Delete this expense"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Expenses;
