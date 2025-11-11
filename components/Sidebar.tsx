import React from 'react';
import HomeIcon from './icons/HomeIcon';
import ListBulletIcon from './icons/ListBulletIcon';
import UsersIcon from './icons/UsersIcon';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg text-base font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-teal-100 text-teal-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <aside className="w-64" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200 flex flex-col">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }} className="flex items-center pl-2.5 mb-5">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">Damar Global <span className="text-teal-500">Network</span></span>
        </a>
        
        <ul className="space-y-2 font-medium flex-grow">
          <NavItem
            label="Dasbor"
            icon={<HomeIcon className="w-6 h-6" />}
            isActive={currentView === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />
          <NavItem
            label="Transaksi"
            icon={<ListBulletIcon className="w-6 h-6" />}
            isActive={currentView === 'transactions'}
            onClick={() => onNavigate('transactions')}
          />
          <NavItem
            label="Pelanggan"
            icon={<UsersIcon className="w-6 h-6" />}
            isActive={currentView === 'customers'}
            onClick={() => onNavigate('customers')}
          />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;