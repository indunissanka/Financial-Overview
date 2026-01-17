<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 💰 Lumina Expense Tracker

Professional-grade expense tracking with AI-powered financial advice, data export, and intelligent features.

View your app in AI Studio: https://ai.studio/apps/drive/13YuyQOF11J5hKCLGEoD9rPt2RVLHks57

## ✨ Features

### Core Features:
- 📊 **Dashboard** - Real-time financial overview with charts
- 💳 **Transaction Management** - Track all expenses with categories
- 📈 **Reports** - Visualize spending patterns
- 🤖 **AI Advisor** - Get personalized financial advice via Google Gemini

### Enhanced Features (NEW):
- ✏️ **Edit Expenses** - Modify transactions after creation
- 💾 **Export Data** - Download expenses as CSV or JSON
- ↩️ **Undo Delete** - Restore accidentally deleted transactions
- 🔄 **Recurring Expenses** - Mark subscriptions and regular payments
- 🎯 **Smart Filtering** - Filter by category, date range, and more

## 🚀 Quick Start

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🎯 How to Use New Features

### Edit an Expense:
1. Go to **Transactions**
2. Click the pencil (✏️) icon on any expense
3. Make your changes
4. Click **Update Transaction**

### Export Your Data:
1. Go to **Dashboard**
2. Click **Export** button
3. Choose CSV or JSON format
4. File downloads automatically

### Undo a Delete:
1. Delete any expense
2. Click **Undo** button (appears in filters)
3. Expense is restored!

### Add Recurring Expense:
1. Click **Add Transaction**
2. Check "Mark as recurring"
3. Select frequency (Daily/Weekly/Monthly)
4. Save!

## 📚 Documentation

- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Fast lookup guide
- **[FEATURE_GUIDE.md](./FEATURE_GUIDE.md)** - Detailed feature implementation
- **[UPDATE_SUMMARY.md](./UPDATE_SUMMARY.md)** - What's new overview
- **[UI_CHANGES.md](./UI_CHANGES.md)** - Visual updates
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** - Technical details

## 🛠️ Built With

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Google Gemini API** - AI-powered advice

## 📦 Project Structure

```
src/
├── App.tsx                 # Main app component
├── components/            # Reusable components
│   ├── CategoryBadge.tsx
│   ├── ExpenseForm.tsx    # Edit + add support
│   ├── ExportButton.tsx   # NEW: Export UI
│   └── StatCard.tsx
├── pages/                 # Page components
│   ├── Dashboard.tsx      # With export
│   ├── Expenses.tsx       # With edit + undo
│   └── Reports.tsx
├── services/              # Business logic
│   ├── geminiService.ts
│   └── exportService.ts   # NEW: CSV/JSON export
├── types.ts               # TypeScript definitions
└── constants.tsx          # App constants
```

## 🔄 Version History

### v0.1.0 (Current) - Enhanced Edition
- ✅ Edit expenses
- ✅ Export to CSV/JSON
- ✅ Undo deletions
- ✅ Recurring expenses
- ✅ Budget foundation

### v0.0.0 - MVP
- Basic expense tracking
- AI financial advice
- Category-based organization

## 🚀 Future Enhancements

- [ ] Budget alerts and limits
- [ ] Auto-generate recurring transactions
- [ ] Date range reporting
- [ ] Import CSV data
- [ ] Dark mode
- [ ] Multi-user support
- [ ] Cloud sync

## 💡 Tips

- Expenses auto-save to localStorage
- Export regularly for backups
- Use categories to organize spending
- Mark subscriptions as recurring
- Check AI insights on Dashboard

## 📄 License

This app is part of Google's AI Studio initiative.

## 🤝 Contributing

Have ideas for improvements? The codebase is structured for easy feature additions!

---

**Happy tracking!** 💰✨
