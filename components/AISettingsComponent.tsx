import React, { useState } from 'react';
import { ExternalLink, Eye, EyeOff, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { AIProvider, AISettings } from '../types';
import { getProviderInfo } from '../services/aiProviderService';

interface AISettingsComponentProps {
  aiSettings: AISettings;
  onUpdateSettings: (settings: AISettings) => void;
}

const AI_PROVIDERS: { value: AIProvider; label: string }[] = [
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'chatgpt', label: 'ChatGPT (OpenAI)' },
  { value: 'deepseek', label: 'DeepSeek' },
  { value: 'claude', label: 'Claude (Anthropic)' },
  { value: 'groq', label: 'Groq' },
];

export const AISettingsComponent: React.FC<AISettingsComponentProps> = ({ aiSettings, onUpdateSettings }) => {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(aiSettings.activeProvider);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [testingProvider, setTestingProvider] = useState<AIProvider | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const currentProvider = aiSettings.providers[selectedProvider];
  const hasApiKey = !!currentProvider?.apiKey;

  const handleAddProvider = () => {
    if (!apiKey.trim()) {
      alert('Please enter an API key');
      return;
    }

    const updatedSettings: AISettings = {
      ...aiSettings,
      activeProvider: selectedProvider,
      providers: {
        ...aiSettings.providers,
        [selectedProvider]: {
          provider: selectedProvider,
          apiKey: apiKey.trim(),
          name: getProviderInfo(selectedProvider).name,
        },
      },
    };

    onUpdateSettings(updatedSettings);
    setApiKey('');
    alert('✅ Provider configured successfully!');
  };

  const handleRemoveProvider = (provider: AIProvider) => {
    const updatedSettings: AISettings = {
      ...aiSettings,
      providers: {
        ...aiSettings.providers,
        [provider]: null,
      },
    };

    if (aiSettings.activeProvider === provider) {
      const availableProviders = AI_PROVIDERS.find(p => aiSettings.providers[p.value]);
      if (availableProviders) {
        updatedSettings.activeProvider = availableProviders.value;
      }
    }

    onUpdateSettings(updatedSettings);
  };

  const handleSetActive = (provider: AIProvider) => {
    if (aiSettings.providers[provider]) {
      onUpdateSettings({
        ...aiSettings,
        activeProvider: provider,
      });
      setSelectedProvider(provider);
    }
  };

  const testProvider = async (provider: AIProvider) => {
    setTestingProvider(provider);
    setTestResult(null);

    const providerConfig = aiSettings.providers[provider];
    if (!providerConfig) {
      setTestResult({ success: false, message: 'Provider not configured' });
      setTestingProvider(null);
      return;
    }

    try {
      // Simple test - just validate API key format
      if (!providerConfig.apiKey || providerConfig.apiKey.length < 10) {
        setTestResult({ success: false, message: 'Invalid API key format' });
      } else {
        setTestResult({ success: true, message: 'API key format looks good!' });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Connection test failed' });
    }

    setTestingProvider(null);
  };

  const providerInfo = getProviderInfo(selectedProvider);

  return (
    <div className="space-y-6 mt-8">
      {/* Add Provider Section */}
      <div className="bg-slate-50/5 rounded-lg p-6 border border-emerald-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">🤖 Add AI Provider</h3>
        
        <div className="space-y-4">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Provider</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AI_PROVIDERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setSelectedProvider(value)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                    selectedProvider === value
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Provider Info */}
          <div className="bg-slate-900/30 rounded-lg p-4 border border-slate-700/50">
            <p className="text-slate-300 text-sm mb-2">{providerInfo.description}</p>
            <a
              href={providerInfo.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm"
            >
              Get API Key <ExternalLink size={14} />
            </a>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddProvider}
            className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            Add Provider
          </button>
        </div>
      </div>

      {/* Configured Providers */}
      <div className="bg-slate-50/5 rounded-lg p-6 border border-emerald-500/20">
        <h3 className="text-lg font-semibold text-white mb-4">⚙️ Configured Providers</h3>
        
        {Object.entries(aiSettings.providers).map(([provider, config]) => {
          if (!config) return null;
          const providerType = provider as AIProvider;
          const isActive = aiSettings.activeProvider === providerType;
          const typedConfig = config as any;
          
          return (
            <div
              key={provider}
              className={`flex items-center justify-between p-4 rounded-lg border mb-2 transition-all ${
                isActive
                  ? 'bg-emerald-900/20 border-emerald-500/50'
                  : 'bg-slate-900/20 border-slate-700/50'
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-medium">{typedConfig.name}</h4>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded text-emerald-300 text-xs font-medium">
                      <CheckCircle size={14} />
                      Active
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  API Key: {typedConfig.apiKey.substring(0, 8)}...
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {!isActive && (
                  <button
                    onClick={() => handleSetActive(providerType)}
                    className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    Use
                  </button>
                )}
                
                <button
                  onClick={() => testProvider(providerType)}
                  disabled={testingProvider === providerType}
                  className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors disabled:opacity-50"
                >
                  {testingProvider === providerType ? 'Testing...' : 'Test'}
                </button>
                
                <button
                  onClick={() => handleRemoveProvider(providerType)}
                  className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}

        {!Object.values(aiSettings.providers).some(p => p) && (
          <div className="text-center py-8 text-slate-400">
            <AlertCircle className="mx-auto mb-2 opacity-50" size={32} />
            <p>No providers configured yet. Add one above to get AI-powered insights!</p>
          </div>
        )}
      </div>

      {/* Test Result */}
      {testResult && (
        <div
          className={`p-4 rounded-lg border flex items-center gap-3 ${
            testResult.success
              ? 'bg-green-900/20 border-green-500/50 text-green-300'
              : 'bg-red-900/20 border-red-500/50 text-red-300'
          }`}
        >
          {testResult.success ? (
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{testResult.message}</span>
        </div>
      )}
    </div>
  );
};
