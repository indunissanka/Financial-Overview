
export enum Category {
  Food = 'Food',
  Transport = 'Transport',
  Entertainment = 'Entertainment',
  Shopping = 'Shopping',
  Utilities = 'Utilities',
  Health = 'Health',
  Income = 'Income',
  Others = 'Others'
}

export type CategoryType = Category | string; // Allow custom categories

export interface CustomCategory {
  id: string;
  name: string;
  color: string; // hex color or tailwind class
  icon?: string;
}

export enum PaymentMethod {
  Cash = 'Cash',
  CreditCard = 'Credit Card',
  DebitCard = 'Debit Card',
  BankTransfer = 'Bank Transfer'
}

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  note: string;
  paymentMethod: PaymentMethod;
  isRecurring?: boolean;
  recurringFrequency?: 'monthly' | 'weekly' | 'daily';
}

export interface Budget {
  id: string;
  category: Category;
  limit: number;
  month: string; // YYYY-MM format
}

export interface FinancialStats {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  categoryTotals: Record<Category, number>;
  monthlyHistory: { month: string; amount: number; income: number }[];
}

export type ViewType = 'dashboard' | 'expenses' | 'reports' | 'settings';

export type AIProvider = 'gemini' | 'chatgpt' | 'deepseek' | 'claude' | 'groq';

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
  name: string;
}

export interface AISettings {
  activeProvider: AIProvider;
  providers: Record<AIProvider, AIProviderConfig | null>;
}

