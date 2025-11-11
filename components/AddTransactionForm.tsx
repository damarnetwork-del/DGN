import React, { useState } from 'react';
import { Transaction, TransactionType, ExpenseCategory, PaymentMethod } from '../types';
import PlusIcon from './icons/PlusIcon';

interface AddTransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.CUSTOMER_DUES);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.TRANSFER);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description.trim() || !amount.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Harap isi semua kolom dengan benar. Jumlah harus positif.');
      setIsSuccess(false);
      return;
    }
    setError('');
    
    const localDate = new Date(date);
    const utcDate = new Date(localDate.getUTCFullYear(), localDate.getUTCMonth(), localDate.getUTCDate());

    onAddTransaction({
      description,
      amount: numericAmount,
      type,
      category: type === TransactionType.EXPENSE ? category : null,
      date: utcDate.toISOString(),
      paymentMethod,
    });
    
    setDescription('');
    setAmount('');
    setType(TransactionType.EXPENSE);
    setCategory(ExpenseCategory.CUSTOMER_DUES);
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod(PaymentMethod.TRANSFER);
    
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300">Deskripsi</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-300">Jumlah (Rp)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-300">Tanggal</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-300">Tipe</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            >
              <option value={TransactionType.EXPENSE}>Pengeluaran</option>
              <option value={TransactionType.INCOME}>Pemasukan</option>
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-300">Metode</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            >
              <option value={PaymentMethod.TRANSFER}>Transfer</option>
              <option value={PaymentMethod.CASH}>Tunai</option>
            </select>
          </div>
          {type === TransactionType.EXPENSE && (
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-slate-300">Kategori</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                {Object.values(ExpenseCategory).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}
      </div>
      
      {isSuccess && <p className="text-green-400 text-sm">Transaksi berhasil ditambahkan!</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        <PlusIcon className="w-5 h-5" />
        Simpan Transaksi
      </button>
    </form>
  );
};

export default AddTransactionForm;