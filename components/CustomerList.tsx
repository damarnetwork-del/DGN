import React from 'react';
import { Customer } from '../types';
import TrashIcon from './icons/TrashIcon';
import UserIcon from './icons/UserIcon';

interface CustomerListProps {
  customers: Customer[];
  onDeleteCustomer: (id: string) => void;
}

const CustomerItem: React.FC<{ customer: Customer; onDelete: (id: string) => void }> = ({ customer, onDelete }) => {
  return (
    <li className="flex items-center justify-between p-4 bg-slate-850 rounded-lg hover:bg-slate-800 transition-colors duration-200 gap-4">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/20 text-indigo-400">
          <UserIcon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-white truncate">{customer.name}</p>
            <span className="text-xs font-medium bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full whitespace-nowrap">{customer.subscriptionCategory}</span>
          </div>
          <p className="text-sm text-slate-400 mt-1 truncate">{customer.phone}</p>
          <p className="text-sm text-slate-400 mt-1 truncate">{customer.address}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-semibold text-teal-400 whitespace-nowrap">
          Rp {customer.amount.toLocaleString('id-ID')}
        </p>
        <button 
          onClick={() => onDelete(customer.id)} 
          className="text-slate-500 hover:text-red-500 transition-colors"
          aria-label={`Delete customer ${customer.name}`}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};


const CustomerList: React.FC<CustomerListProps> = ({ customers, onDeleteCustomer }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Daftar Pelanggan</h3>
      {customers.length > 0 ? (
        <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {customers.map((customer) => (
            <CustomerItem key={customer.id} customer={customer} onDelete={onDeleteCustomer} />
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-center py-8">Belum ada pelanggan.</p>
      )}
    </div>
  );
};

export default CustomerList;