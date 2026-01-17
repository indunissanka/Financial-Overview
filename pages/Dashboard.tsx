
import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Sparkles, Plus, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Expense, Category, ViewType } from '../types';
import StatCard from '../components/StatCard';
import CategoryBadge from '../components/CategoryBadge';
import { getFinancialAdvice } from '../services/geminiService';

interface DashboardProps {
  expenses: Expense[];
  onAddClick: () => void;
  onNavigate: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ expenses, onAddClick, onNavigate }) => {
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const stats = React.useMemo(() => {
    const totalExpenses = expenses.filter(e => e.category !== Category.Income).reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = expenses.filter(e => e.category === Category.Income).reduce((sum, e) => sum + e.amount, 0);
    return {
      balance: totalIncome - totalExpenses,
      expenses: totalExpenses,
      income: totalIncome
    };
  }, [expenses]);

  const recentTransactions = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const chartData = React.useMemo(() => {
    const categories = Object.values(Category).filter(c => c !== Category.Income);
    return categories.map(cat => ({
      name: cat,
      value: expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    })).filter(d => d.value > 0);
  }, [expenses]);

  const fetchAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(expenses);
    setAiAdvice(advice);
    setIsAiLoading(false);
  };

  useEffect(() => {
    if (expenses.length > 0 && !aiAdvice) {
      fetchAdvice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Financial Overview</h1>
          <p className="text-slate-500 mt-1">Track and manage your spending habits with ease.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-indigo-200 shadow-lg hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={20} />
          New Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Current Balance" 
          value={`$${stats.balance.toLocaleString()}`} 
          icon={<Wallet size={24} />} 
          colorClass="bg-indigo-500 text-indigo-500"
        />
        <StatCard 
          title="Total Expenses" 
          value={`$${stats.expenses.toLocaleString()}`} 
          icon={<TrendingDown size={24} />} 
          trend={{ value: 12, isUp: false }}
          colorClass="bg-red-500 text-red-500"
        />
        <StatCard 
          title="Total Income" 
          value={`$${stats.income.toLocaleString()}`} 
          icon={<TrendingUp size={24} />} 
          trend={{ value: 8, isUp: true }}
          colorClass="bg-green-500 text-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Spending by Category</h3>
            <div className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 6]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No spending data yet. Add some expenses to see charts.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
              <button 
                onClick={() => onNavigate('expenses')}
                className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recentTransactions.map(expense => (
                <div key={expense.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <CategoryBadge category={expense.category} />
                    <div>
                      <p className="font-semibold text-slate-800">{expense.note || expense.category}</p>
                      <p className="text-xs text-slate-400">{new Date(expense.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${expense.category === Category.Income ? 'text-green-600' : 'text-slate-900'}`}>
                    {expense.category === Category.Income ? '+' : '-'}${expense.amount.toFixed(2)}
                  </p>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <p className="text-center text-slate-400 py-8">No transactions yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar AI Section */}
        <div className="space-y-8">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={20} className="text-indigo-300" />
                <h3 className="text-lg font-bold">Lumina Smart Insights</h3>
              </div>
              
              {isAiLoading ? (
                <div className="space-y-3 py-4">
                  <div className="h-4 bg-white/10 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-white/10 rounded w-4/6 animate-pulse"></div>
                </div>
              ) : (
                <div className="text-indigo-100 text-sm leading-relaxed space-y-4 whitespace-pre-line">
                  {aiAdvice || "Start logging your expenses to get personalized AI-powered financial advice!"}
                </div>
              )}

              <button 
                onClick={fetchAdvice}
                disabled={isAiLoading}
                className="mt-6 w-full py-2 bg-indigo-500/30 hover:bg-indigo-500/50 border border-indigo-400/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
              >
                {isAiLoading ? 'Analyzing...' : 'Refresh Advice'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Payment Distribution</h3>
            <div className="h-48">
              {/* Simple distribution visualize */}
              <div className="space-y-4">
                {['Debit Card', 'Credit Card', 'Cash', 'Bank Transfer'].map(method => {
                  const total = expenses.filter(e => e.paymentMethod === method).reduce((sum, e) => sum + e.amount, 0);
                  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0) || 1;
                  const percentage = Math.round((total / grandTotal) * 100);
                  return (
                    <div key={method}>
                      <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                        <span>{method}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
