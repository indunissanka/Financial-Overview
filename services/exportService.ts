import { Expense } from '../types';

export const exportToCSV = (expenses: Expense[]): void => {
  const headers = ['ID', 'Date', 'Category', 'Amount', 'Note', 'Payment Method', 'Recurring'];
  const rows = expenses.map(e => [
    e.id,
    e.date,
    e.category,
    e.amount,
    e.note,
    e.paymentMethod,
    e.isRecurring ? `${e.recurringFrequency}` : 'No'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (expenses: Expense[]): void => {
  const jsonString = JSON.stringify(expenses, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
