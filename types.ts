
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
}

export interface FinancialStats {
  totalExpenses: number;
  totalIncome: number;
  balance: number;
  categoryTotals: Record<Category, number>;
  monthlyHistory: { month: string; amount: number; income: number }[];
}

export type ViewType = 'dashboard' | 'expenses' | 'reports';
