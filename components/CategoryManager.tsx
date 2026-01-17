import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CustomCategory, AISettings } from '../types';
import { AISettingsComponent } from './AISettingsComponent';

interface CategoryManagerProps {
  customCategories: CustomCategory[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  aiSettings: AISettings;
  onUpdateAISettings: (settings: AISettings) => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  customCategories,
  onAddCategory,
  onDeleteCategory,
  aiSettings,
  onUpdateAISettings,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [activeTab, setActiveTab] = useState<'categories' | 'ai'>('categories');

  const handleAddClick = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const predefinedCategories = [
    { name: 'Food', color: '#f59e0b' },
    { name: 'Transport', color: '#0ea5e9' },
    { name: 'Entertainment', color: '#8b5cf6' },
    { name: 'Utilities', color: '#ec4899' },
    { name: 'Healthcare', color: '#10b981' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-emerald-950 via-green-900 to-slate-900 rounded-lg p-6 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent mb-2">Settings</h2>
          <p className="text-slate-300 text-sm">Manage categories and configure AI providers</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700/50">
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${
              activeTab === 'categories'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            📁 Categories
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all ${
              activeTab === 'ai'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            🤖 AI Providers
          </button>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Add New Category */}
            <div className="bg-slate-50/5 rounded-lg p-6 border border-emerald-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Add New Category</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddClick()}
                  placeholder="Enter category name (e.g., Subscriptions)"
                  className="flex-1 px-4 py-2 bg-slate-900/50 border border-emerald-500/30 rounded text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={handleAddClick}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium flex items-center gap-2 transition-colors"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </div>

            {/* Predefined Categories */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Predefined Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {predefinedCategories.map((cat) => (
                  <div key={cat.name} className="bg-slate-50/10 rounded-lg p-4 text-center border border-slate-500/20">
                    <div
                      className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: cat.color }}
                    />
                    <p className="text-white text-sm font-medium">{cat.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Categories */}
            {customCategories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Your Custom Categories</h3>
                <div className="space-y-2">
                  {customCategories.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between bg-slate-50/5 hover:bg-slate-50/10 rounded-lg p-4 border border-slate-500/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-white font-medium">{cat.name}</span>
                      </div>
                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        title="Delete category"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customCategories.length === 0 && (
              <div className="bg-slate-50/5 rounded-lg p-8 text-center border border-slate-500/10">
                <p className="text-slate-400 mb-2">No custom categories yet</p>
                <p className="text-slate-500 text-sm">Create your first custom category above to get started</p>
              </div>
            )}
          </div>
        )}

        {/* AI Providers Tab */}
        {activeTab === 'ai' && (
          <AISettingsComponent
            aiSettings={aiSettings}
            onUpdateSettings={onUpdateAISettings}
          />
        )}
      </div>
    </div>
  );
};
