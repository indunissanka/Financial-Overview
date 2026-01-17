
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Expense, Category } from '../types';
import { CATEGORY_CONFIG } from '../constants';

interface ReportsProps {
  expenses: Expense[];
}

const Reports: React.FC<ReportsProps> = ({ expenses }) => {
  const categoryData = React.useMemo(() => {
    const data: any[] = [];
    Object.values(Category).forEach(cat => {
      if (cat === Category.Income) return;
      const amount = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
      if (amount > 0) {
        data.push({ name: cat, value: amount, color: CATEGORY_CONFIG[cat].color.replace('text-', '') });
      }
    });
    return data;
  }, [expenses]);

  const monthlyTrend = React.useMemo(() => {
    // Basic grouping by date for the last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last30Days.map(date => ({
      date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount: expenses.filter(e => e.date === date && e.category !== Category.Income).reduce((sum, e) => sum + e.amount, 0),
      income: expenses.filter(e => e.date === date && e.category === Category.Income).reduce((sum, e) => sum + e.amount, 0)
    }));
  }, [expenses]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent tracking-tight">Spending Reports</h1>
        <p className="text-slate-300 mt-1">Deep dive into your financial data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 p-8 rounded-2xl shadow-sm border border-slate-700/50">
          <h3 className="text-xl font-bold text-slate-100 mb-8">Category Distribution</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#0ea5e9'][index % 7]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)', backgroundColor: '#1e293b', color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 p-8 rounded-2xl shadow-sm border border-slate-700/50">
          <h3 className="text-xl font-bold text-slate-100 mb-8">Spending Over Time</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)', backgroundColor: '#1e293b', color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#ef4444" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 p-8 rounded-2xl shadow-sm border border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-100 mb-6">Efficiency Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg. Daily Spend', value: `$${(expenses.reduce((s, e) => e.category !== Category.Income ? s + e.amount : s, 0) / 30).toFixed(2)}` },
            { label: 'Transactions count', value: expenses.length },
            { label: 'Top Category', value: categoryData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A' },
            { label: 'Savings Rate', value: `${Math.max(0, Math.round(((expenses.filter(e => e.category === Category.Income).reduce((s, e) => s + e.amount, 0) - expenses.filter(e => e.category !== Category.Income).reduce((s, e) => s + e.amount, 0)) / (expenses.filter(e => e.category === Category.Income).reduce((s, e) => s + e.amount, 0) || 1)) * 100))}%` },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-xl font-extrabold text-slate-100">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
