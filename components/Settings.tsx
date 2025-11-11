import React from 'react';
import UserManagement from './UserManagement';
import { User } from '../types';

interface SettingsProps {
  currentUser: User;
  users: User[];
  onAddUser: (user: Omit<User, 'id'|'password'> & {password: string}) => void;
  onDeleteUser: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentUser, users, onAddUser, onDeleteUser }) => {
  return (
    <div className="space-y-6">
      {currentUser.role === 'admin' ? (
        <UserManagement 
          currentUser={currentUser}
          users={users}
          onAddUser={onAddUser}
          onDeleteUser={onDeleteUser}
        />
      ) : (
         <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
            <p className="text-slate-400 text-center">Hanya admin yang dapat mengakses halaman pengaturan.</p>
        </div>
      )}
    </div>
  );
};

export default Settings;