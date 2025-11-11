import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, ExpenseCategory, PaymentMethod } from '../types';

interface EditTransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (updatedTransaction: Transaction) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onSave }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.CUSTOMER_DUES);
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.TRANSFER);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setDescription(transaction.description);
      setAmount(String(transaction.amount));
      setType(transaction.type);
      setCategory(transaction.category || ExpenseCategory.CUSTOMER_DUES);
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
      setPaymentMethod(transaction.paymentMethod || PaymentMethod.TRANSFER); // Add fallback for older data
    }
  }, [transaction]);

  if (!transaction) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description.trim() || !amount.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Harap isi semua kolom dengan benar. Jumlah harus positif.');
      return;
    }
    setError('');

    const updatedDate = new Date(transaction.date);
    const [year, month, day] = date.split('-').map(Number);
    updatedDate.setFullYear(year, month - 1, day);

    onSave({
      ...transaction,
      description,
      amount: numericAmount,
      type,
      category: type === TransactionType.EXPENSE ? category : null,
      date: updatedDate.toISOString(),
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-slate-800 p-6 rounded-2xl shadow-lg w-full max-w-md m-4">
        <h3 className="text-xl font-bold text-white mb-4">Edit Transaksi</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-slate-300">Deskripsi</label>
            <input
              type="text"
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="edit-amount" className="block text-sm font-medium text-slate-300">Jumlah (Rp)</label>
            <input
              type="number"
              id="edit-amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-slate-300">Tanggal</label>
            <input
              type="date"
              id="edit-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="edit-type" className="block text-sm font-medium text-slate-300">Tipe</label>
              <select
                id="edit-type"
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option value={TransactionType.EXPENSE}>Pengeluaran</option>
                <option value={TransactionType.INCOME}>Pemasukan</option>
              </select>
            </div>
             <div className="flex-1">
              <label htmlFor="edit-paymentMethod" className="block text-sm font-medium text-slate-300">Metode</label>
              <select
                id="edit-paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              >
                <option value={PaymentMethod.TRANSFER}>Transfer</option>
                <option value={PaymentMethod.CASH}>Tunai</option>
              </select>
            </div>
          </div>
            {type === TransactionType.EXPENSE && (
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium text-slate-300">Kategori</label>
                <select
                  id="edit-category"
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
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;