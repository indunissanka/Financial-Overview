
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, colorClass }) => {
  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl shadow-sm border border-slate-700/50 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.isUp ? 'text-emerald-400 bg-emerald-950/50' : 'text-red-400 bg-red-950/50'}`}>
            {trend.isUp ? '+' : '-'}{trend.value}%
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-300 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-100 mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
