import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, PaymentMethod } from '../types';
import ArrowDownIcon from './icons/ArrowDownIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import CreditCardIcon from './icons/CreditCardIcon';
import CashIcon from './icons/CashIcon';
import RefreshIcon from './icons/RefreshIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: (id: string) => void; onEdit: (transaction: Transaction) => void; }> = ({ transaction, onDelete, onEdit }) => {
  const isExpense = transaction.type === TransactionType.EXPENSE;
  const formattedAmount = `Rp ${transaction.amount.toLocaleString('id-ID')}`;
  const formattedDate = new Date(transaction.date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <li className="flex items-center justify-between p-4 bg-slate-850 rounded-lg hover:bg-slate-800 transition-colors duration-200 gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isExpense ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
          {isExpense ? <ArrowDownIcon className="w-6 h-6" /> : <ArrowUpIcon className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{transaction.description}</p>
          <div className="flex items-center gap-2 flex-wrap text-slate-400">
            <p className="text-sm">{formattedDate}</p>
            <span className="text-slate-600">&bull;</span>
             <div className="flex items-center gap-1 text-sm">
              {transaction.paymentMethod === PaymentMethod.TRANSFER ? <CreditCardIcon className="w-4 h-4" /> : <CashIcon className="w-4 h-4" />}
              <span>{transaction.paymentMethod}</span>
            </div>
            {transaction.category && (
              <>
                <span className="text-slate-600">&bull;</span>
                <span className="text-xs font-medium bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full whitespace-nowrap">{transaction.category}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className={`font-semibold whitespace-nowrap ${isExpense ? 'text-red-400' : 'text-green-400'}`}>
          {isExpense ? '-' : '+'} {formattedAmount}
        </p>
        <button 
          onClick={() => onEdit(transaction)} 
          className="text-slate-500 hover:text-teal-400 transition-colors"
          aria-label={`Edit transaction ${transaction.description}`}
        >
          <PencilIcon />
        </button>
        <button 
          onClick={() => onDelete(transaction.id)} 
          className="text-slate-500 hover:text-red-500 transition-colors"
          aria-label={`Delete transaction ${transaction.description}`}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDeleteTransaction, onEditTransaction }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (!startDate && !endDate) return true;
      const transactionDate = new Date(t.date);

      if (startDate && transactionDate < new Date(startDate)) {
        return false;
      }
      if (endDate && transactionDate > new Date(endDate)) {
        return false;
      }
      return true;
    });
  }, [transactions, startDate, endDate]);

  const sortedTransactions = [...filteredTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-xl font-bold text-white">Riwayat Transaksi</h3>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-auto bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                aria-label="Dari tanggal"
            />
            <span className="text-slate-400 hidden sm:block">hingga</span>
            <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-auto bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                aria-label="Hingga tanggal"
                min={startDate}
            />
            {(startDate || endDate) && (
              <button 
                  onClick={handleResetFilters}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                  aria-label="Reset filter"
              >
                  <RefreshIcon className="w-5 h-5" />
              </button>
            )}
        </div>
      </div>

      {sortedTransactions.length > 0 ? (
        <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {sortedTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} onDelete={onDeleteTransaction} onEdit={onEditTransaction} />
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-center py-8">
          {transactions.length > 0 ? 'Tidak ada transaksi pada rentang tanggal yang dipilih.' : 'Belum ada transaksi.'}
        </p>
      )}
    </div>
  );
};

export default TransactionList;
