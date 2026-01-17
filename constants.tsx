
import React from 'react';
import { 
  Utensils, 
  Car, 
  Film, 
  ShoppingBag, 
  Zap, 
  Activity, 
  PlusCircle, 
  MoreHorizontal,
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  LayoutDashboard,
  Receipt,
  Sparkles
} from 'lucide-react';
import { Category } from './types';

export const CATEGORY_CONFIG: Record<Category, { color: string; icon: React.ReactNode; bgColor: string }> = {
  [Category.Food]: { 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-100',
    icon: <Utensils size={16} /> 
  },
  [Category.Transport]: { 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-100',
    icon: <Car size={16} /> 
  },
  [Category.Entertainment]: { 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-100',
    icon: <Film size={16} /> 
  },
  [Category.Shopping]: { 
    color: 'text-pink-600', 
    bgColor: 'bg-pink-100',
    icon: <ShoppingBag size={16} /> 
  },
  [Category.Utilities]: { 
    color: 'text-yellow-600', 
    bgColor: 'bg-yellow-100',
    icon: <Zap size={16} /> 
  },
  [Category.Health]: { 
    color: 'text-red-400', 
    bgColor: 'bg-red-950/30',
    icon: <Activity size={16} /> 
  },
  [Category.Income]: { 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-950/30',
    icon: <PlusCircle size={16} /> 
  },
  [Category.Others]: { 
    color: 'text-slate-600', 
    bgColor: 'bg-slate-100',
    icon: <MoreHorizontal size={16} /> 
  },
};

export const INITIAL_EXPENSES = [
  { id: '1', amount: 1200, category: Category.Income, date: '2024-03-01', note: 'Monthly Salary', paymentMethod: 'Bank Transfer' },
  { id: '2', amount: 45, category: Category.Food, date: '2024-03-02', note: 'Dinner with friends', paymentMethod: 'Debit Card' },
  { id: '3', amount: 30, category: Category.Transport, date: '2024-03-03', note: 'Uber ride', paymentMethod: 'Credit Card' },
  { id: '4', amount: 150, category: Category.Shopping, date: '2024-03-05', note: 'New shoes', paymentMethod: 'Credit Card' },
  { id: '5', amount: 80, category: Category.Utilities, date: '2024-03-07', note: 'Electricity bill', paymentMethod: 'Bank Transfer' },
  { id: '6', amount: 25, category: Category.Health, date: '2024-03-10', note: 'Gym supplement', paymentMethod: 'Cash' },
  { id: '7', amount: 60, category: Category.Entertainment, date: '2024-03-12', note: 'Movie tickets', paymentMethod: 'Debit Card' },
  { id: '8', amount: 200, category: Category.Shopping, date: '2024-03-15', note: 'Groceries', paymentMethod: 'Debit Card' },
];
