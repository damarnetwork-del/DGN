import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, Customer, User, UserRole, View } from './types';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardPage from './components/DashboardPage';
import TransactionList from './components/TransactionList';
import AddTransactionForm from './components/AddTransactionForm';
import CustomerList from './components/CustomerList';
import AddCustomerForm from './components/AddCustomerForm';
import Settings from './components/Settings';
import EditTransactionModal from './components/EditTransactionModal';
import MonthlyReport from './components/MonthlyReport';

const App: React.FC = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Load initial data and session
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    const allUsers = savedUsers ? JSON.parse(savedUsers) : [];
    
    if (allUsers.length === 0) {
      const adminUser = { id: 'admin-user', username: 'admin', password: 'daden', role: UserRole.ADMIN };
      allUsers.push(adminUser);
      localStorage.setItem('users', JSON.stringify(allUsers));
    }
    setUsers(allUsers);
    
    const sessionUser = localStorage.getItem('sessionUser');
    if (sessionUser) {
      setCurrentUser(JSON.parse(sessionUser));
    }
  }, []);

  // Load user-specific data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const savedTransactions = localStorage.getItem(`transactions_${currentUser.username}`);
      const savedCustomers = localStorage.getItem(`customers_${currentUser.username}`);
      setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
      setCustomers(savedCustomers ? JSON.parse(savedCustomers) : []);
    } else {
      setTransactions([]);
      setCustomers([]);
    }
  }, [currentUser]);

  const saveData = useCallback((key: string, data: any) => {
    if (currentUser) {
      localStorage.setItem(`${key}_${currentUser.username}`, JSON.stringify(data));
    }
  }, [currentUser]);

  // Auth Handlers
  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      const userToSave = { id: user.id, username: user.username, role: user.role };
      localStorage.setItem('sessionUser', JSON.stringify(userToSave));
      setCurrentUser(userToSave);
      setCurrentView('dashboard');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionUser');
    setCurrentUser(null);
  };
  
  // User Management Handlers (Admin)
  const handleAddUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: new Date().toISOString() };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };
  
  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Transaction Handlers
  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: new Date().toISOString() };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveData('transactions', updatedTransactions);
  };
  
  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t);
    setTransactions(updatedTransactions);
    saveData('transactions', updatedTransactions);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveData('transactions', updatedTransactions);
  };
  
  // Customer Handlers
  const handleAddCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: new Date().toISOString() };
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    saveData('customers', updatedCustomers);
  };

  const handleDeleteCustomer = (id: string) => {
    const updatedCustomers = customers.filter(c => c.id !== id);
    setCustomers(updatedCustomers);
    saveData('customers', updatedCustomers);
  };

  // Render Logic
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  const pageTitles: Record<View, string> = {
    dashboard: 'Dasbor',
    transactions: 'Riwayat Transaksi',
    customers: 'Daftar Pelanggan',
    settings: 'Pengaturan',
  };

  const renderPage = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage 
                    transactions={transactions} 
                    onAddTransaction={handleAddTransaction}
                    onAddCustomer={handleAddCustomer} 
                />;
      case 'transactions':
        return (
          <div className="space-y-6">
            <TransactionList 
              transactions={transactions} 
              onDeleteTransaction={handleDeleteTransaction} 
              onEditTransaction={setEditingTransaction} 
            />
            <MonthlyReport transactions={transactions} />
          </div>
        );
      case 'customers':
        return <CustomerList customers={customers} onDeleteCustomer={handleDeleteCustomer} />;
      case 'settings':
        return <Settings 
                    currentUser={currentUser}
                    users={users}
                    onAddUser={handleAddUser}
                    onDeleteUser={handleDeleteUser} />;
      default:
        return <DashboardPage 
                    transactions={transactions} 
                    onAddTransaction={handleAddTransaction}
                    onAddCustomer={handleAddCustomer} 
                />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header username={currentUser.username} onLogout={handleLogout} pageTitle={pageTitles[currentView]} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6">
          <div className="container mx-auto max-w-8xl">
            {renderPage()}
          </div>
        </main>
      </div>
      {editingTransaction && (
        <EditTransactionModal 
            transaction={editingTransaction}
            onClose={() => setEditingTransaction(null)}
            onSave={handleUpdateTransaction}
        />
      )}
    </div>
  );
};

export default App;