import React, { useState } from 'react';
import { Customer, SubscriptionCategory } from '../types';
import UserPlusIcon from './icons/UserPlusIcon';

interface AddCustomerFormProps {
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
}

const AddCustomerForm: React.FC<AddCustomerFormProps> = ({ onAddCustomer }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [subscriptionCategory, setSubscriptionCategory] = useState<SubscriptionCategory>(SubscriptionCategory.PPPOE);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!name.trim() || !phone.trim() || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Harap isi nama, telepon, dan jumlah dengan benar.');
      setIsSuccess(false);
      return;
    }
    setError('');

    onAddCustomer({
      name,
      phone,
      address,
      subscriptionCategory,
      amount: numericAmount,
    });
    
    setName('');
    setPhone('');
    setAddress('');
    setSubscriptionCategory(SubscriptionCategory.PPPOE);
    setAmount('');
    
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="customer-name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input
            type="text"
            id="customer-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="customer-phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
          <input
            type="tel"
            id="customer-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="customer-address" className="block text-sm font-medium text-gray-700">Alamat</label>
          <input
            type="text"
            id="customer-address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="subscription-category" className="block text-sm font-medium text-gray-700">Kategori Langganan</label>
          <select
            id="subscription-category"
            value={subscriptionCategory}
            onChange={(e) => setSubscriptionCategory(e.target.value as SubscriptionCategory)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          >
            {Object.values(SubscriptionCategory).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="customer-amount" className="block text-sm font-medium text-gray-700">Jumlah Tagihan (Rp)</label>
          <input
            type="number"
            id="customer-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full bg-gray-50 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      {isSuccess && <p className="text-green-600 text-sm">Pelanggan berhasil ditambahkan!</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        <UserPlusIcon className="w-5 h-5" />
        Simpan Pelanggan
      </button>
    </form>
  );
};

export default AddCustomerForm;