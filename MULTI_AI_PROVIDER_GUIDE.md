# 🤖 Multi-AI Provider Integration - Complete Guide

## Overview
FinTrack now supports **5 different AI providers** for generating personalized financial advice. Users can switch between providers and configure their preferred AI service.

## Supported AI Providers

### 1. **Google Gemini** ⚡
- **Speed**: Ultra-fast
- **Cost**: Free tier available
- **Model**: `gemini-3-flash-preview`
- **Setup**: Get API key at [ai.google.dev](https://ai.google.dev)
- **Ideal for**: Quick, efficient responses

### 2. **ChatGPT (OpenAI)** 🧠
- **Power**: Most capable language model
- **Cost**: Pay-per-use ($0.50/M input tokens)
- **Model**: `gpt-3.5-turbo`
- **Setup**: Get API key at [platform.openai.com](https://platform.openai.com)
- **Ideal for**: Detailed, nuanced financial analysis

### 3. **DeepSeek** 🔍
- **Speed**: Very fast
- **Cost**: Affordable
- **Model**: `deepseek-chat`
- **Setup**: Get API key at [www.deepseek.com](https://www.deepseek.com)
- **Ideal for**: Cost-effective analysis

### 4. **Claude (Anthropic)** 🛡️
- **Quality**: Highest quality responses
- **Cost**: $3/M input tokens
- **Model**: `claude-3-haiku-20240307`
- **Setup**: Get API key at [docs.anthropic.com](https://docs.anthropic.com)
- **Ideal for**: Safety-conscious users, detailed reasoning

### 5. **Groq** ⚡⚡
- **Speed**: Lightning fast
- **Cost**: Free tier available
- **Model**: `mixtral-8x7b-32768`
- **Setup**: Get API key at [console.groq.com](https://console.groq.com)
- **Ideal for**: High-speed inference

## How to Use

### Step 1: Access AI Settings
1. Click **"Categories"** button in the sidebar (⚙️ icon)
2. Click the **"🤖 AI Providers"** tab

### Step 2: Add a Provider
1. Select an AI provider from the dropdown
2. Click "Get API Key" to open the provider's documentation
3. Follow their signup process to get an API key
4. Paste your API key into the input field
5. Click **"Add Provider"** button

### Step 3: Use Your Provider
1. Once configured, the provider appears in "Configured Providers"
2. Click **"Use"** to set it as active (active providers are marked ✅)
3. Go back to Dashboard
4. The AI Insights section will use your selected provider

### Step 4: Switch Providers
1. Return to AI Providers settings
2. Click **"Use"** on any configured provider to switch
3. The AI Insights will immediately use the new provider

## Feature Details

### ✅ Provider Management
- **Add Multiple**: Configure as many providers as you want
- **Switch Anytime**: Change active provider instantly
- **Test Connection**: Verify API key validity with "Test" button
- **Secure Storage**: API keys stored in browser's localStorage (encrypted for security)
- **Delete**: Remove providers you no longer need

### 🔒 Security
- API keys stored locally in your browser
- Never sent to FinTrack servers
- Always transmitted directly to the AI provider's API
- Clear local storage button to purge all keys (coming soon)

### 📊 AI Insights
When you have a provider configured:
- Automatic financial advice generation from your transaction history
- Personalized recommendations based on spending patterns
- "Refresh Advice" button to get new insights
- Error messages with setup instructions if provider not configured

## Error Handling

### "Provider not configured"
- Go to AI Providers settings
- Add an API key for the selected provider

### "Invalid API key format"
- Verify the API key from the provider's dashboard
- Ensure you copied the entire key
- Check for extra spaces or characters

### "Connection failed"
- Verify your internet connection
- Check if the provider's API is operational
- Try a different provider as backup

## API Key Sources

| Provider | Get Key | Free Tier | Cost |
|----------|---------|-----------|------|
| Gemini | [ai.google.dev](https://ai.google.dev) | ✅ Yes | Free tier available |
| ChatGPT | [platform.openai.com](https://platform.openai.com) | ❌ No | $0.50/M input tokens |
| DeepSeek | [www.deepseek.com](https://www.deepseek.com) | ✅ Yes | Very affordable |
| Claude | [docs.anthropic.com](https://docs.anthropic.com) | ❌ No | $3/M input tokens |
| Groq | [console.groq.com](https://console.groq.com) | ✅ Yes | Free tier available |

## Technical Architecture

### Service Layer
**File**: `services/aiProviderService.ts`

Functions:
- `getFinancialAdvice(expenses, provider, apiKey)` - Main entry point
- `getAdviceFromGemini()` - Gemini-specific logic
- `getAdviceFromChatGPT()` - OpenAI-specific logic
- `getAdviceFromDeepSeek()` - DeepSeek-specific logic
- `getAdviceFromClaude()` - Anthropic-specific logic
- `getAdviceFromGroq()` - Groq-specific logic
- `getProviderInfo()` - Provider metadata and links

### UI Components
**File**: `components/AISettingsComponent.tsx`

Features:
- Provider selection buttons
- API key input with show/hide toggle
- Configured providers list
- Active provider indicator
- Test connection button
- Delete provider button
- Link to provider documentation

### State Management
**File**: `App.tsx`

Tracks:
- `aiSettings.activeProvider` - Currently selected provider
- `aiSettings.providers` - Configuration for each provider
- localStorage key: `'fintrack_ai_settings'`

### Dashboard Integration
**File**: `pages/Dashboard.tsx`

Updates:
- "FinTrack AI Insights" section now multi-provider aware
- Shows error message if provider not configured
- "Go to Settings" link in error state
- Refresh button disabled until configured

## Workflows

### Workflow 1: First-Time Setup
```
User clicks Dashboard → Sees "FinTrack AI Insights" → 
Click "Refresh Advice" → Gets error "Provider not configured" →
Click "Go to Settings" → 
Select provider (e.g., Gemini) →
Get API key from ai.google.dev →
Paste key → Add Provider →
Go back to Dashboard →
AI Insights now work!
```

### Workflow 2: Switch Providers
```
Already have ChatGPT configured →
Click "Categories" (Settings) →
Go to "AI Providers" tab →
Click "Use" on DeepSeek →
Go back to Dashboard →
Refresh Advice →
Now using DeepSeek!
```

### Workflow 3: Add Backup Provider
```
Have Gemini as primary →
Add ChatGPT as backup →
Both appear in "Configured Providers" →
Can instantly switch if Gemini fails →
"Test" button verifies connectivity
```

## Best Practices

### ✅ Do's
- Use free tier providers (Gemini, DeepSeek, Groq) to start
- Add multiple providers for redundancy
- Regularly test connections with "Test" button
- Use "Refresh Advice" when spending patterns change
- Keep API keys secure and don't share them

### ❌ Don'ts
- Don't share your API keys with anyone
- Don't commit API keys to version control
- Don't use expired or revoked keys
- Don't store keys outside the app if possible
- Don't forget to delete keys before giving device to others

## Troubleshooting

### AI Advice Not Appearing
1. Check if you have any expenses logged
2. Go to Settings → AI Providers
3. Verify a provider is marked as active (✅)
4. Click "Test" to verify API key
5. If test passes, click "Refresh Advice" in Dashboard

### "Invalid API Key" Error
1. Go to provider's API dashboard
2. Generate a new API key
3. Copy the entire key (check for trailing spaces)
4. Go to Settings → AI Providers
5. Delete old provider
6. Add new provider with new key
7. Test connection

### Provider Not Responding
1. Check your internet connection
2. Try refreshing the page
3. Switch to a different configured provider
4. Wait a few minutes and retry

## Future Enhancements

Coming soon:
- [ ] Custom prompt templates per provider
- [ ] Voice output for advice
- [ ] Historical advice tracking
- [ ] Provider reliability metrics
- [ ] Cost estimation dashboard
- [ ] Batch processing for multiple analyses
- [ ] Scheduled advice generation

## Related Files Modified

1. ✅ `types.ts` - Added AIProvider, AISettings types
2. ✅ `services/aiProviderService.ts` - New file with multi-provider support
3. ✅ `components/AISettingsComponent.tsx` - New UI for AI settings
4. ✅ `components/CategoryManager.tsx` - Updated with tabs + AI settings
5. ✅ `App.tsx` - State management for aiSettings
6. ✅ `pages/Dashboard.tsx` - Integrated multi-provider support

## Summary

FinTrack now offers **enterprise-grade AI flexibility**! Users can:
- Choose their preferred AI provider
- Configure multiple providers for redundancy
- Switch instantly between providers
- Get personalized financial advice from any major AI platform
- Maintain full control of their API keys locally

This makes FinTrack the most flexible expense tracker for AI-powered insights! 🚀
