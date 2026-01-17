import React from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { Expense } from '../types';
import { exportToCSV, exportToJSON } from '../services/exportService';

interface ExportButtonProps {
  expenses: Expense[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ expenses }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-all border border-slate-700"
        title="Export your expenses"
      >
        <Download size={18} />
        <span className="hidden sm:inline">Export</span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800/95 rounded-lg shadow-lg border border-slate-700 z-10">
          <button
            onClick={() => {
              exportToCSV(expenses);
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 border-b border-slate-700 transition-all"
          >
            <FileText size={18} className="text-emerald-400" />
            <div>
              <p className="font-semibold text-slate-100">Export as CSV</p>
              <p className="text-xs text-slate-400">Excel/Spreadsheet format</p>
            </div>
          </button>
          <button
            onClick={() => {
              exportToJSON(expenses);
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700 transition-all"
          >
            <FileJson size={18} className="text-blue-400" />
            <div>
              <p className="font-semibold text-slate-100">Export as JSON</p>
              <p className="text-xs text-slate-400">Data backup format</p>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportButton;
