import React, { useState } from 'react';
import { User, UserRole } from '../types';
import TrashIcon from './icons/TrashIcon';
import UserPlusIcon from './icons/UserPlusIcon';

interface UserManagementProps {
    currentUser: User;
    users: User[];
    onAddUser: (user: Omit<User, 'id'|'password'> & {password: string}) => void;
    onDeleteUser: (id: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ currentUser, users, onAddUser, onDeleteUser }) => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newRole, setNewRole] = useState<UserRole>(UserRole.USER);
    const [error, setError] = useState('');

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUsername.trim() || !newPassword.trim()) {
            setError('Nama pengguna dan kata sandi tidak boleh kosong.');
            return;
        }
        if (users.some(u => u.username === newUsername)) {
            setError('Nama pengguna sudah ada.');
            return;
        }
        setError('');
        onAddUser({ username: newUsername, password: newPassword, role: newRole });
        setNewUsername('');
        setNewPassword('');
        setNewRole(UserRole.USER);
    };

    return (
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Manajemen Pengguna</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Buat Pengguna Baru</h4>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <div>
                            <label htmlFor="new-username" className="block text-sm font-medium text-slate-300">Nama Pengguna</label>
                            <input
                                id="new-username"
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="new-password"className="block text-sm font-medium text-slate-300">Kata Sandi</label>
                            <input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                        <div>
                             <label htmlFor="new-role" className="block text-sm font-medium text-slate-300">Peran</label>
                             <select
                                id="new-role"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value as UserRole)}
                                className="mt-1 block w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                             >
                                <option value={UserRole.USER}>User</option>
                                <option value={UserRole.ADMIN}>Admin</option>
                             </select>
                        </div>
                        {error && <p className="text-red-400 text-sm">{error}</p>}
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            Tambah Pengguna
                        </button>
                    </form>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Daftar Pengguna</h4>
                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {users.map(user => (
                            <li key={user.id} className="flex justify-between items-center p-3 bg-slate-850 rounded-lg">
                                <div>
                                    <p className="font-semibold text-white">{user.username}</p>
                                    <p className="text-sm text-slate-400">{user.role}</p>
                                </div>
                                {currentUser.id !== user.id && (
                                     <button 
                                        onClick={() => onDeleteUser(user.id)} 
                                        className="text-slate-500 hover:text-red-500 transition-colors"
                                        aria-label={`Hapus pengguna ${user.username}`}
                                    >
                                        <TrashIcon />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
