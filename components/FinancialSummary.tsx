
import React, { useState, useCallback } from 'react';
import { getFinancialSummary } from '../services/geminiService';
import { Transaction } from '../types';
import SparklesIcon from './icons/SparklesIcon';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({ transactions }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGetSummary = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await getFinancialSummary(transactions);
      setSummary(result);
    } catch (err) {
      setError('Gagal mendapatkan ringkasan. Coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">Ringkasan Cerdas</h3>
        <button
          onClick={handleGetSummary}
          disabled={isLoading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SparklesIcon className="w-5 h-5" />
          {isLoading ? 'Menganalisis...' : 'Dapatkan Analisis'}
        </button>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center space-x-2 p-4">
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-teal-400 rounded-full animate-pulse"></div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
      
      {summary && (
        <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
      )}
      {!summary && !isLoading && <p className="text-gray-500 text-sm">Klik tombol untuk mendapatkan analisis keuangan dari AI.</p>}
    </div>
  );
};

export default FinancialSummary;