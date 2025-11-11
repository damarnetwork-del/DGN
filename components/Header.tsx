
import React from 'react';
import UserIcon from './icons/UserIcon';
import LogoutIcon from './icons/LogoutIcon';

interface HeaderProps {
  username: string;
  onLogout: () => void;
  pageTitle: string;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout, pageTitle }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-700">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white">
              <UserIcon className="w-6 h-6 text-slate-400" />
              <span className="font-medium hidden sm:block">{username}</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Logout"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
