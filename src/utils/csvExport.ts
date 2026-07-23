import { Debt, Month, Transaction } from '../types';

/**
 * Helper to sanitize and escape CSV field values
 */
function escapeCsvField(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  // Replace double quotes with escaped double quotes
  const escaped = str.replace(/"/g, '""');
  return `"${escaped}"`;
}

/**
 * Convert transactions list into CSV format and trigger browser download
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  months: Month[],
  currencySymbol: string = '₹'
): void {
  const headers = [
    'Transaction ID',
    'Date',
    'Month ID',
    'Type',
    'Category',
    'Description',
    'Amount',
    'Currency',
    'Auto Generated EMI',
  ];

  // Map month IDs to month name if needed, or sort transactions by date descending
  const sortedTransactions = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  const rows = sortedTransactions.map((tx) => [
    escapeCsvField(tx.id),
    escapeCsvField(tx.date),
    escapeCsvField(tx.monthId),
    escapeCsvField(tx.type.toUpperCase()),
    escapeCsvField(tx.category),
    escapeCsvField(tx.description || '-'),
    escapeCsvField(tx.amount.toFixed(2)),
    escapeCsvField(currencySymbol),
    escapeCsvField(tx.isAuto ? 'Yes' : 'No'),
  ]);

  const csvLines = [
    headers.map(escapeCsvField).join(','),
    ...rows.map((row) => row.join(',')),
  ];

  const csvString = csvLines.join('\r\n');

  // \uFEFF is UTF-8 Byte Order Mark (BOM) so Excel/Numbers handles symbols like ₹, $, €, etc. correctly
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const todayStr = new Date().toISOString().split('T')[0];
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Expense_Tracker_Transactions_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert debts list into CSV format and trigger browser download
 */
export function exportDebtsToCSV(debts: Debt[], currencySymbol: string = '₹'): void {
  const headers = [
    'Debt ID',
    'Name / Title',
    'Monthly EMI',
    'Remaining Months',
    'Total Remaining Amount',
    'Status',
    'Currency',
    'Created Date',
  ];

  const rows = debts.map((d) => [
    escapeCsvField(d.id),
    escapeCsvField(d.name),
    escapeCsvField(d.emi.toFixed(2)),
    escapeCsvField(d.remainingMonths),
    escapeCsvField(d.remainingAmount.toFixed(2)),
    escapeCsvField(d.active ? 'Active' : 'Cleared'),
    escapeCsvField(currencySymbol),
    escapeCsvField(d.createdAt.split('T')[0] || d.createdAt),
  ]);

  const csvLines = [
    headers.map(escapeCsvField).join(','),
    ...rows.map((row) => row.join(',')),
  ];

  const csvString = csvLines.join('\r\n');
  const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const todayStr = new Date().toISOString().split('T')[0];
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Expense_Tracker_Debts_${todayStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
