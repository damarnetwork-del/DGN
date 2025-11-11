import React, { useMemo, useState } from 'react';
import { Transaction, TransactionType, Customer } from '../types';
import ExpenseChart from './ExpenseChart';
import AddTransactionForm from './AddTransactionForm';
import AddCustomerForm from './AddCustomerForm';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';

interface DashboardPageProps {
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
}

const StatCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; color: string; }> = ({ title, amount, icon, color }) => (
  <div className="bg-slate-800 p-6 rounded-2xl shadow-lg flex items-center gap-4">
    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white">Rp {amount.toLocaleString('id-ID')}</p>
    </div>
  </div>
);

const TabButton: React.FC<{label: string; isActive: boolean; onClick: () => void;}> = ({label, isActive, onClick}) => (
  <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors outline-none focus:outline-none ${
          isActive 
          ? 'bg-slate-800 text-teal-400 border-b-2 border-teal-400'
          : 'text-slate-400 hover:text-white border-b-2 border-transparent'
      }`}
  >
      {label}
  </button>
);

const DashboardPage: React.FC<DashboardPageProps> = ({ transactions, onAddTransaction, onAddCustomer }) => {
  const [activeTab, setActiveTab] = useState<'transaction' | 'customer'>('transaction');

  const { totalIncome, totalExpense, balance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Pemasukan" 
          amount={totalIncome} 
          icon={<ArrowUpIcon className="w-6 h-6" />}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard 
          title="Total Pengeluaran" 
          amount={totalExpense} 
          icon={<ArrowDownIcon className="w-6 h-6" />}
          color="bg-red-500/20 text-red-400"
        />
        <StatCard 
          title="Saldo Saat Ini" 
          amount={balance} 
          icon={<span className="font-bold text-xl">=</span>}
          color="bg-indigo-500/20 text-indigo-400"
        />
      </div>
      
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4">Menu Input</h3>
        <div className="border-b border-slate-700">
            <TabButton label="Tambah Transaksi" isActive={activeTab === 'transaction'} onClick={() => setActiveTab('transaction')} />
            <TabButton label="Tambah Pelanggan" isActive={activeTab === 'customer'} onClick={() => setActiveTab('customer')} />
        </div>
        <div className="pt-6">
            {activeTab === 'transaction' && (
                <AddTransactionForm onAddTransaction={onAddTransaction} />
            )}
            {activeTab === 'customer' && (
                <AddCustomerForm onAddCustomer={onAddCustomer} />
            )}
        </div>
      </div>

      <div className="h-96">
        <ExpenseChart transactions={transactions} />
      </div>
    </div>
  );
};

export default DashboardPage;